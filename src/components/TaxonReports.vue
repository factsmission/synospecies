<template>
<div>
  Hi! ({{genus}} {{species}})
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
export default class Classic extends Vue {
  @Prop() genus!: string;
  @Prop() species!: string;
  @Prop() taxamanager!: TaxaManager;

  names: {[key: string]: boolean} = {};

  // @Watch('genus')
  @Watch('species')
  onGenusChanged () {
    //
  }

  relatedTaxonEncountered (taxon: string) {
    this.$emit('relatedTaxonEncountered', taxon)
  }

  taxonRendered (taxon: string) {
    this.$emit('taxonRendered', taxon)
  }

  renderTns (tns: any, title: string) { // eslint-disable-line
    tns.each((tn: any) => tn) // eslint-disable-line
      .then((tns: any) => Promise.all(tns.sort((tn1: any, tn2: any) => { // eslint-disable-line
        const y1 = tn1.value.substring(tn1.value.length - 4)
        const y2 = tn2.value.substring(tn2.value.length - 4)
        return y1 - y2
      }).map(async (tn: {value: string; [key: string]: any}) => {
        // for unclear reasons some taxa have more than one order or family (maybe other ranks, thus generalized)
        const ranks = await Promise.all(['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].map(async r => tn.out(dwc(r)).each((f: any) => f.value).then((fs: any) => fs.join(', ')))).then(rs => '<tr><td>' + rs.join('</td><td>') + '</td></tr>')

        function linkToTreatments (gn: any) {
          return gn.each((t: any) => t)
            .then((ts: any) => Promise.all(ts.map(async (t: any) => ' <a class="truncate" href="' + t.value + '">' +
                            (await t.out(dc('creator')).each((c: any) => c.value)).join('; ') +
                            (await t.out(dc('date')).each((d: any) => ' ' + d.value)).join('/') +
                            '</a>')).then(links => links.join(' - ')))
        }

        const preferedNameByGN = tn.in(treat('preferedName'))
        const preferedNameBy = preferedNameByGN.nodes.length > 0 ? await linkToTreatments(preferedNameByGN) : ''

        const definingTreatmentGN = tn.in(treat('definesTaxonConcept'))
        const definingTreatment = definingTreatmentGN.nodes.length > 0 ? 'Defined by: ' + await linkToTreatments(definingTreatmentGN) : 'Defining treatment not yet on plazi'

        const augmentingTreatmentGN = tn.in(treat('augmentsTaxonConcept'))
        const augmentingTreatment = augmentingTreatmentGN.nodes.length > 0 ? 'Augmented by: ' + await linkToTreatments(augmentingTreatmentGN) : ''

        const result = document.createElement('li')

        result.innerHTML += '<strong>' + getFormattedName(tn.value) + '</strong>'
        result.innerHTML += preferedNameBy
        result.innerHTML += '<table class="nobold card"><tr><th>Kingdom</th><th>Phylum</th><th>Class</th><th>Order</th><th>Family</th><th>Genus</th><th>Species</th></tr>' +
                    ranks + '</table>'
        result.innerHTML += '<br/>' + definingTreatment + '<br/>' + augmentingTreatment
        if (!this.names[tn.value]) {
          const deprecationsArea = document.createElement('div')
          deprecationsArea.classList.add('deprecations')
          deprecationsArea.innerHTML = 'looking for deprecations...'
          result.appendChild(deprecationsArea)
          this.names[tn.value] = true
          this.taxamanager.getNewTaxa(tn.value).then((newTaxa: any) => {
            this.renderTns(newTaxa, 'Deprecated by')
            newTaxa.each((newTaxa: any) => {
              this.relatedTaxonEncountered(newTaxa.out(dwc('genus')).value + ' ' + newTaxa.out(dwc('species')).value)
            })
          })
        }

        this.taxonRendered(tn.value)
        return result
      }))).then((listItems: [any]) => {
        if (listItems.length > 0) {
          this.$el.innerHTML = '<h4>' + title + '</h4>'
          const list = document.createElement('ul')
          listItems.forEach((i) => list.appendChild(i))
          this.$el.appendChild(list)
          truncate()
        } else {
          this.$el.innerHTML = ''
        }
      })
  }

  mounted () {
    this.taxamanager.getTaxonConcepts(this.genus, this.species)
      .then((taxonConcepts: any) => { // eslint-disable-line
        if (taxonConcepts.nodes.length === 0) {
          this.$el.textContent = 'No treatment for ' + this.genus + ' ' + this.species + ' found on Plazi.'
        } else {
          window.location.hash = this.genus + '+' + this.species
          this.renderTns(taxonConcepts, this.genus + ' ' + this.species)
        }
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
