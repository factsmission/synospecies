// eslint-disable
import $rdf from 'ext-rdflib'
import GraphNode from 'rdfgraphnode-rdfext'
import SparqlEndpoint from '@retog/sparql-client'

export default class TaxaManager {
  constructor (sparqlEndpoint) {
    this._sparqlEndpoint = sparqlEndpoint
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
