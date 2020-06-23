<template>
  <div>
    <h1>Settings</h1>
    <div class="card">
      <h2 class="card_header">
        Choose SPARQL endpoint
      </h2>
      <label>
        <input type="radio" name="endpoint" value="https://trifid-lindas.test.cluster.ldbar.ch/query" v-model="inputEndpoint">
        https://trifid-lindas.test.cluster.ldbar.ch/query (default)
      </label>
      <label>
        <input type="radio" name="endpoint" value="https://treatment.ld.plazi.org/sparql" v-model="inputEndpoint">
        https://treatment.ld.plazi.org/sparql
      </label>
      <label>
        <input type="radio" name="endpoint" value="CUSTOM" v-model="inputEndpoint">
        Custom:
        <input type="text" v-model="customEndpoint" @focus.passive="inputEndpoint = 'CUSTOM'">
      </label>
    </div>
  </div>
</template>

<script lang="js">
import { Component, Vue } from 'vue-property-decorator'
import config from '@/config'

@Component({})
export default class About extends Vue {
  _inputEndpoint = 'https://trifid-lindas.test.cluster.ldbar.ch/query'

  customEndpoint = ''

  endpoint () {
    return this.inputEndpoint !== 'CUSTOM' ? this._inputEndpoint : this.customEndpoint
  }

  get inputEndpoint () {
    console.log('_inputEndpoint', this._inputEndpoint)
    return config.endpoint()
  }

  set inputEndpoint (v) {
    this._inputEndpoint = v
    localStorage.setItem('plazi-treatments-endpoint', this.endpoint())
    if (v === 'CUSTOM') {
      localStorage.setItem('plazi-treatments-custom-endpoint', this.endpoint())
    }
    console.log(v, this._inputEndpoint, this.endpoint(), localStorage.getItem('plazi-treatments-custom-endpoint'))
  }
}
</script>

<style lang="scss" scoped>
.card {
  word-break: break-all;

  & label {
    padding: 0.4em 0;
    display: flex;
    flex-direction: row;
  }

  & input[type="radio"] {
    margin-right: 1ch;
    margin-top: 0.4em;
  }

  & input[type="text"] {
    margin-left: 1ch;
    flex: 1;
  }
}
</style>
