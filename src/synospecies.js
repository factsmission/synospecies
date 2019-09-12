import "core-js/stable";
import "regenerator-runtime/runtime";

import style from "./css/synospecies.css";
import $rdf from "ext-rdflib";
import Mustache from "mustache";
import GraphNode from "rdfgraphnode-rdfext";

import Vernacular from "./vernacular.js"
import SparqlEndpoint from "./SparqlEndpoint.js";

import WikidataViewer from "./WikidataViewer.js";
import TaxaManager from "./TaxaManager.js";
import TaxonReport from "./TaxonReport.js";
import Taxomplete from "./Taxomplete.js";


let sparqlEndpoint = new SparqlEndpoint("https://lindas-data.ch/sparql");
//let sparqlEndpoint = "https://plazi.factsmission.com/plazi/query";

let taxaManager = new TaxaManager(sparqlEndpoint);
let taxonReport = new TaxonReport(taxaManager, document.getElementById('taxon-name'));




function dwc(localName) {
    return $rdf.sym("http://rs.tdwg.org/dwc/terms/" + localName);
}

function treat(localName) {
    return $rdf.sym("http://plazi.org/vocab/treatment#" + localName);
}

function dc(localName) {
    return $rdf.sym("http://purl.org/dc/elements/1.1/" + localName);
}

let addedImages = {};
let wikidataViewer = new WikidataViewer(document.getElementById("wikidata-area"));

function appendImages(taxon) {
    taxaManager.getImages(taxon).then(images => {
        var template = $('#imageTpl').html();
        images.forEach(image => {
            if (!addedImages[image.url]) {
                addedImages[image.url] = true;
                var html = Mustache.to_html(template, image);
                $('#image-area').append(html);
            }
        });
    });
}


function report(genus, species) {
    function getFormattedName(uri) {
        let nameSection = uri.substring(uri.lastIndexOf("/") + 1);
        let lastSeparator = nameSection.lastIndexOf("_");
        return nameSection.substring(0, lastSeparator).replace(new RegExp("_", "g"), " ") +
                ", " + nameSection.substring(lastSeparator + 1);
    }
    $('#taxon-name').html("");
    $('#image-area').html("");
    wikidataViewer.reset();
    let names = {};
    addedImages = {};
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
                            .then(ts => Promise.all(ts.map(async t => " <a href=\"" + t.value + "\">" +
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

                let result = $("<li>").append("<strong>" + getFormattedName(tn.value) + "</strong>" +
                        preferedNameBy + "<br/>\n" +
                        "Kingdom: " + tn.out(dwc("kingdom")).value + " - Phylum: " + tn.out(dwc("phylum")).value +
                        " - Class: " + tn.out(dwc("class")).value + " - Order: " + tn.out(dwc("order")).value +
                        " - Family: " + family + " - Genus: " + tn.out(dwc("genus")).value +
                        " - Species: " + tn.out(dwc("species")).value + "<br/>" + definingTreatment + "<br/>" + augmentingTreatment);
                if (!names[tn.value]) {
                    let deprecationsArea = $("<div class=\"deprecations\">looking for deprecations....</div>");
                    result = result.append(deprecationsArea)
                    names[tn.value] = true;
                    taxaManager.getNewTaxa(tn.value).then(newTaxa => {
                        render(newTaxa,"Deprecated by", deprecationsArea);
                        newTaxa.each(newTaxa => 
                            wikidataViewer.addTaxon(newTaxa.out(dwc("genus")).value + " " + newTaxa.out(dwc("species")).value)
                        )
                    });
                }
                appendImages(tn.value);
                return result;
            }))
        ).then(listItems => {
            if (listItems.length > 0) {
                target.html(title).append($("<ul>").append(listItems));
            } else {
                target.html("");
            }
        });
    };

    taxaManager.getTaxonConcepts(genus, species).then(taxonConcepts => {
        if (taxonConcepts.nodes.length === 0) {
            $('#taxon-name').html("No treatment for " + genus + " " + species + " found on plazi.");
        } else {
            window.location.hash = genus+"+"+species;
            render(taxonConcepts,genus + " " + species, $('#taxon-name'));
        }
        wikidataViewer.addTaxon(genus + " " + species);
    });
}

//Search field

let input = document.getElementById("combinedfield");
let taxomplete = new Taxomplete(sparqlEndpoint, input);
taxomplete.action = function(value) {
    $('#top-navbar').append($('#search-form'));
    report(value.substring(0, value.indexOf(" ")), 
            value.substr(value.indexOf(" ") + 1));
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

