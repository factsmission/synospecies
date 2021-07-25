<template>
  <div>
    <h1>SynoSpecies</h1>
    <div class="card notice"><b>Beta:</b> This is under development. Looks and behavior will change.</div>
    <div class="flex-row">
      <label for="combinedfield">Input Genus and species here:</label>
      <input type="text" v-model="input" id="combinedfield" placeholder="Sadayoshia acroporae" />
      <!--<input type="text" @keyup.enter="updateSG">-->
      <button @click="updateSG">Go</button>
      <label><input type="checkbox" v-model="openJ">Expand all Justifications</label>
      <label><input type="checkbox" v-model="openT">Expand all Treatments</label>
    </div>
    <div v-if="loading" class="card"><spinner class="center"/></div>
    <div v-else class="card" style="line-height: 1rem;">
      {{ result.length }} results, took {{ time }}s
    </div>
    <div class="card" v-for="js in result" :key="js.taxonConceptUri">
      <h2>
        <a :href="js.taxonConceptUri">{{ shorten(js.taxonConceptUri) }}</a>
      </h2>
      <a :href="js.taxonNameUri">{{ shorten(js.taxonNameUri) }}</a>
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
import Taxomplete from 'taxomplete'

@Component({
  components: {
    JustificationView,
    TreatmentsView,
    Spinner
  }
})
export default class SynonymGrouper extends Vue {
  endpoint = new SparqlEndpoint(config.endpoint())
  taxomplete!: Taxomplete
  input = 'Sadayoshia acroporae'
  result: JustifiedSynonym[] = []
  sg?: SynonymGroup
  loading = false
  openJ = false
  openT = false
  time = '-'

  shorten (uri: string, bracket?: boolean) {
    let temp = bracket ? uri.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g, (_, g) => `[${g}]`) : uri
    const index = ~temp.indexOf(']') ? temp.indexOf(']') + 2 : 0
    temp = temp.substring(index)
    return temp.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\//g, '').replace(/\/|_/g, ' ')
  }

  updateSG () {
    this.result = []
    this.loading = true
    const t0 = performance.now()
    SynonymGroupBuilder(this.endpoint, this.input, this.result).then(sg => {
      this.loading = false
      this.time = ((performance.now() - t0) / 1000).toFixed(2)
      // this.sg = sg
      // this.result = sg.getAllSynonyms()
    })
  }

  mounted () {
    const input = document.getElementById('combinedfield') as HTMLInputElement
    this.taxomplete = new Taxomplete(input, this.endpoint)
    this.taxomplete.action = (val: string) => {
      this.input = val
      this.updateSG()
    }
    if (!this.input && window.location.hash) {
      this.input = window.location.hash.substring(1).replace('+', ' ')
      this.taxomplete.lookup()
    }
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

.card h2 {
  margin: -0.25rem 0 0.25rem;
  font-weight: 600;
  font-size: 1.25rem;
}
</style>
