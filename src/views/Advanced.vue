<!-- eslint-disable -->
<template dir>
  <div class="home">
  <query-editor query="SELECT ?s ?p ?o WHERE {?s ?p ?o} LIMIT 10"/>
  <hr>
  <query-editor query="CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o} LIMIT 10"/>
  <hr>
  <query-editor>
    <pre>
PREFIX treat: &lt;http://plazi.org/vocab/treatment#>
SELECT DISTINCT * WHERE {
  &lt;http://taxon-concept.plazi.org/id/Animalia/Munida_Man_1888> ((^treat:deprecates/(treat:augmentsTaxonConcept|treat:definesTaxonConcept))|((^treat:augmentsTaxonConcept|^treat:definesTaxonConcept)/treat:deprecates))* ?tc .
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
