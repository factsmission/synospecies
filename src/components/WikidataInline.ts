import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { SparqlEndpoint } from "@plazi/synolib";

@customElement("s-wikidata")
export class Timeline extends LitElement {
  static override styles = css`
    * {
      box-sizing: border-box;
    }

    button {
      background: none;
      border: none;
      display: inline-block;
      height: 100%;
      margin: 0;
      padding: 0;
      width: 100%;
    }

    .button {
      background: #eeeeee;
      display: inline-block;
      border: none;
      border-radius: 0.2rem;
      margin: 0 0.2rem;
      min-width: calc(.4rem + 1em);
      overflow: hidden;
      padding: 0.2rem;

      & svg {
        display: block;
        height: 1em;
        margin: 0 auto;
      }

      &:hover {
        background: #cccccc;
      }

      &[disabled],
      &[disabled]:hover {
        background: #ffffff;

        & path {
          fill: #777777;
        }
      }

      &:focus,
      &:focus-visible {
        outline: 2px solid #81951d;
      }
    }

    .button_group {
      display: inline-flex;

      &>.button:first-child {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        margin-right: 1px;
      }

      &>.button:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        margin-left: 0
      }

      &>.button:only-child {
        border-radius: 0.2rem;
        margin: 0 0.2rem;
      }
    }

    .dropdown {
      position: relative;

      svg {
        transition: 500ms transform;
      }
    }

    .dropdown_menu {
      display: none;
    }

    .dropdown[data-open] {
      overflow: visible;

      svg {
        transform: rotate(180deg);
      }

      .dropdown_menu {
        background: white;
        border: 1px solid #00000033;
        border-radius: 0.25rem;
        box-shadow: 2px 4px 9px -4px #212121;
        display: flex;
        flex-direction: column;
        max-height: 80vh;
        max-width: 80vw;
        overflow-y: auto;
        position: absolute;
        right: 0;
        top: calc(.4rem + 24px);
        width: max-content;
        z-index: 990;

        & ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        & li {
          display: flex;
        }

        & li+li {
          border-top: 1px solid #00000033;
        }

        & a {
          display: block;
          padding: .25rem .5rem;
          width: 100%;
        }
      }
    }

    /* new */

    .uri,
    .id {
      font-feature-settings: "liga", "calt", "dlig", "ss02";
      word-break: break-all;
    }

    .uri:not(:empty) {
      align-items: center;
      display: inline-flex;
      font-size: 0.75rem;
      height: 15px;
      padding: 0 4px;
      border-radius: 4px;
      background: var(--nav-background);
      font-family: inherit;
      font-weight: normal;
      text-decoration: none;
      color: var(--text-color-muted);

      s-icon:last-child,
      svg:last-child {
        display: inline-block;
        height: 0.8em;
        vertical-align: baseline;
        margin: 0 -0.1em 0 0.2em;
      }
    }`;

  @property()
  accessor displayName: string | undefined = undefined;

  @state()
  protected accessor wikidataUrl: string | undefined = undefined;
  @state()
  protected accessor gbifID: string | undefined = undefined;
  @state()
  protected accessor wikipediaEnUrl: string | undefined = undefined;
  @state()
  protected accessor wikipediaUrls: string[] = [];
  @state()
  protected accessor wikispeciesUrl: string | undefined = undefined;
  @state()
  protected accessor commonsUrl: string | undefined = undefined;

  @state()
  protected accessor open = false;

  private queryed: string | undefined = undefined;

  private endpoint = new SparqlEndpoint("https://query.wikidata.org/sparql");

  getData() {
    if (!this.displayName || this.queryed === this.displayName) return;
    this.queryed = this.displayName;
    const query = `
SELECT DISTINCT ?item ?gbif (group_concat(?page;separator="|") as ?pages)
WHERE {
  ?item wdt:P225 "${this.displayName}" .
  OPTIONAL { ?item wdt:P846 ?gbif . }
  OPTIONAL { ?page schema:about ?item . }
}
GROUP BY ?item ?gbif
`;
    this.endpoint.getSparqlResultSet(query).then((j) => {
      const result = j.results.bindings[0];
      if (result) {
        this.wikidataUrl = result.item?.value;
        this.gbifID = result.gbif?.value;
        const pages: string[] = (result.pages?.value || "").split("|");
        if (pages.length) {
          this.wikipediaEnUrl = pages.find((p) =>
            p.match(/^https?:\/\/en\.wikipedia\.org\//)
          );
          this.wikispeciesUrl = pages.find((p) =>
            p.match(/^https?:\/\/species\.wikimedia\.org\//)
          );
          this.commonsUrl = pages.find((p) =>
            p.match(/^https?:\/\/commons\.wikimedia\.org\//)
          );
          this.wikipediaUrls = pages.filter((p) =>
            p !== this.wikipediaEnUrl && p !== this.wikispeciesUrl &&
            p !== this.commonsUrl && p !== ""
          ).sort();
        }
      }
    });
  }

  override render() {
    this.getData();
    if (
      !this.wikidataUrl && !this.gbifID && !this.wikipediaEnUrl &&
      !this.wikipediaUrls.length && !this.wikispeciesUrl && !this.commonsUrl
    ) return nothing;
    return html`${
      when(this.wikidataUrl, () =>
        html` <a href=${this.wikidataUrl} class="uri" target="_blank">Wikidata<s-icon icon="link"></s-icon></a>`)
    }${
      when(this.gbifID, () =>
        html` <a href=${
          "https://www.gbif.org/species/" + this.gbifID
        }" target="_blank" class="uri">GBIF ID ${this.gbifID}<s-icon icon="link"></s-icon></a>`)
    }${
      when(this.wikispeciesUrl, () =>
        html` <a href=${this.wikispeciesUrl} class="uri" target="_blank">Wikispecies<s-icon icon="link"></s-icon></a>`)
    }${
      when(this.commonsUrl, () =>
        html` <a href=${this.commonsUrl} class="uri" target="_blank">Wikimedia Commons<s-icon icon="link"></s-icon></a>`)
    }${
      when(this.wikipediaEnUrl || this.wikipediaUrls.length, () =>
        html`<div class="button_group">
      <a href=${
          this.wikipediaEnUrl ?? nothing
        } aria-label="associated english wikipedia page" class="button" ?disabled=${!this
          .wikipediaEnUrl} target="_blank" title=${
          this.wikipediaEnUrl
            ? "English Wikipedia"
            : "No English Wikipedia page"
        }>
        <svg version="1.0" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m95.869 23.909v2.139c-2.8213 0.50109-4.9569 1.3875-6.4066 2.6592-2.0768 1.8885-4.5256 4.779-6.132 8.6714l-32.685 66.712h-2.1747l-32.813-67.579c-1.5282-3.4685-3.6058-5.5882-4.2327-6.359-0.97961-1.1947-2.1845-2.1292-3.6147-2.8038-1.4302-0.67437-3.3601-1.1079-5.7895-1.3007v-2.139h31.928v2.139c-3.6834 0.34693-5.4394 0.96357-6.5365 1.8499-1.0972 0.88649-1.6458 2.0234-1.6457 3.4108-2.6e-5 1.9271 0.90121 4.9331 2.7037 9.0183l24.232 45.959 23.693-45.38c1.8416-4.4705 3.3695-7.573 3.3695-9.3073-6.3e-5 -1.1176-0.56824-2.1871-1.7045-3.2084-1.1364-1.0212-2.4222-1.7438-5.1259-2.1679-0.19598-0.038463-0.52904-0.096273-0.9992-0.17343v-2.139h23.934z" />
          <path
            d="m123.98 23.909v2.139c-2.8213 0.50109-4.9569 1.3875-6.4066 2.6592-2.0768 1.8885-4.5256 4.779-6.132 8.6714l-28.685 66.712h-2.1747l-30.313-67.579c-1.5282-3.4685-3.6058-5.5882-4.2327-6.359-0.97962-1.1947-2.1845-2.1292-3.6147-2.8038-1.4302-0.67437-2.7259-1.1079-5.1553-1.3007v-2.139h31.294v2.139c-3.6834 0.34693-5.4394 0.96357-6.5365 1.8499-1.0972 0.88649-1.6458 2.0234-1.6457 3.4108-2.5e-5 1.9271 0.90121 4.9331 2.7037 9.0183l21.732 45.959 19.693-45.38c1.8416-4.4705 3.3695-7.573 3.3696-9.3073-6e-5 -1.1176-0.56824-2.1871-1.7045-3.2084-1.1364-1.0212-3.0564-1.7438-5.7601-2.1679-0.19598-0.038463-0.52904-0.096273-0.9992-0.17343v-2.139h24.568z" />
        </svg>
      </a>
      <div class="dropdown button" ?data-open=${this.open}>
        <button aria-label="Other language Wikipedia pages" title="Other languages" @click=${() =>
          this.open = !this.open}>
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
          </svg>
        </button>
        <div class="dropdown_menu">
          <ul>${
          [this.wikipediaEnUrl, ...this.wikipediaUrls].map((link) =>
            link
              ? html`<li><a href=${link ?? nothing}>${
                readableLink(link)
              }</a></li>`
              : nothing
          )
        }</ul>
        </div>
      </div>
    </div>`)
    }`;
  }
}

function readableLink(url: string) {
  return decodeURI(url.replace(/^https?:\/\//, ""));
}
