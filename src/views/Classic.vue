<template>
<div>
  <h1>SynoSpecies</h1>
  <form id="search-form">
    <span>Input Genus and species here:</span>
    <input type="text" id="combinedfield" placeholder="Sadayoshia acroporae" />
    <button @click.prevent="onClick" id="lookup">Look up</button>
  </form>
  <hr />
  {{ message }}
  <timeline
    v-if="names.length > 0"
    :names="names"
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
  taxa: {[key: string]: any}[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any

  names: string[] = []
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

    this.sparqlEndpoint = new SparqlEndpoint(params.get('endpoint') || 'https://treatment.ld.plazi.org/sparql')
    this.taxamanager = new TaxaManager(this.sparqlEndpoint)
  }

  getData () {
    this.taxamanager.getTaxonConcepts(this.current.genus, this.current.species)
      .then(async (taxonConcepts: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (taxonConcepts.nodes.length === 0) {
          this.message = 'No treatment for ' + this.current.genus + ' ' + this.current.species + ' found on Plazi.'
        } else {
          window.location.hash = this.current.genus + '+' + this.current.species
          this.taxa = this.taxa.concat(
            await taxonConcepts.each((tn: any) => tn) // eslint-disable-line
              .then(
                (tns: any) => Promise.all(tns.sort(
                  (tn1: any, tn2: any) => { // eslint-disable-line
                    const y1 = tn1.value.substring(tn1.value.length - 4)
                    const y2 = tn2.value.substring(tn2.value.length - 4)
                    return y1 - y2
                  }
                ))
              )
          )
          console.table(this.taxa) // eslint-disable-line
          this.taxa.forEach((taxon) => {
            this.taxamanager.getSynonymsWithTreatments(taxon.value).then(this.processSynonymsWithTreatments)
          })
          this.message = ''
        }
      })
  }

  processSynonymsWithTreatments (j: SparqlJson) {
    j.results.bindings.forEach(b => {
      let index = this.names.indexOf(b.tc.value)
      if (index === -1) {
        index = this.names.push(b.tc.value) - 1
      }

      // Defining Treatments
      if (b.def) {
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
      }

      // Augmenting treatments
      if (b.aug) {
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
      }

      // Deprecating Treatments
      if (b.dpr) {
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
      }
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

    this.years.forEach(y => {
      if (y === 'sep') { return }
      y.treatments.forEach(t => {
        t.data = t.data.concat(Array(this.names.length - t.data.length).fill(false))
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
</style>
