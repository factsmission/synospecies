<!-- eslint-disable -->
<template dir>
  <div class="home">
  <h2>Retrieving triples</h2>
  This query retrieves 10 arbitrary triples from the SPARQL endpoint.
  <query-editor query="SELECT ?s ?p ?o WHERE {?s ?p ?o} LIMIT 10"/>
  <hr>
  <h2>All synonyms</h2>
  This query returns all synonyms of 
  <code>&lt;http://taxon-concept.plazi.org/id/Animalia/Tyrannosaurus_rex_Osborn_1905></code>.
  It uses a transitive property path to get the taxa (Taxon-Concepts) 
  augmented or defined by a treatmented that deprecates this taxon or that are
  deprecated by a treatement that defines or deprecates this taxon.
  <query-editor>
    <pre>
PREFIX treat: &lt;http://plazi.org/vocab/treatment#>
SELECT DISTINCT * WHERE {
  &lt;http://taxon-concept.plazi.org/id/Animalia/Tyrannosaurus_rex_Osborn_1905> ((^treat:deprecates/(treat:augmentsTaxonConcept|treat:definesTaxonConcept))|((^treat:augmentsTaxonConcept|^treat:definesTaxonConcept)/treat:deprecates))* ?tc .
}
    </pre>
  </query-editor>
    <hr>
  <h2>Find homonyms</h2>
  Find binomens that exist both as Animalia as well as Plantae
  <query-editor>
    <pre>
SELECT DISTINCT *
WHERE {
  ?s1 a &lt;http://filteredpush.org/ontologies/oa/dwcFP#TaxonName>;
  &lt;http://rs.tdwg.org/dwc/terms/kingdom> "Plantae";
  &lt;http://rs.tdwg.org/dwc/terms/genus> ?gn;
  &lt;http://rs.tdwg.org/dwc/terms/species> ?sp;
  &lt;http://rs.tdwg.org/dwc/terms/rank> "species".
  ?s2 a &lt;http://filteredpush.org/ontologies/oa/dwcFP#TaxonName>;
  &lt;http://rs.tdwg.org/dwc/terms/kingdom> "Animalia";
  &lt;http://rs.tdwg.org/dwc/terms/genus> ?gn;
  &lt;http://rs.tdwg.org/dwc/terms/species> ?sp;
  &lt;http://rs.tdwg.org/dwc/terms/rank> "species".
}
    </pre>
  </query-editor>
    <hr>
  <h2>Find kingdoms</h2>
  Find all kingdoms and one sample taxon-name from within each.
  <query-editor>
    <pre>
SELECT DISTINCT ?k (SAMPLE(?s1) as ?s)
WHERE {
  ?s1 a &lt;http://filteredpush.org/ontologies/oa/dwcFP#TaxonName>;
  &lt;http://rs.tdwg.org/dwc/terms/kingdom> ?k.
}
GROUP BY ?k
    </pre>
  </query-editor>
    <hr>
  <h2>Largest graphs</h2>
  This query returns the 10 largest graphs on the SPARQL endpoint.
  <query-editor>
    <pre>
SELECT DISTINCT ?g (COUNT(?sub) AS ?size) WHERE {
  GRAPH ?g {?sub ?pred ?obj .}
} GROUP BY ?g
ORDER BY DESC(?size)
LIMIT 10
    </pre>
  </query-editor>
    <hr>
  <h2>Single graph</h2>
  This query returns the triples of a single graphs.
  <query-editor>
    <pre>
CONSTRUCT {?s ?p ?o} { GRAPH &lt;https://raw.githubusercontent.com/plazi/treatments-rdf/master/8E33E30FFFD9FFCC4AD302B2FFB04209> {?s ?p ?o} }
    </pre>
  </query-editor>
  <hr>
  <h2>Unusual names</h2>
  This query returns genus with contain a non-alphanumeric character 
  (note that this includes genus with white-spaces which are not visible in the
  table-results, you might want to switch to the raw response view).
  <query-editor>
    <pre>
PREFIX rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dwc: &lt;http://rs.tdwg.org/dwc/terms/>
PREFIX dwcfp: &lt;http://filteredpush.org/ontologies/oa/dwcFP#>
SELECT DISTINCT ?graph ?genus WHERE { 
  GRAPH ?graph {
    ?sub dwc:genus ?genus .
    ?sub dwc:species ?species .
    ?sub rdf:type dwcfp:TaxonName.
    FILTER regex(?genus, "[^a-zA-Z0-9s|]")
  }
} ORDER BY UCASE(?genus) LIMIT 100
    </pre>
  </query-editor>
  <h2>Treatments by genus</h2>
  <query-editor>
    <pre>
PREFIX dwc: &lt;http://rs.tdwg.org/dwc/terms/>
PREFIX treat: &lt;http://plazi.org/vocab/treatment#>
PREFIX dc: &lt;http://purl.org/dc/elements/1.1/>
SELECT * WHERE { 
  ?tc dwc:rank ?rank .
  ?tc dwc:phylum ?phylum .
  ?tc dwc:kingdom ?kingdom .
  ?tc dwc:class ?class .
  ?tc dwc:family ?family .
  ?tc dwc:order ?oder .
  ?tc dwc:genus "Lestes" .
  ?tc a &lt;http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept> . 
  OPTIONAL { ?tc treat:hasTaxonName ?tn . }
  OPTIONAL { ?augmentingTreatment treat:augmentsTaxonConcept ?tc . 
  ?augmentingTreatment dc:creator ?augmentingTreatmentCreator .}
  OPTIONAL { ?definingTreatment treat:definesTaxonConcept ?tc . 
  ?definingTreatment dc:creator ?definingTreatmentCreator .}
}
    </pre>
  </query-editor>
  <h2>Count quads</h2>
  <query-editor>
    SELECT (COUNT(*) AS ?quads) WHERE { GRAPH ?g { ?s ?p ?o } }
  </query-editor>

  <h2>Count triples</h2>
  <query-editor>
    SELECT (COUNT(DISTINCT *) AS ?triples) WHERE {?s ?p ?o } 
  </query-editor>
  <hr>
  <h2>Union</h2>
  This query is faster than the property-paths version on Fuseki but slower with allegro 6
  <query-editor>
    <pre>
PREFIX franzOption_memoryLimit: &lt;franz:15G> 
PREFIX treat: &lt;http://plazi.org/vocab/treatment#>
PREFIX dwc: &lt;http://rs.tdwg.org/dwc/terms/>
PREFIX dc: &lt;http://purl.org/dc/elements/1.1/>
SELECT * WHERE { 
  ?treatment treat:deprecates &lt;http://taxon-concept.plazi.org/id/Animalia/Sadayoshia_miyakei_Baba_1969>.
  { 
    ?treatment treat:augmentsTaxonConcept ?tc . 
  } UNION { 
    ?treatment treat:definesTaxonConcept ?tc . 
  }
  ?tc dwc:kingdom ?kingdom .
  ?tc dwc:class ?class .
  ?tc dwc:family ?family .
  ?tc dwc:order ?oder .
  ?tc dwc:genus ?genus .
  ?treatment ?treatmentTaxonRelation ?tc .

} 
    </pre>
  </query-editor>
  </div>
</template>

<script>
import QueryEditor from '@/components/QueryEditor.vue'

export default {
  name: 'home',
  components: {
    QueryEditor
  }
}
</script>

<style scoped>
 p {
   white-space: pre;
   background: red;
 }
</style>
