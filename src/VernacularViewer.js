import SparqlEndpoint from "@retog/sparql-client"
import $rdf from "ext-rdflib";
import GraphNode from "rdfgraphnode-rdfext";

export default class VernacularViewer {
    constructor(element) {
        this._element = element;
        this._taxonUrls = {};
        this._sparqlEndpoint = new SparqlEndpoint("https://vernacular.plazi.org/sparql");
        this._query = taxonUrl => `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
prefix slang: <https://vocab.plazi.org/vernacular/>

SELECT DISTINCT ?value (GROUP_CONCAT(DISTINCT(?af); separator='; ') as ?afs) WHERE {
    GRAPH ?g {
        ?no a slang:NameOccurrence .
        ?no rdf:value ?value .
        OPTIONAL { ?no slang:areaFine ?af . }
        ?no slang:taxon <${taxonUrl}> .
    }
}
GROUP BY ?value`;
    }

    addTaxonUrl(taxonUrl) {
        const render = resArray => {
            if (resArray.length > 0) {
                let result = '<table class="table"><thead><tr><th scope="col">Vernacular Name</th><th scope="col">Area</th></tr></thead><tbody>';
                for (let i = 0; i < resArray.length; i++) {
                    result += `<tr><td>${resArray[i].value.value}</td><td>${resArray[i].afs.value}</td></tr>`;
                }
                result += '</tbody></table>'
                return result;
            } else {
                return false;
            }
        }
        if (!this._taxonUrls[taxonUrl]) {
            this._taxonUrls[taxonUrl] = true;
            return this._sparqlEndpoint.getSparqlResultSet(this._query(taxonUrl)).then(json => {
                this._element.innerHTML = render(json.results.bindings) || "";
            });
        }
    };

    addTaxon(taxonName) {
        return this.addTaxonUrl("http://taxon-concept.plazi.org/id/Plantae/" + taxonName.replace(/\s/g, "_"))
    };

    reset() {
        this._element.innerHTML = "";
        this._taxonUrls = {};
    };
}