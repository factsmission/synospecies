import { html, nothing } from "lit";

import type { TestResult } from "../endpoints.ts";

/** Renders the outcome of an endpoint test, see `testEndpoint`. */
export function renderTestResult(test: TestResult | null) {
  if (!test) return nothing;
  switch (test.state) {
    case "running":
      return html`<span>Testing…</span>`;
    case "ok":
      return test.treatments
        ? html`<span>✓ The endpoint works and contains treatments.</span>`
        : html`<span class="error">The endpoint works, but contains no Plazi treatments.</span>`;
    case "error":
      return html`
        <span
          class="error">Query failed: ${test.message.replace(
            /\.$/,
            "",
          )}. The endpoint may be unreachable or may not allow cross-origin (CORS) requests.</span>
      `;
  }
}
