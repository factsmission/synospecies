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

/** Value of the select's placeholder while the page uses a link's server. */
const LINK = "link";

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

  /** The select's value: a known endpoint URL, `CUSTOM` or `LINK`. */
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
    addEventListener("scroll", this.close, { passive: true });
  }

  override disconnectedCallback() {
    removeEventListener("resize", this.close);
    removeEventListener("scroll", this.close);
    super.disconnectedCallback();
  }

  /** The popover is placed next to the gear, so it closes when that moves. */
  private readonly close = () => this.menu?.hidePopover();

  private reflectStored() {
    const stored = getStoredEndpoint();
    // a test result belongs to the endpoint it was run for
    if (stored !== this.endpoint) this.clearTest();
    this.endpoint = stored;
    // while the page uses a server named in its link, nothing is selected, so
    // that choosing any endpoint (also the stored one) counts as a change
    this.choice = getEndpoint() !== this.endpoint
      ? LINK
      : isKnownEndpoint(this.endpoint)
      ? this.endpoint
      : CUSTOM;
    this.custom = this.choice === CUSTOM ? this.endpoint : "";
  }

  /** Prepares the menu before it is shown. */
  private onBeforeToggle(e: ToggleEvent) {
    if (e.newState !== "open") return;
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
    // the result shown belongs to the URL before the edit
    this.clearTest();
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
    // a custom endpoint is checked first: the page switches once the test has
    // passed (or on request), so that a failure is seen before e.g. the
    // search reloads with it
    if (isKnownEndpoint(url)) this.announce(url);
    else this.runTest(url);
  }

  /** Tells the page to use the endpoint. */
  private announce(url: string) {
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
      if (treatments) this.announce(url);
    } catch (error) {
      if (abort.signal.aborted) return;
      this.test = {
        state: "error",
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  override render() {
    const fromLink = this.choice === LINK;
    return html`
      <button class="icon-button" type="button"
        aria-label="Settings" title="Settings"
        popovertarget="settings-menu"><s-icon icon="settings"></s-icon></button>
      <div id="settings-menu" popover @beforetoggle=${this.onBeforeToggle}>
              <label>SPARQL endpoint
                <select @change=${this.onSelect}>
                  ${fromLink
                    ? html`
                      <option value=${LINK} disabled
                        .selected=${true}>Server from link: ${getEndpoint()
                          .replace(/^https?:\/\//, "")}</option>
                    `
                    : nothing}
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
                ? html`<p>${renderTestResult(this.test)}${
                  this.test.state === "error" ||
                    (this.test.state === "ok" && !this.test.treatments)
                    ? html`
                      <button type="button" @click=${() =>
                        this.announce(this.endpoint)}>Use anyway</button>
                    `
                    : nothing
                }</p>`
                : nothing}
              ${fromLink
                ? html`<p><small>This page uses the server named in its link.
          Choose an endpoint to switch to it.</small></p>`
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
