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
 * which the SPARQL endpoint can be chosen. A known endpoint is stored right
 * away and announced with an `endpoint-change` event (bubbling and composed,
 * with the URL as `detail`), so that the page can switch to it. A custom URL
 * is tested first and only stored and announced once the test has passed, or
 * when the user decides to use it anyway.
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

  /** A custom URL being tested, or one that failed; not stored yet. */
  @state()
  accessor pending: string | null = null;

  @state()
  accessor test: TestResult | null = null;

  @query("button")
  accessor button!: HTMLButtonElement;

  @query("[popover]")
  accessor menu!: HTMLDivElement;

  @query("input")
  accessor customInput: HTMLInputElement | null = null;

  private abortTest?: AbortController;

  /** The animation frame in which the popover is placed again, if any. */
  private layoutFrame = 0;

  protected override createRenderRoot() {
    return this;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.reflectStored();
    addEventListener("resize", this.onLayoutChange);
    addEventListener("scroll", this.onLayoutChange, { passive: true });
  }

  override disconnectedCallback() {
    removeEventListener("resize", this.onLayoutChange);
    removeEventListener("scroll", this.onLayoutChange);
    cancelAnimationFrame(this.layoutFrame);
    this.layoutFrame = 0;
    super.disconnectedCallback();
  }

  /**
   * The popover is placed next to the gear: it follows the gear when the page
   * is resized or scrolled (as on phones when the on-screen keyboard opens or
   * closes), once per frame, and closes when the gear leaves the view.
   */
  private readonly onLayoutChange = () => {
    if (this.layoutFrame) return;
    this.layoutFrame = requestAnimationFrame(() => {
      this.layoutFrame = 0;
      if (!this.menu?.matches(":popover-open")) return;
      const { top, bottom } = this.button.getBoundingClientRect();
      if (bottom > 0 && top < innerHeight) this.position();
      else this.menu.hidePopover();
    });
  };

  /** Whether the page uses a server named in its link instead of the setting. */
  private get fromLink() {
    return getEndpoint() !== this.endpoint;
  }

  private reflectStored() {
    const stored = getStoredEndpoint();
    // a test result and a draft belong to the setting they were made for
    if (stored !== this.endpoint) {
      this.clearTest();
      this.pending = null;
    }
    this.endpoint = stored;
    // a custom URL not used yet stays in the menu with its test result
    if (this.pending !== null) {
      this.choice = CUSTOM;
      this.custom = this.pending;
      return;
    }
    // while the page uses a server named in its link, nothing is selected, so
    // that choosing any endpoint (also the stored one) counts as a change
    this.choice = this.fromLink
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
    this.pending = null;
    // a stored custom endpoint is offered for editing; it is used again with
    // the field's "Use" button, e.g. to leave a server named in the link
    this.custom = isKnownEndpoint(this.endpoint) ? "" : this.endpoint;
    this.updateComplete.then(() => this.customInput?.focus());
  }

  /** Uses the URL in the field, also when it was not edited. */
  private onCustomSubmit(e: SubmitEvent) {
    e.preventDefault();
    const input = this.customInput;
    if (!input) return;
    // Enter in the field fires `change` first, which already started a test
    if (
      this.pending === input.value.trim() && this.test?.state === "running"
    ) return;
    this.useCustom(input);
  }

  private onCustomChange(e: Event) {
    this.useCustom(e.target as HTMLInputElement);
  }

  private useCustom(input: HTMLInputElement) {
    const url = input.value.trim();
    this.custom = url;
    // the draft and its result belong to the URL before the edit
    this.clearTest();
    this.pending = null;
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
    if (isKnownEndpoint(url)) {
      this.apply(url);
      return;
    }
    // a custom endpoint is checked first and applied once the test has passed
    // (or on request), so that a failure is seen before e.g. the search
    // reloads with it, and a failing URL is neither stored nor used
    this.pending = url;
    this.runTest(url);
  }

  /** Stores the endpoint and tells the page to use it. */
  private apply(url: string) {
    this.pending = null;
    setStoredEndpoint(url);
    // read back, as storing fails silently when site data is blocked
    this.endpoint = getStoredEndpoint();
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
      if (treatments) this.apply(url);
    } catch (error) {
      if (abort.signal.aborted) return;
      this.test = {
        state: "error",
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  override render() {
    const pending = this.pending;
    return html`
      <button class="icon-button" type="button"
        aria-label="Settings" title="Settings"
        popovertarget="settings-menu"><s-icon icon="settings"></s-icon></button>
      <div id="settings-menu" popover @beforetoggle=${this.onBeforeToggle}>
              <label>SPARQL endpoint
                <select @change=${this.onSelect}>
                  ${this.choice === LINK
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
                  <form class="custom-endpoint" @submit=${this.onCustomSubmit}>
                    <input type="text" inputmode="url" enterkeyhint="go"
                      placeholder="https://example.org/sparql"
                      aria-label="Custom endpoint URL"
                      .value=${this.custom} @change=${this.onCustomChange}>
                    <button type="submit">Use</button>
                  </form>
                `
                : nothing}
              ${this.test
                ? html`<p>${renderTestResult(this.test)}${
                  pending !== null &&
                    (this.test.state === "error" ||
                      (this.test.state === "ok" && !this.test.treatments))
                    ? html`
                      <button type="button" @click=${() =>
                        this.apply(pending)}>Use anyway</button>
                    `
                    : nothing
                }</p>`
                : nothing}
              ${this.fromLink
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
