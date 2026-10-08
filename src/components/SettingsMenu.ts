import { html, LitElement, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import "./Icons.ts";
import { renderTestResult } from "./TestResult.ts";
import {
  DEFAULT_ENDPOINT,
  ENDPOINTS,
  getEndpoint,
  getStoredEndpoint,
  isKnownEndpoint,
  isValidEndpoint,
  setStoredEndpoint,
  testEndpoint,
  type TestResult,
} from "../endpoints.ts";

/** Value of the select's option for a custom endpoint URL. */
const CUSTOM = "custom";

/**
 * The settings menu in the page header: a gear button opening a popover in
 * which the SPARQL endpoint can be chosen. A choice is stored right away and
 * announced with an `endpoint-change` event (bubbling and composed, with the
 * URL as `detail`), so that the page can switch to the new endpoint.
 *
 * Renders into the light DOM, so the page's stylesheet applies.
 */
@customElement("syno-settings-menu")
export class SettingsMenu extends LitElement {
  /** The stored endpoint, re-read whenever the menu opens. */
  @state()
  accessor endpoint: string = getStoredEndpoint();

  /** The select's value: a known endpoint URL or `CUSTOM`. */
  @state()
  accessor choice: string = CUSTOM;

  /** The text in the custom URL field. */
  @state()
  accessor custom: string = "";

  @state()
  accessor test: TestResult | null = null;

  @query("button")
  accessor button!: HTMLButtonElement;

  @query("[popover]")
  accessor menu!: HTMLDivElement;

  @query("input")
  accessor customInput: HTMLInputElement | null = null;

  private abortTest?: AbortController;

  protected override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.reflectStored();
    addEventListener("resize", this.close);
  }

  override disconnectedCallback() {
    removeEventListener("resize", this.close);
    super.disconnectedCallback();
  }

  /** The popover is positioned for the current layout, so it closes on resize. */
  private readonly close = () => this.menu?.hidePopover();

  private reflectStored() {
    this.endpoint = getStoredEndpoint();
    this.choice = isKnownEndpoint(this.endpoint) ? this.endpoint : CUSTOM;
    this.custom = this.choice === CUSTOM ? this.endpoint : "";
  }

  /** Prepares the menu before it is shown (or forgets the test on close). */
  private onBeforeToggle(e: ToggleEvent) {
    if (e.newState !== "open") {
      this.clearTest();
      return;
    }
    // the setting may have been changed elsewhere, e.g. on the settings page
    this.reflectStored();
    this.position();
  }

  /** Places the popover below the gear button, right-aligned with it. */
  private position() {
    const rect = this.button.getBoundingClientRect();
    const right = Math.max(8, innerWidth - rect.right);
    this.menu.style.top = `${rect.bottom + 4}px`;
    this.menu.style.right = `${right}px`;
    // never wider than the space left of the right edge
    this.menu.style.maxWidth = `calc(100vw - ${right + 8}px)`;
  }

  private onSelect(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.choice = value;
    if (value !== CUSTOM) {
      this.save(value);
      return;
    }
    this.clearTest();
    this.custom = isKnownEndpoint(this.endpoint) ? "" : this.endpoint;
    this.updateComplete.then(() => this.customInput?.focus());
  }

  private onCustomChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const url = input.value.trim();
    this.custom = url;
    const valid = isValidEndpoint(url);
    input.setCustomValidity(
      valid
        ? ""
        : document.location.protocol === "https:"
        ? "Please enter the https URL of a SPARQL endpoint."
        : "Please enter the http(s) URL of a SPARQL endpoint.",
    );
    input.reportValidity();
    if (valid) this.save(url);
  }

  private save(url: string) {
    this.clearTest();
    this.endpoint = url;
    setStoredEndpoint(url);
    // check a custom endpoint right away; a failure only warns
    if (!isKnownEndpoint(url)) this.runTest(url);
    this.dispatchEvent(
      new CustomEvent("endpoint-change", {
        detail: url,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private clearTest() {
    this.abortTest?.abort();
    this.abortTest = undefined;
    this.test = null;
  }

  private async runTest(url: string) {
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
    // the page may use a server named in its link instead of the setting
    const fromLink = getEndpoint() !== getStoredEndpoint();
    return html`
      <button class="icon-button" type="button"
        aria-label="Settings" title="Settings"
        popovertarget="settings-menu"><s-icon icon="settings"></s-icon></button>
      <div id="settings-menu" popover @beforetoggle=${this.onBeforeToggle}>
              <label>SPARQL endpoint
                <select @change=${this.onSelect}>
                  ${ENDPOINTS.map((e) =>
                    html`
                      <option value=${e.url}
                        .selected=${this.choice === e.url}>${e
                          .name}${e.url === DEFAULT_ENDPOINT
                          ? " (default)"
                          : ""}${e.note ? ` (${e.note})` : ""}</option>
                    `
                  )}
                  <option value=${CUSTOM} .selected=${this.choice ===
                    CUSTOM}>Custom URL…</option>
                </select>
              </label>
              ${this.choice === CUSTOM
                ? html`
                  <input type="text" inputmode="url"
                    placeholder="https://example.org/sparql"
                    aria-label="Custom endpoint URL"
                    .value=${this.custom} @change=${this.onCustomChange}>
                `
                : nothing}
              ${this.test
                ? html`<p>${renderTestResult(this.test)}</p>`
                : nothing}
              ${fromLink
                ? html`<p><small>This page uses the server named in its link.
          Choosing an endpoint here switches to that one.</small></p>`
                : nothing}
              <p><a href="settings.html">All settings…</a></p>
            </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "syno-settings-menu": SettingsMenu;
  }
}
