<template>
<div>
  {{ message }}
  <single-taxon-report
    v-for="taxon in taxa"
    :key="taxon.value"
    :taxon="taxon"
    :taxamanager="taxamanager"
    @taxonRendered="t => onTaxonRendered(t)"
    @relatedTaxaEncountered="t => renderTns(t)"
  />
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SingleTaxonReport from '@/components/SingleTaxonReport.vue'
import TaxaManager from '@/TaxaManager'
import $rdf from 'ext-rdflib'

function dwc (localName: string) {
  return $rdf.sym('http://rs.tdwg.org/dwc/terms/' + localName)
}

@Component({
  components: {
    SingleTaxonReport
  }
})
export default class TaxonReports extends Vue {
  @Prop() genus!: string;
  @Prop() species!: string;
  @Prop() taxamanager!: TaxaManager;

  names: {[key: string]: boolean} = {};

  message = ''
  taxa: {[key: string]: any}[] = []

  // @Watch('genus')
  @Watch('species')
  onGenusChanged () {
    this.rendering()
  }

  rendering () {
    this.message = 'Searching for treatments'
    this.taxa = []
    this.taxamanager.getTaxonConcepts(this.genus, this.species)
      .then((taxonConcepts: any) => { // eslint-disable-line
        if (taxonConcepts.nodes.length === 0) {
          this.message = 'No treatment for ' + this.genus + ' ' + this.species + ' found on Plazi.'
        } else {
          window.location.hash = this.genus + '+' + this.species
          this.renderTns(taxonConcepts)
          this.message = ''
        }
      })
  }

  async renderTns (tns: any) { // eslint-disable-line
    this.taxa = this.taxa.concat(( await tns.each((tn: any) => tn) // eslint-disable-line
      .then((tns: any) => Promise.all(tns.sort((tn1: any, tn2: any) => { // eslint-disable-line
        const y1 = tn1.value.substring(tn1.value.length - 4)
        const y2 = tn2.value.substring(tn2.value.length - 4)
        return y1 - y2
      })))).filter((taxon: any) => !this.names[taxon.value]))
  }

  onTaxonRendered (taxon: any) {
    this.names[taxon.value] = true
    this.$emit('taxonRendered', taxon.value)
  }

  mounted () {
    this.rendering()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
