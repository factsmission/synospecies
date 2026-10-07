import { html, LitElement, type PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  DEFAULT_ENDPOINT,
  ENDPOINTS,
  isKnownEndpoint,
  isValidEndpoint,
} from "../endpoints.ts";

/**
 * Radio buttons to choose one of the known SPARQL endpoints or enter a custom
 * one.
 *
 * Renders into the light DOM with `display: contents`, so the labels take part
 * in the layout of the surrounding element.
 *
 * Fires `endpoint-change` (with the URL as `detail`) whenever the selection
 * changes; for the custom URL only once editing is done (focusing the field
 * merely selects it). `value` is always current.
 */
@customElement("endpoint-select")
export class EndpointSelect extends LitElement {
  @property()
  accessor value: string = DEFAULT_ENDPOINT;

  @state()
  accessor custom: string = "";

  @query(".custom-endpoint input[type=text]")
  accessor customInput!: HTMLInputElement;

  protected override createRenderRoot() {
    return this;
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has("value") && !isKnownEndpoint(this.value)) {
      this.custom = this.value;
    }
  }

  /** Checks the custom URL (if selected) and reports problems to the user. */
  checkValidity(): boolean {
    if (isKnownEndpoint(this.value)) return true;
    const valid = isValidEndpoint(this.value);
    this.customInput.setCustomValidity(
      valid ? "" : document.location.protocol === "https:"
        ? "Please enter the https URL of a SPARQL endpoint."
        : "Please enter the http(s) URL of a SPARQL endpoint.",
    );
    this.customInput.reportValidity();
    return valid;
  }

  private select(url: string) {
    this.value = url;
    this.customInput.setCustomValidity("");
    this.dispatchEvent(
      new CustomEvent("endpoint-change", { detail: url, bubbles: true }),
    );
  }

  override render() {
    const isCustom = !isKnownEndpoint(this.value);
    const options = ENDPOINTS.map((e) =>
      html`<label><input type="radio" name="endpoint"
        .checked=${this.value === e.url}
        @change=${() => this.select(e.url)}>${e.name}
        <code class="uri">${e.url.replace("https://", "")}</code>${
        e.url === DEFAULT_ENDPOINT ? " (Default)" : ""
      }${e.note ? ` (${e.note})` : ""}</label>`
    );
    return html`${options}<label class="custom-endpoint"><input
        type="radio" name="endpoint"
        .checked=${isCustom}
        @change=${() => this.select(this.custom)}>Custom:<input
        type="text" inputmode="url" placeholder="https://example.org/sparql"
        .value=${this.custom}
        @focus=${() => this.value = this.custom}
        @input=${this.onCustomInput}
        @change=${() => this.select(this.custom)}></label>`;
  }

  private onCustomInput(e: Event) {
    // update the value right away, but only notify once editing is done
    this.custom = (e.target as HTMLInputElement).value;
    this.value = this.custom;
    this.customInput.setCustomValidity("");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "endpoint-select": EndpointSelect;
  }
}
