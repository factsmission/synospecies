import Awesomplete from "awesomplete";

export default class Taxomplete {

    constructor(sparqlEndpoint, input) {
        this._sparqlEndpoint = sparqlEndpoint;
        this._input = input;
        let previousValue = input.value;
        let gs = [];
        let cs = [];
        let ss = [];

        let self = this;

        var awesomplete = new Awesomplete(input);
        awesomplete.maxItems = 15;
        awesomplete.sort = false;

        input.onkeyup = (e) => {
            if ((input.value.length >= 2) && (e.key !== "Enter") && (input.value !== previousValue)) {
                populateSuggestions();
            }
            return true;
        };

        input.addEventListener("awesomplete-selectcomplete", (e) => {
            let wordCount = input.value.trim().split(" ").length;
            if (wordCount === 1) {
                populateSuggestions();
                awesomplete.open();
            }
            if (wordCount === 2) {
                this.lookup();
            }
        });

        function populateSuggestions() {
            if (input.value.toString().indexOf(" ") === -1) {
                previousValue = input.value;
                Promise.all([getGenusSuggestions(input.value), getCombinedSuggestions(input.value)]).then(v => {
                    gs = gs.map(i => i + " ");
                    awesomplete.list = gs.concat(cs);
                });
            } else {
                previousValue = input.value;
                let speciesIn = input.value.toString().substr(input.value.toString().indexOf(" ") + 1);
                let genusIn = input.value.toString().substring(0, input.value.toString().indexOf(" "));
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

        awesomplete.filter = (t, i) => {
            let foundPos = t.toLowerCase().indexOf(i.toLowerCase());
            return (foundPos === 0) || (foundPos === (t.indexOf(" ") + 1));
        };

        let origItem = awesomplete.item;
        awesomplete.item = (suggestion, i) => {
            let foundPos = suggestion.toLowerCase().indexOf(i.toLowerCase());
            let suggestionSpacePos = suggestion.substr(0, suggestion.length - 1).indexOf(" ");
            let html;
            if (suggestionSpacePos === -1) {
                html = "<mark>" + suggestion.substring(0, i.length) + "</mark>" + suggestion.substring(i.length);
            } else if (i.indexOf(" ") === -1) {
                html = suggestion.substring(0, suggestionSpacePos + 1) + "<mark>" +
                        suggestion.substring(suggestionSpacePos + 1, suggestionSpacePos + 1 + i.length) +
                        "</mark>" + suggestion.substring(suggestionSpacePos + 1 + i.length);
            } else if (i.indexOf(" ") !== -1) {
                html = "<mark>" +
                        suggestion.substring(0, i.length) +
                        "</mark>" + suggestion.substring(i.length);
            }
            let result = document.createElement("li");
            result.setAttribute("aria-selected", "false");
            result.innerHTML = html;
            return result;
        };


        /**
         * 
         * @param {type} prefix
         * @returns A promise for an array of matching genera
         */
        function getGenusSuggestions(prefix) {
            let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n" +
                    "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n" +
                    "SELECT DISTINCT ?genus WHERE {\n" +
                    " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
                    "?sub dwc:genus ?genus .\n" +
                    "?sub rdf:type dwcfp:TaxonName.\n" +
                    "FILTER REGEX(?genus, \"^" + prefix + "\",\"i\")\n" +
                    " }\n" +
                    "} ORDER BY UCASE(?genus) LIMIT 10";
            return sparqlEndpoint.getSparqlResultSet(query).then(json => {
                gs = json.results.bindings.map(binding => binding.genus.value);
                return true;
            });
        }

        function getSpeciesSuggestions(prefix, genus) {
            let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n" +
                    "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n" +
                    "SELECT DISTINCT ?species WHERE {\n" +
                    " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
                    "?sub dwc:genus \"" + genus + "\" .\n" +
                    "?sub dwc:species ?species .\n" +
                    "?sub rdf:type dwcfp:TaxonName.\n" +
                    "FILTER REGEX(?species, \"^" + prefix + "\",\"i\")\n" +
                    " }\n" +
                    "} ORDER BY UCASE(?species) LIMIT 10";
            return sparqlEndpoint.getSparqlResultSet(query).then(json => {
                ss = json.results.bindings.map(binding => binding.species.value);
                return true;
            });
        }

        function getCombinedSuggestions(prefix) {
            let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                    "PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n" +
                    "PREFIX dwcfp: <http://filteredpush.org/ontologies/oa/dwcFP#>\n" +
                    "SELECT DISTINCT ?genus ?species WHERE {\n" +
                    " GRAPH <https://linked.opendata.swiss/graph/plazi> {\n" +
                    "?sub dwc:genus ?genus .\n" +
                    "?sub dwc:species ?species .\n" +
                    "?sub rdf:type dwcfp:TaxonName.\n" +
                    "FILTER REGEX(?species, \"^" + prefix + "\",\"i\")\n" +
                    " }\n" +
                    "} ORDER BY UCASE(?species) LIMIT 10";
            return sparqlEndpoint.getSparqlResultSet(query).then(json => {
                cs = json.results.bindings.map(binding => binding.genus.value + " " + binding.species.value);
                return true;
            });
        }
    }

    lookup() {
        this.action(this._input.value.toString());
    }

    action(value) {
        console.log("Value "+value+" selected, overwrite action(value) method to have something happen.")
    }

}