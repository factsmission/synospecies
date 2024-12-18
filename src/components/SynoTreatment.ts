import type {
  AuthorizedName,
  MaterialCitation,
  SynonymGroup,
  Treatment,
} from "@plazi/synolib";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import { Icon, icons } from "./Icons.ts";

export type SynoStatus = "def" | "aug" | "dpr" | "cite";

const shortUrl = (url: string) =>
  url
    .replace("https://www.catalogueoflife.org/data/taxon/", "")
    .replace("http://taxon-concept.plazi.org/id/", "")
    .replace("http://taxon-name.plazi.org/id/", "");

function unCamelCase(string: string) {
  const result = string.charAt(0).toUpperCase() +
    string.slice(1).replace(/([A-Z])/g, " $1").trim();
  return result.replace(/gbif/gi, "GBIF").replace(/id/gi, "ID").replace(
    /http/gi,
    "HTTP",
  ).replace(/uri/gi, "URI");
}

function pretty(mc: MaterialCitation): string {
  let result = "";
  if (mc.typeStatus) result += `Status: ${mc.typeStatus}\n`;
  // if (mc.recordedBy) result += `Recorded by ${mc.recordedBy}\n`;
  for (const [key, value] of Object.entries(mc)) {
    if (
      value &&
      !([
        // "collectionCode",
        // "catalogNumber",
        "typeStatus",
        "recordedBy",
        "httpUri",
      ].includes(key))
    ) {
      result += `${unCamelCase(key)}: ${value}\n`;
    }
  }
  if (result === "") result = "[no additional details provided]";
  return result;
}

@customElement("syno-treatment")
export class SynoTreatment extends LitElement {
  static override styles = css`
    :host {
      border-radius: 12px;
      display: block;
      margin-block: 6px;
      margin-left: -20px;
      padding: 0 6px;
      font-feature-settings: "liga", "calt", "dlig", "tnum";
    }

    s-icon {
      display: block;
    }

    .head {
      display: grid;
      line-height: 20px;
      grid-template-columns: 16px 1fr auto auto;
      grid-template-rows: 20px auto;
      gap: 0 4px;
      align-items: center;

      &>div {
        grid-row-end: span 2;
      }
    }

    .counts {
      display: flex;
      align-items: center;
    }

    .details {
      color: var(--text-color-muted);
      margin: 4px 0 0 20px;

      .row {
        display: grid;
        line-height: 16px;
        font-size: 0.75em;
        grid-template-columns: auto 1fr;
        grid-template-rows: 16px auto;
        gap: 0 4px;
        align-items: center;

        &>div {
          grid-row-end: span 2;
        }
      }

      .row + .row {
        margin-top: 4px;
      }

      .row.hidden {
        display: none;
      }

      &.open .row.hidden {
        display: grid;
      }
    }

    a,
    a:where(:visited) {
      color: var(--accent);
      text-decoration: none;

      &:hover,
      &:focus,
      &:active {
        color: var(--accent-mild) !important;
        text-decoration: underline;
      }

      & img {
        display: block;
      }
    }

    button {
      border-radius: 1rem;
      border: none;
      background: none;
      padding: 0;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        top: -1rem;
        bottom: -1rem;
        left: -1rem;
        right: -1rem;
        border-radius: 2rem;
      }

      &:hover::before {
        background: #ededed8c;
      }
    }

    .taxon,
    .col {
      color: var(--text-color-muted);
      font-size: 0.75rem;

      &:not(:last-child):not(.uri)::after {
        content: ",";
      }
    }

    .uri:not(:empty) {
      font-size: 0.75rem;
      line-height: 1em;
      padding: 0 4px;
      border-radius: 4px;
      background: var(--nav-background);
      font-family: inherit;
      font-weight: normal;
      font-feature-settings: "liga", "calt", "dlig", "case", "ss02", "tnum";
      text-decoration: none;

      &.taxon {
        color: #4e69ae;
      }

      &.treatment {
        color: var(--text-color-muted);
      }

      &.col {
        color: #177669;
      }

      s-icon,
      svg {
        display: inline-block;
        height: 0.8em;
        vertical-align: baseline;
        margin: 0 -0.1em 0 0.2em;
      }
    }

    .figures {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
      grid-template-rows: masonry;
      gap: 12px 4px;

      & figure {
        margin: 0;
      }

      & figcaption {
        font-size: 0.4rem;
        line-height: normal;
      }

      & img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .materials {
      &>b {
        display: block;
        height: 16px;
      }

      ul {
        margin: 0;
        padding-left: 12px;
        column-gap: 16px;
        columns: calc(24rem + 4px);
      }
      
      li {
        break-inside: avoid;
      }
    }

    .blue {
      color: #1e88e5;
    }

    .green {
      color: #388e3c;
    }

    .red {
      color: #e53935;
    }

    .gray {
      color: #666666;
    }

    b {
      font-weight: 600;
      text-transform: uppercase;
      font-feature-settings: "liga", "calt", "dlig", "tnum", "cpsp";
    }
`;

  @property({ attribute: false })
  accessor synoGroup: SynonymGroup | null = null;

  @property({ attribute: false })
  accessor trt: Treatment | null = null;

  @property({ attribute: false })
  accessor status: SynoStatus | null = null;

  @state()
  accessor open = false;

  override render() {
    this.classList.toggle("open", this.open);
    return html`
      <div class="head">
        <s-icon icon=${this.status || "unknown"}></s-icon>
        <div>
          ${this.trt?.date ?? html`<i>No Date</i>`}:
          ${
      until(
        this.trt?.details.then((d) => d.creators),
        html`<progress></progress>`,
      )
    }
          <i>${
      until(this.trt?.details.then((d) => `“${d.title}”`), nothing)
    }</i>
          <a target="_blank" href=${this.trt?.url} class="treatment uri">${
      this.trt?.url.replace("http://treatment.plazi.org/id/", "")
    }<s-icon icon="link"></s-icon></a>
        </div>
        <span class="counts">
          ${
      until(
        this.trt?.details.then((d) =>
          html`${
            d.figureCitations.length > 0
              ? html`${d.figureCitations.length}<s-icon icon="image"></s-icon>`
              : nothing
          }${
            d.materialCitations.length > 0
              ? html`${d.materialCitations.length}<s-icon icon="material"></s-icon>`
              : nothing
          }`
        ),
        nothing,
      )
    }
        </span>
        <button @click=${(e: Event) => {
      e.stopPropagation();
      this.open = !this.open;
    }}><s-icon icon=${this.open ? "collapse" : "expand"}></s-icon></button>
      </div>
      <div class="details ${this.open ? "open" : ""}">
      ${
      until(
        this.trt?.details.then((details) =>
          html`${
            details.treats.def.size
              ? html`<div class="row ${
                this.status === "def" || this.status === "cite" ? "hidden" : ""
              }"><s-icon icon="def"></s-icon><div><b class="green">Defines:</b>${
                details.treats.def.values().map((n) => {
                  const short = n.replace(
                    "http://taxon-concept.plazi.org/id/",
                    "",
                  );
                  return until(
                    this.synoGroup?.findName(n).then((nn) => {
                      if ((nn as AuthorizedName).authority) {
                        return html` <a class="taxon" href="#${short}">${
                          nn.displayName + " " +
                          (nn as AuthorizedName).authority
                        }</a>`;
                      } else {
                        return html` <a class="taxon" href="#${short}">${nn.displayName}</a>`;
                      }
                    }),
                    html` <a class="taxon uri">${short}</a>`,
                  );
                })
              }</div></div>`
              : nothing
          }${
            details.treats.aug.size > 0 || details.treats.treattn.size > 0
              ? html`<div class="row ${
                this.status === "aug" || this.status === "cite" ? "hidden" : ""
              }"><s-icon icon="aug"></s-icon><div><b class="blue">Treats:</b>${
                details.treats.aug.union(details.treats.treattn).values().map(
                  (n) => {
                    const short = n.replace(
                      "http://taxon-concept.plazi.org/id/",
                      "",
                    ).replace(
                      "http://taxon-name.plazi.org/id/",
                      "",
                    );
                    return until(
                      this.synoGroup?.findName(n).then((nn) => {
                        if ((nn as AuthorizedName).authority) {
                          return html` <a class="taxon" href="#${short}">${
                            nn.displayName + " " +
                            (nn as AuthorizedName).authority
                          }</a>`;
                        } else {
                          return html` <a class="taxon" href="#${short}">${nn.displayName}</a>`;
                        }
                      }),
                      html` <a class="taxon uri">${short}</a>`,
                    );
                  },
                )
              }</div></div>`
              : nothing
          }${
            details.treats.dpr.size
              ? html`<div class="row ${
                this.status === "dpr" || this.status === "cite" ? "hidden" : ""
              }"><s-icon icon="dpr"></s-icon><div><b class="red">Deprecates:</b>${
                details.treats.dpr.values().map((n) => {
                  const short = n.replace(
                    "http://taxon-concept.plazi.org/id/",
                    "",
                  );
                  return until(
                    this.synoGroup?.findName(n).then((nn) => {
                      if ((nn as AuthorizedName).authority) {
                        return html` <a class="taxon" href="#${short}">${
                          nn.displayName + " " +
                          (nn as AuthorizedName).authority
                        }</a>`;
                      } else {
                        return html` <a class="taxon" href="#${short}">${nn.displayName}</a>`;
                      }
                    }),
                    html` <a class="taxon uri">${short}</a>`,
                  );
                })
              }</div></div>`
              : nothing
          }${
            details.treats.citetc.size > 0 || details.treats.citetn.size > 0
              ? html`<div class="row hidden"><s-icon icon="cite"></s-icon><div><b class="gray">Cites:</b>${
                details.treats.citetc.union(details.treats.citetn).values().map(
                  (n) => {
                    const short = n.replace(
                      "http://taxon-concept.plazi.org/id/",
                      "",
                    ).replace(
                      "http://taxon-name.plazi.org/id/",
                      "",
                    );
                    return until(
                      this.synoGroup?.findName(n).then((nn) => {
                        if ((nn as AuthorizedName).authority) {
                          return html` <a class="taxon" href="#${short}">${
                            nn.displayName + " " +
                            (nn as AuthorizedName).authority
                          }</a>`;
                        } else {
                          return html` <a class="taxon" href="#${short}">${nn.displayName}</a>`;
                        }
                      }),
                      html` <a class="taxon uri">${short}</a>`,
                    );
                  },
                )
              }</div></div>`
              : nothing
          }${
            details.figureCitations.length > 0
              ? html`<div class="row hidden"><s-icon icon="image"></s-icon><div class="figures">${
                details.figureCitations.map((figure) =>
                  html`
                  <figure>
                    <img src=${figure.url} loading="lazy" alt=${
                    figure.description ?? "Cited Figure without caption"
                  }>
                    <figcaption>${figure.description ?? ""}</figcaption>
                  </figure>`
                )
              }</div></div>`
              : nothing
          }${
            details.materialCitations.length > 0
              ? html`<div class="row hidden"><s-icon icon="material"></s-icon><div class="materials"><b class="gray">Cited Materials:</b><ul>${
                details.materialCitations.sort((a, b) =>
                  (a.collectionCode + a.catalogNumber).localeCompare(
                    b.collectionCode + b.catalogNumber,
                  )
                ).map((material) =>
                  html`
                <li title=${pretty(material)}>
                  ${
                    material.typeStatus &&
                      material.typeStatus.toLocaleLowerCase() !==
                        "other material"
                      ? html`<b class=${
                        material.typeStatus.toLocaleLowerCase().includes(
                            "holotype",
                          )
                          ? "green"
                          : nothing
                      }>${material.typeStatus}:</b>`
                      : nothing
                  }
                  ${
                    material.collectionCode
                      ? material.collectionCode + ":"
                      : nothing
                  }
                  ${
                    material.collectionCode &&
                      material.catalogNumber.startsWith(material.collectionCode)
                      ? material.catalogNumber.slice(
                        material.collectionCode.length,
                      ).replace(/^\s*[-:]\s*/i, "")
                      : material.catalogNumber
                  }
                  ${
                    material.recordedBy || material.eventDate
                      ? `(Recorded ${material.eventDate ?? ""}${
                        material.recordedBy ? " by " + material.recordedBy : ""
                      })`
                      : nothing
                  }
                  ${
                    material.httpUri?.filter((uri) =>
                      uri &&
                      (!material.gbifSpecimenId ||
                        !uri.endsWith(material.gbifSpecimenId)) &&
                      (!material.gbifOccurrenceId ||
                        !uri.endsWith(material.gbifOccurrenceId))
                    ).map((uri) =>
                      html`<a class="uri" href=${uri}>Link<s-icon icon="link"></s-icon></a>`
                    )
                  }
                  ${
                    material.gbifSpecimenId
                      ? html`<a class="uri" href=${
                        "https://www.gbif.org/specimen/" +
                        material.gbifSpecimenId
                      }>GBIF&nbsp;Specimen&nbsp;${material.gbifSpecimenId}<s-icon icon="link"></s-icon></a>`
                      : nothing
                  }
                  ${
                    material.gbifOccurrenceId
                      ? html`<a class="uri" href=${
                        "https://www.gbif.org/occurrence/" +
                        material.gbifOccurrenceId
                      }>GBIF&nbsp;Occurrence&nbsp;${material.gbifOccurrenceId}<s-icon icon="link"></s-icon></a>`
                      : nothing
                  }
                </li>`
                )
              }</ul></div></div>`
              : nothing
          }`
        ),
        html`<progress></progress>`,
      )
    }
      </div>
    `;
  }
}
