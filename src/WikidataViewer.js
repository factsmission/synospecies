import SparqlEndpoint from "@retog/sparql-client"
import $rdf from "ext-rdflib";
import GraphNode from "rdfgraphnode-rdfext";

export default class WikidataViewer {
    
    

    constructor(element) {
        this._element = element;
        this._taxonNames = {};
        this._sparqlEndpoint = new SparqlEndpoint("https://query.wikidata.org/sparql");
        this._query = taxonName =>`
            DESCRIBE ?item WHERE 
            {
                ?item wdt:P225 "${taxonName}"
            }`;
    }
        
    
    addTaxon(taxonName) {
        function wdt(localName) {
            return $rdf.sym("http://www.wikidata.org/prop/direct/" + localName);
        }
    
        function wd(localName) {
            return $rdf.sym("http://www.wikidata.org/entity/" + localName);
        }

        function schema(localName) {
            return $rdf.sym("http://schema.org/" + localName);
        }

        function render(gn) {
            let result = "<div>Wikidata Resource: <a href=\""+gn.value+"\">"+gn.value+"</a>";
            result += "<ul>"
            gn.out(wdt("P225")).each(taxonName => {
                result += "<li>Taxon Name "+taxonName.value+"</li>";
            });
            gn.in(schema("about")).each(about => {
                result += "<li>Is subject of: <a href=\""+about.value+"\">"+decodeURI(about.value)+"</a></li>";
            });
            gn.out(wdt("P846")).each(gbifId => {
                result += "<li>GBIF ID <a href=\"https://www.gbif.org/species/"+gbifId.value+"\">"+gbifId.value+"</a></li>";
            });
            result += "</ul>"
            result += "</div>"
            return result;
        }
        if (!this._taxonNames[taxonName]) {
            this._taxonNames[taxonName] = true;
            return this._sparqlEndpoint.getSparqlRDF(this._query(taxonName)).then(graph => {
                if (graph.length === 0) {
                    throw Error("Not in wikidata: "+taxonName);
                }
                let tnClass = GraphNode(wd("Q16521"), graph);
                let instance = tnClass.in(wdt("P31"));
                if (instance.nodes.length === 0) {
                    //maybe it's a fossil taxon (a subclass of taxon)
                    tnClass = GraphNode(wd("Q23038290"), graph);
                    instance = tnClass.in(wdt("P31"));
                }
                return instance;
            }).then(gn => {
                    this._element.innerHTML = this._element.innerHTML+render(gn);    
            });
        }
    };

    reset() {
        this._element.innerHTML = "";
        this._taxonNames = {};
    };
}