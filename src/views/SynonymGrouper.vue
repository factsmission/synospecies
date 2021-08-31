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
            ({{ jsArray.length }} result(s) so far)
          </div>
          <div v-else-if="time">
            {{ jsArray.length }} result(s), took {{ time }}s
          </div>
        </div>
        <div class="dropdown" :data-open="tunerOpen">
          <button class="icon" @click="tunerOpen = !tunerOpen" aria-label="Search Settings" :disabled="!time && !loading">
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
      v-if="jsArray.length > 0"
      :result="jsArray"
    />
    <div v-for="taxonName in result" :key="taxonName[0]">
      <span class="muted">{{ kingdom(taxonName[0]) }}</span> {{ shorten(taxonName[0]) }}
      <div :class="js.treatments.dpr.length ? 'card deprecated' : 'card'" v-for="js in taxonName[1]" :key="js.taxonConceptUri">
        <h2>
          <a :href="js.taxonConceptUri">{{ shorten(js.taxonConceptUri) }}</a>
        </h2>
        <details :open="openJ">
          <summary>
            {{ js.justifications.length === 1 ? 'Justification' : `Justifications (${js.justifications.length})` }}
          </summary>
          <justification-view :js="js"/>
        </details>
        <treatments-view :js="js" :open="openT"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { anyJustification, SyncJustifiedSynonym, SyncTreatments, SynonymGroup } from '@factsmission/synogroup'
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
  jsArray: SyncJustifiedSynonym[] = []
  result: Map<string, SyncJustifiedSynonym[]> = new Map()
  loading = false
  settingsOpen = false
  tunerOpen = false
  openJ = false
  openT = false
  time = ''
  syg: SynonymGroup|null = null

  kingdom (uri: string) {
    return (uri.match(/http:\/\/taxon-name\.plazi\.org\/id\/([^/]*)\//) || [])[1]
  }

  shorten (uri: string, bracket?: boolean) {
    let temp = bracket ? uri.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g, (_, g) => `[${g}]`) : uri
    const index = ~temp.indexOf(']') ? temp.indexOf(']') + 2 : 0
    temp = temp.substring(index)
    return temp.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^/]*\//g, '').replace(/\/|_/g, ' ')
  }

  async updateSG () {
    if (!this.input) this.input = 'Sadayoshia acamar'
    this.jsArray = []
    this.result = new Map()
    this.loading = true
    if (this.syg) {
      this.syg.abort()
    }
    this.syg = new SynonymGroup(this.endpoint, this.input, this.ignoreRank)
    const t0 = performance.now()
    const promises: Promise<any>[] = []
    for await (const { taxonConceptUri, taxonNameUri, justifications, treatments, loading } of this.syg) {
      console.groupCollapsed(taxonConceptUri.slice(-10))
      const justs: anyJustification[] = []
      const treats: SyncTreatments = { def: [], aug: [], dpr: [] }
      const js = { taxonConceptUri, taxonNameUri, justifications: justs, treatments: treats, loading }
      this.jsArray.push(js)
      const resultArr = this.result.get(taxonNameUri)
      if (resultArr) {
        resultArr.push(js)
      } else {
        this.result.set(taxonNameUri, [js])
      }
      promises.push(
        (async () => {
          for await (const just of justifications) {
            justs.push(just)
          }
          console.log(taxonConceptUri.slice(-10), 'JUST done')
        })())
      promises.push(
        (async () => {
          console.log('BBB')
          for await (const treat of treatments.def) {
            console.log(taxonConceptUri.slice(-10), 'def', treat)
            treats.def.push(treat)
          }
          console.log(taxonConceptUri.slice(-10), 'DEF  done')
        })())
      promises.push(
        (async () => {
          console.log('CCC')
          for await (const treat of treatments.aug) {
            console.log(taxonConceptUri.slice(-10), 'aug', treat)
            treats.aug.push(treat)
          }
          console.log(taxonConceptUri.slice(-10), 'AUG  done')
        })())
      promises.push(
        (async () => {
          console.log('DDD')
          for await (const treat of treatments.dpr) {
            console.log(taxonConceptUri.slice(-10), 'dpr', treat)
            treats.dpr.push(treat)
          }
          console.log(taxonConceptUri.slice(-10), 'DPR  done')
        })())
      console.groupEnd()
    }
    await Promise.allSettled(promises)
    this.loading = false
    this.time = ((performance.now() - t0) / 1000).toFixed(2)
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

.deprecated {
  background: repeating-linear-gradient(
  -55deg,
  #f3c6c1,
  #f3c6c1 1px,
  #fbe9e7 1px,
  #fbe9e7 .25rem
  );
}

.muted {
  color: gray;
}
</style>
