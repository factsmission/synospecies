<template>
  <div>
    <h1>SynonymGrouper</h1>
    <pre>{{ result }}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SynonymGroup } from '@/SynonymGroup'
import config from '@/config'
import SparqlEndpoint from '@retog/sparql-client'
import { inspect } from 'util'

@Component({})
export default class SynonymGrouper extends Vue {
  constructor () {
    super()
    const sg = new SynonymGroup(new SparqlEndpoint(config.endpoint()), 'Sadayoshia acroporae')
    this.result = inspect(sg.getAllSynonyms())
  }

  result = ''
}
</script>
