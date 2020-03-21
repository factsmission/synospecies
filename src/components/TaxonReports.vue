<template>
<div>
  {{ message }}
  <single-taxon-report
    v-for="taxon in taxa"
    :key="taxon.value"
    :taxon="taxon"
    @taxonRendered="t => $emit('taxonRendered', t)"
  />
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SingleTaxonReport from '@/components/SingleTaxonReport.vue'
import TaxaManager from '@/TaxaManager'

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
  taxa: {ranks: string; [key: string]: any}[] = []

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
          this.message = ''
          this.renderTns(taxonConcepts, this.genus + ' ' + this.species)
        }
      })
  }

  relatedTaxonEncountered (taxon: string) {
    this.$emit('relatedTaxonEncountered', taxon)
  }

  taxonRendered (taxon: string) {
    this.$emit('taxonRendered', taxon)
  }

  async renderTns (tns: any, title: string) { // eslint-disable-line
    this.taxa = await tns.each((tn: any) => tn) // eslint-disable-line
      .then((tns: any) => Promise.all(tns.sort((tn1: any, tn2: any) => { // eslint-disable-line
        const y1 = tn1.value.substring(tn1.value.length - 4)
        const y2 = tn2.value.substring(tn2.value.length - 4)
        return y1 - y2
      })))
  }

  mounted () {
    this.rendering()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
