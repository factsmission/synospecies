import type {
  AuthorizedName,
  Name,
  SynonymGroup,
  Treatment,
} from "@plazi/synolib";
import { distinct } from "@std/collections/distinct";
import "./Icons.ts";
import { type SynoStatus, SynoTreatment } from "./SynoTreatment.ts";
import { html, render } from "lit";

export class SynoName extends HTMLElement {
  constructor(
    private name: Name,
    private synoGroup: SynonymGroup,
    private SORT_TREATMENTS_BY_TYPE: boolean,
  ) {
    super();
  }

  connectedCallback() {
    if (this.innerHTML) return;
    const title = document.createElement("h2");
    const name_title = document.createElement("i");
    name_title.innerText = this.name.displayName;
    title.append(name_title);
    this.append(title);

    const rank_badge = document.createElement("span");
    rank_badge.classList.add("rank");
    rank_badge.innerText = this.name.rank;
    const kingdom_badge = document.createElement("span");
    kingdom_badge.classList.add("rank");
    kingdom_badge.innerText = this.name.kingdom || "Missing Kingdom";
    title.append(" ", kingdom_badge, " ", rank_badge);

    if (this.name.taxonNameURI) {
      const short = this.name.taxonNameURI.replace(
        "http://taxon-name.plazi.org/id/",
        "",
      );
      render(
        html`<a class="taxon uri" id=${short} href=${this.name.taxonNameURI} target="_blank">${short}<s-icon icon="link"></s-icon></a>`,
        title,
      );
    }

    const vernacular = document.createElement("div");
    vernacular.classList.add("vernacular");
    this.name.vernacularNames.then((names) => {
      if (names.size > 0) {
        vernacular.innerText = "“" +
          distinct([...names.values()].flat()).join("”, “") + "”";
      }
    });
    this.append(vernacular);

    const treatments = document.createElement("ul");
    this.append(treatments);

    if (this.name.colURI) {
      const short = this.name.colURI.replace(
        "https://www.catalogueoflife.org/data/taxon/",
        "",
      );
      render(
        html`<a class="col uri" id=${short} href=${this.name.taxonNameURI} target="_blank">${short}<s-icon icon="link"></s-icon></a>`,
        title,
      );

      const li = document.createElement("div");
      li.classList.add("treatmentline");
      render(
        html`<s-icon icon=${
          this.name.acceptedColURI !== this.name.colURI ? "col_dpr" : "col_aug"
        }></s-icon>`,
        li,
      );
      treatments.append(li);

      const creators = document.createElement("span");
      creators.innerText = "Catalogue of Life";
      li.append(creators);

      const names = document.createElement("div");
      names.classList.add("indent");
      li.append(names);

      if (this.name.acceptedColURI !== this.name.colURI) {
        const line = document.createElement("div");
        render(
          html`<s-icon icon="east"></s-icon><s-icon icon="col_aug"></s-icon>`,
          line,
        );
        names.append(line);

        const col_uri = document.createElement("a");
        col_uri.classList.add("col", "uri");
        const id = this.name.acceptedColURI!.replace(
          "https://www.catalogueoflife.org/data/taxon/",
          "",
        );
        col_uri.innerText = id;
        col_uri.href = `#${id}`;
        col_uri.title = "show name";
        line.append(col_uri);
        this.synoGroup.findName(this.name.acceptedColURI!).then((n) => {
          if ((n as AuthorizedName).authority) {
            col_uri.innerText = n.displayName + " " +
              (n as AuthorizedName).authority;
          } else col_uri.innerText = n.displayName;
        }, () => {
          col_uri.removeAttribute("href");
        });
      }
    }
    if (
      this.name.treatments.treats.size > 0 || this.name.treatments.cite.size > 0
    ) {
      for (const trt of this.name.treatments.treats) {
        const li = new SynoTreatment(trt, "aug", this.synoGroup);
        treatments.append(li);
      }
      for (const trt of this.name.treatments.cite) {
        const li = new SynoTreatment(trt, "cite", this.synoGroup);
        treatments.append(li);
      }
    }

    const justification = document.createElement("abbr");
    justification.classList.add("justification");
    justification.innerText = "...?";
    justify(this.name).then((just) => justification.title = `This ${just}`);
    title.append(" ", justification);

    for (const authorizedName of this.name.authorizedNames) {
      const authName = document.createElement("h3");
      const name_title = document.createElement("i");
      name_title.innerText = authorizedName.displayName;
      name_title.classList.add("gray");
      authName.append(name_title);
      authName.append(" ", authorizedName.authority);
      this.append(authName);

      const treatments = document.createElement("ul");
      this.append(treatments);

      if (authorizedName.taxonConceptURI) {
        const name_uri = document.createElement("a");
        name_uri.classList.add("taxon", "uri");
        const short = authorizedName.taxonConceptURI.replace(
          "http://taxon-concept.plazi.org/id/",
          "",
        );
        name_uri.innerText = short;
        name_uri.id = short;
        name_uri.href = authorizedName.taxonConceptURI;
        name_uri.target = "_blank";
        render(html`<s-icon icon="link"></s-icon>`, name_uri);
        authName.append(" ", name_uri);
      }
      if (authorizedName.colURI) {
        const col_uri = document.createElement("a");
        col_uri.classList.add("col", "uri");
        const id = authorizedName.colURI.replace(
          "https://www.catalogueoflife.org/data/taxon/",
          "",
        );
        col_uri.innerText = id;
        col_uri.id = id;
        col_uri.href = authorizedName.colURI;
        col_uri.target = "_blank";
        render(html`<s-icon icon="link"></s-icon>`, col_uri);
        authName.append(" ", col_uri);

        const li = document.createElement("div");
        li.classList.add("treatmentline");
        render(
          html`<s-icon icon=${
            authorizedName.acceptedColURI !== authorizedName.colURI
              ? "col_dpr"
              : "col_aug"
          }></s-icon>`,
          li,
        );
        treatments.append(li);

        const creators = document.createElement("span");
        creators.innerText = "Catalogue of Life";
        li.append(creators);

        const names = document.createElement("div");
        names.classList.add("indent");
        li.append(names);

        if (authorizedName.acceptedColURI !== authorizedName.colURI) {
          const line = document.createElement("div");
          render(
            html`<s-icon icon="east"></s-icon><s-icon icon="col_aug"></s-icon>`,
            line,
          );
          names.append(line);

          const col_uri = document.createElement("a");
          col_uri.classList.add("col", "uri");
          const id = authorizedName.acceptedColURI!.replace(
            "https://www.catalogueoflife.org/data/taxon/",
            "",
          );
          col_uri.innerText = id;
          col_uri.href = `#${id}`;
          col_uri.title = "show name";
          line.append(" ", col_uri);
          this.synoGroup.findName(authorizedName.acceptedColURI!).then((n) => {
            col_uri.classList.remove("uri");
            if ((n as AuthorizedName).authority) {
              col_uri.innerText = n.displayName + " " +
                (n as AuthorizedName).authority;
            } else col_uri.innerText = n.displayName;
          }, () => {
            col_uri.removeAttribute("href");
          });
        }
      }

      const treatments_array: { trt: Treatment; status: SynoStatus }[] = [];

      for (const trt of authorizedName.treatments.def) {
        treatments_array.push({ trt, status: "def" });
      }
      for (const trt of authorizedName.treatments.aug) {
        treatments_array.push({ trt, status: "aug" });
      }
      for (const trt of authorizedName.treatments.dpr) {
        treatments_array.push({ trt, status: "dpr" });
      }
      for (const trt of authorizedName.treatments.cite) {
        treatments_array.push({ trt, status: "cite" });
      }

      if (!this.SORT_TREATMENTS_BY_TYPE) {
        treatments_array.sort((a, b) => {
          if (a.trt.date && b.trt.date) return a.trt.date - b.trt.date;
          if (a.trt.date) return 1;
          if (b.trt.date) return -1;
          return 0;
        });
      }

      for (const { trt, status } of treatments_array) {
        const li = new SynoTreatment(trt, status, this.synoGroup);
        treatments.append(li);
      }
    }
  }
}
customElements.define("syno-name", SynoName);

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
