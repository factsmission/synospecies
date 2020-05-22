<template>
<div>
  {{ message }}
  <timeline
    :names="names"
    :years="years"
  />
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
import Timeline from '@/components/Timeline.vue'
import TaxaManager from '@/TaxaManager'
import $rdf from 'ext-rdflib'

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

function dwc (localName: string) {
  return $rdf.sym('http://rs.tdwg.org/dwc/terms/' + localName)
}

@Component({
  components: {
    SingleTaxonReport,
    Timeline
  }
})
export default class TaxonReports extends Vue {
  @Prop() genus!: string;
  @Prop() species!: string;
  @Prop() taxamanager!: TaxaManager;

  oldNames: {[key: string]: boolean} = {};

  names: string[] = []
  years: (TLYear | 'sep')[] = [];

  message = ''
  taxa: {[key: string]: any}[] = []

  @Watch('genus')
  @Watch('species')
  onGenusChanged () {
    this.rendering()
  }

  reset () {
    this.rendering()
  }

  rendering () {
    this.message = 'Searching for treatments'
    this.taxa = []
    this.oldNames = {}
    this.names = []
    this.years = []
    this.taxamanager.getTaxonConcepts(this.genus, this.species)
      .then((taxonConcepts: any) => { // eslint-disable-line
        if (taxonConcepts.nodes.length === 0) {
          this.message = 'No treatment for ' + this.genus + ' ' + this.species + ' found on Plazi.'
        } else {
          window.location.hash = this.genus + '+' + this.species
          this.renderTns(taxonConcepts)
          this.message = 'Loading Timeline'
          this.taxa.forEach((taxon) => {
            this.taxamanager.getSynonymsWithTreatments(taxon.value).then(this.processSynonymsWithTreatments)
          })
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
      })))).filter((taxon: any) => !this.oldNames[taxon.value]))
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

  onTaxonRendered (taxon: any) {
    this.oldNames[taxon.value] = true
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
