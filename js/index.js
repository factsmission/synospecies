/* global Mustache, $rdf, fetch */
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
            "DESCRIBE ?newTaxon WHERE { \n" +
            " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
            "  ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?newTaxon .\n" +
            "    ?treatment treat:deprecates <"+oldTaxon+">.\n" +
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
function specificInfos(genus, species) {
    let query = "PREFIX treat: <http://plazi.org/vocab/treatment#>" +
"PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
"SELECT DISTINCT * WHERE {   " +
"  OPTIONAL {?taxon      (^treat:deprecates/(treat:augmentsTaxonConcept|treat:definesTaxonConcept)) ?newTaxon . }" +
"  ?taxon dwc:genus \"Munida\" .    " +
"  ?taxon dwc:species \"irrasa\".    " +
"  OPTIONAL { " +
"    ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?taxon. " +
"    ?treatment <http://purl.org/spar/cito/cites> ?cites." +
"    ?cites rdf:type <http://purl.org/spar/fabio/Figure>. " +
"    ?cites ?p ?o." +
"  }" +
"  OPTIONAL {?taxon  (dwc:authority|dwc:scientificNameAuthorship) ?authority .}" +
"  " +
"  } LIMIT 150";
		
};


function getTaxonConcepts(genus, species) {
    let query = "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n" +
        "DESCRIBE ?taxonConcept WHERE {\n" +
        "?taxonConcept dwc:genus \""+genus+"\" .\n"+    
        "?taxonConcept dwc:species \""+species+"\" .\n"+
        "?taxonConcept a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept>\n"+
        "}";
    return getSparqlRDF(query).then(graph => {
        let tnClass = GraphNode($rdf.sym("http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept"),graph);
        return tnClass.in($rdf.sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"));
    });
};


function dwc(localName) {
    return $rdf.sym("http://rs.tdwg.org/dwc/terms/"+localName);
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
    let names = {};
    function getTaxonRenderer(target) {
        return tns => tns.each(tn => tn).then(tns => Promise.all(tns.sort((tn1, tn2) => {
                let y1 = tn1.value.substring(tn1.value.length -4);
                let y2 = tn2.value.substring(tn2.value.length -4);
                return y1 - y2;
            }).map(async tn => {
                
                //for unlear reasons some taxa have more than one family
                let family = await tn.out(dwc("family")).each(f => f.value).then(fs => fs.join(", "));
                let deprecationsArea = $("<div class=\"deprecations\">looking fro deprecations....</div>");
                let result = $("<li>").append("<strong>"+getFormattedName(tn.value)+"</strong><br/>\n"+
                 "Kingdom: "+tn.out(dwc("kingdom")).value+" - Phylum: "+tn.out(dwc("phylum")).value+
                 " - Class: "+tn.out(dwc("class")).value+" - Order: "+tn.out(dwc("order")).value+
                 " - Family: "+family+" - Genus: "+tn.out(dwc("genus")).value+
                 " - Species: "+tn.out(dwc("species")).value);
                 if (!names[tn.value]) {
                     result = result.append(deprecationsArea)
                     names[tn.value] = true;
                     getNewTaxa(tn.value).then(getTaxonRenderer(deprecationsArea));
                 }        
                 return result;
             }))
         ).then(listItems => {
             target.html($("<ul>").append(listItems))
         });
    };
    getTaxonConcepts(genus, species).then(getTaxonRenderer($('#taxon-name')));
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