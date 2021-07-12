<template>
  <div>
    <h1>SynoSpecies</h1>
    <div class="card notice"><b>Beta:</b> This is under development. Looks and behavior will change.</div>
    <div class="flex-row">
      <input type="text" v-model="input" @keyup.enter="updateSG">
      <button @click="updateSG">Go</button>
      <label><input type="checkbox" v-model="openAll">Expand All</label>
    </div>
    <div v-if="loading" class="card">loading...</div>
    <div v-else class="card split">
      <b>Taxon Name URI</b>
      <b>Taxon Concept URI</b>
    </div>
    <div class="card" v-for="js in result" :key="js.taxonConceptUri">
      <div class="split">
        <a :href="js.taxonNameUri">{{ shorten(js.taxonNameUri) }}</a>
        <a :href="js.taxonConceptUri">{{ shorten(js.taxonConceptUri) }}</a>
      </div>
      <details :open="openAll">
        <summary>Justifications</summary>
        <justification-view :js="js"/>
      </details>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SynonymGroupBuilder } from '@/SynonymGroup'
import type { JustifiedSynonym, SynonymGroup } from '@/SynonymGroup'
import config from '@/config'
import SparqlEndpoint from '@retog/sparql-client'
import JustificationView from '@/components/JustificationView.vue'

@Component({
  components: {
    JustificationView
  }
})
export default class SynonymGrouper extends Vue {
  endpoint = new SparqlEndpoint(config.endpoint())
  input = 'Sadayoshia acroporae'
  result: JustifiedSynonym[] = []
  sg?: SynonymGroup;
  loading = ''
  openAll = false

  shorten (uri: string, bracket?: boolean) {
    let temp = bracket ? uri.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g, (_, g) => `[${g}]`) : uri
    const index = ~temp.indexOf(']') ? temp.indexOf(']') + 2 : 0
    temp = temp.substring(index)
    return temp.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\//g, '').replace(/\/|_/g, ' ')
  }

  updateSG () {
    this.result = []
    this.loading = true
    SynonymGroupBuilder(this.endpoint, this.input, this.result).then(sg => {
      this.loading = false
      // this.sg = sg
      // this.result = sg.getAllSynonyms()
    })
  }

  mounted () {
    this.updateSG()
  }
}
</script>

<style lang="scss" scoped>
.split {
  display: flex;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.flex-row>input {
  flex: auto;
}

table tr {
  th,
  td {
    text-align: left;
  }
}
</style>
