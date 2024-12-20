import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { type NameState } from "../types.ts";
import type { SynonymGroup, Treatment } from "@plazi/synolib";
import "./Timeline.ts";
import "./SynoName.ts";

enum sortOrder {
  Found,
  Alphabetical,
  Oldest,
  Newest,
}

const sortFound = (a: NameState, b: NameState) => a.orderFound - b.orderFound;
const sortAlphabetical = (a: NameState, b: NameState) =>
  a.name.displayName.localeCompare(b.name.displayName);
const sortOldest = (a: NameState, b: NameState) =>
  a.dateOld !== b.dateOld ? a.dateOld - b.dateOld : sortAlphabetical(a, b);
const sortNewest = (a: NameState, b: NameState) =>
  a.dateNew !== b.dateNew ? b.dateNew - a.dateNew : sortAlphabetical(a, b);

const sortName = (order: sortOrder) => {
  switch (order) {
    case sortOrder.Alphabetical:
      return sortAlphabetical;
    case sortOrder.Oldest:
      return sortOldest;
    case sortOrder.Newest:
      return sortNewest;
    case sortOrder.Found:
    default:
      return sortFound;
  }
};

const params = new URLSearchParams(document.location.search);

@customElement("syno-main")
export class SynoMain extends LitElement {
  @property({ attribute: false })
  accessor synoGroup: SynonymGroup | null = null;

  @state()
  protected accessor isWaiting = false;
  @state()
  accessor sortOrder = sortOrder.Oldest;
  @state()
  protected accessor names: NameState[] = [];
  @state()
  protected accessor colExpanded: boolean = false;
  @state()
  protected accessor cols: string[] = [];
  @state()
  protected accessor years: {
    year: string;
    treatments: Treatment[];
    open: boolean;
  }[] = [];

  @state()
  protected accessor NAME = params.get("q");

  @state()
  protected accessor timeEnd: number | null = null;
  protected timeStart = performance.now();

  async handleSynonyms() {
    if (this.synoGroup === null) {
      alert("Uh Oh!");
      return;
    }
    for await (const name of this.synoGroup) {
      const openable = name.authorizedNames.length > 0 &&
        (name.authorizedNames.length > 1 ||
          (!!name.colURI || name.treatments.cite.size > 0 ||
            name.treatments.treats.size > 0));
      const sameName = this.names.find((n) =>
        n.name.displayName === name.displayName
      );
      if (sameName) sameName.homonym = true;

      let dateOld = Infinity;
      let dateNew = -Infinity;
      name.treatments.treats.forEach((t) => {
        if (t.date) {
          if (t.date < dateOld) dateOld = t.date;
          if (t.date > dateNew) dateNew = t.date;
        }
      });
      name.treatments.cite.forEach((t) => {
        if (t.date) {
          if (t.date < dateOld) dateOld = t.date;
          if (t.date > dateNew) dateNew = t.date;
        }
      });
      name.authorizedNames.forEach((a) => {
        a.treatments.def.forEach((t) => {
          if (t.date) {
            if (t.date < dateOld) dateOld = t.date;
            if (t.date > dateNew) dateNew = t.date;
          }
        });
        a.treatments.aug.forEach((t) => {
          if (t.date) {
            if (t.date < dateOld) dateOld = t.date;
            if (t.date > dateNew) dateNew = t.date;
          }
        });
        a.treatments.dpr.forEach((t) => {
          if (t.date) {
            if (t.date < dateOld) dateOld = t.date;
            if (t.date > dateNew) dateNew = t.date;
          }
        });
        a.treatments.cite.forEach((t) => {
          if (t.date) {
            if (t.date < dateOld) dateOld = t.date;
            if (t.date > dateNew) dateNew = t.date;
          }
        });
        const matched = a.authority.match(/\b\d{4}$/);
        if (matched) {
          const date = parseInt(matched[0], 10);
          if (date && !isNaN(date)) {
            if (date < dateOld) dateOld = date;
            if (date > dateNew) dateNew = date;
          }
        }
      });

      this.names = [...this.names, {
        name,
        open: openable && name.authorizedNames.length <= 2,
        openable,
        homonym: !!sameName,
        orderFound: this.names.length,
        dateNew,
        dateOld,
      }].toSorted(sortName(this.sortOrder));

      if (name.acceptedColURI && !this.cols.includes(name.acceptedColURI)) {
        this.cols = [...this.cols, name.acceptedColURI].toSorted();
      }
      for (const authName of name.authorizedNames) {
        if (
          authName.acceptedColURI &&
          !this.cols.includes(authName.acceptedColURI)
        ) {
          this.cols = [...this.cols, authName.acceptedColURI].toSorted();
        }
      }
      for (const treatment of this.synoGroup.treatments.values()) {
        const year = treatment.date ? treatment.date + "" : "N/A";
        const entry = this.years.find((y) => y.year === year);
        if (entry) {
          if (!entry.treatments.includes(treatment)) {
            entry.treatments.push(treatment);
            this.years = this.years.toSorted((a, b) =>
              a.year.localeCompare(b.year)
            );
          }
        } else {
          this.years.push({ year, open: false, treatments: [treatment] });
          this.years = this.years.toSorted((a, b) =>
            a.year.localeCompare(b.year)
          );
        }
      }
    }
    this.timeEnd = performance.now();
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("sortOrder")) {
      // sortOrder changed, re-sort.
      this.names = this.names.toSorted(sortName(this.sortOrder));
    }
  }

  constructor() {
    super();

    this.addEventListener("toggle-open-name", (e: Event) => {
      const { index, name } =
        (e as CustomEvent<{ index: number; name: NameState }>).detail;
      this.names = this.names.toSpliced(index, 1, name);
    });
    this.addEventListener("toggle-open-year", (e: Event) => {
      const { index, open } =
        (e as CustomEvent<{ index: number; open: boolean }>).detail;
      this.years = this.years.toSpliced(index, 1, {
        ...this.years[index],
        open,
      });
    });
  }

  override render() {
    if (!this.synoGroup) return nothing;
    if (!this.isWaiting) {
      this.isWaiting = true;
      this.handleSynonyms();
    }

    return html`
    <div class="option">
      Sort Names:
      <label><input type="radio" name="sort"
        ?checked=${this.sortOrder === sortOrder.Found}
        @change=${(_: Event) => {
      this.sortOrder = sortOrder.Found;
    }}
      >Order Found</label>
      <label><input type="radio" name="sort"
        ?checked=${this.sortOrder === sortOrder.Alphabetical}
        @change=${(_: Event) => {
      this.sortOrder = sortOrder.Alphabetical;
    }}
      >Alphabetical</label>
      <label><input type="radio" name="sort"
        ?checked=${this.sortOrder === sortOrder.Oldest}
        @change=${(_: Event) => {
      this.sortOrder = sortOrder.Oldest;
    }}
      >Oldest Treatment</label>
      <label><input type="radio" name="sort"
        ?checked=${this.sortOrder === sortOrder.Newest}
        @change=${(_: Event) => {
      this.sortOrder = sortOrder.Newest;
    }}
      >Newest Treatment</label>
      (Date of defining treatment may be inferred from the authority)
    </div>
    <div>${
      this.timeEnd === null
        ? html`Finding Synonyms for ${this.NAME} <progress></progress> (`
        : nothing
    }Found ${
      this.names.length === 1 ? "1 name" : `${this.names.length} names`
    } with ${
      this.synoGroup.treatments.size === 1
        ? "1 treatment"
        : `${this.synoGroup.treatments.size} treatments`
    }${
      this.timeEnd === null
        ? ` so far)`
        : `. This took ${(this.timeEnd - this.timeStart) / 1000} seconds.`
    }</div>
    <s-timeline .names=${this.names} .cols=${this.cols} .years=${this.years} ></s-timeline>
    ${
      // this.names.map((name) =>
      //   html`<syno-name .synoGroup=${this.synoGroup} .name=${name.name}></syno-name>`
      // )
      repeat(
        this.names,
        (name) => name.name.displayName + (name.name.taxonNameURI ?? "@"),
        (name) =>
          html`<syno-name .synoGroup=${this.synoGroup} .name=${name.name}></syno-name>`,
      )}
    `;
  }

  protected override createRenderRoot() {
    return this;
  }
}
