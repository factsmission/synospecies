import type { AuthorizedName, SynonymGroup, Treatment } from "@plazi/synolib";
import { icons } from "./Icons.ts";

export type SynoStatus = "def" | "aug" | "dpr" | "cite" | "unknown";

export class SynoTreatment extends HTMLElement {
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

    const url = document.createElement("a");
    url.classList.add("treatment", "uri");
    url.href = this.trt.url;
    url.target = "_blank";
    url.innerText = this.trt.url.replace("http://treatment.plazi.org/id/", "");
    url.innerHTML += icons.link;
    this.append(" ", url);

    this.append(button);

    const names = document.createElement("div");
    names.classList.add("indent", "details");
    this.append(names);

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
        // line.innerHTML = status === "cite" ? icons.line : icons.east;
        line.innerHTML = icons.east;
        line.innerHTML += icons.def;
        if (status === "def" || status === "cite") {
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
        // line.innerHTML = status === "cite" ? icons.line : icons.east;
        line.innerHTML = icons.east;
        line.innerHTML += icons.aug;
        if (status === "aug" || status === "cite") {
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
        // line.innerHTML = status === "cite" ? icons.line : icons.west;
        line.innerHTML = icons.west;
        line.innerHTML += icons.dpr;
        if (status === "dpr" || status === "cite") {
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
        // if (status === "dpr" || status === "cite") {
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
customElements.define("syno-treatment", SynoTreatment);
