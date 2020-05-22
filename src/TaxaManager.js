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
         treat:publishedIn ?augp;
         dc:creator ?augc.
    ?augp dc:date ?augd .
  }
  OPTIONAL {
    ?def treat:definesTaxonConcept ?tc;
         treat:publishedIn ?defp;
         dc:creator ?defc.
    ?defp dc:date ?defd .
  }
  OPTIONAL {
    ?dpr treat:deprecates ?tc;
          treat:publishedIn ?dprp;
          dc:creator ?dprc.
    ?dprp dc:date ?dprd .
  }
}
GROUP BY ?tc ?aug ?augd ?def ?defd ?dpr ?dprd`
    return this._sparqlEndpoint.getSparqlResultSet(query).then(json => json)
  }

  getNewTaxa (oldTaxon) {
    const query = 'PREFIX treat: <http://plazi.org/vocab/treatment#>\n' +
                'PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'CONSTRUCT {\n' +
                '  ?tc dwc:rank ?rank .\n' +
                '  ?tc dwc:phylum ?phylum .\n' +
                '  ?tc dwc:kingdom ?kingdom .\n' +
                '  ?tc dwc:class ?class .\n' +
                '  ?tc dwc:family ?family .\n' +
                '  ?tc dwc:order ?oder .\n' +
                '  ?tc dwc:genus ?genus .\n' +
                '  ?tc dwc:species ?species .\n' +
                '  ?tc a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> .\n' +
                '  ?treatment treat:preferedName ?tc.\n' +
                '  ?treatment dc:creator ?treatmentCreator .\n' +
                '  ?treatment dc:date ?date . \n' +
                '  ?augmentingTreatment treat:augmentsTaxonConcept ?tc .\n' +
                '  ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .\n' +
                '  ?augmentingTreatment dc:date ?augmentingDate . \n' +
                '  ?definingTreatment treat:definesTaxonConcept ?tc .\n' +
                '  ?definingTreatment dc:creator ?definingTreatmentCreator .\n' +
                '  ?definingTreatment dc:date ?definingDate . \n' +
                '} WHERE { \n' +
                '  ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?tc .\n' +
                '  ?treatment treat:deprecates <' + oldTaxon + '>.\n' +
                '  ?tc dwc:rank ?rank .\n' +
                '  ?tc dwc:phylum ?phylum .\n' +
                '  ?tc dwc:kingdom ?kingdom .\n' +
                '  ?tc dwc:class ?class .\n' +
                '  ?tc dwc:family ?family .\n' +
                '  ?tc dwc:order ?oder .\n' +
                '  ?tc dwc:genus ?genus .\n' +
                '  ?tc dwc:species ?species .\n' +
                '  ?treatment ?treatmentTaxonRelation ?tc .\n' +
                '  ?treatment dc:creator ?treatmentCreator .\n' +
                '  OPTIONAL { ?treatment treat:publishedIn ?publ .\n' +
                '    ?publ dc:date ?date . } \n' +
                '  OPTIONAL { ?augmentingTreatment treat:augmentsTaxonConcept ?tc .\n' +
                '    ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .\n' +
                '    OPTIONAL { ?augmentingTreatment treat:publishedIn ?augmentingPubl .\n' +
                '      ?augmentingPubl dc:date ?augmentingDate . }} \n' +
                '  OPTIONAL { ?definingTreatment treat:definesTaxonConcept ?tc .\n' +
                '    ?definingTreatment dc:creator ?definingTreatmentCreator .\n' +
                '    OPTIONAL { ?definingTreatment treat:publishedIn ?definingPubl .\n' +
                '      ?definingPubl dc:date ?definingDate . }} \n' +
                '}'
    return this._sparqlEndpoint.getSparqlRDF(query).then(graph => {
      const tnClass = GraphNode($rdf.sym('http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept'), graph)
      return tnClass.in($rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'))
    })
  }

  getOldTaxa (newTaxon) {
    const query = `PREFIX treat: <http://plazi.org/vocab/treatment#>
    PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    CONSTRUCT {
      ?tc dwc:rank ?rank .
      ?tc dwc:phylum ?phylum .
      ?tc dwc:kingdom ?kingdom .
      ?tc dwc:class ?class .
      ?tc dwc:family ?family .
      ?tc dwc:order ?oder .
      ?tc dwc:genus ?genus .
      ?tc dwc:species ?species .
      ?tc a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> .
      ?treatment treat:preferedName ?tc.
      ?treatment dc:creator ?treatmentCreator .
      ?treatment dc:date ?date . 
      ?augmentingTreatment treat:augmentsTaxonConcept ?tc .
      ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .
      ?augmentingTreatment dc:date ?augmentingDate . 
      ?definingTreatment treat:definesTaxonConcept ?tc .
      ?definingTreatment dc:creator ?definingTreatmentCreator .
      ?definingTreatment dc:date ?definingDate . 
    } WHERE {
      ?newtreatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) <${newTaxon}> .
      ?newtreatment treat:deprecates ?tc .
      ?tc dwc:rank ?rank .
      ?tc dwc:phylum ?phylum .
      ?tc dwc:kingdom ?kingdom .
      ?tc dwc:class ?class .
      ?tc dwc:family ?family .
      ?tc dwc:order ?oder .
      ?tc dwc:genus ?genus .
      ?tc dwc:species ?species .
      OPTIONAL { ?treatment (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?tc .
        ?treatment ?treatmentTaxonRelation ?tc .
        ?treatment dc:creator ?treatmentCreator . 
        OPTIONAL { ?treatment treat:publishedIn ?publ .
          ?publ dc:date ?date . } 
        OPTIONAL { ?augmentingTreatment treat:augmentsTaxonConcept ?tc .
          ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .
          OPTIONAL { ?augmentingTreatment treat:publishedIn ?augmentingPubl .
            ?augmentingPubl dc:date ?augmentingDate . }} 
        OPTIONAL { ?definingTreatment treat:definesTaxonConcept ?tc .
          ?definingTreatment dc:creator ?definingTreatmentCreator .
          OPTIONAL { ?definingTreatment treat:publishedIn ?definingPubl .
            ?definingPubl dc:date ?definingDate . }}}
    }`
    return this._sparqlEndpoint.getSparqlRDF(query).then(graph => {
      const tnClass = GraphNode($rdf.sym('http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept'), graph)
      return tnClass.in($rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'))
    })
  }

  getImages (taxon) {
    const query = 'PREFIX treat: <http://plazi.org/vocab/treatment#>\n' +
                'PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n' +
                'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
                'PREFIX fabio: <http://purl.org/spar/fabio/>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'SELECT ?url ?description WHERE {   \n' +
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
    const query = 'PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>\n' +
                'PREFIX treat: <http://plazi.org/vocab/treatment#>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'CONSTRUCT {\n' +
                '  ?tc dwc:rank ?rank .\n' +
                '  ?tc dwc:phylum ?phylum .\n' +
                '  ?tc dwc:kingdom ?kingdom .\n' +
                '  ?tc dwc:class ?class .\n' +
                '  ?tc dwc:family ?family .\n' +
                '  ?tc dwc:order ?oder .\n' +
                '  ?tc dwc:genus "' + genus + '" .\n' +
                '  ?tc dwc:species "' + species + '" .\n' +
                '  ?tc a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> .\n' +
                '  ?tc treat:hasTaxonName ?tn .\n' +
                '  ?augmentingTreatment treat:augmentsTaxonConcept ?tc .\n' +
                '  ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .\n' +
                '  ?augmentingTreatment dc:date ?augmentingDate . \n' +
                '  ?definingTreatment treat:definesTaxonConcept ?tc .\n' +
                '  ?definingTreatment dc:creator ?definingTreatmentCreator .\n' +
                '  ?definingTreatment dc:date ?definingDate . \n' +
                '} WHERE { \n' +
                '  ?tc dwc:rank ?rank .\n' +
                '  ?tc dwc:phylum ?phylum .\n' +
                '  ?tc dwc:kingdom ?kingdom .\n' +
                '  ?tc dwc:class ?class .\n' +
                '  ?tc dwc:family ?family .\n' +
                '  ?tc dwc:order ?oder .\n' +
                '  ?tc dwc:genus "' + genus + '" .\n' +
                '  ?tc dwc:species "' + species + '" .\n' +
                '  ?tc a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> . \n' +
                '  OPTIONAL { ?tc treat:hasTaxonName ?tn . }\n' +
                '  OPTIONAL { ?augmentingTreatment treat:augmentsTaxonConcept ?tc .\n' +
                '    ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .\n' +
                '    OPTIONAL { ?augmentingTreatment treat:publishedIn ?augmentingPubl .\n' +
                '      ?augmentingPubl dc:date ?augmentingDate . }} \n' +
                '  OPTIONAL { ?definingTreatment treat:definesTaxonConcept ?tc .\n' +
                '    ?definingTreatment dc:creator ?definingTreatmentCreator .\n' +
                '    OPTIONAL { ?definingTreatment treat:publishedIn ?definingPubl .\n' +
                '      ?definingPubl dc:date ?definingDate . }} \n' +
                '}'
    return this._sparqlEndpoint.getSparqlRDF(query).then(graph => {
      const tnClass = GraphNode($rdf.sym('http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept'), graph)
      return tnClass.in($rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'))
    })
  }
}
