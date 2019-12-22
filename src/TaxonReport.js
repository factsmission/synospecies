import $rdf from "ext-rdflib";

export default class TaxonReport {

    constructor(taxaManager, element) {
        this._element = element;
        this._taxaManager = taxaManager;
    }

    setTaxon(genus, species) {
        const self = this;
        const names = {};
        function dwc(localName) {
            return $rdf.sym("http://rs.tdwg.org/dwc/terms/" + localName);
        }
        function treat(localName) {
            return $rdf.sym("http://plazi.org/vocab/treatment#" + localName);
        }
        function dc(localName) {
            return $rdf.sym("http://purl.org/dc/elements/1.1/" + localName);
        }

        function truncate() {
            const toTruncate = document.getElementsByClassName("truncate");
            toTruncate.forEach(el => {
                let tc = el.textContent;
                if (tc.length > 80) {
                    el.innerHTML = tc.slice(0, 81) + '<span hidden aria-hidden="false">' + tc.slice(81) + '</span>';
                    let expandbtn = document.createElement("span");
                    expandbtn.innerHTML = "...";
                    expandbtn.classList.add("expandbtn");
                    expandbtn.addEventListener("click", e => {
                        el.innerHTML = tc;
                        e.preventDefault();
                    });
                    el.append(expandbtn);
                }
            })
        }

        function getFormattedName(uri) {
            let nameSection = uri.substring(uri.lastIndexOf("/") + 1);
            let lastSeparator = nameSection.lastIndexOf("_");
            return nameSection.substring(0, lastSeparator).replace(new RegExp("_", "g"), " ") +
                ", " + nameSection.substring(lastSeparator + 1);
        }

        /** renders a graphnode (possibly one that represents multiple nodes) */
        function render(tns, title, target) {
            tns.each(tn => tn).then(tns => Promise.all(tns.sort((tn1, tn2) => {
                let y1 = tn1.value.substring(tn1.value.length - 4);
                let y2 = tn2.value.substring(tn2.value.length - 4);
                return y1 - y2;
            }).map(async tn => {

                //for unclear reasons some taxa have more than one order or family (maybe other ranks, so generalized)
                const ranks = await Promise.all(["kingdom", "phylum", "class", "order", "family", "genus", "species"].map(async r => await tn.out(dwc(r)).each(f => f.value).then(fs => fs.join(", ")))).then(rs => "<tr><td>" + rs.join("</td><td>") + "</td></tr>")

                function linkToTreatments(gn) {
                    return gn.each(t => t)
                        .then(ts => Promise.all(ts.map(async t => " <a class=\"truncate\" href=\"" + t.value + "\">" +
                            (await t.out(dc("creator")).each(c => c.value)).join("; ") +
                            (await t.out(dc("date")).each(d => " " + d.value)).join("/") +
                            "</a>")).then(links => links.join(" - ")));
                }

                let preferedNameByGN = tn.in(treat("preferedName"));
                let preferedNameBy = preferedNameByGN.nodes.length > 0 ? await linkToTreatments(preferedNameByGN) : "";

                let definingTreatmentGN = tn.in(treat("definesTaxonConcept"));
                let definingTreatment = definingTreatmentGN.nodes.length > 0 ? "Defined by: " + await linkToTreatments(definingTreatmentGN) : "Defining treatment not yet on plazi";

                let augmentingTreatmentGN = tn.in(treat("augmentsTaxonConcept"));
                let augmentingTreatment = augmentingTreatmentGN.nodes.length > 0 ? "Augmented by: " + await linkToTreatments(augmentingTreatmentGN) : "";

                let result = document.createElement("li");

                result.innerHTML += "<strong>" + getFormattedName(tn.value) + "</strong>";
                result.innerHTML += preferedNameBy;
                result.innerHTML += '<table class="nobold card"><tr><th>Kingdom</th><th>Phylum</th><th>Class</th><th>Order</th><th>Family</th><th>Genus</th><th>Species</th></tr>' +
                    ranks + '</table>'
                result.innerHTML += "<br/>" + definingTreatment + "<br/>" + augmentingTreatment;
                if (!names[tn.value]) {
                    let deprecationsArea = document.createElement("div");
                    deprecationsArea.classList.add("deprecations");
                    deprecationsArea.innerHTML = "looking for deprecations...";
                    result.appendChild(deprecationsArea)
                    names[tn.value] = true;
                    self._taxaManager.getNewTaxa(tn.value).then(newTaxa => {
                        render(newTaxa, "Deprecated by", deprecationsArea);
                        newTaxa.each(newTaxa => {
                            self.relatedTaxonEncountered(newTaxa.out(dwc("genus")).value + " " + newTaxa.out(dwc("species")).value);
                        })
                    });
                }

                self.taxonRendered(tn.value);
                return result;
            }))).then(listItems => {
                if (listItems.length > 0) {
                    target.innerHTML = "<h4>" + title + "</h4>";
                    const list = document.createElement("ul");
                    listItems.forEach((i) => list.appendChild(i));
                    target.appendChild(list);
                    truncate();
                } else {
                    target.innerHTML = "";
                }
            });
        };

        this._taxaManager.getTaxonConcepts(genus, species).then(taxonConcepts => {
            if (taxonConcepts.nodes.length === 0) {
                this._element.innerHTML = "No treatment for " + genus + " " + species + " found on plazi.";
            } else {
                window.location.hash = genus + "+" + species;
                render(taxonConcepts, genus + " " + species, this._element);
            }
        });
    }

    reset() {
        this._element.innerHTML = "";
    };

    relatedTaxonEncountered(genus, species) { /* TODO */ }
    taxonRendered(taxonConcept) { /* TODO */ }
}
