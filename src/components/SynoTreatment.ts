import type { AuthorizedName, SynonymGroup, Treatment } from "@plazi/synolib";
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

@customElement("syno-treatment")
export class SynoTreatment extends LitElement {
  static override styles = css`
    :host {
      line-height: 20px;
      padding: 4px;
      margin: 4px 0 4px -20px;
      display: block;
    }

    s-icon {
      display: block;
    }

    .head {
      display: grid;
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
      margin: 4px 0 0 20px;

      .row {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: 20px auto;
        gap: 0 4px;
        align-items: center;

        &>div {
          grid-row-end: span 2;
        }
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
          <a target="_blank" href=${this.trt?.url} class="treatment uri">
            ${this.trt?.url.replace("http://treatment.plazi.org/id/", "")}
            <s-icon icon="link"></s-icon>
          </a>
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
      ${
      this.open
        ? html`
        <div class="details">
          ...
        </div>`
        : nothing
    }
    `;
  }
}

export class SynoTreatmentOld extends HTMLElement {
  constructor(
    private trt: Treatment,
    private status: SynoStatus,
    private synoGroup: SynonymGroup,
  ) {
    super();
  }

  connectedCallback() {
    if (this.innerHTML) return;
    this.innerHTML = icons[this.status] ?? icons.unknown;

    const button = document.createElement("button");
    button.classList.add("icon", "button");
    button.innerHTML = icons.expand;
    button.addEventListener("click", () => {
      if (this.classList.toggle("expanded")) {
        button.innerHTML = icons.collapse;
      } else {
        button.innerHTML = icons.expand;
      }
    });

    const date = document.createElement("span");
    if (this.trt.date) date.innerText = "" + this.trt.date;
    else {
      date.classList.add("missing");
      date.innerText = "No Date";
    }
    this.append(date);

    const spinner = document.createElement("progress");
    this.append(": ", spinner);

    this.append(button);

    const names = document.createElement("div");
    names.classList.add("indent", "details");
    this.append(names);

    const url = document.createElement("a");
    url.classList.add("treatment", "uri");
    url.href = this.trt.url;
    url.target = "_blank";
    url.innerText = this.trt.url.replace("http://treatment.plazi.org/id/", "");
    url.innerHTML += icons.link;
    names.append(url);

    this.trt.details.then((details) => {
      const creators = document.createElement("span");
      const title = document.createElement("i");
      spinner.replaceWith(creators, " ", title);

      if (details.creators) creators.innerText = details.creators;
      else {
        creators.classList.add("missing");
        creators.innerText = "No Authors";
      }

      if (details.title) title.innerText = "“" + details.title + "”";
      else {
        title.classList.add("missing");
        title.innerText = "No Title";
      }

      if (details.treats.def.size > 0) {
        const line = document.createElement("div");
        // line.innerHTML = this.status === "cite" ? icons.line : icons.east;
        line.innerHTML = icons.east;
        line.innerHTML += icons.def;
        if (this.status === "def" || this.status === "cite") {
          line.classList.add("hidden");
        }
        names.append(line);

        details.treats.def.forEach((n) => {
          const url = document.createElement("a");
          url.classList.add("taxon", "uri");
          const short = n.replace("http://taxon-concept.plazi.org/id/", "");
          url.innerText = short;
          url.href = "#" + short;
          url.title = "show name";
          line.append(" ", url);
          this.synoGroup.findName(n).then((nn) => {
            url.classList.remove("uri");
            if ((nn as AuthorizedName).authority) {
              url.innerText = nn.displayName + " " +
                (nn as AuthorizedName).authority;
            } else url.innerText = nn.displayName;
          }, () => {
            url.removeAttribute("href");
          });
        });
      }
      if (details.treats.aug.size > 0 || details.treats.treattn.size > 0) {
        const line = document.createElement("div");
        // line.innerHTML = this.status === "cite" ? icons.line : icons.east;
        line.innerHTML = icons.east;
        line.innerHTML += icons.aug;
        if (this.status === "aug" || this.status === "cite") {
          line.classList.add("hidden");
        }
        names.append(line);

        details.treats.aug.forEach((n) => {
          const url = document.createElement("a");
          url.classList.add("taxon", "uri");
          const short = n.replace("http://taxon-concept.plazi.org/id/", "");
          url.innerText = short;
          url.href = "#" + short;
          url.title = "show name";
          line.append(" ", url);
          this.synoGroup.findName(n).then((nn) => {
            url.classList.remove("uri");
            if ((nn as AuthorizedName).authority) {
              url.innerText = nn.displayName + " " +
                (nn as AuthorizedName).authority;
            } else url.innerText = nn.displayName;
          }, () => {
            url.removeAttribute("href");
          });
        });
        details.treats.treattn.forEach((n) => {
          const url = document.createElement("a");
          url.classList.add("taxon", "uri");
          const short = n.replace("http://taxon-name.plazi.org/id/", "");
          url.innerText = short;
          url.href = "#" + short;
          url.title = "show name";
          line.append(" ", url);
          this.synoGroup.findName(n).then((nn) => {
            url.classList.remove("uri");
            if ((nn as AuthorizedName).authority) {
              url.innerText = nn.displayName + " " +
                (nn as AuthorizedName).authority;
            } else url.innerText = nn.displayName;
          }, () => {
            url.removeAttribute("href");
          });
        });
      }
      if (details.treats.dpr.size > 0) {
        const line = document.createElement("div");
        // line.innerHTML = this.status === "cite" ? icons.line : icons.west;
        line.innerHTML = icons.west;
        line.innerHTML += icons.dpr;
        if (this.status === "dpr" || this.status === "cite") {
          line.classList.add("hidden");
        }
        names.append(line);

        details.treats.dpr.forEach((n) => {
          const url = document.createElement("a");
          url.classList.add("taxon", "uri");
          const short = n.replace("http://taxon-concept.plazi.org/id/", "");
          url.innerText = short;
          url.href = "#" + short;
          url.title = "show name";
          line.append(" ", url);
          this.synoGroup.findName(n).then((nn) => {
            url.classList.remove("uri");
            if ((nn as AuthorizedName).authority) {
              url.innerText = nn.displayName + " " +
                (nn as AuthorizedName).authority;
            } else url.innerText = nn.displayName;
          }, () => {
            url.removeAttribute("href");
          });
        });
      }
      if (details.treats.citetc.size > 0 || details.treats.citetn.size > 0) {
        const line = document.createElement("div");
        line.innerHTML = icons.empty + icons.cite;
        // if (this.status === "dpr" || this.status === "cite") {
        line.classList.add("hidden");
        // }
        names.append(line);

        details.treats.citetc.forEach((n) => {
          const url = document.createElement("a");
          url.classList.add("taxon", "uri");
          const short = n.replace("http://taxon-concept.plazi.org/id/", "");
          url.innerText = short;
          url.href = "#" + short;
          url.title = "show name";
          line.append(" ", url);
          this.synoGroup.findName(n).then((nn) => {
            url.classList.remove("uri");
            if ((nn as AuthorizedName).authority) {
              url.innerText = nn.displayName + " " +
                (nn as AuthorizedName).authority;
            } else url.innerText = nn.displayName;
          }, () => {
            url.removeAttribute("href");
          });
        });
        details.treats.citetn.forEach((n) => {
          const url = document.createElement("a");
          url.classList.add("taxon", "uri");
          const short = n.replace("http://taxon-name.plazi.org/id/", "");
          url.innerText = short;
          url.href = "#" + short;
          url.title = "show name";
          line.append(" ", url);
          this.synoGroup.findName(n).then((nn) => {
            url.classList.remove("uri");
            if ((nn as AuthorizedName).authority) {
              url.innerText = nn.displayName + " " +
                (nn as AuthorizedName).authority;
            } else url.innerText = nn.displayName;
          }, () => {
            url.removeAttribute("href");
          });
        });
      }
      if (details.figureCitations.length > 0) {
        const line = document.createElement("div");
        line.classList.add("figures", "hidden");
        names.append(line);
        for (const figure of details.figureCitations) {
          const el = document.createElement("figure");
          line.append(el);
          const img = document.createElement("img");
          img.src = figure.url;
          img.loading = "lazy";
          img.alt = figure.description ?? "Cited Figure without caption";
          el.append(img);
          const caption = document.createElement("figcaption");
          caption.innerText = figure.description ?? "";
          el.append(caption);
        }
      }
      if (details.materialCitations.length > 0) {
        const line = document.createElement("div");
        line.innerHTML = icons.empty + icons.cite +
          " Material Citations:<br> -";
        line.classList.add("hidden");
        names.append(line);
        line.innerText += details.materialCitations.map((c) =>
          JSON.stringify(c)
            .replaceAll("{", "")
            .replaceAll("}", "")
            .replaceAll('":', ": ")
            .replaceAll(",", ", ")
            .replaceAll('"', "")
        ).join("\n -");
      }
    });
  }
}
