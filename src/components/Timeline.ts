import type { Treatment } from "@plazi/synolib";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import { IconName } from "./Icons.ts";
import { type NameState } from "../types.ts";

@customElement("s-timeline-treatment")
export class TimelineTreatment extends LitElement {
  static override styles = css`
    :host > div,
    :host > a {
      background-color: light-dark(rgb(250, 227, 182), rgb(82, 57, 9));
      border-radius: .5rem;
      display: grid;
      padding: .25rem;
      min-width: 1rem;
      font-size: 0.8rem;

      &.multiple {
        background-color: light-dark(rgb(203, 233, 255), rgb(7, 58, 95));
      }
    }

    .row {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: max-content;
      justify-content: safe center;
      align-items: center;
    }

    .name {
      display: grid;
      grid-auto-rows: 24px;
      align-items: center;

      & + & {
        border-top: 1px solid var(--text-color-muted);
      }
    }
  `;

  @property({ attribute: false })
  accessor treatments: Treatment[] = [];
  @property({ attribute: false })
  accessor acceptedCoL: string[] = [];
  @property({ attribute: false })
  accessor names: NameState[] = [];

  override render() {
    if (this.treatments.length === 1) {
      const treatment = this.treatments[0];
      return html`<a href=${treatment.url} target="_blank" title=${
        until(
          treatment.details.then((d) =>
            `${d.creators} ${treatment?.date} “${d.title}”`
          ),
          treatment.url,
        )
      }>${
        this.names.map((i) => {
          let hasDef = false;
          let hasAug = false;
          let hasDpr = false;
          let hasCite = false;
          const result: IconName[] = [];
          if (i.name.treatments.treats.has(treatment)) {
            result.push("aug");
            hasAug = true;
          } else if (i.name.treatments.cite.has(treatment)) {
            result.push("cite");
            hasCite = true;
          } else {
            result.push("empty");
          }
          for (const authName of i.name.authorizedNames) {
            if (authName.treatments.def.has(treatment)) {
              result.push("def");
              hasDef = true;
            } else if (authName.treatments.aug.has(treatment)) {
              result.push("aug");
              hasAug = true;
            } else if (authName.treatments.dpr.has(treatment)) {
              result.push("dpr");
              hasDpr = true;
            } else if (authName.treatments.cite.has(treatment)) {
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
      }</a>`;
    }
    if (this.treatments.length > 1) {
      const tSet = new Set(this.treatments);
      return html`<div class="multiple" title=${this.treatments.length}>${
        this.names.map((i) => {
          const result = [{ def: 0, aug: 0, dpr: 0, cite: 0 }];
          result[0].aug = i.name.treatments.treats.intersection(tSet).size;
          result[0].cite = i.name.treatments.cite.intersection(tSet).size;
          for (const authName of i.name.authorizedNames) {
            const res = {
              def: authName.treatments.def.intersection(tSet).size,
              aug: authName.treatments.aug.intersection(tSet).size,
              dpr: authName.treatments.dpr.intersection(tSet).size,
              cite: authName.treatments.cite.intersection(tSet).size,
            };
            result.push(res);
          }
          if (i.open) {
            return html`<div class="name">${
              result.map(({ def, aug, dpr, cite }) =>
                html`<div class="row">${
                  def > 1
                    ? html`${def}<s-icon icon="def"></s-icon>`
                    : def === 1
                    ? html`<s-icon icon="def"></s-icon>`
                    : nothing
                }${
                  aug > 1
                    ? html` ${aug}<s-icon icon="aug"></s-icon>`
                    : aug === 1
                    ? html`<s-icon icon="aug"></s-icon>`
                    : nothing
                }${
                  dpr > 1
                    ? html` ${dpr}<s-icon icon="dpr"></s-icon>`
                    : dpr === 1
                    ? html`<s-icon icon="dpr"></s-icon>`
                    : nothing
                }${
                  cite > 1
                    ? html` ${cite}<s-icon icon="cite"></s-icon>`
                    : cite === 1
                    ? html`<s-icon icon="cite"></s-icon>`
                    : nothing
                }</div>`
              )
            }</div>`;
          }
          const acc = { def: 0, aug: 0, dpr: 0, cite: 0 };
          result.map(
            ({ def, aug, dpr, cite }) => {
              acc.def += def;
              acc.aug += aug;
              acc.dpr += dpr;
              acc.cite += cite;
            },
          );
          return html`<div class="name"><div class="row">${
            acc.def > 1
              ? html`${acc.def}<s-icon icon="def"></s-icon>`
              : acc.def === 1
              ? html`<s-icon icon="def"></s-icon>`
              : nothing
          }${
            acc.aug > 1
              ? html` ${acc.aug}<s-icon icon="aug"></s-icon>`
              : acc.aug === 1
              ? html`<s-icon icon="aug"></s-icon>`
              : nothing
          }${
            acc.dpr > 1
              ? html` ${acc.dpr}<s-icon icon="dpr"></s-icon>`
              : acc.dpr === 1
              ? html`<s-icon icon="dpr"></s-icon>`
              : nothing
          }${
            acc.cite > 1
              ? html` ${acc.cite}<s-icon icon="cite"></s-icon>`
              : acc.cite === 1
              ? html`<s-icon icon="cite"></s-icon>`
              : nothing
          }</div></div>`;
        })
      }</div>`;
    }
    if (this.acceptedCoL.length === 1) {
      const col = this.acceptedCoL[0];
      return html`<a href=${col} target="_blank" title=${
        col.replace("https://www.catalogueoflife.org/data/taxon/", "")
      }>${
        this.names.map((i) => {
          let hasAug = false;
          let hasDpr = false;
          const result: IconName[] = [];
          if (i.name.colURI === col) {
            result.push("col_aug");
            hasAug = true;
          } else if (i.name.acceptedColURI === col) {
            result.push("col_dpr");
            hasDpr = true;
          } else {
            result.push("empty");
          }
          for (const authName of i.name.authorizedNames) {
            if (authName.colURI === col) {
              result.push("col_aug");
              hasAug = true;
            } else if (authName.acceptedColURI === col) {
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
      }</a>`;
    }
    if (this.acceptedCoL.length > 1) {
      const colSet = new Set(this.acceptedCoL);
      return html`<div title=${colSet.size} class="multiple">${
        this.names.map((i) => {
          let hasAug = false;
          let hasDpr = false;
          const result: IconName[] = [];
          if (i.name.colURI && colSet.has(i.name.colURI)) {
            result.push("col_aug");
            hasAug = true;
          } else if (
            i.name.acceptedColURI && colSet.has(i.name.acceptedColURI)
          ) {
            result.push("col_dpr");
            hasDpr = true;
          } else {
            result.push("empty");
          }
          for (const authName of i.name.authorizedNames) {
            if (authName.colURI && colSet.has(authName.colURI)) {
              result.push("col_aug");
              hasAug = true;
            } else if (
              authName.acceptedColURI && colSet.has(authName.acceptedColURI)
            ) {
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
      grid-template-columns: max-content 1fr;
      margin: 1rem 0;
      overflow: auto;
      max-height: 90vh;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .header {
      background: var(--nav-background);
      background-opacity: 50%;
      display: grid;
      position: sticky;
      top: 0;
      padding: .25rem;
      text-align: right;
      grid-template-columns: auto auto;
      justify-content: safe center;

      h2 {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5rem;
      }
    }

    .names {
      background: var(--nav-background);
      background-opacity: 50%;
      border-right: 1px solid var(--text-color-muted);
      position: sticky;
      left: 0;
      z-index: 10;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      min-width: min(24rem, 40vw);
      max-width: min(48rem, 60vw);
      overflow: hidden;

      .header {
        z-index: 15;
      }

      * {
        max-width: 100%;
        text-overflow: ellipsis;
        // overflow: hidden;
      }
    }

    .list {
      display: grid;
      padding: .5rem .25rem;
    }

    .name {
      display: grid;
      grid-template-columns: 100%;
      line-height: 1.5rem;

      a {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        gap: .25rem;
        align-items: center;
      }

      & + & {
        border-top: 1px solid var(--text-color-muted);
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

      .ditto {
        color:  var(--text-color-muted);
      }
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

    .treatments {
      /* overflow-x: scroll; */

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
      justify-content: safe center
    }
  `;

  @property({ attribute: false })
  accessor names: NameState[] = [];
  @property({ attribute: false })
  accessor cols: string[] = [];
  @property({ attribute: false })
  accessor years: {
    year: string;
    treatments: Treatment[];
    open: boolean;
  }[] = [];

  @state()
  protected accessor colExpanded: boolean = false;

  private async toggle_open_name(index: number, n: NameState) {
    const name: NameState = { ...n, open: !n.open };
    await this.updateComplete;
    this.dispatchEvent(
      new CustomEvent<{ index: number; name: NameState }>(
        "toggle-open-name",
        {
          bubbles: true,
          composed: true,
          detail: { index, name },
        },
      ),
    );
  }

  override render() {
    return html`
      <div class="names">
        <div class="header"><h2>Timeline</h2></div>
        <div class="list">${
      this.names.map((n, index) =>
        html`<div class="name ${
          n.open ? "open" : "closed"
        }"><div class="unauthorized"><a href=${
          n.name.colURI?.replace(
            "https://www.catalogueoflife.org/data/taxon/",
            "#",
          ) ?? n.name.taxonNameURI?.replace(
            "http://taxon-name.plazi.org/id/",
            "#",
          ) ?? "#"
        }>${
          n.homonym
            ? (n.name.kingdom === "Animalia" || n.name.kingdom === "Plantae"
              ? html`<s-icon icon=${n.name.kingdom}></s-icon>`
              : n.name.kingdom
              ? html`(${n.name.kingdom}) `
              : html`<s-icon icon="unknown"></s-icon>`)
            : ""
        }<i>${n.name.displayName}</i>${
          !n.openable && n.name.authorizedNames.length === 1
            ? " " + n.name.authorizedNames[0].authority
            : ""
        }</a> ${
          n.openable
            ? html`<button @click=${() =>
              this.toggle_open_name(index, n)}><s-icon icon=${
              n.open ? "collapse" : "expand"
            }></s-icon></button>`
            : nothing
        }</div>${
          n.name.authorizedNames.map((a) =>
            html`<a class="authorized" href=${
              a.colURI?.replace(
                "https://www.catalogueoflife.org/data/taxon/",
                "#",
              ) ?? a.taxonConceptURI?.replace(
                "http://taxon-concept.plazi.org/id/",
                "#",
              ) ?? "#"
            }"><span class="ditto">—“—</span> ${a.authority}</a>`
          )
        }</div>`
      )
    }</div>
      </div>
      <div class="treatments">
        <div class="years">${
      this.cols.length > 0
        ? html`
          <div>
            <div class="header"><h2>CoL</h2>${
          this.cols.length > 1
            ? html`<button @click=${() =>
              this.colExpanded = !this.colExpanded}><s-icon icon=${
              this.colExpanded ? "collapse" : "expand"
            }></s-icon></button>`
            : nothing
        }
          </div>
          <div class="grid">${
          this.colExpanded
            ? this.cols.map((col) =>
              html`<s-timeline-treatment .acceptedCoL=${[
                col,
              ]} .names=${this.names}></s-timeline-treatment>`
            )
            : html`<s-timeline-treatment
              .acceptedCoL=${this.cols}
              .names=${this.names}
              @click=${(e: Event) => {
              if (e.target === e.currentTarget) {
                this.colExpanded = !this.colExpanded;
              }
            }}></s-timeline-treatment>`
        }</div>
          </div>`
        : nothing
    }${
      this.years.map((t, index) =>
        html`<div>
          <div class="header"><h2>${t.year}</h2>${
          t.treatments.length > 1
            ? html`<button @click=${() => {
              this.years = this.years.toSpliced(index, 1, {
                ...t,
                open: !t.open,
              });
            }}><s-icon icon=${t.open ? "collapse" : "expand"}></s-icon</button>`
            : nothing
        }</div>
          <div class="grid">${
          t.open
            ? t.treatments.map((treat) =>
              html`<s-timeline-treatment .treatments=${[
                treat,
              ]} .names=${this.names}></s-timeline-treatment>`
            )
            : html`<s-timeline-treatment
              .treatments=${t.treatments}
              .names=${this.names}
              @click=${(e: Event) => {
              if (e.target === e.currentTarget) {
                this.years = this.years.toSpliced(index, 1, {
                  ...t,
                  open: !t.open,
                });
              }
            }}
            ></s-timeline-treatment>`
        }</div>
          </div>`
      )
    }</div>
      </div>
    `;
  }
}
