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
import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import { authNameToID, nameToID } from "./utils.ts";
import { type NameState } from "../types.ts";

@customElement("syno-authname")
export class SynoAuthName extends LitElement {
  @property({ attribute: false })
  accessor synoGroup: SynonymGroup | null = null;
  @property({ attribute: false })
  accessor authorizedName: AuthorizedName | null = null;

  @state()
  accessor open = false;

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

    const authorities = new Set(this.authorizedName.authorities);
    authorities.delete(this.authorizedName.authority);

    return html`
      <div class="header" @click=${(e: Event) => {
      e.stopPropagation();
      this.open = !this.open;
    }}>
      <h3 id=${authNameToID(this.authorizedName)}>
        <i class="ditto">${this.authorizedName.displayName}</i>
        ${this.authorizedName.authority}
      </h3>
      ${
      // authorities.size > 0 ||
      this.authorizedName.taxonConceptURIs.length > 0
        ? html`<button class="icon" @click=${(e: Event) => {
          e.stopPropagation();
          this.open = !this.open;
        }}><s-icon icon=${
          this.open ? "collapse" : "justification"
        }></s-icon></button>`
        : nothing}
    </div>
    <div class="details ${this.open ? "open" : ""}">
      ${
      this.authorizedName.taxonConceptURIs.map((tc) =>
        html`
      <div class="hidden row">
        <s-icon icon="empty"></s-icon>
        <div>
          <b>Taxon Concept ID:</b>
          <span class="id">${tc}</span>
          <a target="_blank" href="?q=${
          encodeURIComponent(tc)
        }" class="taxon uri">Use as search Term<s-icon icon="link"></s-icon></a>
          <a target="_blank" href=${tc} class="uri">TreatmentBank<s-icon icon="link"></s-icon></a>
          <a target="_blank" href="https://rdf2h-browser.linked.solutions/#${
          tc.replace("http://", "https://")
            .replace(".plazi.", ".ld.plazi.")
        }" class="uri">RDF2h<s-icon icon="link"></s-icon></a>
        </div>
      </div>`
      )
    }${
      authorities.size > 0
        ? html`<div class="row">
        <s-icon icon="empty"></s-icon>
        <div>
          <b>Authority also given as:</b> “${[...authorities].join("”, “")}”
        </div>
      </div>`
        : nothing
    }
    </div>
    <ul>
      ${
      this.authorizedName.col
        ? html`<syno-col .synoGroup=${this.synoGroup} .col=${this.authorizedName.col}></syno-col>`
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
  accessor name: NameState | null = null;
  @property({ attribute: false })
  accessor showKingdom = false;

  @state()
  accessor open = false;

  override render() {
    if (!this.synoGroup || !this.name) return nothing;
    this.classList.toggle("open", this.open);

    const treatments_array: { trt: Treatment; status: SynoStatus }[] = [];

    for (const trt of this.name.name.treatments.treats) {
      treatments_array.push({ trt, status: "aug" });
    }
    for (const trt of this.name.name.treatments.cite) {
      treatments_array.push({ trt, status: "cite" });
    }

    treatments_array.sort((a, b) => {
      if (a.trt.date && b.trt.date) return a.trt.date - b.trt.date;
      if (a.trt.date) return 1;
      if (b.trt.date) return -1;
      return 0;
    });

    return html`
    <div class="header" @click=${(e: Event) => {
      e.stopPropagation();
      this.open = !this.open;
    }}>
      <h2 id=${
      nameToID(this.name.name)
    }><i>${this.name.name.displayName}</i></h2>
      <div class="header" style="padding: 0;">
        <s-wikidata displayname=${this.name.name.displayName}></s-wikidata>
        <button class="icon" @click=${(e: Event) => {
      e.stopPropagation();
      this.open = !this.open;
    }}><s-icon icon=${
      this.open ? "collapse" : "justification"
    }></s-icon></button>
    </div>
    </div>
    <div class="details ${this.open ? "open" : ""}">
      ${
      this.name.name.taxonNameURI
        ? html`<div class="hidden row">
        <s-icon icon="empty"></s-icon>
        <div>
          <b>Taxon Name ID:</b>
          <span class="id">${this.name.name.taxonNameURI}</span>
          <a target="_blank" href="?q=${
          encodeURIComponent(this.name.name.taxonNameURI)
        }" class="taxon uri">Use as search Term<s-icon icon="link"></s-icon></a>
          <a target="_blank" href=${this.name.name.taxonNameURI} class="uri">TreatmentBank<s-icon icon="link"></s-icon></a>
          <a target="_blank" href="https://rdf2h-browser.linked.solutions/#${
          this.name.name.taxonNameURI.replace("http://", "https://").replace(
            ".plazi.",
            ".ld.plazi.",
          )
        }" class="uri">RDF2h<s-icon icon="link"></s-icon></a>
        </div>
      </div>`
        : nothing
    }
      <div class="row ${
      this.name.name.rank === "genus" || this.name.name.rank === "species"
        ? "hidden"
        : ""
    }">
        <s-icon icon="empty"></s-icon>
        <div><b>Rank:</b> ${this.name.name.rank}</div>
      </div>
      <div class="row ${
      this.showKingdom || this.name.homonym || !this.name.name.kingdom ? "" : "hidden"
    }">
        <s-icon style=${
      this.name.homonym ? "color: var(--accent);" : ""
    } icon=${
      ["Animalia", "Plantae", "Bacteria", "Fungi"].includes(this.name.name.kingdom)
        ? this.name.name.kingdom
        : "empty"
    }></s-icon>
        <div><b>Kingdom:</b> ${
      this.name.name.kingdom || html`<i>Missing Kingdom</i>`
    }${
      this.name.homonym
        ? html` <i style="color: var(--accent);">(is homonym)</i>`
        : nothing
    }</div>
      </div>
      <div class="hidden row">
        <s-icon icon="justification"></s-icon>
        <div style="white-space: pre-wrap;"><b><abbr title="Why this name was found by SynoSpecies.">Justification:</abbr></b> ${
      until(
        justify(this.name.name).then((just) => `This ${just}`),
        "Justification loading...",
      )
    }</div>
      </div>
      <!--<div class="row">
        <s-icon icon="empty"></s-icon>
        <div><b style="line-height: 20px;">Found in Wikidata:</b><s-wikidata displayname=${this.name.name.displayName}></s-wikidata></div>
      </div>-->
      ${
      until(
        this.name.name.vernacularNames.then((names) => {
          if (names.size > 0) {
            return html`
      <div class="row">
        <s-icon icon="vernacular"></s-icon>
        <div><b>Common Names:</b> ${
              "“" + distinct([...names.values()].flat()).join("”, “") + "”"
            }</div>
      </div>`;
          }
        }),
        nothing,
      )
    }
    </div>
    <ul>
    ${
      this.name.name.col
        ? html`<syno-col .synoGroup=${this.synoGroup} .col=${this.name.name.col}></syno-col>`
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
      this.name.name.authorizedNames.map((authorizedName) =>
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
    return `is – according to ${details.creators} ${name.justification.treatment.date} –\n     a synonym of ${name.justification.parent.displayName} which ${parent}`;
    // return `is, according to ${details.creators} ${details.date} “${details.title||"No Title"}” ${name.justification.treatment.url},\n     a synonym of ${name.justification.parent.displayName} which ${parent}`;
  } else {
    const parent = await justify(name.justification.parent);
    return `is – according to the Catalogue of Life –\n     a synonym of ${name.justification.parent.displayName} which ${parent}`;
  }
}
