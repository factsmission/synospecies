<template>
<div :class="'card' /* + (deprecates.length > 0 && 0 === taxon.dpr.length ? ' deprecates ' : ' ') + (taxon.dpr.length > 0 ? 'deprecated' : '') */">
  <div class="flex">
    <div class="text">
      <h2>
        <a :href="js.taxonConceptUri">{{ shorten(js.taxonConceptUri) }}</a>
      </h2>
      <a :href="js.taxonNameUri">{{ shorten(js.taxonNameUri) }}</a>
      <details :open="openJ">
        <summary>
          Justifications
          ( {{ js.justifications.size }} )
        </summary>
        <justification-view :js="js"/>
      </details>
      <treatments-view :js="js" :open="openT"/>
    </div>
    <div class="vert">
      <table class="nobold">
        <tr>
          <th>Kingdom</th>
          <td v-if="!loading">{{ ranks[0] }}</td>
          <td v-else></td>
        </tr>
        <tr>
          <th>Phylum</th>
          <td v-if="!loading">{{ ranks[1] }}</td>
          <td v-else></td>
        </tr>
        <tr>
          <th>Class</th>
          <td v-if="!loading">{{ ranks[2] }}</td>
          <td v-else></td>
        </tr>
        <tr>
          <th>Order</th>
          <td v-if="!loading">{{ ranks[3] }}</td>
          <td v-else><spinner /></td>
        </tr>
        <tr>
          <th>Family</th>
          <td v-if="!loading">{{ ranks[4] }}</td>
          <td v-else></td>
        </tr>
        <tr>
          <th>Genus</th>
          <td v-if="!loading">{{ ranks[5] }}</td>
          <td v-else></td>
        </tr>
        <tr>
          <th>Species</th>
          <td v-if="!loading">{{ ranks[6] }}</td>
          <td v-else></td>
        </tr>
      </table>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import JustificationView from '@/components/JustificationView.vue'
import TreatmentsView from '@/components/TreatmentsView.vue'
import Spinner from '@/components/Spinner.vue'
import type TaxaManager from '@/TaxaManager'
import type { JustifiedSynonym } from '@/SynonymGroup'

type SparqlJson = {
  head: {
    vars: string[];
  };
  results: {
    bindings: { [key: string]: { type: string; value: string } }[];
  };
}

@Component({
  components: {
    JustificationView,
    TreatmentsView,
    Spinner
  }
})
export default class SingleSynonym extends Vue {
  @Prop() js!: JustifiedSynonym
  // @Prop() taxamanager!: TaxaManager

  @Prop() openJ!: boolean;
  @Prop() openT!: boolean;
  ranks: string[] = []

  loading = true

  deprecations: { url: string; new: string }[] = []
  deprecates: { url: string; old: string }[] = []

  preferedNameBy: {
    creators: string[];
    dates: string[];
    url: string;
  }[] | null = null

  shorten (uri: string, bracket?: boolean) {
    let temp = bracket ? uri.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g, (_, g) => `[${g}]`) : uri
    const index = ~temp.indexOf(']') ? temp.indexOf(']') + 2 : 0
    temp = temp.substring(index)
    return temp.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\//g, '').replace(/\/|_/g, ' ')
  }

  async renderTaxon () {
    /* // for unclear reasons some taxa have more than one order or family (maybe other ranks, thus generalized)
    const ranks = await Promise.all(['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(async r => this.taxon.out(dwc(r)).each((f: any) => f.value).then((fs: any) => fs.join(', '))))
    this.ranks = ranks */

    const details: SparqlJson = await this.taxamanager.getTaxonDetails(this.js.taxonConceptUri)
    details.results.bindings.forEach(b => {
      this.ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(r => b[r] ? b[r].value : '')
      if (b.dprtreat && b.new) {
        const i = this.deprecations.findIndex(d => d.url === b.dprtreat.value && d.new === b.new.value)
        if (i === -1) this.deprecations.push({ url: b.dprtreat.value, new: b.new.value })
      }
      if (b.dprxtreat && b.old) {
        const i = this.deprecates.findIndex(d => d.url === b.dprxtreat.value && d.old === b.old.value)
        if (i === -1) this.deprecates.push({ url: b.dprxtreat.value, old: b.old.value })
      }
    })
    this.loading = false
    this.$emit('taxonRendered', this.taxon)
  }

  graph: any = '...';
  loadGraph () {
    this.taxamanager.getSynonymGraph().then((g: any) => { this.graph = g })
  }

  mounted () {
    this.renderTaxon()
  }
}
</script>

<style scoped>
.deprecated {
  background-color: #fbe9e7;
}
.deprecates {
  background-color: #e8f5e9;
}

.flex {
  display: flex;
  justify-content: space-between;
}
.vert {
  display: flex;
  flex-direction: column;
  /*justify-content: top;*/
}

table {
  font-size: 0.8rem;
  margin: -0.4rem -0.4rem -0.4rem 0.3rem;
}
table th,
table td {
  padding: 0.4rem;
  white-space: nowrap;
}
th {
  text-align: right;
}
td {
  text-align: left;
  min-width: 100px;
}

.scroll-x {
  overflow-x: auto;
}

svg {
  height: 1em;
  vertical-align: bottom;
  margin-bottom: 2px;
}

.blue {
  color: #1e88e5;
}

.green {
  color: #388e3c;
}

.red {
  color: #e53935;
}

.text p:last-child,
.text p:last-child>ul,
.text pre:last-child {
  margin-bottom: 0;
}

ul {
  margin-top: 0.4rem;
}
li ul {
  margin-top: 0;
}

.just {
  font-size: 0.8rem;
  font-style: italic;
}

.just > span:not(:last-child)::after {
  content: '; ';
}
</style>
