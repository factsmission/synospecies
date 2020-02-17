<template>
  <div>
    <div class="query"></div>
    <div class="result"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import YASQE from '@triply/yasqe'
import YASR from '@triply/yasr'
import superagent from 'superagent'
import '@triply/yasqe/build/yasqe.min.css'
import '@triply/yasr/build/yasr.min.css'
import { endpoint } from '@/config'

@Component
export default class QueryEditor extends Vue {
  @Prop() private query!: string;

  mounted () {
    const queryElement: HTMLElement = this.$el.getElementsByClassName('query')[0] as HTMLElement
    const yasqe = new YASQE(queryElement, {
      requestConfig: {
        showQueryButton: true,
        endpoint
      }
    })
    const resultElement: HTMLElement = this.$el.getElementsByClassName('result')[0] as HTMLElement
    // eslint-disable-next-line
        console.log("intitailizing yasr on", resultElement);
    const yasr = new YASR(resultElement, {
      pluginOrder: ['table', 'response'],
      prefixes: {
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        name: 'http://taxon-name.plazi.org/id/',
        bibo: 'http://purl.org/ontology/bibo/',
        dwc: 'http://rs.tdwg.org/dwc/terms/',
        dce: 'http://purl.org/dc/elements/1.1/',
        'treat-vocab': 'http://plazi.org/vocab/treatment#',
        'dwc-fp': 'http://filteredpush.org/ontologies/oa/dwcFP#',
        treatment: 'http://treatment.plazi.org/id/',
        'taxon-concept': 'http://taxon-concept.plazi.org/id/',
        publication: 'http://publication.plazi.org/id/',
        doi: 'http://dx.doi.org/',
        fabio: 'http://purl.org/spar/fabio/'
      }
    })
    yasqe.on('queryResponse',
      (instance: YASQE, req: superagent.SuperAgentRequest, duration: number) => {
        yasr.setResponse(req)
      })
    if (this.query) {
      yasqe.setValue(this.query)
    } else {
      // yasqe.setValue(this.$slots.default[0].text)

      const defaultSlot = this.$slots!.default![0]
      // eslint-disable-next-line
      console.log("ds", defaultSlot)
      // eslint-disable-next-line
      console.log("dstc", defaultSlot.children![0]!.text)
      // eslint-disable-next-line
      //console.log("dsetc", defaultSlot.elm!.textContent)
      yasqe.setValue(defaultSlot.children![0]!.text)
      // eslint-disable-next-line
      // console.log("text", this.$slots.default[0].elm)
      // eslint-disable-next-line
      // console.log("tc", this.$slots.default[0].elm.textContent)
      // eslint-disable-next-line
      // console.log("fcd", this.$slots.default[0].elm.firstChild.data)
    }
    yasqe.addPrefixes({ rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' })
  }
}
</script>

<style scoped>
* {
 text-align: initial;
}
</style>

<style>
.yasr_results td:first-child,
.yasr_results th:first-child {
  display: none
}
</style>
