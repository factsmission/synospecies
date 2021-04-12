// eslint-disable
import $rdf from 'ext-rdflib'
import GraphNode from 'rdfgraphnode-rdfext'

export default class TaxaManager {
  constructor (sparqlEndpoint) {
    this._sparqlEndpoint = sparqlEndpoint
  }

  getSynonymsWithTreatments (taxon) {
    const query =
`PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT
?tc
?aug ?augd (group_concat(DISTINCT ?augc;separator="; ") as ?augcs)
?def ?defd (group_concat(DISTINCT ?defc;separator="; ") as ?defcs)
?dpr ?dprd (group_concat(DISTINCT ?dprc;separator="; ") as ?dprcs)
WHERE {
  <${taxon}> ((^treat:deprecates/(treat:augmentsTaxonConcept|treat:definesTaxonConcept))|
    ((^treat:augmentsTaxonConcept|^treat:definesTaxonConcept)/treat:deprecates))* ?tc .
  OPTIONAL {
    ?aug treat:augmentsTaxonConcept ?tc;
         dc:creator ?augc.
    OPTIONAL {
      ?aug treat:publishedIn ?augp.
      ?augp dc:date ?augd.
    }
  }
  OPTIONAL {
    ?def treat:definesTaxonConcept ?tc;
         dc:creator ?defc.
    OPTIONAL {
      ?def treat:publishedIn ?defp.
      ?defp dc:date ?defd.
    }
  }
  OPTIONAL {
    ?dpr treat:deprecates ?tc;
          dc:creator ?dprc.
    OPTIONAL {
      ?dpr treat:publishedIn ?dprp.
      ?dprp dc:date ?dprd.
    }
  }
}
GROUP BY ?tc ?aug ?augd ?def ?defd ?dpr ?dprd`
    return this._sparqlEndpoint.getSparqlResultSet(query).then(json => json)
  }

  getImages (taxon) {
    const query = 'PREFIX treat: <http://plazi.org/vocab/treatment#>\n' +
                'PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n' +
                'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
                'PREFIX fabio: <http://purl.org/spar/fabio/>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'SELECT DISTINCT ?url ?description WHERE {   \n' +
                '  ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) <' + taxon + '> .\n' +
                '  ?treatment <http://purl.org/spar/cito/cites> ?cites.\n' +
                '  ?cites rdf:type fabio:Figure. \n' +
                '  ?cites fabio:hasRepresentation ?url.\n' +
                '  ?cites dc:description ?description.  \n' +
                '} '
    return this._sparqlEndpoint.getSparqlResultSet(query).then(json => {
      return json.results.bindings.map(binding => {
        const result = {}
        result.url = binding.url.value
        result.description = binding.description.value
        return result
      })
    })
  }

  getTaxonConcepts (genus, species) {
    const query = `PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT ?tc WHERE {
  ?tc dwc:genus "${genus}";
      dwc:species "${species}";
      a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept>.
}`
    return this._sparqlEndpoint.getSparqlResultSet(query).then(json => json)
  }

  getTaxonDetails (tc) {
    const query = `PREFIX treat: <http://plazi.org/vocab/treatment#>
    PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    SELECT DISTINCT * WHERE {
      <${tc}> dwc:rank ?rank;
              dwc:phylum ?phylum;
              dwc:kingdom ?kingdom;
              dwc:class ?class;
              dwc:family ?family;
              dwc:order ?order;
              dwc:genus ?genus.
      OPTIONAL {
        <${tc}> dwc:species ?species;
      }
      OPTIONAL {
        ?dprtreat treat:deprecates <${tc}>;
                  (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?new.
      }
      OPTIONAL {
        ?dprxtreat (treat:augmentsTaxonConcept|treat:definesTaxonConcept) <${tc}>;
                   treat:deprecates ?old.
      }
    }`
    return this._sparqlEndpoint.getSparqlResultSet(query).then(json => json)
  }
}
