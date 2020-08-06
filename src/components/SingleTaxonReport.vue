<template>
<div :class="'card' + (deprecates.length > 0 ? ' deprecates ' : ' ') + (taxon.dpr.length > 0 ? 'deprecated' : '')">
  <hgroup>
     <h2 class="card_header">{{ getFormattedName(taxon.url) }}</h2>
    <h3
      class="card_header"
      v-for="p in preferedNameBy"
      :key="p.url"
    >
      Preferred by
      <a :href="p.url">
        {{ p.creators.join('; ') }} {{ p.dates.join('/') }}
      </a>
    </h3>
  </hgroup>
  <div class="scroll-x">
    <table class="nobold">
      <tr>
        <th>Kingdom</th>
        <th>Phylum</th>
        <th>Class</th>
        <th>Order</th>
        <th>Family</th>
        <th>Genus</th>
        <th>Species</th>
      </tr>
      <tr>
        <td
          v-for="r in ranks"
          :key="r"
        >
          {{ r }}
        </td>
      </tr>
      <tr>
        <td
          colspan="7"
          v-if="loading"
        >
          <spinner />
        </td>
      </tr>
    </table>
  </div>
  <p v-if="taxon.loading">
    <spinner/>
    Loading Treatments
  </p>
  <p v-if="!taxon.loading">
    <svg v-if="taxon.def.length" class="green" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
    </svg>
    <svg v-else class="green" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"/>
    </svg>
    {{ taxon.def.length || taxon.loading ? 'Defining Treatments: ' : 'Defining treatment not yet on Plazi' }}
    <ul v-if="taxon.def.length">
      <li
        v-for="t in taxon.def"
        :key="t.url"
      >
        <a :href="t.url">
          {{ t.creators }} ({{ t.year }}) <code>{{ t.url.substring(t.url.indexOf('/id/') + 4) }}</code>
        </a>
        <ul v-if="deprecates.find(d => d.url === t.url)">
          <li v-for="d in deprecates.filter(d => d.url === t.url)" :key="d.old">
            Deprecates {{ getFormattedName(d.old) }}
          </li>
        </ul>
      </li>
    </ul>
  </p>
  <p v-if="taxon.aug.length">
    <svg class="blue" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
    </svg>
    Augmenting Treatments:
    <ul>
      <li
        v-for="t in taxon.aug"
        :key="t.url"
      >
        <a :href="t.url">
          {{ t.creators }} ({{ t.year }}) <code>{{ t.url.substring(t.url.indexOf('/id/') + 4) }}</code>
        </a>
        <ul v-if="deprecates.find(d => d.url === t.url)">
          <li v-for="d in deprecates.filter(d => d.url === t.url)" :key="d.old">
            Deprecates {{ getFormattedName(d.old) }}
          </li>
        </ul>
      </li>
    </ul>
  </p>
  <p v-if="taxon.dpr.length">
    <svg class="red" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
    </svg>
    Deprecating Treatments:
    <ul>
      <li
        v-for="t in taxon.dpr"
        :key="t.url"
      >
        <a :href="t.url">
          {{ t.creators }} ({{ t.year }}) <code>{{ t.url.substring(t.url.indexOf('/id/') + 4) }}</code>
        </a>
        <ul v-if="deprecations.find(d => d.url === t.url)">
          <li v-for="d in deprecations.filter(d => d.url === t.url)" :key="d.new">
            Deprecated by {{ getFormattedName(d.new) }}
          </li>
        </ul>
      </li>
    </ul>
  </p>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Spinner from '@/components/Spinner.vue'
import $rdf from 'ext-rdflib'
import TaxaManager from '@/TaxaManager'

function dwc (localName: string) {
  return $rdf.sym('http://rs.tdwg.org/dwc/terms/' + localName)
}
function treat (localName: string) {
  return $rdf.sym('http://plazi.org/vocab/treatment#' + localName)
}
function dc (localName: string) {
  return $rdf.sym('http://purl.org/dc/elements/1.1/' + localName)
}

function truncate () {
  const toTruncate = document.getElementsByClassName('truncate')
  for (let i = 0; i < toTruncate.length; i++) {
    const el = toTruncate[i]
    const tc = el.textContent
    if (tc && tc.length > 80) {
      el.innerHTML = tc.slice(0, 81) + '<span hidden aria-hidden="false">' + tc.slice(81) + '</span>'
      const expandbtn = document.createElement('span')
      expandbtn.innerHTML = '...'
      expandbtn.classList.add('expandbtn')
      expandbtn.addEventListener('click', e => {
        el.innerHTML = tc
        e.preventDefault()
      })
      el.append(expandbtn)
    }
  }
}

type SparqlJson = {
  head: {
    vars: string[];
  };
  results: {
    bindings: { [key: string]: { type: string; value: string } }[];
  };
}

type Treat = {
  url: string;
  creators?: string;
  year?: number;
}

@Component({
  components: { Spinner }
})
export default class TaxonReport extends Vue {
  @Prop() taxon!: {url: string;
      def: Treat[];
      aug: Treat[];
      dpr: Treat[];
      loading: boolean;
    }

  @Prop() taxamanager!: TaxaManager;

  treats: {url: string; deprecates: string[]}[] = []
  ranks: string[] = []

  loading = true

  deprecations: { url: string; new: string }[] = []
  deprecates: { url: string; old: string }[] = []

  preferedNameBy: {
    creators: string[];
    dates: string[];
    url: string;
  }[] | null = null

  getFormattedName (uri: string) {
    const nameSection = uri.substring(uri.lastIndexOf('/') + 1)
    const lastSeparator = nameSection.lastIndexOf('_')
    return nameSection.substring(0, lastSeparator)
      .replace(new RegExp('_', 'g'), ' ') +
      ', ' +
      nameSection.substring(lastSeparator + 1)
  }

  async renderTaxon () {
    /* // for unclear reasons some taxa have more than one order or family (maybe other ranks, thus generalized)
    const ranks = await Promise.all(['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(async r => this.taxon.out(dwc(r)).each((f: any) => f.value).then((fs: any) => fs.join(', '))))
    this.ranks = ranks */

    const details: SparqlJson = await this.taxamanager.getTaxonDetails(this.taxon.url)
    details.results.bindings.forEach(b => {
      console.log(b)
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

.scroll-x {
  overflow-x: auto;
}

svg {
  height: 1em;
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
</style>
