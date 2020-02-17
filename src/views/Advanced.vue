<!-- eslint-disable -->
<template dir>
  <div class="home">
  <query-editor query="SELECT ?s ?p ?o WHERE {?s ?p ?o} LIMIT 10"/>
  <hr>
  <query-editor query="CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o} LIMIT 10"/>
  <hr>
  <h2>All synonyms</h2>
  <query-editor>
    <pre>
PREFIX treat: &lt;http://plazi.org/vocab/treatment#>
SELECT DISTINCT * WHERE {
  &lt;http://taxon-concept.plazi.org/id/Animalia/Munida_Man_1888> ((^treat:deprecates/(treat:augmentsTaxonConcept|treat:definesTaxonConcept))|((^treat:augmentsTaxonConcept|^treat:definesTaxonConcept)/treat:deprecates))* ?tc .
}
    </pre>
  </query-editor>
  <hr>
  <h2>Union</h2>
  This query is faster than the property-paths verison on Fuseki but slower with allegro 6
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
    <hr>
  <h2>Largest graphs</h2>
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
  <query-editor>
    <pre>
CONSTRUCT {?s ?p ?o} { GRAPH &lt;https://raw.githubusercontent.com/plazi/treatments-rdf/master/8E33E30FFFD9FFCC4AD302B2FFB04209> {?s ?p ?o} }
    </pre>
  </query-editor>
  <hr>
  <h2>Unusual names</h2>
  <query-editor>
    <pre>
PREFIX rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dwc: &lt;http://rs.tdwg.org/dwc/terms/>
PREFIX dwcfp: &lt;http://filteredpush.org/ontologies/oa/dwcFP#>
SELECT DISTINCT ?graph ?genus WHERE { GRAPH ?graph {
?sub dwc:genus ?genus .
?sub dwc:species ?species .
?sub rdf:type dwcfp:TaxonName.
  FILTER regex(?genus, "[^a-zA-Z0-9s|]")
  }
  } ORDER BY UCASE(?genus) LIMIT 100
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
