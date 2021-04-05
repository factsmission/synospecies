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
    <details class="card">
      <summary>More Settings</summary>
      <br>
      <label>
        <input type="checkbox" v-model="justifications">
        Show justifications
      </label>
    </details>
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
  allEndpoints = ['https://lindas.admin.ch/query', 'https://trifid-lindas.test.cluster.ldbar.ch/query', 'https://treatment.ld.plazi.org/sparql']

  endpoint = config.endpoint();
  justifications = config.justifications();

  @Watch('endpoint')
  onEndpointChanged (v) {
    localStorage.setItem('plazi-treatments-endpoint', v)
  }

  @Watch('justifications')
  onJustificationChanged (v) {
    localStorage.setItem('justify-synospecies', JSON.stringify(!!v))
  }
}
</script>
