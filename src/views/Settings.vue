<template>
  <div>
    <h1>Settings</h1>
    <div class="card">
      <h2 class="card_header">
        Set SPARQL endpoint
      </h2>
      <b>Select SPARQL endpoint serving the Plazi Treatment Data:</b>
      <selector :options="allEndpoints" v-model="endpoint" />
    </div>
  </div>
</template>

<script lang="js">
import { Component, Vue, Watch } from 'vue-property-decorator'
import config from '@/config'
import Selector from '@/components/Selector'

@Component({
  components: { Selector }
})
export default class About extends Vue {
  allEndpoints = ['https://lindas-cached.cluster.ldbar.ch/query', 'https://lindas.admin.ch/query', 'https://trifid-lindas.test.cluster.ldbar.ch/query', 'https://treatment.ld.plazi.org/sparql']

  endpoint = config.endpoint();

  @Watch('endpoint')
  onEndpointChanged (v) {
    localStorage.setItem('plazi-treatments-endpoint', v)
  }
}
</script>
