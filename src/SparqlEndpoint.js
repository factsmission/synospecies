import $rdf from "ext-rdflib";

export default class SparqlEndpoint {
    constructor(uri) {
        this._uri = uri;
    }

    getSparqlResultSet(query) {
        console.log(query);
        let encodedQuery = encodeURIComponent(query);
        return fetch(this._uri + "?query=" + encodedQuery, {
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
    
    getSparqlRDF(query) {
        console.log(query);
        let encodedQuery = encodeURIComponent(query);
        return $rdf.rdfFetch(this._uri + "?query=" + encodedQuery, {
            headers: new Headers({
                accept: "text/turtle"
            })
        }).then(response =>
        {
            if (!response.ok) {
                throw response.status;
            } else {
                return response.graph();
            }
        });
    }
}

