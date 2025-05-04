import { html, LitElement, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { type NameState, type NonexistentTreatment } from "../types.ts";
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
  accessor sortOrder = sortOrder.Newest;
  @state()
  protected accessor names: NameState[] = [];
  // maps authority → NonexistentTreatment
  @state()
  protected accessor missingTreatments: Map<string, NonexistentTreatment> =
    new Map();
  @state()
  protected accessor hasMultipleKingdoms = false;
  @state()
  protected accessor colExpanded: boolean = false;
  @state()
  protected accessor cols: string[] = [];
  @state()
  protected accessor years: {
    year: string;
    treatments: (Treatment | NonexistentTreatment)[];
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
    let multipleKingdoms: undefined | string = undefined;
    console.time("synogroup");
    console.timeLog("synogroup", "Starting");
    for await (const name of this.synoGroup) {
      console.timeLog("synogroup", "Found Name", name.displayName);
      if (!multipleKingdoms) {
        multipleKingdoms = name.kingdom;
      } else if (
        !this.hasMultipleKingdoms && multipleKingdoms !== name.kingdom
      ) {
        this.hasMultipleKingdoms = true;
      }
      const openable = name.authorizedNames.length > 0 &&
        (name.authorizedNames.length > 1 ||
          (!!name.col || name.treatments.cite.size > 0 ||
            name.treatments.treats.size > 0));
      const sameName = this.names.find((n) =>
        n.name.displayName === name.displayName
      );
      if (sameName) sameName.homonym = true;

      let dateOld = Infinity;
      let dateNew = -Infinity;
      let missingDefines: Set<NonexistentTreatment> = new Set();
      name.treatments.treats.forEach((t) => {
        if (t.date) {
          const date = t.date + 0.2;
          if (date < dateOld) dateOld = date;
          if (date > dateNew) dateNew = date;
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
            const date = t.date + 0.4;
            if (date < dateOld) dateOld = date;
            if (date > dateNew) dateNew = date;
          }
        });
        a.treatments.aug.forEach((t) => {
          if (t.date) {
            const date = t.date + 0.3;
            if (date < dateOld) dateOld = date;
            if (date > dateNew) dateNew = date;
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
            if (a.treatments.def.size == 0) {
              const existing = this.missingTreatments.get(a.authority);
              if (existing !== undefined){
                existing.missingDefines.add(a);
                missingDefines.add(existing);
             } else {
                const missingTreatment: NonexistentTreatment = {
                  date: date,
                  creators: a.authority,
                  missingDefines: new Set([a]),
                };
                this.missingTreatments.set(a.authority, missingTreatment);
                missingDefines.add(missingTreatment);
              }
            }
          }
        }
      });

      this.names = [...this.names, {
        name,
        open: openable && name.authorizedNames.length <= 3,
        openable,
        homonym: !!sameName,
        orderFound: this.names.length,
        dateNew,
        dateOld,
        missingDefines,
      }].toSorted(sortName(this.sortOrder));

      if (name.col && !this.cols.includes(name.col.acceptedURI)) {
        this.cols = [...this.cols, name.col.acceptedURI].toSorted();
      }
      for (const authName of name.authorizedNames) {
        if (
          authName.col &&
          !this.cols.includes(authName.col.acceptedURI)
        ) {
          this.cols = [...this.cols, authName.col.acceptedURI].toSorted();
        }
      }
      for (const treatment of this.missingTreatments.values()) {
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
          this.years.push({ year, open: true, treatments: [treatment] });
          this.years = this.years.toSorted((a, b) =>
            a.year.localeCompare(b.year)
          );
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
          this.years.push({ year, open: true, treatments: [treatment] });
          this.years = this.years.toSorted((a, b) =>
            a.year.localeCompare(b.year)
          );
        }
      }
    }
    this.timeEnd = performance.now();
    console.timeEnd("synogroup");
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
    <div class="result-header">
      <div class="status">
      ${
      this.timeEnd === null
        ? (this.synoGroup.noSynonyms
          ? html`Finding details for ${this.NAME} <progress></progress> (`
          : html`Finding synonyms for ${this.NAME} <progress></progress> (`)
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
    }
      </div>
      <div class="sort">
        <label>
          Sort
          <select name="sort" required @change=${(e: Event) => {
      const value = (e.target as HTMLSelectElement).value;
      switch (value) {
        case "Found": {
          this.sortOrder = sortOrder.Found;
          break;
        }
        case "Alphabetical": {
          this.sortOrder = sortOrder.Alphabetical;
          break;
        }
        case "Oldest": {
          this.sortOrder = sortOrder.Oldest;
          break;
        }
        case "Newest": {
          this.sortOrder = sortOrder.Newest;
          break;
        }
        default: {
          console.error("Invalid Sort Order", e);
        }
      }
    }}>
            <option value="Found">Order Found</option>
            <option value="Alphabetical">Alphabetical</option>
            <option value="Oldest">Oldest Treatment</option>
            <option value="Newest" selected>Newest Treatment</option>
          </select>
        </label>
      </div>
    </div>
    <s-timeline .names=${this.names} .cols=${this.cols} .years=${this.years} .showKingdoms=${this.hasMultipleKingdoms}></s-timeline>
    ${
      // this.names.map((name) =>
      //   html`<syno-name .synoGroup=${this.synoGroup} .name=${name.name}></syno-name>`
      // )
      repeat(
        this.names,
        (name) => name.name.displayName + (name.name.taxonNameURI ?? "@"),
        (name) =>
          html`<syno-name .synoGroup=${this.synoGroup} .name=${name} .showKingdom=${this.hasMultipleKingdoms}></syno-name>`,
      )}${
      this.timeEnd === null && this.names.length === 0
        ? html`<div class="placeholder">It may take a moment for the first result to appear.</div>`
        : nothing
    }
    `;
  }

  protected override createRenderRoot() {
    return this;
  }
}
