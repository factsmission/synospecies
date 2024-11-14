import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { SparqlEndpoint } from "@plazi/synolib";

@customElement("s-wikidata")
export class Timeline extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      justify-content: right !important;
      margin-right: -0.2rem;
      max-height: 30.4px;
      align-self: end;
      flex-shrink: 0;
      font-size: 1rem;
    }

    * {
      box-sizing: border-box;
    }

    a {
      display: block;
      line-height: calc(.4rem + 24px);
      margin: 0 0.2rem;
    }

    button {
      background: none;
      border: none;
      display: block;
      height: 100%;
      margin: 0;
      padding: 0;
      width: 100%;
    }

    .button {
      background: #eeeeee;
      display: block;
      border: none;
      border-radius: 0.2rem;
      margin: 0 0.2rem;
      min-width: calc(.4rem + 24px);
      overflow: hidden;
      padding: 0.2rem;

      & svg {
        display: block;
        height: 24px;
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
      display: flex;

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
    return html`
    <a href=${
      this.wikidataUrl ?? nothing
    } aria-label="associated wikidata page" class="button" ?disabled=${!this
      .wikidataUrl}
      target="_blank" title="Wikidata">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 1050 590">
        <path id="path2"
          d="m 120,545 h 30 V 45 H 120 V 545 z m 60,0 h 90 V 45 H 180 V 545 z M 300,45 V 545 h 90 V 45 h -90 z"
          style="fill: #990000" />
        <path id="path4"
          d="m 840,545 h 30 V 45 H 840 V 545 z M 900,45 V 545 h 30 V 45 H 900 z M 420,545 h 30 V 45 H 420 V 545 z M 480,45 V 545 h 30 V 45 h -30 z"
          style="fill: #339966" />
        <path id="path6"
          d="m 540,545 h 90 V 45 h -90 V 545 z m 120,0 h 30 V 45 H 660 V 545 z M 720,45 V 545 h 90 V 45 H 720 z"
          style="fill: #006699" />
      </svg>
    </a>${
      when(this.gbifID, () =>
        html`<a href=${
          "https://www.gbif.org/species/" + this.gbifID
        }" target="_blank">GBIF ID: ${this.gbifID}</a>`)
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
    }${
      when(this.wikispeciesUrl, () =>
        html`<a href=${this.wikispeciesUrl} aria-label="associated wikispecies page" class="button" target="_blank" title="Wikispecies">
      <svg viewBox="0 0 941 1103" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        height="24px">
        <defs>
          <radialGradient id="d" cx="510" cy="110" r="210" gradientUnits="userSpaceOnUse">
            <stop stop-color="#D8ABA5" offset=".04" />
            <stop stop-color="#AD604E" offset=".4" />
            <stop stop-color="#9C4029" offset=".6" />
            <stop stop-color="#92331F" offset=".7" />
            <stop stop-color="#43180F" offset="1" />
          </radialGradient>
          <radialGradient id="i" cx="470.5" cy="650" r="430" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4F8FB3" offset=".8" />
            <stop stop-color="#0C5178" offset=".95" />
            <stop stop-color="#002D4A" offset="1" />
          </radialGradient>
          <clipPath id="h">
            <path d="m0 199 470.5 428 470.5-428v904h-941z" />
          </clipPath>
          <linearGradient id="b">
            <stop stop-color="#00090E" offset="0" />
            <stop stop-color="#082E45" offset=".1" />
            <stop stop-color="#0A6997" offset=".5" />
            <stop stop-color="#082E45" offset=".9" />
            <stop stop-color="#00090E" offset="1" />
          </linearGradient>
          <linearGradient id="j">
            <stop stop-color="#375D72" offset="0" />
            <stop stop-color="#407B9B" offset=".1" />
            <stop stop-color="#A0C0CF" offset=".5" />
            <stop stop-color="#407B9B" offset=".9" />
            <stop stop-color="#375D72" offset="1" />
          </linearGradient>
          <linearGradient id="g">
            <stop stop-color="#0F3119" offset="0" />
            <stop stop-color="#01703B" offset=".1" />
            <stop stop-color="#89C4AE" offset=".5" />
            <stop stop-color="#01703B" offset=".9" />
            <stop stop-color="#0F3119" offset="1" />
          </linearGradient>
          <linearGradient id="a">
            <stop stop-color="#476C5A" offset="0" />
            <stop stop-color="#52A27D" offset=".1" />
            <stop stop-color="#A7D2BE" offset=".5" />
            <stop stop-color="#52A27D" offset=".9" />
            <stop stop-color="#476C5A" offset="1" />
          </linearGradient>
        </defs>
        <g stroke-width="0">
          <g fill="url(#b)">
            <path id="c" d="m213 218c39 137 436 101 436 202v90c0-111-404.5-64.7-436-200" />
          </g>
          <g fill="url(#b)">
            <path id="e" d="m649 800c0-94.5-411-72.4-411-192v90c0 112.5 411 89.5 411 192" />
          </g>
          <use transform="translate(941) scale(-1 1)" fill="url(#g)" xlink:href="#f" />
          <use transform="translate(941) scale(-1 1)" fill="url(#a)" xlink:href="#e" />
          <use transform="translate(941) scale(-1 1)" fill="url(#a)" xlink:href="#c" />
          <g fill="url(#j)">
            <path id="f" d="m649 420c0 99.7-411 81-411 188v90c0-103.7 411-91.8 411-188" />
          </g>
        </g>
        <circle cx="470.5" cy="628" r="388.5" clip-path="url(#h)" fill="none" stroke="url(#i)" stroke-width="100px" />
        <circle cx="470.5" cy="161" r="125" fill="url(#d)" stroke="#555" />
      </svg>
    </a>`)
    }${
      when(this.commonsUrl, () =>
        html`<a href=${this.commonsUrl} aria-label="associated wikimedia commons page" class="button" target="_blank" title="Wikimedia Commons">
      <svg height="24" version="1.1" viewBox="-305 -516 610 820" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <clipPath id="wc_b">
            <circle r="298" />
          </clipPath>
        </defs>
        <circle r="100" fill="#900" />
        <g fill="#069">
          <g id="wc_a" clip-path="url(#wc_b)">
            <path d="m-11 180v118h22v-118" />
            <path d="m-43 185 43-75 43 75" />
          </g>
          <g id="wc_c">
            <use transform="rotate(45)" xlink:href="#wc_a" />
            <use transform="rotate(90)" xlink:href="#wc_a" />
            <use transform="rotate(135)" xlink:href="#wc_a" />
          </g>
          <use transform="scale(-1 1)" xlink:href="#wc_c" />
          <path transform="rotate(-45)" d="m0-256a256 256 0 1 0 256 256c0-100-101-150-6-275" fill="none" stroke="#069"
            stroke-width="84" />
          <path d="m-23-515s-36 135-80 185 116-62 170-5-90-180-90-180z" />
        </g>
      </svg>
    </a>`)
    }`;
  }
}

function readableLink(url: string) {
  return decodeURI(url.replace(/^https?:\/\//, ""));
}
