import $rdf from "ext-rdflib";

export default class TaxonReport {

    constructor(taxaManager, element) {
        this._element = element;
        this._taxaManager = taxaManager;
    }

    setTaxon(genus, species) {
        let self = this;
        function dwc(localName) {
            return $rdf.sym("http://rs.tdwg.org/dwc/terms/" + localName);
        }
        
        function treat(localName) {
            return $rdf.sym("http://plazi.org/vocab/treatment#" + localName);
        }
        
        function dc(localName) {
            return $rdf.sym("http://purl.org/dc/elements/1.1/" + localName);
        }
        function truncate () {
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
        let names = {};
        
        /* renders a graphnode (possibly one that represents multiple nodes)
         */
        function render(tns, title, target) {
            tns.each(tn => tn).then(tns => Promise.all(tns.sort((tn1, tn2) => {
                    let y1 = tn1.value.substring(tn1.value.length - 4);
                    let y2 = tn2.value.substring(tn2.value.length - 4);
                    return y1 - y2;
                }).map(async tn => {
    
                    //for unclear reasons some taxa have more than one family
                    let family = await tn.out(dwc("family")).each(f => f.value).then(fs => fs.join(", "));
    
                    function linkToTreatments(gn) {
                        return gn.each(t => t)
                                .then(ts => Promise.all(ts.map(async t => " <a class=\"truncate\" href=\"" + t.value + "\">" +
                                                (await t.out(dc("creator")).each(c => c.value)).join("; ") +
                                                "</a>")).then(links => links.join(" - ")));
                    }
    
                    let preferedNameByGN = tn.in(treat("preferedName"));
                    let preferedNameBy = preferedNameByGN.nodes.length > 0 ? await linkToTreatments(preferedNameByGN) :
                            "";
    
                    let definingTreatmentGN = tn.in(treat("definesTaxonConcept"));
                    let definingTreatment = definingTreatmentGN.nodes.length > 0 ? "Defined by: " + await linkToTreatments(definingTreatmentGN) : "Defining treatment not yet on plazi";
    
                    let augmentingTreatmentGN = tn.in(treat("augmentsTaxonConcept"));
                    let augmentingTreatment = augmentingTreatmentGN.nodes.length > 0 ? "Augmented by: " + await linkToTreatments(augmentingTreatmentGN) :
                            "";
    
                    let result = document.createElement("li");
                    
                    result.innerHTML +="<strong>"+getFormattedName(tn.value)+"</strong>";
                    result.innerHTML +=
                            preferedNameBy + "<br/>\n" +
                            "Kingdom: " + tn.out(dwc("kingdom")).value + " - Phylum: " + tn.out(dwc("phylum")).value +
                            " - Class: " + tn.out(dwc("class")).value + " - Order: " + tn.out(dwc("order")).value +
                            " - Family: " + family + " - Genus: " + tn.out(dwc("genus")).value +
                            " - Species: " + tn.out(dwc("species")).value + "<br/>" + definingTreatment + "<br/>" + augmentingTreatment;
                    if (!names[tn.value]) {
                        let deprecationsArea = document.createElement("div");
                        deprecationsArea.classList.add("deprecations");
                        deprecationsArea.innerHTML = "looking for deprecations...";
                        result.appendChild(deprecationsArea)
                        names[tn.value] = true;
                        self._taxaManager.getNewTaxa(tn.value).then(newTaxa => {
                            render(newTaxa,"Deprecated by", deprecationsArea);
                            newTaxa.each(newTaxa => { 
                                self.relatedTaxonEncountered(newTaxa.out(dwc("genus")).value + " " + newTaxa.out(dwc("species")).value);
                            }
                            )
                        });
                    }
                    self.taxonRendered(tn.value);
                    return result;
                }))
            ).then(listItems => {
                if (listItems.length > 0) {
                    target.innerHTML = "<h4>"+title +"</h4>";
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
                window.location.hash = genus+"+"+species;
                render(taxonConcepts,genus + " " + species, this._element);
            }
            
        });
    }

    reset() {
        this._element.innerHTML = "";
    };

    relatedTaxonEncountered(genus, species) {

    }

    taxonRendered(taxonConcept) {

    }

    
}
