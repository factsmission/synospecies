<template>
  <main class="container">
    <h1>Settings</h1>
    <div class="card">
      <h2 class="card_header">
        Set SPARQL endpoint
      </h2>
      <b>Select SPARQL endpoint serving the Plazi Treatment Data:</b>
      <selector
        v-model="endpoint"
        :options="allEndpoints"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import Selector from '@/components/Selector.vue'

import * as config from '@/utilities/config'

@Component({
  components: { Selector }
})
export default class Settings extends Vue {
  allEndpoints = config.allEndpoints
  endpoint = config.getEndpoint();

  @Watch('endpoint')
  onEndpointChanged (v: string) {
    localStorage.setItem('plazi-treatments-endpoint', v)
  }
}
</script>