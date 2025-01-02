import type {
  AuthorizedName,
  MaterialCitation,
  Name,
  SynonymGroup,
  Treatment,
} from "@plazi/synolib";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import "./Icons.ts";
import { authNameToID, nameToID } from "./utils.ts";

export type SynoStatus = "def" | "aug" | "dpr" | "cite";

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

const styles = css`
:host {
  border-radius: 12px;
  display: block;
  margin-block: 6px;
  margin-left: -20px;
  padding: 0 4px;
  font-feature-settings: "liga", "calt", "dlig";
}

s-icon {
  display: block;
}

.head {
  display: grid;
  line-height: 20px;
  grid-template-columns: auto 1fr auto auto;
  grid-template-rows: 20px auto;
  gap: 0 4px;
  align-items: center;

  &>div {
    grid-row-end: span 2;
  }
  
  &:hover button::before {
    background: #ededed8c;
  }
}

.counts {
  align-items: center;
  color: var(--text-color-muted);
  display: flex;
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

    &>s-icon {
      height: 12px;
    }

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

.uri, .id {
  font-feature-settings: "liga", "calt", "dlig", "case", "ss02", "tnum";
  word-break: break-all;
}

.uri:not(:empty) {
  font-size: 0.75rem;
  line-height: 1em;
  padding: 0 4px;
  border-radius: 4px;
  background: var(--nav-background);
  font-family: inherit;
  font-weight: normal;
  text-decoration: none;
  color: var(--text-color-muted);

  &.taxon {
    color: #4e69ae;
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
    background: var(--body-background);
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

@customElement("syno-treatment")
export class SynoTreatment extends LitElement {
  static override styles = styles;

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
    const treatmentID =
      this.trt?.url.replace("http://treatment.plazi.org/id/", "") || "";
    return html`
      <div class="head ${this.open ? "open" : ""}" @click=${(e: Event) => {
      e.stopPropagation();
      this.open = !this.open;
    }}>
        <s-icon icon=${this.status || "unknown"}></s-icon>
        <div>
          ${
      until(
        this.trt?.details.then((d) => d.creators + ","),
        nothing,
      )
    }
          <b>${this.trt?.date ?? html`<i>No Date</i>`}</b>:
          <i>${
      until(
        this.trt?.details.then((d) => `“${d.title}”`),
        html`<progress></progress>`,
      )
    }</i></div>
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
        <div class="row hidden">
          <s-icon icon="empty"></s-icon>
          <div>
            <b>Treatment ID:</b>
            <span class="id">${treatmentID}</span>
            <a target="_blank" href=${this.trt?.url} class="treatment uri">TreatmentBank<s-icon icon="link"></s-icon></a>
            <a target="_blank" href="https://git.ld.plazi.org/plazi/treatments-xml/src/branch/main/data/${
      treatmentID.slice(0, 2)
    }/${treatmentID.slice(2, 4)}/${
      treatmentID.slice(4, 6)
    }/${treatmentID}.xml" class="treatment uri">XML<s-icon icon="link"></s-icon></a>
            <a target="_blank" href="https://git.ld.plazi.org/plazi/treatments-rdf/src/branch/main/data/${
      treatmentID.slice(0, 2)
    }/${treatmentID.slice(2, 4)}/${
      treatmentID.slice(4, 6)
    }/${treatmentID}.ttl" class="treatment uri">RDF<s-icon icon="link"></s-icon></a>
          </div>
        </div>
      ${
      until(
        this.trt?.details.then((details) =>
          html`${
            details.treats.def.size
              ? html`<div class="row ${
                this.status === "def" || this.status === "cite" ? "hidden" : ""
              }"><s-icon icon="def"></s-icon><div><b class="green"><abbr title="This treatment defines (e.g. as 'sp. nov.)' a new Taxon.">Defines:</abbr></b>${
                details.treats.def.values().map((n) => {
                  const short = n.replace(
                    "http://taxon-concept.plazi.org/id/",
                    "",
                  );
                  return until(
                    this.synoGroup?.findName(n).then(nameLink),
                    html` <a class="taxon uri">${short}</a>`,
                  );
                })
              }</div></div>`
              : nothing
          }${
            details.treats.aug.size > 0 || details.treats.treattn.size > 0
              ? html`<div class="row ${
                this.status === "aug" || this.status === "cite" ? "hidden" : ""
              }"><s-icon icon="aug"></s-icon><div><b class="blue"><abbr title="The taxon the treatment is about. SynoSpecies interprets this as an assertion that this name is valid.">Treats:</abbr></b>${
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
                      this.synoGroup?.findName(n).then(nameLink),
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
              }"><s-icon icon="dpr"></s-icon><div><b class="red"><abbr title="Synonym(s) cited in the treatment.">Deprecates:</abbr></b>${
                details.treats.dpr.values().map((n) => {
                  const short = n.replace(
                    "http://taxon-concept.plazi.org/id/",
                    "",
                  );

                  return until(
                    this.synoGroup?.findName(n).then(nameLink),
                    html` <a class="taxon uri">${short}</a>`,
                  );
                })
              }</div></div>`
              : nothing
          }${
            details.treats.citetc.size > 0 || details.treats.citetn.size > 0
              ? html`<div class="row hidden"><s-icon icon="cite"></s-icon><div><b class="gray"><abbr title="These citations are not considered synonyms by SynoSpecies.">Cites:</abbr></b>${
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
                      this.synoGroup?.findName(n).then(nameLink),
                      html` <a class="taxon uri">${short}</a>`,
                    );
                  },
                )
              }</div></div>`
              : nothing
          }${
            details.figureCitations.length > 0
              ? html`<div class="row hidden"><s-icon icon="image"></s-icon><div class="figures">${
                details.figureCitations.sort((a, b) =>
                  (a.description || "").localeCompare(b.description || "")
                ).map((figure) =>
                  html`
                  <figure>
                    <img src=${figure.url} loading="lazy" alt=${figure.url}>
                    <figcaption>${figure.description ?? ""}</figcaption>
                  </figure>`
                )
              }</div></div>`
              : nothing
          }${
            details.materialCitations.length > 0
              ? html`<div class="row hidden"><s-icon icon="material"></s-icon><div class="materials"><b class="gray">Cited Materials:</b><ul>${
                details.materialCitations.sort((a, b) =>
                  ((a.typeStatus || "zz") + a.collectionCode + a.catalogNumber)
                    .localeCompare(
                      (b.typeStatus || "zz") +
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
                        /holotype|^type$/i.test(material.typeStatus)
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
                      html` <a class="uri" href=${uri}>Link<s-icon icon="link"></s-icon></a>`
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
        nothing,
      )
    }
      </div>
    `;
  }
}

@customElement("syno-col")
export class SynoColTreatment extends LitElement {
  static override styles = css`${styles} :host { border-radius: 4px; }`;

  @property({ attribute: false })
  accessor synoGroup: SynonymGroup | null = null;

  @property({ attribute: false })
  accessor colURI: string | null = null;

  @property({ attribute: false })
  accessor acceptedColURI: string | null = null;

  @state()
  accessor open = false;

  override render() {
    this.classList.toggle("open", this.open);
    return html`
      <div class="head ${this.open ? "open" : ""}" @click=${(e: Event) => {
      e.stopPropagation();
      this.open = !this.open;
    }}>
        <s-icon icon=${
      this.acceptedColURI !== this.colURI ? "col_dpr" : "col_aug"
    }></s-icon>
        <div>
          Found in the Catalogue of Life
        </div>
        <div></div>
        <button @click=${(e: Event) => {
      e.stopPropagation();
      this.open = !this.open;
    }}><s-icon icon=${this.open ? "collapse" : "expand"}></s-icon></button>
      </div>
      <div class="details ${this.open ? "open" : ""}">
        <div class="row hidden">
          <s-icon icon="empty"></s-icon>
          <div>
            <b>CoL ID:</b>
            <a target="_blank" href=${this.colURI || nothing} class="col uri">${
      this.colURI?.replace("https://www.catalogueoflife.org/data/taxon/", "")
    }<s-icon icon="link"></s-icon></a>
          </div>
        </div>
        <div class="row ${this.acceptedColURI !== this.colURI ? "" : "hidden"}">
          <s-icon icon="col_aug"></s-icon>
          <div>
            <b class="blue">Accepted Name:</b>
            ${
      until(
        this.synoGroup?.findName(this.acceptedColURI!).then(nameLink),
        html`<a target="_blank" href=${this
          .acceptedColURI!} class="col uri">${
          this.acceptedColURI?.replace(
            "https://www.catalogueoflife.org/data/taxon/",
            "",
          )
        }<s-icon icon="link"></s-icon></a>`,
      )
    }</a>
          </div>
        </div>
      </div>
    `;
  }
}

function nameLink(nn: Name | AuthorizedName) {
  if ((nn as AuthorizedName).authority) {
    return html` <a class="taxon" href="#${
      authNameToID(nn as AuthorizedName)
    }">${
      nn.displayName + " " +
      (nn as AuthorizedName).authority
    }</a>`;
  } else {
    return html` <a class="taxon" href="#${
      nameToID(nn as Name)
    }">${nn.displayName}</a>`;
  }
}
