<template>
<div>
  <h1>SynoSpecies</h1>
  <form id="search-form">
    <span>Input Genus and species here:</span>
    <input type="text" id="combinedfield" placeholder="Sadayoshia acroporae" />
    <button @click.prevent="onClick" id="lookup">Look up</button>
  </form>
  <hr />
  <taxon-reports
    :genus="current.genus"
    :species="current.species"
    :taxamanager="taxamanager"
    @relatedTaxonEncountered="relatedTaxonEncountered"
    @taxonRendered="taxonRendered"
  />
  <hr />
  <div class="section" id="image-area"></div>
  <div class="section" id="vernacular-area"></div>
  <div class="section" id="wikidata-area"></div>
</div>
</template>

<script lang="js">
import { Component, Vue } from 'vue-property-decorator'
/* eslint-disable */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Mustache from 'mustache'

import SparqlEndpoint from '@retog/sparql-client'

import WikidataViewer from '@/WikidataViewer.js'
import VernacularViewer from '@/VernacularViewer.js'
import ImageSplash from '@/ImageSplash.js'
import TaxaManager from '@/TaxaManager.js'
import TaxonReports from '@/components/TaxonReports'
import Taxomplete from 'taxomplete'

@Component({
  components: {
    TaxonReports
  }
})
export default class Classic extends Vue {
  current = {
    genus: null,
    species: null
  };

  taxamanager;
  sparqlEndpoint;
  taxomplete;
  wikidataViewer;
  vernacularViewer;
  imageSplash;

  onClick () {
    const input = document.getElementById('combinedfield')
    if (!input.value) input.value = 'Sadayoshia acroporae'
    this.taxomplete.lookup()
  }

  relatedTaxonEncountered(genus, species) {
    wikidataViewer.addTaxon(genus + ' ' + species)
    vernacularViewer.addTaxon(genus + ' ' + species)
  }

  taxonRendered(taxonConcept) {
    this.imageSplash.appendImages(taxonConcept)
  }

  beforeMount () {
    const params = new URLSearchParams(window.location.search)

    this.sparqlEndpoint = new SparqlEndpoint(params.get('endpoint') || 'https://treatment.ld.plazi.org/sparql')
    this.taxamanager = new TaxaManager(this.sparqlEndpoint)
  }

  mounted () {
    const self = this;
    this.imageSplash = new ImageSplash(this.taxamanager, document.getElementById('image-area'))
    this.wikidataViewer = new WikidataViewer(document.getElementById('wikidata-area'))
    this.vernacularViewer = new VernacularViewer(document.getElementById('vernacular-area'))
    // Search field
    const input = document.getElementById('combinedfield')
    this.taxomplete = new Taxomplete(input, this.sparqlEndpoint)
    this.taxomplete.action = function (value) {
      self.wikidataViewer.reset()
      self.vernacularViewer.reset()
      self.imageSplash.reset()
      self.current.genus = value.substring(0, value.indexOf(' '))
      self.current.species = value.substr(value.indexOf(' ') + 1)
      self.wikidataViewer.addTaxon(self.current.genus + ' ' + self.current.species)
      self.vernacularViewer.addTaxon(self.current.genus + ' ' + self.current.species)
    }

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
