<template>
<div class="card">
  <h2>{{ title }}</h2>
  {{ preferedNameBy }}
  <table class="nobold card">
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
  </table>
  <p>
    {{ definingTreatments ? 'Defining Treatments: ' : 'Defining treatment not yet on Plazi' }}
    <ul v-if="definingTreatments">
      <li
        v-for="t in definingTreatments"
        :key="t.url"
      >
        <a :href="t.url">
          {{ t.creators.join('; ') }} {{ t.dates.join('/') }}
        </a>
      </li>
    </ul>
  </p>
  <p v-if="augmentingTreatments">
    Augmenting Treatments:
    <ul v-if="augmentingTreatments">
      <li
        v-for="t in augmentingTreatments"
        :key="t.url"
      >
        <a :href="t.url">
          {{ t.creators.join('; ') }} {{ t.dates.join('/') }}
        </a>
      </li>
    </ul>
  </p>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
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

function getFormattedName (uri: string) {
  const nameSection = uri.substring(uri.lastIndexOf('/') + 1)
  const lastSeparator = nameSection.lastIndexOf('_')
  return nameSection.substring(0, lastSeparator)
    .replace(new RegExp('_', 'g'), ' ') +
    ', ' +
    nameSection.substring(lastSeparator + 1)
}

@Component
export default class TaxonReport extends Vue {
  @Prop() taxon!: {value: string; [key: string]: any}

  title = ''
  preferedNameBy = ''
  ranks = []

  definingTreatments: {
    creators: string[];
    dates: string[];
    url: string;
  }[] | null = null

  augmentingTreatments: {
    creators: string[];
    dates: string[];
    url: string;
  }[] | null = null

  async renderTaxon () {
    // for unclear reasons some taxa have more than one order or family (maybe other ranks, thus generalized)
    const ranks = await Promise.all(['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(async r => this.taxon.out(dwc(r)).each((f: any) => f.value).then((fs: any) => fs.join(', '))))
    this.ranks = ranks

    function linkToTreatments (gn: any) {
      return gn.each((t: any) => t)
        .then((ts: any) => Promise.all(ts.map(async (t: any) => {
          const url = t.value
          const creators = await t.out(dc('creator')).each((c: any) => c.value)
          const dates = await t.out(dc('date')).each((d: any) => ' ' + d.value)
          return { url, dates, creators }
        })))
    }

    const preferedNameByGN = this.taxon.in(treat('preferedName'))
    this.preferedNameBy = preferedNameByGN.nodes.length > 0 ? await linkToTreatments(preferedNameByGN) : ''

    const definingTreatmentGN = this.taxon.in(treat('definesTaxonConcept'))
    this.definingTreatments = definingTreatmentGN.nodes.length > 0 ? await linkToTreatments(definingTreatmentGN) : null

    const augmentingTreatmentGN = this.taxon.in(treat('augmentsTaxonConcept'))
    this.augmentingTreatments = augmentingTreatmentGN.nodes.length > 0 ? await linkToTreatments(augmentingTreatmentGN) : null

    this.title = getFormattedName(this.taxon.value)
    // if (!this.names[this.taxon.value]) {
    const deprecationsArea = document.createElement('div')
    deprecationsArea.classList.add('deprecations')
    deprecationsArea.innerHTML = 'looking for deprecations...'
    this.$el.appendChild(deprecationsArea)
    // this.names[this.taxon.value] = true
    // this.taxamanager.getNewTaxa(this.taxon.value).then((newTaxa: any) => {
    //   this.renderTns(newTaxa, 'Deprecated by')
    //   newTaxa.each((newTaxa: any) => {
    //     this.relatedTaxonEncountered(newTaxa.out(dwc('genus')).value + ' ' + newTaxa.out(dwc('species')).value)
    //   })
    // })
    // }

    this.$emit('taxonRendered', this.taxon.value)
  }

  mounted () {
    this.renderTaxon()
  }
}
</script>
