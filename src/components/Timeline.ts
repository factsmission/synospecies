import type { Name, SynonymGroup, Treatment } from "@plazi/synolib";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import { Icon, IconName } from "./Icons.ts";

type NameState = { name: Name; open: boolean; openable: boolean };
type NameIcons = { collapsed: Icon; all: Icon[]; open: boolean };

@customElement("s-timeline-treatment")
export class TimelineTreatment extends LitElement {
  static override styles = css`
    :host > div {
      background-color: light-dark(rgb(250, 227, 182), rgb(82, 57, 9));
      border-radius: .5rem;
      display: grid;
      padding: .25rem;
    }
    
    .name {
      display: grid;
      grid-auto-rows: 24px;
      align-items: center;

      & + & {
        border-top: 1px solid gray;
      }
    }
  `;

  @property({ attribute: false })
  accessor treatment: Treatment | null = null;
  @property({ attribute: false })
  accessor acceptedCoL: string | null = null;
  @property({ attribute: false })
  accessor names: NameState[] = [];

  override render() {
    if (this.treatment !== null) {
      return html`<div title=${
        until(
          this.treatment.details.then((d) =>
            `${d.creators} ${this.treatment?.date} “${d.title}”`
          ),
          this.treatment.url,
        )
      }>${
        this.names.map((i) => {
          let hasDef = false;
          let hasAug = false;
          let hasDpr = false;
          let hasCite = false;
          const result: IconName[] = [];
          if (i.name.treatments.treats.has(this.treatment!)) {
            result.push("aug");
            hasAug = true;
          } else if (i.name.treatments.cite.has(this.treatment!)) {
            result.push("cite");
            hasCite = true;
          } else {
            result.push("empty");
          }
          for (const authName of i.name.authorizedNames) {
            if (authName.treatments.def.has(this.treatment!)) {
              result.push("def");
              hasDef = true;
            } else if (authName.treatments.aug.has(this.treatment!)) {
              result.push("aug");
              hasAug = true;
            } else if (authName.treatments.dpr.has(this.treatment!)) {
              result.push("dpr");
              hasDpr = true;
            } else if (authName.treatments.cite.has(this.treatment!)) {
              result.push("cite");
              hasCite = true;
            } else {
              result.push("empty");
            }
          }
          if (i.open) {
            return html`<div class="name">${
              result.map((i) => html`<s-icon icon=${i}></s-icon>`)
            }</div>`;
          }
          const collapsed_icon: IconName = hasDef
            ? (hasDpr ? "def_dpr" : "def")
            : hasAug
            ? (hasDpr ? "aug_dpr" : "aug")
            : hasDpr
            ? "dpr"
            : hasCite
            ? "cite"
            : "empty";
          return html`<div class="name"><s-icon icon=${collapsed_icon}></s-icon></div>`;
        })
      }</div>`;
    }
    if (this.acceptedCoL !== null) {
      return html`<div title=${this.acceptedCoL}>${
        this.names.map((i) => {
          let hasAug = false;
          let hasDpr = false;
          const result: IconName[] = [];
          if (i.name.colURI === this.acceptedCoL) {
            result.push("col_aug");
            hasAug = true;
          } else if (i.name.acceptedColURI === this.acceptedCoL) {
            result.push("col_dpr");
            hasDpr = true;
          } else {
            result.push("empty");
          }
          for (const authName of i.name.authorizedNames) {
            if (authName.colURI === this.acceptedCoL) {
              result.push("col_aug");
              hasAug = true;
            } else if (authName.acceptedColURI === this.acceptedCoL) {
              result.push("col_dpr");
              hasDpr = true;
            } else {
              result.push("empty");
            }
          }
          if (i.open) {
            return html`<div class="name">${
              result.map((i) => html`<s-icon icon=${i}></s-icon>`)
            }</div>`;
          }
          const collapsed_icon: IconName = hasAug
            ? (hasDpr ? "aug_dpr" : "col_aug")
            : hasDpr
            ? "col_dpr"
            : "empty";
          return html`<div class="name"><s-icon icon=${collapsed_icon}></s-icon></div>`;
        })
      }</div>`;
    }

    return nothing;
  }
}

@customElement("s-timeline")
export class Timeline extends LitElement {
  static override styles = css`
    :host {
      background: var(--nav-background);
      border-radius: 1rem;
      display: grid;
      grid-template-columns: auto 1fr;
      margin: 1rem 0;
      overflow: hidden;
    }

    .header {
      position: sticky;
      top: 0;
      padding: .25rem;
      text-align: center;

      h2 {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5rem;
      }
    }

    .names {
        border-right: 1px solid gray;
    }

    .list {
      display: grid;
      padding: .5rem .25rem;
    }

    .name {
      display: grid;
      line-height: 1.5rem;

      & + & {
        border-top: 1px solid gray;
      }

      &.closed .authorized {
        height: 0;
        overflow-y: hidden;
      }
      
      .unauthorized {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: .25rem;
      }

      button {
        border-radius: 1rem;
        border: none;
        background: none;
        width: 1rem;
        height: 1rem;
        padding: 0;
        margin: .25rem;
        position: relative;

        &>svg {
          height: 1rem;
          margin: 0;
        }

        &::before {
          content: "";
          position: absolute;
          top: -0.5rem;
          bottom: -0.5rem;
          left: -0.5rem;
          right: -0.5rem;
          border-radius: 100%;
        }

        &:hover::before {
          background: #ededed8c;
        }
      }
    }

    .treatments {
      overflow-x: scroll;

      h2 {
        font-size: 0.8rem;
        font-weight: normal;
      }
    }

    .years {
      display: grid;
      gap: .25rem;
      grid-auto-flow: column;
      grid-auto-columns: min-content;
    }

    .grid {
      display: grid;
      gap: .25rem;
      grid-auto-flow: column;
      grid-auto-columns: min-content;
      padding: .25rem;
    }
  `;

  @property({ attribute: false })
  accessor synoGroup: SynonymGroup | null = null;
  @state()
  protected accessor isWaiting = false;
  @property({ attribute: false })
  accessor names: NameState[] = [];
  @state()
  protected accessor cols: string[] = [];
  @state()
  protected accessor years: { year: string; treatments: Treatment[] }[] = [];

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
      this.names = [...this.names, { name, open: false, openable }];
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
          this.years.push({ year, treatments: [treatment] });
          this.years = this.years.toSorted((a, b) =>
            a.year.localeCompare(b.year)
          );
        }
      }
    }
  }

  override render() {
    if (this.synoGroup === null) return nothing;
    if (!this.isWaiting) {
      this.isWaiting = true;
      this.handleSynonyms();
    }
    return html`
      <div class="names">
        <div class="header"><h2>Timeline<h2></div>
        <div class="list">${
      this.names.map((n, index) =>
        html`<div class="name ${
          n.open ? "open" : "closed"
        }"><div class="unauthorized">${n.name.displayName} ${
          n.openable
            ? html`<button @click=${() => {
              this.names = this.names.toSpliced(index, 1, {
                ...n,
                open: !n.open,
              });
            }}><s-icon icon=${n.open ? "collapse" : "expand"}></s-icon</button>`
            : n.name.authorizedNames.length > 0
            ? n.name.authorizedNames[0]!.authority
            : nothing
        }</div>${
          n.name.authorizedNames.map((a) =>
            html`<div class="authorized"><span class="ditto">—“—<span> ${a.authority}</div>`
          )
        }</div>`
      )
    }</div>
      </div>
      <div class="treatments">
        <div class="years">${
      this.cols.length > 0
        ? html`<div>
          <div class="header"><h2>CoL<h2></div>
          <div class="grid">${
          this.cols.map((col) =>
            html`<s-timeline-treatment .acceptedCoL=${col} .names=${this.names}></s-timeline-treatment>`
          )
        }</div>
          </div>`
        : nothing
    }${
      this.years.map((t) =>
        html`<div>
          <div class="header"><h2>${t.year}<h2></div>
          <div class="grid">${
          t.treatments.map((treat) =>
            html`<s-timeline-treatment .treatment=${treat} .names=${this.names}></s-timeline-treatment>`
          )
        }</div>
          </div>`
      )
    }</div>
      </div>
    `;
  }
}
