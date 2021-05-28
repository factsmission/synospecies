<template>
<div>
  <i id="betabtn"><router-link to="/syg">view beta</router-link></i>
  <h1>SynoSpecies</h1>
  <form id="search-form">
    <label for="combinedfield">Input Genus and species here:</label>
    <input type="text" id="combinedfield" placeholder="Sadayoshia acroporae" />
    <button @click.prevent="onClick" id="lookup">Look up</button>
  </form>
  <hr />
  {{ message }}
  <timeline
    v-if="taxa.length > 0"
    :taxa="taxa"
    :years="years"
  />
  <hr />
  <taxon-reports
    :taxa="taxa"
    :taxamanager="taxamanager"
    ref="taxonreports"
  />
  <hr />
  <image-splash
    :taxa="taxa"
    :taxamanager="taxamanager"
  />
  <hr />
  <div class="section" id="vernacular-area"></div>
  <div class="section" id="wikidata-area"></div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import SparqlEndpoint from '@retog/sparql-client'

import Timeline from '@/components/Timeline.vue'
import ImageSplash from '@/components/ImageSplash.vue'

import WikidataViewer from '@/WikidataViewer'
import VernacularViewer from '@/VernacularViewer'
import TaxaManager from '@/TaxaManager'
import TaxonReports from '@/components/TaxonReports.vue'
import Taxomplete from 'taxomplete'
import config from '@/config'

type SparqlJson = {
  head: {
    vars: string[];
  };
  results: {
    bindings: { [key: string]: { type: string; value: string } }[];
  };
}

type TLYear = {
  year: number;
  treatments: { data: ('def'|'ass'|'aug'|'dpr'|false)[]; url?: string; creators?: string }[];
}

type Treat = {
  url: string;
  creators?: string;
  year?: number;
}

function getFormattedName (uri: string) {
  const nameSection = uri.substring(uri.lastIndexOf('/') + 1)
  const lastSeparator = nameSection.lastIndexOf('_')
  return nameSection.substring(0, lastSeparator)
    .replace(new RegExp('_', 'g'), ' ') +
    ', ' +
    nameSection.substring(lastSeparator + 1)
}

@Component({
  components: {
    TaxonReports,
    Timeline,
    ImageSplash
  }
})
export default class Classic extends Vue {
  current = {
    genus: null as null|string,
    species: null as null|string
  };

  message = ''

  taxa: {
    url: string;
    def: Treat[];
    aug: Treat[];
    dpr: Treat[];
    loading: boolean;
  }[] = []

  years: (TLYear | 'sep')[] = [];

  taxamanager!: TaxaManager;
  sparqlEndpoint!: SparqlEndpoint;
  taxomplete!: Taxomplete;
  wikidataViewer!: WikidataViewer;
  vernacularViewer!: VernacularViewer;

  onClick () {
    const input = document.getElementById('combinedfield') as HTMLInputElement
    if (!input.value) input.value = 'Sadayoshia acroporae'
    this.taxomplete.lookup()
  }

  relatedTaxonEncountered (genus: string, species: string) {
    // wikidataViewer.addTaxon(genus + ' ' + species)
    // vernacularViewer.addTaxon(genus + ' ' + species)
  }

  beforeMount () {
    const params = new URLSearchParams(window.location.search)

    this.sparqlEndpoint = new SparqlEndpoint(params.get('endpoint') || config.endpoint())
    this.taxamanager = new TaxaManager(this.sparqlEndpoint)
  }

  getData () {
    this.taxamanager.getTaxonConcepts(this.current.genus, this.current.species).then((j: SparqlJson) => {
      if (j.results.bindings.length === 0) {
        this.message = 'No treatment for ' + this.current.genus + ' ' + this.current.species + ' found on Plazi.'
      } else {
        window.location.hash = this.current.genus + '+' + this.current.species
        this.taxa = j.results.bindings.map(t => {
          return { url: t.tc.value, def: [], aug: [], dpr: [], loading: true }
        })
        this.taxa.forEach((taxon) => {
          this.taxamanager.getSynonymsWithTreatments(taxon.url).then((j: SparqlJson) => this.processSynonymsWithTreatments(j, taxon.url))
        })
        this.message = ''
      }
    })
  }

  getHorizontalData (genus: string, species: string) {
    this.taxamanager.getTaxonConcepts(genus, species).then((j: SparqlJson) => {
      if (j.results.bindings.length !== 0) {
        const res = j.results.bindings
          .filter(t => !this.taxa.find(ta => t.tc.value === ta.url))
          .map(t => {
            return { url: t.tc.value, def: [], aug: [], dpr: [], loading: true }
          })
        this.taxa = this.taxa.concat(res)
        res.forEach((taxon) => {
          this.taxamanager.getSynonymsWithTreatments(taxon.url).then((j: SparqlJson) => this.processSynonymsWithTreatments(j, taxon.url))
        })
      }
    })
  }

  processSynonymsWithTreatments (j: SparqlJson) {
    j.results.bindings.forEach(b => {
      let index = this.taxa.findIndex(t => t.url === b.tc.value)
      if (index === -1) {
        index = this.taxa.push({ url: b.tc.value, def: [], aug: [], dpr: [], loading: false }) - 1
      }

      // Defining Treatments
      if (b.def) {
        if (!b.defd || !b.defd.value) {
          b.defd = { value: '-1', type: 'literal' }
        }
        const defyindex = this.years.findIndex(y => y !== 'sep' && y.year.toString() === b.defd.value)
        if (defyindex === -1) {
          const data: ('def'|false)[] = []
          data[index] = 'def'
          this.years.push({
            year: parseInt(b.defd.value, 10),
            treatments: [{
              creators: b.defcs.value,
              url: b.def.value,
              data
            }]
          })
        } else {
          const deftindex = (this.years[defyindex] as TLYear).treatments.findIndex(t => t.url === b.def.value)
          if (deftindex === -1) {
            const data: ('def'|false)[] = []
            data[index] = 'def';
            (this.years[defyindex] as TLYear).treatments.push({
              creators: b.defcs.value,
              url: b.def.value,
              data
            })
          } else {
            (this.years[defyindex] as TLYear).treatments[deftindex].data[index] = 'def'
          }
        }
        const i = this.taxa[index].def.findIndex(d => d.url === b.def.value && d.creators === b.defcs.value && d.year === parseInt(b.defd.value, 10))
        if (i === -1) this.taxa[index].def.push({ url: b.def.value, creators: b.defcs.value, year: parseInt(b.defd.value, 10) })
      }

      // Augmenting treatments
      if (b.aug) {
        if (!b.augd || !b.augd.value) {
          b.augd = { value: '-1', type: 'literal' }
        }
        const augyindex = this.years.findIndex(y => y !== 'sep' && y.year.toString() === b.augd.value)
        if (augyindex === -1) {
          const data: ('aug'|false)[] = []
          data[index] = 'aug'
          this.years.push({
            year: parseInt(b.augd.value, 10),
            treatments: [{
              creators: b.augcs.value,
              url: b.aug.value,
              data
            }]
          })
        } else {
          const augtindex = (this.years[augyindex] as TLYear).treatments.findIndex(t => t.url === b.aug.value)
          if (augtindex === -1) {
            const data: ('aug'|false)[] = []
            data[index] = 'aug';
            (this.years[augyindex] as TLYear).treatments.push({
              creators: b.augcs.value,
              url: b.aug.value,
              data
            })
          } else {
            (this.years[augyindex] as TLYear).treatments[augtindex].data[index] = 'aug'
          }
        }
        const i = this.taxa[index].aug.findIndex(d => d.url === b.aug.value && d.creators === b.augcs.value && d.year === parseInt(b.augd.value, 10))
        if (i === -1) this.taxa[index].aug.push({ url: b.aug.value, creators: b.augcs.value, year: parseInt(b.augd.value, 10) })
      }

      // Deprecating Treatments
      if (b.dpr) {
        if (!b.dprd || !b.dprd.value) {
          b.dprd = { value: '-1', type: 'literal' }
        }
        const dpryindex = this.years.findIndex(y => y !== 'sep' && y.year.toString() === b.dprd.value)
        if (dpryindex === -1) {
          const data: ('dpr'|false)[] = []
          data[index] = 'dpr'
          this.years.push({
            year: parseInt(b.dprd.value, 10),
            treatments: [{
              creators: b.dprcs.value,
              url: b.dpr.value,
              data
            }]
          })
        } else {
          const dprtindex = (this.years[dpryindex] as TLYear).treatments.findIndex(t => t.url === b.dpr.value)
          if (dprtindex === -1) {
            const data: ('dpr'|false)[] = []
            data[index] = 'dpr';
            (this.years[dpryindex] as TLYear).treatments.push({
              creators: b.dprcs.value,
              url: b.dpr.value,
              data
            })
          } else {
            (this.years[dpryindex] as TLYear).treatments[dprtindex].data[index] = 'dpr'
          }
        }
        const i = this.taxa[index].dpr.findIndex(d => d.url === b.dpr.value && d.creators === b.dprcs.value && d.year === parseInt(b.dprd.value, 10))
        if (i === -1) this.taxa[index].dpr.push({ url: b.dpr.value, creators: b.dprcs.value, year: parseInt(b.dprd.value, 10) })
      }
      this.taxa[index].loading = false
    });

    (this.years as TLYear[]).sort((a, b) => {
      if (a.year < b.year) {
        return -1
      }
      if (a.year > b.year) {
        return 1
      }
      return 0
    })

    this.taxa.forEach((taxon) => {
      try {
        const nameSection = taxon.url.substring(taxon.url.lastIndexOf('/') + 1)
        const genus = nameSection.substring(0, nameSection.indexOf('_'))
        const species = nameSection.substring(nameSection.indexOf('_') + 1, nameSection.indexOf('_', nameSection.indexOf('_') + 1))
        this.getHorizontalData(genus, species)
      } catch (error) {}
    })

    this.years.forEach(y => {
      if (y === 'sep') { return }
      y.treatments.forEach(t => {
        t.data = t.data.concat(Array(this.taxa.length - t.data.length).fill(false))
      })
    })
  }

  mounted () {
    this.wikidataViewer = new WikidataViewer(document.getElementById('wikidata-area')!)
    this.vernacularViewer = new VernacularViewer(document.getElementById('vernacular-area')!)
    // Search field
    const input = document.getElementById('combinedfield') as HTMLInputElement
    this.taxomplete = new Taxomplete(input, this.sparqlEndpoint)

    const resetAll = (value: string) => {
      this.taxa = []
      this.years = []
      this.wikidataViewer.reset()
      this.vernacularViewer.reset()
      this.current.genus = value.substring(0, value.indexOf(' '))
      this.current.species = value.substr(value.indexOf(' ') + 1)
      this.wikidataViewer.addTaxon(this.current.genus + ' ' + this.current.species)
      this.vernacularViewer.addTaxon(this.current.genus + ' ' + this.current.species)
      this.getData()
    }
    this.taxomplete.action = resetAll

    if (!input.value && window.location.hash) {
      input.value = window.location.hash.substring(1).replace('+', ' ')
      this.taxomplete.lookup()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  padding: 0 0.8rem;
}
#betabtn {
  float: right;
  margin: 0.2em;
  font-size: small;
}
#search-form {
  padding: 0 0.8rem 0.5rem;

  input,
  button {
    line-height: 1.8rem;
    border-radius: 0.2rem;
    margin-left: 0.8rem;
    padding: 0 0.4rem;
    font-size: 1rem;
  }

  input {
    border: 1px solid grey;
    width: 290px;
  }

  button {
    background: #476100;
    border: 1px solid #476100;
    color: #fff;
  }

  button:hover,
  button:focus,
  button:active {
    background: #81951d;
    border: 1px solid #81951d;
  }
}
</style>
