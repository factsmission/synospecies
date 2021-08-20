<template>
  <div>
    <h1>SynoSpecies</h1>
    <div class="card notice"><b>Beta:</b> This is under development. Looks and behavior will change.</div>
    <div class="card form">
      <div class="flex">
        <label>Enter Taxon Name</label>
      </div>
      <div class="flex">
        <input type="text" v-model="input" id="combinedfield" placeholder="Sadayoshia acamar" />
        <button class="go" @click="updateSG">Go</button>
        <div class="dropdown" :data-open="settingsOpen">
          <button class="icon" @click="settingsOpen = !settingsOpen" aria-label="Search Settings">
            <svg role="presentation" viewBox="0 0 24 24"><path fill="currentcolor" :d="$icons.mdiCogOutline"></path></svg>
          </button>
          <div>
            <label><input type="checkbox" v-model="ignoreRank">Include Subtaxa</label>
          </div>
        </div>
      </div>
      <hr>
      <div class="flex">
        <div style="line-height: 2.5rem; padding-left: .5rem;">
          <div v-if="loading">
            Loading
            <spinner/>
            ({{ result.length }} result(s) so far)
          </div>
          <div v-else-if="result.length">
            {{ result.length }} result(s), took {{ time }}s
          </div>
        </div>
        <div class="dropdown" :data-open="tunerOpen">
          <button class="icon" @click="tunerOpen = !tunerOpen" aria-label="Search Settings" :disabled="!result.length">
            <svg role="presentation" viewBox="0 0 24 24"><path fill="currentcolor" :d="$icons.mdiTune"></path></svg>
          </button>
          <div>
            <label><input type="checkbox" v-model="openJ">Expand all Justifications</label>
            <label><input type="checkbox" v-model="openT">Expand all Treatments</label>
          </div>
        </div>
      </div>
    </div>
    <timeline
      v-if="result.length > 0"
      :result="result"
    />
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
      <treatments-view :js="js" :open="openT"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { SynonymGroupBuilder } from '@/SynonymGroup'
import type { JustifiedSynonym, SynonymGroup } from '@/SynonymGroup'
import config from '@/config'
import SparqlEndpoint from '@retog/sparql-client'
import JustificationView from '@/components/JustificationView.vue'
import TreatmentsView from '@/components/TreatmentsView.vue'
import Timeline from '@/components/Timeline.vue'
import Spinner from '@/components/Spinner.vue'
import Taxomplete from 'taxomplete'

@Component({
  components: {
    JustificationView,
    TreatmentsView,
    Timeline,
    Spinner
  }
})
export default class SynonymGrouper extends Vue {
  @Prop() s?: string
  endpoint = new SparqlEndpoint(config.endpoint())
  taxomplete!: Taxomplete
  input = ''
  ignoreRank = false
  result: JustifiedSynonym[] = []
  sg?: SynonymGroup
  loading = false
  settingsOpen = false
  tunerOpen = false
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
    if (!this.input) this.input = 'Sadayoshia acamar'
    this.result = []
    this.loading = true
    const t0 = performance.now()
    SynonymGroupBuilder(this.endpoint, this.input, this.result, this.ignoreRank).then(sg => {
      this.loading = false
      this.time = ((performance.now() - t0) / 1000).toFixed(2)
      // this.sg = sg
      // this.result = sg.getAllSynonyms()
    })
  }

  @Watch('s')
  mounted () {
    const input = document.getElementById('combinedfield') as HTMLInputElement
    this.taxomplete = new Taxomplete(input, this.endpoint)
    this.taxomplete.action = (val: string) => {
      this.input = val
      this.updateSG()
    }
    if (this.s) {
      this.input = this.s ?? ''
      this.updateSG()
    }
  }
}
</script>

<style lang="scss">
.awesomplete {
  flex: 1;

  input {
    width: 100%;
    height: 100%;
    border-radius: .25rem 0 0 .25rem;
    border: 1px solid #0000003E;
    border-right: none;
    line-height: 2rem;
  }
}
</style>
<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
}

.form {
  .go {
    border-radius: 0 .25rem .25rem 0;
    border: 1px solid #0000003E;
    line-height: 2rem;
    background: #436c00;
    color: white;
    text-align: center;
    min-width: min(10vw, 5rem);
  }
}

input,
button,
label {
  padding: 0 .5rem;
  font-size: 1rem;
}

.dropdown {
  position: relative;

  & > div {
    visibility: hidden;
    position: absolute;
    width: max-content;
    right: 0;
    top: 2rem;
    background: white;
    border: 1px solid #00000033;
    border-radius: 0.25rem;
    box-shadow: 2px 4px 9px -4px #212121;
    z-index: 990;
    display: flex;
    flex-direction: column;

    & > * {
      padding: .5rem;
    }

    & > * + * {
      border-top: 1px solid #00000033;
    }
  }

  &[data-open] > div {
    visibility: visible;
  }
}

button.icon {
  width: 2.5rem;
  height: 2.5rem;
  display: block;
  padding: .5rem;
  border: none;
  border-radius: 100%;
  background: none;

  &:not([disabled]):hover {
    background-color: #0000003E;
  }

  & svg {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
  }
}

.split {
  display: flex;
  display: grid;
  grid-template-columns: 3fr 4fr;
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
