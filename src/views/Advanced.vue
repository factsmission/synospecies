<template>
  <div class="home">
    <img alt="Plazi logo" src="../assets/logo.png">
    <query-editor query="SELECT * WHERE {?s ?p ?o} LIMIT 10"/>
    <hr>
    <query-editor query="CONSTRUCT {?s ?p ?o} WHERE {?s ?p ?o} LIMIT 10"/>
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
