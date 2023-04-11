<template>
  <div>
    <single-taxon-report
      v-for="taxon in taxa"
      :key="taxon.value"
      :taxon="taxon"
      :taxamanager="taxamanager"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SingleTaxonReport from '@/components/SingleTaxonReport.vue'
import TaxaManager from '@/TaxaManager'

@Component({
  components: {
    SingleTaxonReport
  }
})
export default class TaxonReports extends Vue {
  @Prop() taxa!: {[key: string]: any}[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Prop() taxamanager!: TaxaManager;

  message = ''
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
