<template>
  <div :class="'card' + (deprecates.length > 0 && 0 === taxon.dpr.length ? ' deprecates ' : ' ') + (taxon.dpr.length > 0 ? 'deprecated' : '')">
    <div class="flex">
      <div class="text">
        <hgroup>
          <h2 class="card_header">
            {{ getFormattedName(taxon.url) }}
          </h2>
          <h3
            v-for="p in preferedNameBy"
            :key="p.url"
            class="card_header"
          >
            Preferred by
            <a :href="p.url">
              {{ p.creators.join('; ') }} {{ p.dates.join('/') }}
            </a>
          </h3>
        </hgroup>
        <p v-if="taxon.loading">
          <dot-spinner />
          Loading Treatments
        </p>
        <p v-if="!taxon.loading">
          <svg
            v-if="taxon.def.length"
            class="green"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentcolor"
              d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
          <svg
            v-else
            class="green"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentcolor"
              d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"
            />
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
                <li
                  v-for="d in deprecates.filter(d => d.url === t.url)"
                  :key="d.old"
                >
                  Deprecates {{ getFormattedName(d.old) }}
                </li>
              </ul>
            </li>
          </ul>
        </p>
        <p v-if="taxon.aug.length">
          <svg
            class="blue"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentcolor"
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
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
                <li
                  v-for="d in deprecates.filter(d => d.url === t.url)"
                  :key="d.old"
                >
                  Deprecates {{ getFormattedName(d.old) }}
                </li>
              </ul>
            </li>
          </ul>
        </p>
        <p v-if="taxon.dpr.length">
          <svg
            class="red"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentcolor"
              d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
            />
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
                <li
                  v-for="d in deprecations.filter(d => d.url === t.url)"
                  :key="d.new"
                >
                  Deprecated by {{ getFormattedName(d.new) }}
                </li>
              </ul>
            </li>
          </ul>
        </p>
      </div>
      <div class="vert">
        <table class="nobold">
          <tr>
            <th>Kingdom</th>
            <td v-if="!loading">
              {{ ranks[0] }}
            </td>
            <td v-else />
          </tr>
          <tr>
            <th>Phylum</th>
            <td v-if="!loading">
              {{ ranks[1] }}
            </td>
            <td v-else />
          </tr>
          <tr>
            <th>Class</th>
            <td v-if="!loading">
              {{ ranks[2] }}
            </td>
            <td v-else />
          </tr>
          <tr>
            <th>Order</th>
            <td v-if="!loading">
              {{ ranks[3] }}
            </td>
            <td v-else>
              <dot-spinner />
            </td>
          </tr>
          <tr>
            <th>Family</th>
            <td v-if="!loading">
              {{ ranks[4] }}
            </td>
            <td v-else />
          </tr>
          <tr>
            <th>Genus</th>
            <td v-if="!loading">
              {{ ranks[5] }}
            </td>
            <td v-else />
          </tr>
          <tr>
            <th>Species</th>
            <td v-if="!loading">
              {{ ranks[6] }}
            </td>
            <td v-else />
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DotSpinner from '@/components/DotSpinner.vue'
import TaxaManager from '@/TaxaManager'

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
  components: { DotSpinner }
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
