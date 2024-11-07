import type {
  Name,
  SynonymGroup,
  Treatment,
  TreatmentDetails,
} from "@plazi/synolib";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { until } from "lit/directives/until.js";
import { Icon, icons } from "./Icons.ts";

type NameState = { name: Name; open: boolean };
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
  accessor names: NameState[] = [];

  override render() {
    if (this.treatment === null) return nothing;
    console.log("updating treatment");
    return html`<div title=${
      until(
        this.treatment.details.then((d) =>
          `${d.creators} ${this.treatment?.date} “${d.title}”`
        ),
        this.treatment.url,
      )
    }>${
      this.names.map((i) => {
        const result: (keyof typeof icons)[] = [];
        if (i.name.treatments.treats.has(this.treatment!)) {
          result.push("aug");
        } else if (i.name.treatments.cite.has(this.treatment!)) {
          result.push("cite");
        } else {
          result.push("empty");
        }
        for (const authName of i.name.authorizedNames) {
          if (authName.treatments.def.has(this.treatment!)) {
            result.push("def");
          } else if (authName.treatments.aug.has(this.treatment!)) {
            result.push("aug");
          } else if (authName.treatments.dpr.has(this.treatment!)) {
            result.push("dpr");
          } else if (authName.treatments.cite.has(this.treatment!)) {
            result.push("cite");
          } else {
            result.push("empty");
          }
        }
        return html`<div title=${i.name.displayName} class="name ${
          i.open ? "open" : "closed"
        }">${result.map((i) => html`<s-icon icon=${i}></s-icon>`)}</div>`;
      })
    }</div>`;
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
    }

    .header {
      position: sticky;
      top: 0;
      padding: .25rem;

      h2 {
        margin: 0;
        font-size: 1.5rem;
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
      grid-auto-rows: 1.5rem;
      line-height: 1.5rem;

      & + & {
        border-top: 1px solid gray;
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
  protected accessor years: { year: string; treatments: Treatment[] }[] = [];

  async handleSynonyms() {
    if (this.synoGroup === null) {
      alert("Uh Oh!");
      return;
    }
    for await (const name of this.synoGroup) {
      this.names = [...this.names, { name, open: true }];
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
      this.names.map((n) =>
        html`<div class="name ${
          n.open ? "open" : "closed"
        }"><div class="unauthorized">${n.name.displayName}</div>${
          n.name.authorizedNames.map((a) =>
            html`<div class="authorized"><span class="ditto">—“—<span> ${a.authority}</div>`
          )
        }</div>`
      )
    }</div>
      </div>
      <div class="treatments">
        <div class="years">${
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
