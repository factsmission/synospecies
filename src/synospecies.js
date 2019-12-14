import "core-js/stable";
import "regenerator-runtime/runtime";

import style from "./css/synospecies.css";

import Mustache from "mustache";

import SparqlEndpoint from "@retog/sparql-client"

import WikidataViewer from "./WikidataViewer.js";
import VernacularViewer from "./VernacularViewer.js";
import ImageSplash from "./ImageSplash.js";
import TaxaManager from "./TaxaManager.js";
import TaxonReport from "./TaxonReport.js";
import Taxomplete from "taxomplete";


const params = new URLSearchParams(window.location.search);

const sparqlEndpoint = new SparqlEndpoint(params.get("endpoint") || "https://treatment.ld.plazi.org/sparql");
const taxaManager = new TaxaManager(sparqlEndpoint);
const taxonReport = new TaxonReport(taxaManager, document.getElementById('taxon-name'));
const imageSplash = new ImageSplash(taxaManager, document.getElementById("image-area"));
const wikidataViewer = new WikidataViewer(document.getElementById("wikidata-area"));
const vernacularViewer = new VernacularViewer(document.getElementById("vernacular-area"));

//Search field

let input = document.getElementById("combinedfield");
let taxomplete = new Taxomplete(input, sparqlEndpoint);
taxomplete.action = function(value) {
    wikidataViewer.reset();
    vernacularViewer.reset();
    imageSplash.reset();
    taxonReport.reset();
    let genus = value.substring(0, value.indexOf(" "));
    let species = value.substr(value.indexOf(" ") + 1);
    taxonReport.relatedTaxonEncountered = (genus, species) => {
        wikidataViewer.addTaxon(genus + " " + species);
        vernacularViewer.addTaxon(genus + " " + species);
    }
    taxonReport.taxonRendered = (taxonConcept) => {
        imageSplash.appendImages(taxonConcept);
    }
    taxonReport.setTaxon(genus, species);
    wikidataViewer.addTaxon(genus + " " + species);
    vernacularViewer.addTaxon(genus + " " + species);
}
document.getElementById("lookup").addEventListener("click", e => {
    taxomplete.lookup();
    e.preventDefault();
    return false;
});

if (!input.value && window.location.hash) {
    input.value = window.location.hash.substring(1).replace("+"," ");
    taxomplete.lookup();
}

