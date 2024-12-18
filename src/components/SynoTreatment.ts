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
      border-radius: 8px;
      display: block;
      margin-block: 4px;
      margin-left: -20px;
      padding: 0 4px;
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
      margin: 4px 0 0 20px;

      .row {
        display: grid;
        line-height: 16px;
        font-size: 0.75em;
        grid-template-columns: auto auto 1fr;
        grid-template-rows: 16px auto;
        gap: 0 4px;
        align-items: center;

        &>div {
          grid-row-end: span 2;

          &>span {
            font-weight: 600;
            text-transform: uppercase;
          }
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
      color: var(--text-color-muted);
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
      <div class="details ${this.open ? "open" : ""}">
      ${
      until(
        this.trt?.details.then((details) =>
          html`${
            details.treats.def.size
              ? html`<div class="row ${
                this.status === "def" || this.status === "cite" ? "hidden" : ""
              }"><s-icon icon="def"></s-icon><div><span class="green">Defines:</span>${
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
              }"><s-icon icon="aug"></s-icon><div><span class="blue">Treats:</span>${
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
              }"><s-icon icon="dpr"></s-icon><div><span class="red">Deprecates:</span>${
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
              ? html`<div class="row hidden"><s-icon icon="cite"></s-icon><div><span class="gray">Cites:</span>${
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
                details.figureCitations.map((figure) => html`
                  <figure>
                    <img src=${figure.url} loading="lazy" alt=${figure.description ?? "Cited Figure without caption"}>
                    <figcaption>${figure.description ?? ""}</figcaption>
                  </figure>`)
              }</div></div>`
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

/*
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
  */
