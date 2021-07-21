<template>
  <div>
    <h1>SynoSpecies</h1>
    <div class="card notice"><b>Beta:</b> This is under development. Looks and behavior will change.</div>
    <div class="flex-row">
      <input type="text" v-model="input" @keyup.enter="updateSG">
      <button @click="updateSG">Go</button>
      <label><input type="checkbox" v-model="openJ">Expand all Justifications</label>
      <label><input type="checkbox" v-model="openT">Expand all Treatments</label>
    </div>
    <div v-if="loading" class="card"><spinner class="center"/></div>
    <div v-else class="card split">
      <b>Taxon Name URI</b>
      <b>Taxon Concept URI</b>
    </div>
    <div class="card" v-for="js in result" :key="js.taxonConceptUri">
      <div class="split">
        <a :href="js.taxonNameUri">{{ shorten(js.taxonNameUri) }}</a>
        <a :href="js.taxonConceptUri">{{ shorten(js.taxonConceptUri) }}</a>
      </div>
      <details :open="openJ">
        <summary>
          Justifications
          ( {{ js.justifications.size }} )
        </summary>
        <justification-view :js="js"/>
      </details>
      <details :open="openT">
        <summary>
          Treatments
          ( {{ js.treatments ? `${js.treatments.def.length} / ${js.treatments.aug.length} / ${js.treatments.dpr.length}` : '0 / 0 / 0' }} )
        </summary>
        <treatments-view :js="js"/>
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
import TreatmentsView from '@/components/TreatmentsView.vue'
import Spinner from '@/components/Spinner.vue'

@Component({
  components: {
    JustificationView,
    TreatmentsView,
    Spinner
  }
})
export default class SynonymGrouper extends Vue {
  endpoint = new SparqlEndpoint(config.endpoint())
  input = 'Sadayoshia acroporae'
  result: JustifiedSynonym[] = []
  sg?: SynonymGroup;
  loading = false
  openJ = false
  openT = true

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
  grid-template-columns: 3fr 4fr;
}

.flex-row>input {
  flex: auto;
}

.center {
  display: block;
  margin: 0 auto;
}

table tr {
  th,
  td {
    text-align: left;
  }
}
</style>
