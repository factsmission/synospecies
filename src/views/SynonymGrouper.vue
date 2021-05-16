<template>
  <div>
    <h1>SynonymGrouper</h1>
    <input type="text" v-model="input" @keyup.enter=updateSG>
    <button @click="updateSG">Go</button>
    <code>{{ message }}</code>
    <table>
        <tr>
          <th>Taxon Name URI</th>
          <th>Taxon Concept URI</th>
          <th>Justifications</th>
        </tr>
        <tr v-for="js in result" :key="js.taxonConceptUri">
          <td><a :href="js.taxonNameUri">{{ shorten(js.taxonNameUri) }}</a></td>
          <td><a :href="js.taxonConceptUri">{{ shorten(js.taxonConceptUri) }}</a></td>
          <td>
            <ul>
              <li v-for="j in js.justifications.values()" :key="j.toString()">{{ shorten(j.toString(), true) }}</li>
            </ul>
            <!-- {{ Array.from(js.justifications.values()) }} -->
          </td>
        </tr>
      </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SynonymGroupBuilder } from '@/SynonymGroup'
import type { JustifiedSynonym, SynonymGroup } from '@/SynonymGroup'
import config from '@/config'
import SparqlEndpoint from '@retog/sparql-client'

@Component({})
export default class SynonymGrouper extends Vue {
  endpoint = new SparqlEndpoint(config.endpoint())
  input = 'Sadayoshia acroporae'
  result: JustifiedSynonym[] = []
  sg?: SynonymGroup;
  message = ''

  shorten (uri: string, bracket?: boolean) {
    let temp = bracket ? uri.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g, (_, g) => `[${g}]`) : uri
    const index = ~temp.indexOf(']') ? temp.indexOf(']') + 2 : 0
    temp = temp.substring(index)
    return temp.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\//g, '').replace(/\/|_/g, ' ')
  }

  updateSG () {
    this.result = []
    this.message = ' loading'
    SynonymGroupBuilder(this.endpoint, this.input, this.result).then(sg => {
      this.message = ' loaded'
      // this.sg = sg
      // this.result = sg.getAllSynonyms()
    })
  }

  mounted () {
    this.updateSG()
  }
}
</script>

<style lang="scss" scoped>
table tr {
  th,
  td {
    text-align: left;
  }

  ul {
    list-style: '— ' inside none;
    padding: 0;
  }
}
</style>
