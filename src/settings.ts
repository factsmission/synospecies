import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import "./components/EndpointSelect.ts";
import type { EndpointSelect } from "./components/EndpointSelect.ts";
import "./components/SettingsMenu.ts";
import { renderTestResult } from "./components/TestResult.ts";
import {
  DEFAULT_ENDPOINT,
  getStoredEndpoint,
  isKnownEndpoint,
  isValidEndpoint,
  setStoredEndpoint,
  testEndpoint,
  type TestResult,
} from "./endpoints.ts";

@customElement("syno-settings")
export class SynoSettings extends LitElement {
  static override styles = css`
    .options {
      border: 1px solid var(--nav-background);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
      padding: 0.5rem;
    }

    .actions {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    button {
      background: var(--accent-mild);
      border: 1px solid var(--accent-mild);
      border-radius: 0.6rem;
      color: var(--text-color);
      font-size: 1rem;
      line-height: 2rem;
      padding: 0 1rem;

      &:hover,
      &:focus,
      &:active {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--body-background);
      }
    }

    .error {
      color: light-dark(#c62828, #ff8a80);
    }
  `;

  @state()
  accessor endpoint: string = getStoredEndpoint();

  @state()
  accessor saved = false;

  @state()
  accessor test: TestResult | null = null;

  @query("endpoint-select")
  accessor select!: EndpointSelect;

  /** Aborts the running endpoint test, if any. */
  private abortTest?: AbortController;

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("endpoint-change", this.onEndpointChange);
  }

  override disconnectedCallback() {
    document.removeEventListener("endpoint-change", this.onEndpointChange);
    super.disconnectedCallback();
  }

  /** Reflects an endpoint chosen in the settings menu of the header. */
  private readonly onEndpointChange = (e: Event) => {
    this.clearTest();
    this.endpoint = (e as CustomEvent<string>).detail;
    this.select.value = this.endpoint;
    this.saved = true;
  };

  private clearTest() {
    this.abortTest?.abort();
    this.abortTest = undefined;
    this.test = null;
  }

  private save(url: string) {
    this.clearTest();
    if (!isValidEndpoint(url)) {
      this.saved = false;
      // don't complain about a custom URL not yet entered
      if (url) this.select.checkValidity();
      return;
    }
    this.endpoint = url;
    setStoredEndpoint(url);
    this.saved = true;
    // check a custom endpoint right away; a failure only warns
    if (!isKnownEndpoint(url)) this.runTest();
  }

  private reset() {
    setStoredEndpoint(null);
    this.endpoint = DEFAULT_ENDPOINT;
    this.select.value = DEFAULT_ENDPOINT;
    this.clearTest();
    this.saved = true;
  }

  /** Checks that the endpoint answers SPARQL queries and has treatments. */
  private async runTest() {
    const url = this.select.value;
    if (!this.select.checkValidity()) return;
    // a result of an earlier test must not overwrite this one
    this.clearTest();
    const abort = new AbortController();
    this.abortTest = abort;
    this.test = { state: "running" };
    try {
      const treatments = await testEndpoint(url, abort.signal);
      if (abort.signal.aborted) return;
      this.test = { state: "ok", treatments };
    } catch (error) {
      if (abort.signal.aborted) return;
      this.test = {
        state: "error",
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  override render() {
    return html`
      <link href="index.css" rel="stylesheet">
      <h2>Settings</h2>
      <h3>SPARQL Endpoint</h3>
      <p>
        SynoSpecies runs entirely in your browser and gets all its data with
        <a target="_blank" href="https://www.w3.org/TR/sparql11-query/">SPARQL</a>
        queries. Any SPARQL endpoint that serves the
        <a target="_blank" href="https://plazi.org/">Plazi</a> treatment data
        can be used, including one you host yourself.
      </p>
      <p>
        Choose the endpoint used by the search and the SPARQL page. The choice
        is stored in this browser only; it can also be changed in the settings
        menu (the gear icon in the header). A link may still name a different
        server, in which case you are asked before results are loaded from it.
      </p>
      <div class="options">
        <endpoint-select .value=${this.endpoint}
          @endpoint-change=${(
            e: CustomEvent<string>,
          ) => this.save(e.detail)}></endpoint-select>
      </div>
      <p>
        <small>A custom endpoint must support the
        <a target="_blank" href="https://www.w3.org/TR/sparql11-protocol/">SPARQL 1.1 Protocol</a>
        and allow cross-origin (CORS) requests from this site.</small>
      </p>
      <div class="actions">
        <button @click=${this.runTest}>Test endpoint</button>
        <button @click=${this.reset}>Reset to default</button>
        ${this.saved ? html`<span>Saved.</span>` : null}
        ${renderTestResult(this.test)}
      </div>
    `;
  }
}
