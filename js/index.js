/* global Mustache */
function executeSparql(query) {
    let encodedQuery = encodeURIComponent(query);
    return fetch("https://test.lindas-data.ch/sparql?query=" + encodedQuery, {
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
function getNewTaxon(genus, species) {
    let query = "PREFIX treat: <http://plazi.org/vocab/treatment#>" +
            "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>" +
            "SELECT * WHERE { " +
            "  ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?newTaxon ." +
            "    ?treatment treat:deprecates ?oldTaxon ." +
            "    ?oldTaxon dwc:genus \"" + genus + "\"." +
            "    ?oldTaxon dwc:species \"" + species + "\"." +
            "    ?newTaxon dwc:genus ?newGenus." +
            "    ?newTaxon dwc:species ?newSpecies." +
            "} ";
    return executeSparql(query).then(json => {
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

function showReport(genus, species) {
    let expandedTaxa = {};
    function appendDeprecations(genus, species) {
        let currentAcceptedName = "";
        getNewTaxon(genus, species).then(deprecations => {
            var template = $('#newTaxonTpl').html();
            deprecations.forEach(deprecation => {
                var html = Mustache.to_html(template, deprecation);
                $('#report').append(html);
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
}

let input = document.getElementById("combinedfield");
let previousValue = input.value;

$("#lookup").on("click", e => {
    showReport(input.value.toString().substring(0,input.value.toString().indexOf(" ")), input.value.toString().substr(input.value.toString().indexOf(" ") + 1));
    return false;
});

input.onkeyup = (e) => {
    if (input.value.length >= 2) {
        if (input.value.toString().indexOf(" ") === -1) {
            if ((e.key !== "Enter") && (input.value !== previousValue)) {
                previousValue = input.value;
            getGenusSuggestions(input.value).then(gs => {
                getCombinedSuggestions(input.value).then(cs => {
                    let sugg = [];
                    sugg = gs;
                    sugg = sugg.concat(cs);
                    awesomplete.maxItems = 15;
                    awesomplete.list = sugg; 
                });
            });
            }
        } else {
            if ((e.key !== "Enter") && (input.value !== previousValue)) {
                previousValue = input.value;
                let speciesIn = input.value.toString().substr(input.value.toString().indexOf(" ") + 1);
                let genusIn = input.value.toString().substring(0,input.value.toString().indexOf(" "));
                getSpeciesSuggestions(speciesIn).then(values => {
                    let sugg = values.map(i => genusIn+" "+i);
                    awesomplete.maxItems = 15;
                    awesomplete.list = sugg;
                });
            }
        }
    }
    return true;
};
let awesomplete = new Awesomplete(input);

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
                "?sub dwc:genus ?genus .\n"+
                "?sub rdf:type dwcfp:TaxonName.\n"+
                "FILTER REGEX(?genus, \"^"+prefix+"\",\"i\")\n"+
            "} ORDER BY UCASE(?genus) LIMIT 10";
    console.log(query);
    return executeSparql(query).then(json => {
        return json.results.bindings.map(binding => binding.genus.value);
    });
}

function getSpeciesSuggestions(prefix) {
    let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
                "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n"+
                "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n"+
                "SELECT DISTINCT ?species WHERE {\n"+
                "?sub dwc:species ?species .\n"+
                "?sub rdf:type dwcfp:TaxonName.\n"+
                "FILTER REGEX(?species, \"^"+prefix+"\",\"i\")\n"+
            "} ORDER BY UCASE(?species) LIMIT 10";
    console.log(query);
    return executeSparql(query).then(json => {
        return json.results.bindings.map(binding => binding.species.value);
    });
}

function getCombinedSuggestions(prefix) {
    let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
                "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n"+
                "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n"+
                "SELECT DISTINCT ?genus ?species WHERE {\n"+
                "?sub dwc:genus ?genus .\n"+
                "?sub dwc:species ?species .\n"+
                "?sub rdf:type dwcfp:TaxonName.\n"+
                "FILTER REGEX(?species, \"^"+prefix+"\",\"i\")\n"+
            "} ORDER BY UCASE(?species) LIMIT 10";
    console.log(query);
    return executeSparql(query).then(json => {
        return json.results.bindings.map(binding => binding.genus.value+" "+binding.species.value);
    });
}