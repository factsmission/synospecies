/* global Mustache */

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
    }).then(json => {
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
                if (!expandedTaxa[deprecation.newTaxon.genus+deprecation.newTaxon.species]) {
                    expandedTaxa[deprecation.newTaxon.genus+deprecation.newTaxon.species] = true;
                    appendDeprecations(deprecation.newTaxon.genus, deprecation.newTaxon.species);
                }
            });
        });
    }
    $('#report').html("");
    appendDeprecations(genus, species);
}

$("#lookup").on("click", e => {
    showReport($("#genus").val(), $("#species").val());
    return false;
});

