import type {
  AuthorizedName,
  Name,
  SynonymGroup,
  Treatment,
} from "@plazi/synolib";
import { distinct } from "@std/collections/distinct";
import "./Icons.ts";
import {
  SynoColTreatment,
  type SynoStatus,
  SynoTreatment,
} from "./SynoTreatment.ts";
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

    return html`
        <h3 id=${
      this.authorizedName.colURI
        ? encodeURIComponent(this.authorizedName.colURI)
        : nothing
    }>
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
    }
        </h3>
        <ul>
      ${
      this.authorizedName.colURI
        ? html`<syno-col .synoGroup=${this.synoGroup} .colURI=${this.authorizedName.colURI} .acceptedColURI=${this.authorizedName.acceptedColURI}></syno-col>`
        : nothing
    }${
      treatments_array.map(({ trt, status }) => {
        const t = new SynoTreatment();
        t.trt = trt;
        t.status = status;
        t.synoGroup = this.synoGroup!;
        return t;
      })
    }
    </ul>`;
  }

  protected override createRenderRoot() {
    return this;
  }
}

@customElement("syno-name")
export class SynoName extends LitElement {
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

    return html`
    <div class="header">
      <h2 id=${
      this.name.colURI ? encodeURIComponent(this.name.colURI) : nothing
    }>
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
        ? html`<syno-col .synoGroup=${this.synoGroup} .colURI=${this.name.colURI} .acceptedColURI=${this.name.acceptedColURI}></syno-col>`
        : nothing
    }${
      treatments_array.map(({ trt, status }) => {
        const t = new SynoTreatment();
        t.trt = trt;
        t.status = status;
        t.synoGroup = this.synoGroup!;
        return t;
      })
    }
    </ul>
    ${
      this.name.authorizedNames.map((authorizedName) =>
        html`<syno-authname .synoGroup=${this.synoGroup} .authorizedName=${authorizedName}></syno-authname>`
      )
    }`;
  }

  protected override createRenderRoot() {
    return this;
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
