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
            result.newGenus = binding.newGenus.value;
            result.newSpecies = binding.newSpecies.value;
            result.oldSpecies = species;
            result.oldGenus = genus;
            result.treatment = binding.treatment.value;
            return result;
        });
    });
}

function showReport(genus, species) {
    function appendDeprecations(genus, species) {
        let currentAcceptedName = "";
        let expandedTaxa = {};
        getNewTaxon(genus, species).then(deprecations => {
            var template = $('#newTaxonTpl').html();
            deprecations.forEach(taxon => {
                var html = Mustache.to_html(template, taxon);
                $('#report').append(html);
            });
            if (!expandedTaxa[deprecation.newGenus+deprecation.newSpecies]) {
                deprecations.forEach(deprecation => {
                    appendDeprecations(deprecation.newGenus, deprecation.newSpecies)
                });
            }
        });
    }
    $('#report').html("");
    appendDeprecations(genus, species);
}

$("#lookup").on("click", e => {
    showReport($("#genus").val(), $("#species").val());
    return false;
});

