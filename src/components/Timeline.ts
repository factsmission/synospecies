import type { Treatment } from "@plazi/synolib";
import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import { IconName } from "./Icons.ts";
import { type NameState } from "../types.ts";

type Cell = { def: number; aug: number; dpr: number; cite: number };

type NameIcons = {
  collapsed: Cell;
  expanded: Cell[];
};

@customElement("s-timeline-treatment")
export class TimelineTreatment extends LitElement {
  static override styles = css`
    * { box-sizing: border-box; }

    :host > a {
      background-color: light-dark(rgb(203, 233, 255), rgb(7, 58, 95));
      color: var(--text-color);
      border-radius: .75rem;
      display: grid;
      padding: 0 .25rem;
      min-width: .5rem;
      min-height: 100%;
      font-size: 0.8rem;
      text-decoration: none;
    }

    :host > a.col {
      border-radius: .5rem;
    }

    :host > a[href] {
      background-color: light-dark(rgb(250, 227, 182), rgb(82, 57, 9));
    }

    .row {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: max-content;
      justify-content: safe center;
      align-items: center;
    }

    .name {
      align-items: center;
      display: grid;
      grid-auto-rows: 24px;
      padding: 2px 0;

      & + & {
        /* border-top: 1px solid var(--text-color-muted); */
        border-top: 1px solid var(--body-background);
      }

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
      }
    }
  `;

  @property({ attribute: false })
  accessor names: NameState[] = [];

  @property({ attribute: false })
  accessor isCoL = false;

  @property({ attribute: false })
  accessor icons:
    | ({
      icons: NameIcons[];
      treatment?: Treatment;
      acceptedCoL?: string;
    })
    | null = null;

  override render() {
    if (!this.icons) return nothing;
    const firstName = this.icons.icons.findIndex((i) =>
      i.collapsed.aug + i.collapsed.def + i.collapsed.dpr +
          i.collapsed.cite > 0
    );
    const lastName = this.icons.icons.findLastIndex((i) =>
      i.collapsed.aug + i.collapsed.def + i.collapsed.dpr +
          i.collapsed.cite > 0
    );
    const style = html`<style>:host {
      grid-row-start: ${firstName === -1 ? 1 : firstName + 1};
      grid-row-end: ${lastName === -1 ? -1 : lastName + 2};
    }</style>`;

    const aug_icon = this.icons.acceptedCoL || this.isCoL ? "col_aug" : "aug";
    const dpr_icon = this.icons.acceptedCoL || this.isCoL ? "col_dpr" : "dpr";

    return html`${style}<a
      href=${this.icons.acceptedCoL || this.icons.treatment?.url || nothing}
      target="_blank" class=${
      this.icons.acceptedCoL || this.isCoL ? "col" : nothing
    }
      title=${
      this.icons.acceptedCoL?.replace(
        "https://www.catalogueoflife.org/data/taxon/",
        "",
      ) || (this.icons.treatment
        ? until(
          this.icons.treatment?.details.then((d) =>
            `${d.creators} ${this.icons!.treatment!.date} “${d.title}”`
          ),
          this.icons.treatment!.url,
        )
        : nothing)
    }>${
      this.icons.icons.slice(firstName, lastName + 1).map((icon, index) => {
        if (this.names[index + firstName].open) {
          return html`<div class="name">${
            icon.expanded.map(({ def, aug, dpr, cite }) =>
              html`<div class="row">${
                def > 1
                  ? html`${def}<s-icon icon="def"></s-icon>`
                  : def === 1
                  ? html`<s-icon icon="def"></s-icon>`
                  : nothing
              }${
                aug > 1
                  ? html` ${aug}<s-icon icon="${aug_icon}"></s-icon>`
                  : aug === 1
                  ? html`<s-icon icon="${aug_icon}"></s-icon>`
                  : nothing
              }${
                dpr > 1
                  ? html` ${dpr}<s-icon icon="${dpr_icon}"></s-icon>`
                  : dpr === 1
                  ? html`<s-icon icon="${dpr_icon}"></s-icon>`
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
        return html`<div class="name"><div class="row">${
          icon.collapsed.def > 1
            ? html`${icon.collapsed.def}<s-icon icon="def"></s-icon>`
            : icon.collapsed.def === 1
            ? html`<s-icon icon="def"></s-icon>`
            : nothing
        }${
          icon.collapsed.aug > 1
            ? html` ${icon.collapsed.aug}<s-icon icon="${aug_icon}"></s-icon>`
            : icon.collapsed.aug === 1
            ? html`<s-icon icon="${aug_icon}"></s-icon>`
            : nothing
        }${
          icon.collapsed.dpr > 1
            ? html` ${icon.collapsed.dpr}<s-icon icon="${dpr_icon}"></s-icon>`
            : icon.collapsed.dpr === 1
            ? html`<s-icon icon="${dpr_icon}"></s-icon>`
            : nothing
        }${
          icon.collapsed.cite > 1
            ? html` ${icon.collapsed.cite}<s-icon icon="cite"></s-icon>`
            : icon.collapsed.cite === 1
            ? html`<s-icon icon="cite"></s-icon>`
            : nothing
        }</div></div>`;
      })
    }</a>`;
  }
}

@customElement("s-timeline-year")
export class TimelineYear extends LitElement {
  static override styles = css`
    * { box-sizing: border-box; }

    :host {
      display: grid;
      gap: 5px .25rem;
      grid-auto-flow: column dense;
      grid-auto-columns: min-content;
      padding: .25rem;
      justify-content: safe center;
      justify-items: center;
    }
  `;

  @property({ attribute: false })
  accessor treatments: Treatment[] = [];
  @property({ attribute: false })
  accessor acceptedCoL: string[] = [];
  @property({ attribute: false })
  accessor names: NameState[] = [];

  @property()
  accessor open = false;

  /** one entry per treatment, then one entry per name */
  @state()
  accessor icons: ({
    icons: NameIcons[];
    treatment?: Treatment;
    acceptedCoL?: string;
  })[] = [];
  @state()
  accessor groupIcons: {
    icons: NameIcons[];
  } = { icons: [] };

  override willUpdate(_changedProperties: PropertyValues<this>) {
    if (this.treatments.length) {
      this.icons = this.treatments.map((treatment) => {
        const icons = this.names.map((ns) => {
          const expanded = [{ def: 0, aug: 0, dpr: 0, cite: 0 }];
          if (ns.name.treatments.treats.has(treatment)) {
            expanded[0].aug = 1;
          } else if (ns.name.treatments.cite.has(treatment)) {
            expanded[0].cite = 1;
          }
          for (const authName of ns.name.authorizedNames) {
            expanded.push({
              def: authName.treatments.def.has(treatment) ? 1 : 0,
              aug: authName.treatments.aug.has(treatment) ? 1 : 0,
              dpr: authName.treatments.dpr.has(treatment) ? 1 : 0,
              cite: authName.treatments.cite.has(treatment) ? 1 : 0,
            });
          }
          const collapsed = { def: 0, aug: 0, dpr: 0, cite: 0 };
          expanded.forEach(
            ({ def, aug, dpr, cite }) => {
              // using bitwise or to limit count to be in [0,1]
              collapsed.def |= def;
              collapsed.aug |= aug;
              collapsed.dpr |= dpr;
              if (collapsed.aug || collapsed.aug || collapsed.dpr) {
                collapsed.cite = 0;
              } else {
                collapsed.cite |= cite;
              }
            },
          );

          return { expanded, collapsed };
        });
        return { icons, treatment };
      });
    } else if (this.acceptedCoL.length) {
      this.icons = this.acceptedCoL.map((col) => {
        const icons = this.names.map((ns) => {
          const expanded = [{ def: 0, aug: 0, dpr: 0, cite: 0 }];
          if (ns.name.colURI && ns.name.acceptedColURI === col) {
            if (ns.name.colURI === col) {
              expanded[0].aug = 1;
            } else {
              expanded[0].dpr = 1;
            }
          } else {
            for (const authName of ns.name.authorizedNames) {
              if (authName.colURI && authName.acceptedColURI === col) {
                if (authName.colURI === col) {
                  expanded.push({ def: 0, aug: 1, dpr: 0, cite: 0 });
                } else {
                  expanded.push({ def: 0, aug: 0, dpr: 1, cite: 0 });
                }
              } else {
                expanded.push({ def: 0, aug: 0, dpr: 0, cite: 0 });
              }
            }
          }
          const collapsed = { def: 0, aug: 0, dpr: 0, cite: 0 };
          expanded.forEach(
            ({ aug, dpr }) => {
              // using bitwise or to limit count to be in [0,1]
              // collapsed.def |= def;
              collapsed.aug |= aug;
              collapsed.dpr |= dpr;
              // collapsed.cite |= cite;
            },
          );

          return { expanded, collapsed };
        });
        return { icons, acceptedCoL: col };
      });
    }

    const groupIcons: NameIcons[] = [];
    for (let index = 0; index < this.names.length; index++) {
      const collapsed = { def: 0, aug: 0, dpr: 0, cite: 0 };
      const expanded: Cell[] = [];

      this.icons.forEach(({ icons }) => {
        collapsed.def += icons[index].collapsed.def;
        collapsed.aug += icons[index].collapsed.aug;
        collapsed.dpr += icons[index].collapsed.dpr;
        collapsed.cite += icons[index].collapsed.cite;

        icons[index].expanded.forEach(
          ({ def, aug, dpr, cite }, ei) => {
            if (!expanded[ei]) {
              expanded[ei] = { def: 0, aug: 0, dpr: 0, cite: 0 };
            }
            expanded[ei].def += def;
            expanded[ei].aug += aug;
            expanded[ei].dpr += dpr;
            expanded[ei].cite += cite;
          },
        );
      });

      groupIcons.push({ collapsed, expanded });
    }

    this.groupIcons = { icons: groupIcons };
  }

  override render() {
    if (
      this.open || this.treatments.length === 1 || this.acceptedCoL.length === 1
    ) {
      return html`${
        this.icons.map((t) =>
          html`<s-timeline-treatment .names=${this.names} .icons=${t} ></s-timeline-treatment>`
        )
      }`;
    } else {
      return html`<s-timeline-treatment
        title=${this.treatments.length || this.acceptedCoL.length}
        .names=${this.names} .icons=${this.groupIcons} .isCoL=${
        this.acceptedCoL.length > 0
      }
      ></s-timeline-treatment>`;
    }
  }
}

@customElement("s-timeline")
export class Timeline extends LitElement {
  static override styles = css`
    * { box-sizing: border-box; }

    :host {
      background: var(--nav-background);
      border-radius: 1rem;
      display: grid;
      grid-template-columns: max-content 1fr;
      margin: 1rem 0;
      overflow: auto;
      max-height: 90vh;

      --l: linear-gradient(var(--text-color-muted) 0px 1px, transparent 1px 2px);
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
      max-width: min(48rem, calc(100vw - 12rem));
      overflow: hidden;

      .header {
        z-index: 15;
      }

      * {
        max-width: 100%;
      }
    }

    .list {
      display: grid;
      padding: .25rem;
      grid-template-columns: 100%;
    }

    .name {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 27px;
      grid-auto-rows: 24px;
      align-items: center;
      padding-bottom: 2px;

      &:first-child {
        grid-template-rows: 24px;
      }

      & + & .unauthorized {
        border-top: 1px solid var(--text-color-muted);
        padding-top: 2px;
        height: 27px;
      }

      &:last-child {
        padding-bottom: 0;
      }

      &.closed .authorized {
        display: none;
      }
      
      .unauthorized {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0 .25rem;
      }

      .ditto {
        color: var(--text-color-muted);
      }

      a {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        gap: 0 .25rem;
        align-items: center;
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
      gap: 5px .25rem;
      grid-auto-flow: column dense;
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

  private async toggle_open_year(index: number, open: boolean) {
    await this.updateComplete;
    this.dispatchEvent(
      new CustomEvent<{ index: number; open: boolean }>(
        "toggle-open-year",
        {
          bubbles: true,
          composed: true,
          detail: { index, open },
        },
      ),
    );
  }

  override render() {
    let sofar = 4; // css px
    const dividers: string[] = this.names.map((name, index) => {
      const height = (name.open ? name.name.authorizedNames.length + 1 : 1) *
        24;
      sofar += height;
      return `${index * 5 + 2 + sofar}px`;
    });
    dividers.pop();

    return html`
      <style>s-timeline-year {
      background-image: ${"var(--l),".repeat(this.names.length).slice(0, -10)};
      background-position-y: ${dividers.join(",")};
      background-repeat: no-repeat;
      grid-template-rows: ${
      this.names.map((name) =>
        (name.open ? name.name.authorizedNames.length + 1 : 1) * 1.5 + "rem"
      ).join(" ")
    }
      }</style>
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
          <s-timeline-year
              .acceptedCoL=${this.cols}
              .names=${this.names}
              .open=${this.colExpanded}
              @click=${(e: Event) => {
          if (e.target === e.currentTarget) {
            this.colExpanded = !this.colExpanded;
          }
        }}></s-timeline-year>
          </div>`
        : nothing
    }${
      this.years.map((t, index) =>
        html`<div>
          <div class="header"><h2>${t.year}</h2>${
          t.treatments.length > 1
            ? html`<button @click=${() =>
              this.toggle_open_year(index, !t.open)}><s-icon icon=${
              t.open ? "collapse" : "expand"
            }></s-icon</button>`
            : nothing
        }</div>
          <s-timeline-year
              .treatments=${t.treatments}
              .names=${this.names}
              .open=${t.open}
              @click=${(e: Event) => {
          if (e.target === e.currentTarget) {
            this.toggle_open_year(index, !t.open);
          }
        }}></s-timeline-year>
          </div>`
      )
    }</div>
      </div>
    `;
  }
}
