<template>
  <main :class="loading || time ? 'container' : 'container splash'">
    <div class="form">
      <h1>SynoSpecies</h1>
      <div class="flex">
        <input
          id="combinedfield"
          v-model="input"
          type="text"
          placeholder="Sadayoshia acamar"
          aria-label="Enter Taxon Name"
        >
        <button
          class="go"
          @click="updateSG"
        >
          Go
        </button>
        <div
          class="dropdown"
          :data-open="settingsOpen"
        >
          <button
            class="icon"
            aria-label="Search Settings"
            @click="settingsOpen = !settingsOpen"
          >
            <svg
              role="presentation"
              viewBox="0 0 24 24"
            ><path
              fill="currentcolor"
              :d="$icons.mdiCogOutline"
            /></svg>
          </button>
          <div>
            <label><input
              v-model="ignoreRank"
              type="checkbox"
            >Include Subtaxa</label>
            <router-link to="settings">All Settings</router-link>
          </div>
        </div>
      </div>
      <label v-if="!loading && !time" for="combinedfield">Enter Taxon Name</label>
      <div class="flex" v-if="loading || time">
        <hr>
        <div style="line-height: 2.5rem; padding-left: .5rem;">
          <div v-if="loading">
            Loading
            <spinner />
            ({{ jsArray.length }} result(s) so far)
          </div>
          <div v-else-if="time">
            {{ jsArray.length }} result(s), took {{ time }}s
          </div>
        </div>
        <div
          class="dropdown"
          :data-open="tunerOpen"
        >
          <button
            class="icon"
            aria-label="Search Settings"
            :disabled="!time && !loading"
            @click="tunerOpen = !tunerOpen"
          >
            <svg
              role="presentation"
              viewBox="0 0 24 24"
            ><path
              fill="currentcolor"
              :d="$icons.mdiTune"
            /></svg>
          </button>
          <div>
            <label><input
              v-model="openJ"
              type="checkbox"
            >Expand all Justifications</label>
            <label><input
              v-model="openT"
              type="checkbox"
            >Expand all Treatments</label>
          </div>
        </div>
      </div>
    </div>
    <timeline
      v-if="jsArray.length > 0"
      :result="jsArray"
    />
    <div
      v-for="taxonName in result"
      :key="taxonName[0]"
    >
      <div class="flex">
        <div class="bottom-align">
          <span class="muted">{{ kingdom(taxonName[0]) }}</span>
          {{ shorten(taxonName[0]) }}
        </div>
        <wikidata-buttons :taxonName="shorten(taxonName[0])" />
      </div>
      <div
        v-for="js in taxonName[1]"
        :key="js.taxonConceptUri"
        :class="js.treatments.dpr.length ? 'card deprecated' : 'card'"
      >
        <div class="tree">
          <table>
            <tr>
              <th>Phylum</th><th>Class</th><th>Order</th><th>Family</th>
            </tr>
            <tr>
              <td v-if="!trees.has(js.taxonConceptUri)" colspan="4" class="loading">Loading</td>
              <td v-for="t in trees.get(js.taxonConceptUri)" :key="t">{{ t }}</td>
            </tr>
          </table>
        </div>
        <h2>
          {{ shorten(js.taxonConceptUri) }}
        </h2>
        <details :open="openJ">
          <summary>
            {{ js.justifications.length === 1 ? 'Justification' : `Justifications (${js.justifications.length})` }}
          </summary>
          <justification-view :js="js" />
        </details>
        <treatments-view
          :js="js"
          :open="openT"
        />
      </div>
    </div>
    <hr v-if="jsArray.length">
    <image-splash
      v-if="jsArray.length"
      :taxamanager="taxamanager"
      :taxa="jsArray.map(t => ({ url: t.taxonConceptUri }))"
    />

    <div class="footer" v-if="jsArray.length > 0">
      <small style="opacity:0.6;">
        The Wikidata logo, Wikipedia 'W' icon, Wikispecies logo and Wikimedia Commons logo are trademarks of the <a href="https://wikimediafoundation.org/">Wikimedia Foundation</a> and are used with the permission of the Wikimedia Foundation. We are not endorsed by or affiliated with the Wikimedia Foundation. The <a href="https://commons.wikimedia.org/wiki/File:Wikispecies-logo.svg">Wikispecies logo</a> by Zephram Stark is licensed under <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en">CC BY-SA 3.0</a>
      </small>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import type { anyJustification, MaterialCitation, Treatment } from '@factsmission/synogroup'
import type { SyncJustifiedSynonym, SyncTreatment, SyncTreatments } from '@/utilities/SynogroupSync'
import { getEndpoint } from '@/utilities/config'
import JustificationView from '@/components/JustificationView.vue'
import TreatmentsView from '@/components/TreatmentsView.vue'
import Timeline from '@/components/Timeline.vue'
import ImageSplash from '@/components/ImageSplash.vue'
import Spinner from '@/components/Spinner.vue'
import WikidataButtons from '@/components/WikidataButtons.vue'
import Taxomplete from 'taxomplete'

// do not use this for new stuff - temporarly added to integrate ImageSplash easily
import TaxaManager from '@/TaxaManager'
import { time, trace } from 'console'
import { mdiCached } from '@mdi/js'

@Component({
  components: {
    JustificationView,
    TreatmentsView,
    Timeline,
    ImageSplash,
    Spinner,
    WikidataButtons
  }
})
export default class Home extends Vue {
  @Prop() s?: string
  respondToRouteChanges = true
  endpoint = new window.SparqlEndpoint(getEndpoint())
  taxomplete!: Taxomplete
  input = ''
  ignoreRank = false
  jsArray: SyncJustifiedSynonym[] = []
  result: Map<string, SyncJustifiedSynonym[]> = new Map()
  loading = false
  settingsOpen = false
  tunerOpen = false
  openJ = false
  openT = open
  time = ''
  syg = new window.SynonymGroup(this.endpoint, this.input, this.ignoreRank)


  //         tc-uri : phylum  class   order   family
  trees: Map<string, [string, string, string, string]> = new Map()

  // do not use this for new stuff - temporarly added to integrate ImageSplash easily
  taxamanager = new TaxaManager(this.endpoint)

  async getTree (tcuri: string) {
    if (this.trees.has(tcuri)) {
      return this.trees.get(tcuri)
    } else {
      const query =
`PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
SELECT DISTINCT * WHERE {
  <${tcuri}> dwc:phylum ?phylum; dwc:class ?class; dwc:family ?family; dwc:order ?order.
}`
      return this.endpoint.getSparqlResultSet(query)
        .then(json => json.results.bindings[0])
        .then(result => {
          const tree = ['phylum', 'class', 'order', 'family'].map(r => result[r] ? result[r].value : '') as [string, string, string, string]
          this.trees.set(tcuri, tree)
          return tree
        })
    }
  }

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
    window.location.hash = this.input.replaceAll(' ', '+')
    this.jsArray = []
    this.result = new Map()
    this.loading = true
    if (this.syg) {
      this.syg.abort()
    }
    this.syg = new window.SynonymGroup(this.endpoint, this.input, this.ignoreRank)
    const t0 = performance.now()
    const promises: Promise<any>[] = []
    for await (const justSyn of this.syg) {
      const { taxonConceptUri, taxonNameUri, justifications, treatments } = justSyn
      const justs: anyJustification[] = []
      const treats: SyncTreatments = { def: [], aug: [], dpr: [] }
      const js = { ...justSyn, justifications: justs, treatments: treats }
      this.jsArray.push(js)
      const resultArr = this.result.get(taxonNameUri)
      if (resultArr) {
        resultArr.push(js)
      } else {
        this.result.set(taxonNameUri, [js])
      }
      this.getTree(js.taxonConceptUri)
      const jsPromises: Promise<void>[] = []
      jsPromises.push(
        (async () => {
          for await (const just of justifications) {
            justs.push(just)
          }
        })())

      const handleTreatment = async (treat: Treatment, where: "def"|"aug"|"dpr") => {
        const mc = await treat.materialCitations;
        (treat as any).materialCitations = mc;
        treats[where].push(treat as any);
        treats[where].sort((a,b) => {
          const year_a = a.date || 0;
          const year_b = b.date || 0;
          if (year_a == year_b) {
            return (a.creators ?? "").localeCompare((b.creators ?? ""), undefined, { numeric: true }); // Sort alphabetically
          }
          return year_a - year_b;
        })
      }

      jsPromises.push(
        (async () => {
          for await (const treat of treatments.def) {
            await handleTreatment(treat, "def")
          }
        })())
      jsPromises.push(
        (async () => {
          for await (const treat of treatments.aug) {
            await handleTreatment(treat, "aug")
          }
        })())
      jsPromises.push(
        (async () => {
          for await (const treat of treatments.dpr) {
            await handleTreatment(treat, "dpr")
          }
        })())
      promises.push(
        (async () => {
          await Promise.allSettled(jsPromises)
          console.log(`%c${taxonConceptUri.slice(taxonConceptUri.lastIndexOf('/'))} done`, 'color: gold;') // eslint-disable-line no-console
          js.loading = false
          return taxonConceptUri
        })()
        )
    }
    console.log('awaiting now') // eslint-disable-line no-console
    await Promise.allSettled(promises)
    console.log('%call settled', 'color: green; font-weight: bold;') // eslint-disable-line no-console
    this.loading = false
    this.time = ((performance.now() - t0) / 1000).toFixed(2)
  }

  onHashChanged () {
    if (this.input !== window.location.hash.substring(1).replaceAll('+', ' ')) {
      this.input = window.location.hash.substring(1).replaceAll('+', ' ')
      this.updateSG()
    }
  }

  mounted () {
    const input = document.getElementById('combinedfield') as HTMLInputElement
    this.taxomplete = new Taxomplete(input, this.endpoint)
    this.taxomplete.action = (val: string) => {
      this.input = val
      this.updateSG()
    }
    if (window.location.hash) {
      this.onHashChanged()
    }
    window.addEventListener('hashchange', this.onHashChanged)
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
.bottom-align {
  align-self: end;
}

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

.tree {
  background: #ffffff33;
  border: 1px solid #00000033;
  border-radius: 0.2rem;
  float: right;
  font-size: 0.8rem;
  margin: 0 0 0.5rem 0.5rem;
  max-width: 100%;
  overflow: auto;
  width: auto;

  * {
    background: none;
    border: none;
    white-space: nowrap;
  }

  .loading {
    font-style: italic;
    color: grey;
    text-align: center;
  }

  th {
    font-weight: normal;
    padding: 0.4rem;
  }

  td {
    padding: 0 0.4rem 0.4rem;
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

main {
  display: flex;
  flex-direction: column;
  justify-content: start;

  &.splash {
    justify-content: center;

    h1 {
      text-align: center;
    }
  }
}
</style>
