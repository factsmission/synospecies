<template>
<div>
  <h1>SynoSpecies</h1>
  <form id="search-form">
    <span>Input Genus and species here:</span>
    <input type="text" id="combinedfield" placeholder="Sadayoshia acroporae" />
    <button @click.prevent="onClick" id="lookup">Look up</button>
  </form>
  <hr />
  <div class="section" id="taxon-name"></div>
  <div class="section" id="image-area"></div>
  <div class="section" id="vernacular-area"></div>
  <div class="section" id="wikidata-area"></div>
</div>
</template>

<script lang="js">
import { Component, Prop, Vue } from 'vue-property-decorator'
/* eslint-disable */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Mustache from 'mustache'

import SparqlEndpoint from '@retog/sparql-client'

import WikidataViewer from '@/WikidataViewer.js'
import VernacularViewer from '@/VernacularViewer.js'
import ImageSplash from '@/ImageSplash.js'
import TaxaManager from '@/TaxaManager.js'
import TaxonReport from '@/TaxonReport.js'
import Taxomplete from 'taxomplete'

let taxomplete;

window.addEventListener("load", _ => {
  const params = new URLSearchParams(window.location.search)

  const sparqlEndpoint = new SparqlEndpoint(params.get('endpoint') || 'https://treatment.ld.plazi.org/sparql')
  const taxaManager = new TaxaManager(sparqlEndpoint)
  const taxonReport = new TaxonReport(taxaManager, document.getElementById('taxon-name'))
  const imageSplash = new ImageSplash(taxaManager, document.getElementById('image-area'))
  const wikidataViewer = new WikidataViewer(document.getElementById('wikidata-area'))
  const vernacularViewer = new VernacularViewer(document.getElementById('vernacular-area'))

  // Search field
  const input = document.getElementById('combinedfield')
  taxomplete = new Taxomplete(input, sparqlEndpoint)
  taxomplete.action = function (value) {
    wikidataViewer.reset()
    vernacularViewer.reset()
    imageSplash.reset()
    taxonReport.reset()
    const genus = value.substring(0, value.indexOf(' '))
    const species = value.substr(value.indexOf(' ') + 1)
    taxonReport.relatedTaxonEncountered = (genus, species) => {
      wikidataViewer.addTaxon(genus + ' ' + species)
      vernacularViewer.addTaxon(genus + ' ' + species)
    }
    taxonReport.taxonRendered = (taxonConcept) => {
      imageSplash.appendImages(taxonConcept)
    }
    taxonReport.setTaxon(genus, species)
    wikidataViewer.addTaxon(genus + ' ' + species)
    vernacularViewer.addTaxon(genus + ' ' + species)
  }

  if (!input.value && window.location.hash) {
    input.value = window.location.hash.substring(1).replace('+', ' ')
    taxomplete.lookup()
  }
})

@Component
export default class Classic extends Vue {
  onClick () {
    taxomplete.lookup()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
