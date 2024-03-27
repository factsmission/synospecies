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
          aria-label="Enter taxon name"
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
              :d="icons.mdiCogOutline"
            /></svg>
          </button>
          <div>
            <label><input
              v-model="ignoreRank"
              type="checkbox"
            >Include Subtaxa</label>
            <router-link to="settings">
              App Settings
            </router-link>
          </div>
        </div>
      </div>
      <label
        v-if="!loading && !time"
        for="combinedfield"
      >Enter taxon name</label>
      <div
        v-if="loading || time"
        class="flex"
      >
        <hr>
        <div style="line-height: 2.5rem; padding-left: .5rem;">
          <div v-if="loading">
            Loading
            <dot-spinner />
            (Found {{ jsArray.length }} synonym<span v-if="jsArray.length !== 1">s</span> with {{ syg?.treatments.size || 0 }} treatment<span v-if="syg?.treatments.size !== 1">s</span> so far)
          </div>
          <div v-else-if="time">
            Found {{ jsArray.length }} synonym<span v-if="jsArray.length !== 1">s</span> with {{ syg?.treatments.size || 0 }} treatment<span v-if="syg?.treatments.size !== 1">s</span>, took {{ time }}s
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
              :d="icons.mdiTune"
            /></svg>
          </button>
          <div>
            <label><input
              v-model="openJ"
              type="checkbox"
            >Expand all justifications</label>
            <label><input
              v-model="openT"
              type="checkbox"
            >Expand all treatments</label>
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
          <div
            v-if="!loading && vernacular[taxonName[0]]"
            class="vernaculars"
          >
            <span
              v-if="vernacular[taxonName[0]]?.en"
              class="muted vernacular"
              title="en"
            >{{ vernacular[taxonName[0]]?.en }} </span>
            <span
              v-if="vernacular[taxonName[0]]?.de"
              class="muted vernacular"
              title="de"
            >{{ vernacular[taxonName[0]]?.de }} </span>
            <span
              v-if="vernacular[taxonName[0]]?.es"
              class="muted vernacular"
              title="es"
            >{{ vernacular[taxonName[0]]?.es }} </span>
            <span
              v-if="vernacular[taxonName[0]]?.zh"
              class="muted vernacular"
              title="zh"
            >{{ vernacular[taxonName[0]]?.zh }} </span>
            <span
              v-if="vernacular[taxonName[0]]?.fr"
              class="muted vernacular"
              title="fr"
            >{{ vernacular[taxonName[0]]?.fr }} </span>
            <span
              v-for="[k, name] in Object.entries(vernacular[taxonName[0]] || {}).filter(([key, _]) => (key !== 'en' && key !== 'de' && key !== 'es' && key !== 'zh' && key !== 'fr'))"
              :key="name"
              class="muted vernacular"
              :title="k"
            >{{ name }} </span>
          </div>
        </div>
        <wikidata-buttons :taxon-name="shorten(taxonName[0])" />
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
              <td
                v-if="!trees.has(js.taxonConceptUri)"
                colspan="4"
                class="loading"
              >
                Loading
              </td>
              <td
                v-for="t in trees.get(js.taxonConceptUri)"
                :key="t"
              >
                {{ t }}
              </td>
            </tr>
          </table>
        </div>
        <h2 v-if="js.taxonConceptAuthority">
          {{ shorten(js.taxonName.uri) }}
          <span class="muted">{{ js.taxonConceptAuthority }}</span>
        </h2>
        <h2 v-else>
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
      <div
        v-if="!taxonName[1].length"
        class="muted card"
      >
        No taxon concept found for this taxon name
      </div>
      <div
        v-if="treatsTaxonName.get(taxonName[0])?.length"
        class="trl"
      >
        Other treatments treating or citing this taxon name:
        <ul class="nobullet">
          <treatment-line
            v-for="t in treatsTaxonName.get(taxonName[0])"
            :key="t.url"
            type="cite"
            :treat="t"
          />
        </ul>
      </div>
    </div>
    <hr v-if="jsArray.length">
    <image-splash
      v-if="jsArray.length"
      :taxamanager="taxamanager"
      :taxa="jsArray.map(t => ({ url: t.taxonConceptUri }))"
    />
  </main>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SynonymGroup, { SparqlEndpoint } from '@factsmission/synogroup'
import type { default as syg, anyJustification, MaterialCitation, Treatment, TreatmentDetails } from '@factsmission/synogroup'
import type { SyncJustifiedSynonym, SyncTreatment, SyncTreatments } from '@/utilities/SynogroupSync'
import { getEndpoint } from '@/utilities/config'
import { mdiCogOutline, mdiTune } from '@mdi/js'
import JustificationView from '@/components/JustificationView.vue'
import TreatmentsView from '@/components/TreatmentsView.vue'
import TreatmentLine from '@/components/TreatmentLine.vue'
import Timeline from '@/components/Timeline.vue'
import ImageSplash from '@/components/ImageSplash.vue'
import DotSpinner from '@/components/DotSpinner.vue'
import WikidataButtons from '@/components/WikidataButtons.vue'
import Taxomplete from 'taxomplete'
import CitedMaterials from '@/components/CitedMaterials.vue';

// do not use this for new stuff - temporarly added to integrate ImageSplash easily
import TaxaManager from '@/TaxaManager'

@Component({
  components: {
    CitedMaterials,
    JustificationView,
    TreatmentsView,
    TreatmentLine,
    Timeline,
    ImageSplash,
    DotSpinner,
    WikidataButtons
  }
})
export default class Home extends Vue {
  @Prop() s?: string
  respondToRouteChanges = true
  endpoint = new SparqlEndpoint(getEndpoint())
  taxomplete!: Taxomplete
  input = ''
  ignoreRank = false
  jsArray: SyncJustifiedSynonym[] = []
  result: Map<string, SyncJustifiedSynonym[]> = new Map()
  treatsTaxonName: Map<string, SyncTreatment[]> = new Map()
  loading = false
  settingsOpen = false
  tunerOpen = false
  openJ = false
  openT = open
  time = ''
  syg?: syg;
  icons = {
    mdiCogOutline,
    mdiTune
  }

  //         tc-uri : phylum  class   order   family
  trees: Map<string, [string, string, string, string]> = new Map()

  //                 tn-uri:       { lang : name  }
  vernacular: Record<string, Record<string, string> | null> = {};

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
          const tree = ['phylum', 'class', 'order', 'family'].map(r => result?.[r] ? result[r].value : '') as [string, string, string, string]
          this.trees.set(tcuri, tree)
          return tree
        })
    }
  }

  async getVernacular(tnuri: string): Promise<void> {
    if (this.vernacular[tnuri] === null) {
      return;
    } else {
      this.vernacular[tnuri] = null;
      const query =
        `SELECT DISTINCT ?n WHERE { <${tnuri}> <http://rs.tdwg.org/dwc/terms/vernacularName> ?n . }`
      return this.endpoint.getSparqlResultSet(query)
        .then(json => json.results.bindings)
        .then(bindings => {
          if (bindings.length) {
            const m: Record<string, string> = {};
            for (const n of bindings) {
              console.log(n, n.n["xml:lang"], n.n.value);
              if (n.n["xml:lang"] && n.n.value) m[n.n["xml:lang"]] = n.n.value;
            }
            this.vernacular[tnuri] = m;
          }
        })
    }
  }

  getMaterialCitations(treat: { url: string, creators: string, date?: number, title?: string }, taxonName: string): Promise<void> {
    const query = `
    PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
    SELECT DISTINCT *
    WHERE {
      <${treat.url}> dwc:basisOfRecord ?mc .
      ?mc dwc:catalogNumber ?catalogNumber .
      OPTIONAL { ?mc dwc:collectionCode ?collectionCode . }
      OPTIONAL { ?mc dwc:typeStatus ?typeStatus . }
      OPTIONAL { ?mc dwc:countryCode ?countryCode . }
      OPTIONAL { ?mc dwc:stateProvince ?stateProvince . }
      OPTIONAL { ?mc dwc:municipality ?municipality . }
      OPTIONAL { ?mc dwc:county ?county . }
      OPTIONAL { ?mc dwc:locality ?locality . }
      OPTIONAL { ?mc dwc:verbatimLocality ?verbatimLocality . }
      OPTIONAL { ?mc dwc:recordedBy ?recordedBy . }
      OPTIONAL { ?mc dwc:eventDate ?eventDate . }
      OPTIONAL { ?mc dwc:samplingProtocol ?samplingProtocol . }
      OPTIONAL { ?mc dwc:decimalLatitude ?decimalLatitude . }
      OPTIONAL { ?mc dwc:decimalLongitude ?decimalLongitude . }
      OPTIONAL { ?mc dwc:verbatimElevation ?verbatimElevation . }
    }`;
    return this.endpoint.getSparqlResultSet(query).then(
      (json) => {
        const resultArray: MaterialCitation[] = []
        json.results.bindings.forEach((t) => {
          if (!t.mc || !t.catalogNumber) return;
          const result = {
            "catalogNumber": t.catalogNumber.value,
            "collectionCode": t.collectionCode?.value || undefined,
            "typeStatus": t.typeStatus?.value || undefined,
            "countryCode": t.countryCode?.value || undefined,
            "stateProvince": t.stateProvince?.value || undefined,
            "municipality": t.municipality?.value || undefined,
            "county": t.county?.value || undefined,
            "locality": t.locality?.value || undefined,
            "verbatimLocality": t.verbatimLocality?.value || undefined,
            "recordedBy": t.recordedBy?.value || undefined,
            "eventDate": t.eventDate?.value || undefined,
            "samplingProtocol": t.samplingProtocol?.value || undefined,
            "decimalLatitude": t.decimalLatitude?.value || undefined,
            "decimalLongitude": t.decimalLongitude?.value || undefined,
            "verbatimElevation": t.verbatimElevation?.value || undefined,
          }
          resultArray.push(result)
        })
        const details: TreatmentDetails = { date: treat.date, creators: treat.creators, title: treat.title, materialCitations: resultArray };
        if (this.treatsTaxonName.has(taxonName))
          this.treatsTaxonName.get(taxonName)?.push({ url: treat.url, details } as SyncTreatment)
        else this.treatsTaxonName.set(taxonName, [({ url: treat.url, details } as SyncTreatment)])
      })
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
    this.treatsTaxonName = new Map()
    this.loading = true
    if (this.syg) {
      this.syg.abort()
    }
    this.syg = new SynonymGroup(this.endpoint, this.input, this.ignoreRank)
    const t0 = performance.now()
    const promises: Promise<string>[] = []
    for await (const justSyn of this.syg) {
      const { taxonConceptUri, taxonName, justifications, treatments } = justSyn
      const justs: anyJustification[] = []
      const treats: SyncTreatments = { def: [], aug: [], dpr: [], cite: [] }
      const js = { ...justSyn, justifications: justs, treatments: treats, loading: true }
      this.jsArray.push(js)

      const resultArr = this.result.get(taxonName.uri)
      const jsPromises: Promise<void>[] = []
      if (resultArr) {
        resultArr.push(js)
      } else {
        this.result.set(taxonName.uri, [js]);
        // TODO new taxon name -> look for generic treatments
        jsPromises.push((async () => {
          this.getVernacular(taxonName.uri);
        })());
        if (!this.treatsTaxonName.has(taxonName.uri)) this.treatsTaxonName.set(taxonName.uri, []);
        for (const treat of js.taxonName.treatments.aug) {
          (this.treatsTaxonName.get(taxonName.uri) as SyncTreatment[]).push({ ...treat, details: await treat.details });
        }
        for (const treat of js.taxonName.treatments.cite) {
          (this.treatsTaxonName.get(taxonName.uri) as SyncTreatment[]).push({ ...treat, details: await treat.details });
        }
      }
      this.getTree(js.taxonConceptUri)
      jsPromises.push(
        (async () => {
          for await (const just of justifications) {
            justs.push(just)
          }
        })())

      const handleTreatment = async (treat: Treatment, where: "def"|"aug"|"dpr"|"cite") => {
        const sct = {...treat, details: await treat.details} as SyncTreatment;
        treats[where].push(sct);
        treats[where].sort((a,b) => {
          const year_a = a.details.date || 0;
          const year_b = b.details.date || 0;
          if (year_a == year_b) {
            return (a.details.creators ?? "").localeCompare((b.details.creators ?? ""), undefined, { numeric: true }); // Sort alphabetically
          }
          return year_a - year_b;
        })
      }

      jsPromises.push(
        (async () => {
          for (const treat of treatments.def) {
            await handleTreatment(treat, "def")
          }
        })())
      jsPromises.push(
        (async () => {
          for (const treat of treatments.aug) {
            await handleTreatment(treat, "aug")
          }
        })())
      jsPromises.push(
        (async () => {
          for (const treat of treatments.dpr) {
            await handleTreatment(treat, "dpr")
          }
        })())
      jsPromises.push(
        (async () => {
          for (const treat of treatments.cite) {
            await handleTreatment(treat, "cite")
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
    if (this.jsArray.length === 0) await this.noSuchTaxonConcept();
    console.log('%call settled', 'color: green; font-weight: bold;') // eslint-disable-line no-console
    this.loading = false
    this.time = ((performance.now() - t0) / 1000).toFixed(2)
  }

  async noSuchTaxonConcept() {
    const [genus, species, subspecies] = this.input.split(" ");
    const query = `
PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
SELECT DISTINCT ?tn WHERE {
  ?tn dwc:genus "${genus}";
    ${species ? `dwc:species "${species}";` : ""}
    ${subspecies ? `(dwc:subspecies|dwc:variety) "${subspecies}";` : ""}
      ${this.ignoreRank || !!subspecies
        ? ""
        : `dwc:rank "${species ? "species" : "genus"}";`
      }
      a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonName>.
}`;
    const json = await this.endpoint.getSparqlResultSet(query);
    const bindings = (json.results.bindings as { [key: string]: { type: string; value: string; }; }[]);
    const jsPromises: Promise<void>[] = [];
    bindings.filter(t => t.tn?.value)
        .map((t) => {
          const taxonNameUri = t.tn.value;
          const resultArr = this.result.get(taxonNameUri);
          if (!resultArr) {
            this.result.set(taxonNameUri, []);
            // TODO new taxon name -> look for generic treatments
            jsPromises.push((async () => {
              await this.getVernacular(taxonNameUri);
            })());
            jsPromises.push(
              (async () => {
                const query = `PREFIX treat: <http://plazi.org/vocab/treatment#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
SELECT DISTINCT ?treat ?date (group_concat(DISTINCT ?creator;separator="; ") as ?creators)
WHERE {
  ?treat a treat:Treatment ;
    (treat:citesTaxonName|treat:treatsTaxonName) <${taxonNameUri}> ;
    dc:creator ?creator .
  OPTIONAL {
    ?treat treat:publishedIn ?publ .
    ?publ dc:date ?date .
  }
}
GROUP BY ?treat ?date`;
                const json = await this.endpoint.getSparqlResultSet(query);
                const treats = json.results.bindings
                for (const treat of treats) {
                  await this.getMaterialCitations({
                    url: treat["treat"].value,
                    date: treat["date"]?.value ? parseInt(treat["date"].value) : undefined,
                    creators: treat["creators"].value
                  }, taxonNameUri);
                }
              })());
          }
        });
    return await Promise.allSettled(jsPromises);
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
.trl {
  padding-inline-start: 1rem;
  padding-block-end: 1rem;
}

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

.title {
  opacity: 0.6;
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
  color: #666666;
}

.vernaculars {
  line-height: 1;
  text-wrap: balance;
  font-size: 0.8rem;
}

.vernacular + .vernacular::before {
  content: "/ ";
}

main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &.splash {
    justify-content: center;

    h1 {
      text-align: center;
    }
  }
}
</style>
