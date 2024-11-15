import type {
  AuthorizedName,
  Name,
  SynonymGroup,
  Treatment,
} from "@plazi/synolib";
import { distinct } from "@std/collections/distinct";
import "./Icons.ts";
import { type SynoStatus, SynoTreatment } from "./SynoTreatment.ts";
import "./WikidataButtons.ts";
import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

const shortUrl = (url: string) =>
  url
    .replace("https://www.catalogueoflife.org/data/taxon/", "")
    .replace("http://taxon-concept.plazi.org/id/", "")
    .replace("http://taxon-name.plazi.org/id/", "");

@customElement("syno-authname")
export class SynoAuthName extends LitElement {
  static override styles = css`
  .ditto {
    color:  var(--text-color-muted);
  }`; // TODO

  @property({ attribute: false })
  accessor synoGroup: SynonymGroup | null = null;
  @property({ attribute: false })
  accessor authorizedName: AuthorizedName | null = null;

  override render() {
    if (!this.synoGroup || !this.authorizedName) return nothing;

    const treatments_array: { trt: Treatment; status: SynoStatus }[] = [];

    for (const trt of this.authorizedName.treatments.def) {
      treatments_array.push({ trt, status: "def" });
    }
    for (const trt of this.authorizedName.treatments.aug) {
      treatments_array.push({ trt, status: "aug" });
    }
    for (const trt of this.authorizedName.treatments.dpr) {
      treatments_array.push({ trt, status: "dpr" });
    }
    for (const trt of this.authorizedName.treatments.cite) {
      treatments_array.push({ trt, status: "cite" });
    }

    treatments_array.sort((a, b) => {
      if (a.trt.date && b.trt.date) return a.trt.date - b.trt.date;
      if (a.trt.date) return 1;
      if (b.trt.date) return -1;
      return 0;
    });

    // TODO organize styles better
    return html`
        <link rel="stylesheet" href="index.css" />
        <h3>
          <i class="ditto">${this.authorizedName.displayName}</i>
          ${this.authorizedName.authority}
            ${
      this.authorizedName.taxonConceptURI
        ? html`<a class="taxon uri" id=${
          encodeURIComponent(this.authorizedName.taxonConceptURI)
        } href=${this.authorizedName.taxonConceptURI} target="_blank">${
          shortUrl(this.authorizedName.taxonConceptURI)
        }<s-icon icon="link"></s-icon></a>`
        : nothing
    }${
      this.authorizedName.colURI
        ? html`<a class="taxon uri" id=${
          encodeURIComponent(this.authorizedName.colURI)
        } href=${this.authorizedName.colURI} target="_blank">${
          shortUrl(this.authorizedName.colURI)
        }<s-icon icon="link"></s-icon></a>`
        : nothing
    }
        </h3>
        <ul>
        ${
      this.authorizedName.colURI
        ? html`<div class="treatmentline">
            <s-icon icon=${
          this.authorizedName.acceptedColURI !== this.authorizedName.colURI
            ? "col_dpr"
            : "col_aug"
        }></s-icon>
              Catalogue of Life
              <div class="indent">${
          this.authorizedName.acceptedColURI !== this.authorizedName.colURI
            ? html`<div><s-icon icon="east"></s-icon><s-icon icon="col_aug"></s-icon><a
                  href="#${
              encodeURIComponent(this.authorizedName.acceptedColURI!)
            }" title="show name">${
              until(
                this.synoGroup.findName(this.authorizedName.acceptedColURI!)
                  .then((n) =>
                    (n as AuthorizedName).authority
                      ? n.displayName + " " + (n as AuthorizedName).authority
                      : n.displayName
                  ),
                shortUrl(this.authorizedName.acceptedColURI!),
              )
            }</a></div>`
            : nothing
        }</div>
            </div>`
        : nothing
    }${
      treatments_array.map(({ trt, status }) =>
        new SynoTreatment(trt, status, this.synoGroup!)
      )
    }
    </ul>`;
  }
}

@customElement("syno-name")
export class SynoName extends LitElement {
  static override styles = css`
  .header {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr;
    align-items: center;
    gap: .25rem;
  }`; // TODO

  @property({ attribute: false })
  accessor synoGroup: SynonymGroup | null = null;
  @property({ attribute: false })
  accessor name: Name | null = null;

  override render() {
    if (!this.synoGroup || !this.name) return nothing;

    const treatments_array: { trt: Treatment; status: SynoStatus }[] = [];

    for (const trt of this.name.treatments.treats) {
      treatments_array.push({ trt, status: "aug" });
    }
    for (const trt of this.name.treatments.cite) {
      treatments_array.push({ trt, status: "cite" });
    }

    treatments_array.sort((a, b) => {
      if (a.trt.date && b.trt.date) return a.trt.date - b.trt.date;
      if (a.trt.date) return 1;
      if (b.trt.date) return -1;
      return 0;
    });

    // TODO organize styles better
    return html`
    <link rel="stylesheet" href="index.css" />
    <div class="header">
      <h2>
        <i>${this.name.displayName}</i>
        <span class="rank">${this.name.kingdom || "Missing Kingdom"}</span>
        <span class="rank">${this.name.rank}</span>
    ${
      this.name.taxonNameURI
        ? html`<a class="taxon uri" id=${
          encodeURIComponent(this.name.taxonNameURI)
        } href=${this.name.taxonNameURI} target="_blank">${
          shortUrl(this.name.taxonNameURI)
        }<s-icon icon="link"></s-icon></a>`
        : nothing
    }${
      this.name.colURI
        ? html`<a class="taxon uri" id=${
          encodeURIComponent(this.name.colURI)
        } href=${this.name.colURI} target="_blank">${
          shortUrl(this.name.colURI)
        }<s-icon icon="link"></s-icon></a>`
        : nothing
    }
        <abbr class="justification" title="${
      until(
        justify(this.name).then((just) => `This ${just}`),
        "Justification loading...",
      )
    }">...?</abbr>
      </h2>
      <s-wikidata displayname=${this.name.displayName}></s-wikidata>
    </div>
    <div class="vernacular">${
      until(
        this.name.vernacularNames.then((names) => {
          if (names.size > 0) {
            return "“" +
              distinct([...names.values()].flat()).join("”, “") + "”";
          }
        }),
        nothing,
      )
    }</div>
    <ul>
    ${
      this.name.colURI
        ? html`<div class="treatmentline">
        <s-icon icon=${
          this.name.acceptedColURI !== this.name.colURI ? "col_dpr" : "col_aug"
        }></s-icon>
          Catalogue of Life
          <div class="indent">${
          this.name.acceptedColURI !== this.name.colURI
            ? html`<div><s-icon icon="east"></s-icon><s-icon icon="col_aug"></s-icon><a
              href="#${
              encodeURIComponent(this.name.acceptedColURI!)
            }" title="show name">${
              until(
                this.synoGroup.findName(this.name.acceptedColURI!).then((n) =>
                  (n as AuthorizedName).authority
                    ? n.displayName + " " + (n as AuthorizedName).authority
                    : n.displayName
                ),
                shortUrl(this.name.acceptedColURI!),
              )
            }</a></div>`
            : nothing
        }</div>
        </div>`
        : nothing
    }${
      treatments_array.map(({ trt, status }) =>
        new SynoTreatment(trt, status, this.synoGroup!)
      )
    }
    </ul>
    ${
      this.name.authorizedNames.map((authorizedName) =>
        html`<syno-authname .synoGroup=${this.synoGroup} .authorizedName=${authorizedName}></syno-authname>`
      )
    }`;
  }
}

async function justify(name: Name): Promise<string> {
  if (name.justification.searchTerm) {
    if (name.justification.subTaxon) {
      return "is a sub-taxon of the search term.";
    } else return "is the search term.";
  } else if (name.justification.treatment) {
    const details = await name.justification.treatment.details;
    const parent = await justify(name.justification.parent);
    return `is, according to ${details.creators} ${name.justification.treatment.date},\n     a synonym of ${name.justification.parent.displayName} which ${parent}`;
    // return `is, according to ${details.creators} ${details.date} “${details.title||"No Title"}” ${name.justification.treatment.url},\n     a synonym of ${name.justification.parent.displayName} which ${parent}`;
  } else {
    const parent = await justify(name.justification.parent);
    return `is, according to the Catalogue of Life,\n     a synonym of ${name.justification.parent.displayName} which ${parent}`;
  }
}
