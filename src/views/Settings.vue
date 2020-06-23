<template>
  <div>
    <h1>Settings</h1>
    <div class="card">
      <h2 class="card_header">
        Set SPARQL endpoint
      </h2>
      Sparql endpoint serving the Plazi Treatment Data: <el-select id="ep-select"
        v-model="endpoint"
        filterable
        allow-create
        placeholder="Define SPARQL Enpoint for Plazi treatments">
        <el-option
          v-for="(ep, index) in allEndpoints"
          :key="index"
          :label="ep"
          :value="ep">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script lang="js">
import { Component, Vue, Watch } from 'vue-property-decorator'
import config from '@/config'
import {
  Select, Option
} from 'element-ui'

@Component({
  components: { 'el-select': Select, 'el-option': Option }
})
export default class About extends Vue {
  allEndpoints = ['https://trifid-lindas.test.cluster.ldbar.ch/query', 'https://treatment.ld.plazi.org/sparql']

  endpoint = config.endpoint();

  @Watch('endpoint')
  onEndpointChanged (v) {
    localStorage.setItem('plazi-treatments-endpoint', v)
  }
}
</script>

<style lang="scss">
#ep-select {
  width: 30em;
}
</style>
