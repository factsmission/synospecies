/* global Mustache, $rdf, fetch, Promise */
let sparqlEndpoint = "https://lindas-data.ch/sparql";
//let sparqlEndpoint = "https://plazi.factsmission.com/plazi/query";
function getSparqlResultSet(query) {
    console.log(query);
    let encodedQuery = encodeURIComponent(query);
    return fetch(sparqlEndpoint+"?query=" + encodedQuery, {
        headers: {
            accept: "application/sparql-results+json"
        }
    }).then(response =>
    {
        if (!response.ok) {
            throw response.status;
        } else {
            return response.json();
        }
    });
}

/** a side-effects free rdf-fetch function
 */
function rdfFetch(uri, init = {}) {
    return fetch(uri, init).then(response => {
        if (response.ok) {
            let graph = $rdf.graph();
            let mediaType = response.headers.get("Content-type");
            return response.text().then(text => {
                $rdf.parse(text, graph, uri, mediaType);
                response.graph = graph;
                return response;
            });
        } else {
            return response;
        }
    });
};

function getSparqlRDF(query) {
    console.log(query);
    let encodedQuery = encodeURIComponent(query);
    return rdfFetch(sparqlEndpoint+"?query=" + encodedQuery, {
        headers: {
            accept: "text/turtle"
        }
    }).then(response =>
    {
        if (!response.ok) {
            throw response.status;
        } else {
            return response.graph;
        }
    });
}

function getNewTaxa(oldTaxon) {
    let query = "PREFIX treat: <http://plazi.org/vocab/treatment#>\n" +
            "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n" +
            "PREFIX dc: <http://purl.org/dc/elements/1.1/>\n"+
            "CONSTRUCT {\n"+
            "  ?tc dwc:rank ?rank .\n" +
            "  ?tc dwc:phylum ?phylum .\n" +
            "  ?tc dwc:kingdom ?kingdom .\n" +
            "  ?tc dwc:class ?class .\n" +
            "  ?tc dwc:family ?family .\n" +
            "  ?tc dwc:order ?oder .\n" +
            "  ?tc dwc:genus ?genus .\n" +
            "  ?tc dwc:species ?species .\n" +
            "  ?tc a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> .\n"+
            "  ?treatment treat:preferedName ?tc.\n" +
            "  ?treatment dc:creator ?treatmentCreator .\n" +
            "  ?augmentingTreatment treat:augmentsTaxonConcept ?tc .\n"+
            "  ?augmentingTreatment dc:creator ?augmentingTreatmentCreator ." +
            "  ?definingTreatment treat:definesTaxonConcept ?tc .\n"+
            "  ?definingTreatment dc:creator ?definingTreatmentCreator .\n"+
            "} WHERE { \n" +
            " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
            "  ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?tc .\n" +
            "  ?treatment treat:deprecates <"+oldTaxon+">.\n" +
            "  ?tc dwc:rank ?rank .\n" +
            "  ?tc dwc:phylum ?phylum .\n" +
            "  ?tc dwc:kingdom ?kingdom .\n" +
            "  ?tc dwc:class ?class .\n" +
            "  ?tc dwc:family ?family .\n" +
            "  ?tc dwc:order ?oder .\n" +
            "  ?tc dwc:genus ?genus .\n" +
            "  ?tc dwc:species ?species .\n" +
            "  ?treatment ?treatmentTaxonRelation ?tc .\n" +
            "  ?treatment dc:creator ?treatmentCreator .\n" +
            "  OPTIONAL { ?augmentingTreatment treat:augmentsTaxonConcept ?tc . \n"+
            "  ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .}\n"+
            "  OPTIONAL { ?definingTreatment treat:definesTaxonConcept ?tc . \n"+
            "  ?definingTreatment dc:creator ?definingTreatmentCreator .}\n"+
            " }\n" +
            "} ";
    return getSparqlRDF(query).then(graph => {
        let tnClass = GraphNode($rdf.sym("http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept"),graph);
        return tnClass.in($rdf.sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"));
    });
}


function getNewTaxon(genus, species) {
    let query = "PREFIX treat: <http://plazi.org/vocab/treatment#>" +
            "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>" +
            "SELECT * WHERE { " +
            " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
            "  ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?newTaxon ." +
            "    ?treatment treat:deprecates ?oldTaxon ." +
            "    ?oldTaxon dwc:genus \"" + genus + "\"." +
            "    ?oldTaxon dwc:species \"" + species + "\"." +
            "    ?newTaxon dwc:genus ?newGenus." +
            "    ?newTaxon dwc:species ?newSpecies." +
            " }\n" +
            "} ";
    return getSparqlResultSet(query).then(json => {
        //json.results.bindings[0].oldTaxon.value
        return json.results.bindings.map(binding => {
            let result = {};
            result.newTaxon = {};
            result.newTaxon.genus = binding.newGenus.value;
            result.newTaxon.species = binding.newSpecies.value;
            result.oldTaxon = {};
            result.oldTaxon.species = species;
            result.oldTaxon.genus = genus;
            result.treatment = binding.treatment.value;
            return result;
        });
    });
}
function getImages(taxon) {
    let query = "PREFIX treat: <http://plazi.org/vocab/treatment#>\n" +
        "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n" +
        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
        "PREFIX fabio: <http://purl.org/spar/fabio/>\n" +
        "PREFIX dc: <http://purl.org/dc/elements/1.1/>\n" +
        "SELECT ?url ?description WHERE {   \n" +
        "  ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) <"+taxon+"> .\n" +
        "  ?treatment <http://purl.org/spar/cito/cites> ?cites.\n" +
        "  ?cites rdf:type fabio:Figure. \n" +
        "  ?cites fabio:hasRepresentation ?url.\n" +
        "  ?cites dc:description ?description.  \n" +
        "} ";
    return getSparqlResultSet(query).then(json => {
        return json.results.bindings.map(binding => {
            let result = {};
            result.url = binding.url.value;
            result.description = binding.description.value;
            return result;
        });
    });
		
};


function getTaxonConcepts(genus, species) {
    let query = "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n" +
            "PREFIX treat: <http://plazi.org/vocab/treatment#>\n" +
            "PREFIX dc: <http://purl.org/dc/elements/1.1/>\n" +
            "CONSTRUCT {\n"+
            "  ?tc dwc:rank ?rank .\n" +
            "  ?tc dwc:phylum ?phylum .\n" +
            "  ?tc dwc:kingdom ?kingdom .\n" +
            "  ?tc dwc:class ?class .\n" +
            "  ?tc dwc:family ?family .\n" +
            "  ?tc dwc:order ?oder .\n" +
            "  ?tc dwc:genus \""+genus+"\" .\n"+    
            "  ?tc dwc:species \""+species+"\" .\n"+
            "  ?tc a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> .\n"+
            "  ?augmentingTreatment treat:augmentsTaxonConcept ?tc .\n"+
            "  ?augmentingTreatment dc:creator ?augmentingTreatmentCreator ." +
            "  ?definingTreatment treat:definesTaxonConcept ?tc .\n"+
            "  ?definingTreatment dc:creator ?definingTreatmentCreator .\n"+
            "} WHERE { \n" +
            "  ?tc dwc:rank ?rank .\n" +
            "  ?tc dwc:phylum ?phylum .\n" +
            "  ?tc dwc:kingdom ?kingdom .\n" +
            "  ?tc dwc:class ?class .\n" +
            "  ?tc dwc:family ?family .\n" +
            "  ?tc dwc:order ?oder .\n" +
            "  ?tc dwc:genus \""+genus+"\" .\n"+    
            "  ?tc dwc:species \""+species+"\" .\n"+
            "  ?tc a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> . \n"+
            "  OPTIONAL { ?augmentingTreatment treat:augmentsTaxonConcept ?tc . \n"+
            "  ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .}\n"+
            "  OPTIONAL { ?definingTreatment treat:definesTaxonConcept ?tc . \n"+
            "  ?definingTreatment dc:creator ?definingTreatmentCreator .}\n"+
        "}";
    return getSparqlRDF(query).then(graph => {
        let tnClass = GraphNode($rdf.sym("http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept"),graph);
        return tnClass.in($rdf.sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"));
    });
};


function dwc(localName) {
    return $rdf.sym("http://rs.tdwg.org/dwc/terms/"+localName);
}

function treat(localName) {
    return $rdf.sym("http://plazi.org/vocab/treatment#"+localName);
}

function dc(localName) {
    return $rdf.sym("http://purl.org/dc/elements/1.1/"+localName);
}

let addedImages = {};

function appendImages(taxon) {
    getImages(taxon).then(images => {
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

function nameReport(genus, species) {
    let expandedTaxa = {};
    function appendDeprecations(genus, species) {
        let currentAcceptedName = "";
        getNewTaxon(genus, species).then(deprecations => {
            var template = $('#newTaxonTpl').html();
            deprecations.forEach(deprecation => {
                var html = Mustache.to_html(template, deprecation);
                $('#name-report').append(html);
            });
            deprecations.forEach(deprecation => {
                if (!expandedTaxa[deprecation.newTaxon.genus + deprecation.newTaxon.species]) {
                    expandedTaxa[deprecation.newTaxon.genus + deprecation.newTaxon.species] = true;
                    appendDeprecations(deprecation.newTaxon.genus, deprecation.newTaxon.species);
                }
            });
        });
    }
    $('#report').html("");
    appendDeprecations(genus, species);
};

function report(genus, species) {
    function getFormattedName(uri) {
        let nameSection = uri.substring(uri.lastIndexOf("/")+1);
        let lastSeparator = nameSection.lastIndexOf("_");
        return nameSection.substring(0, lastSeparator).replace(new RegExp("_","g")," ")+
                ", "+nameSection.substring(lastSeparator+1);
    }
    $('#taxon-name').html("");
    $('#image-area').html("");
    let names = {};
    function getTaxonRenderer(title, target) {
        return tns => tns.each(tn => tn).then(tns => Promise.all(tns.sort((tn1, tn2) => {
                let y1 = tn1.value.substring(tn1.value.length -4);
                let y2 = tn2.value.substring(tn2.value.length -4);
                return y1 - y2;
            }).map(async tn => {
                
                //for unclear reasons some taxa have more than one family
                let family = await tn.out(dwc("family")).each(f => f.value).then(fs => fs.join(", "));
                
                function linkToTreatments(gn) {
                    return gn.each(t => t)
                            .then(ts => Promise.all(ts.map(async t => " <a href=\""+t.value+"\">"+
                            (await t.out(dc("creator")).each(c => c.value)).join("; ")+
                            "</a>")).then(links => links.join(" - ")));
                }
            
                let preferedNameByGN = tn.in(treat("preferedName"));
                let preferedNameBy = preferedNameByGN.nodes.length > 0 ? await linkToTreatments(preferedNameByGN) : 
                        "";
                
                let definingTreatmentGN = tn.in(treat("definesTaxonConcept"));
                let definingTreatment = definingTreatmentGN.nodes.length > 0 ? "Defined by: "+await linkToTreatments(definingTreatmentGN) : "Defining treatment not yet on plazi"; 
                
                let augmentingTreatmentGN = tn.in(treat("augmentsTaxonConcept"));
                let augmentingTreatment = augmentingTreatmentGN.nodes.length > 0 ? "Augmented by: "+await linkToTreatments(augmentingTreatmentGN) : 
                        "";
                
                let result = $("<li>").append("<strong>"+getFormattedName(tn.value)+"</strong>"+
                 preferedNameBy+"<br/>\n"+
                 "Kingdom: "+tn.out(dwc("kingdom")).value+" - Phylum: "+tn.out(dwc("phylum")).value+
                 " - Class: "+tn.out(dwc("class")).value+" - Order: "+tn.out(dwc("order")).value+
                 " - Family: "+family+" - Genus: "+tn.out(dwc("genus")).value+
                 " - Species: "+tn.out(dwc("species")).value+"<br/>"+definingTreatment+"<br/>"+augmentingTreatment);
                 if (!names[tn.value]) {
                     let deprecationsArea = $("<div class=\"deprecations\">looking for deprecations....</div>");
                     result = result.append(deprecationsArea)
                     names[tn.value] = true;
                     getNewTaxa(tn.value).then(getTaxonRenderer("Deprecated by",deprecationsArea));
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
    getTaxonConcepts(genus, species).then(getTaxonRenderer(genus +" "+species, $('#taxon-name')));
    //nameReport(genus, species);
}

let input = document.getElementById("combinedfield");
let previousValue = input.value;
let gs = [];
let cs = [];
let ss = [];

$("#lookup").on("click", e => {
    report(input.value.toString().substring(0,input.value.toString().indexOf(" ")), input.value.toString().substr(input.value.toString().indexOf(" ") + 1));
    return false;
});

input.onkeyup = (e) => {
    if ((input.value.length >= 2) && (e.key !== "Enter") && (input.value !== previousValue)) {
        if (input.value.toString().indexOf(" ") === -1) {
            previousValue = input.value;
            Promise.all([getGenusSuggestions(input.value),getCombinedSuggestions(input.value)]).then(v => {
                gs = gs.map(i => i+" ");
                awesomplete.list = gs.concat(cs);
            });
        } else {
            previousValue = input.value;
            let speciesIn = input.value.toString().substr(input.value.toString().indexOf(" ") + 1);
            let genusIn = input.value.toString().substring(0,input.value.toString().indexOf(" "));
            if (speciesIn.length > 0) {
                getSpeciesSuggestions(speciesIn, genusIn).then(values => {
                    awesomplete.list = ss.map(i => genusIn + " " + i);
                });
            } else {
                getSpeciesSuggestions("", genusIn).then(values => {
                    awesomplete.list = ss.map(i => genusIn + " " + i);
                });
            }
        }
    }
    return true;
};
let awesomplete = new Awesomplete(input);
awesomplete.maxItems = 15;
awesomplete.sort = false;
//
awesomplete.filter = (t, i) => {
    let foundPos = t.toLowerCase().indexOf(i.toLowerCase());
    return (foundPos === 0) || (foundPos === (t.indexOf(" ") + 1));
};  

let origItem = awesomplete.item;
awesomplete.item = (suggestion, i) => {
    let foundPos = suggestion.toLowerCase().indexOf(i.toLowerCase());
    let suggestionSpacePos = suggestion.substr(0, suggestion.length-1).indexOf(" ");
    let html;
    if (suggestionSpacePos === -1) {
        html = "<mark>"+suggestion.substring(0, i.length)+"</mark>"+suggestion.substring(i.length);
    } else if (i.indexOf(" ") === -1) {
        html = suggestion.substring(0, suggestionSpacePos + 1)+"<mark>" +
                suggestion.substring(suggestionSpacePos + 1, suggestionSpacePos + 1 + i.length) +
                "</mark>" + suggestion.substring(suggestionSpacePos + 1 + i.length);
    } else if (i.indexOf(" ") !== -1) {
        html = "<mark>" +
                suggestion.substring(0, i.length) +
                "</mark>" + suggestion.substring(i.length);
    }
    return $("<li aria-selected='false'>"+html+"</li>")[0];
};


/**
 * 
 * @param {type} prefix
 * @returns A promise for an array of matching genera
 */
function getGenusSuggestions(prefix) {
    let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
                "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n"+
                "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n"+
                "SELECT DISTINCT ?genus WHERE {\n"+
                " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
                "?sub dwc:genus ?genus .\n"+
                "?sub rdf:type dwcfp:TaxonName.\n"+
                "FILTER REGEX(?genus, \"^"+prefix+"\",\"i\")\n"+
                " }\n" +
            "} ORDER BY UCASE(?genus) LIMIT 10";
    return getSparqlResultSet(query).then(json => {
        gs = json.results.bindings.map(binding => binding.genus.value);
        return true;
    });
}

function getSpeciesSuggestions(prefix, genus) {
    let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
                "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n"+
                "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n"+
                "SELECT DISTINCT ?species WHERE {\n"+
                " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
                "?sub dwc:genus ?genus .\n"+
                "?sub dwc:species ?species .\n"+
                "?sub rdf:type dwcfp:TaxonName.\n"+
                "FILTER REGEX(?species, \"^"+prefix+"\",\"i\")\n"+
                "FILTER REGEX(?genus, \"^"+genus+"\",\"i\")\n" +
                " }\n" +
            "} ORDER BY UCASE(?species) LIMIT 10";
    return getSparqlResultSet(query).then(json => {
        ss = json.results.bindings.map(binding => binding.species.value);
        return true;
    });
}

function getCombinedSuggestions(prefix) {
    let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
                "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n"+
                "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n"+
                "SELECT DISTINCT ?genus ?species WHERE {\n"+
                " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
                "?sub dwc:genus ?genus .\n"+
                "?sub dwc:species ?species .\n"+
                "?sub rdf:type dwcfp:TaxonName.\n"+
                "FILTER REGEX(?species, \"^"+prefix+"\",\"i\")\n"+
                " }\n" +
            "} ORDER BY UCASE(?species) LIMIT 10";
    return getSparqlResultSet(query).then(json => {
        cs = json.results.bindings.map(binding => binding.genus.value+" "+binding.species.value);
        return true;
    });
}