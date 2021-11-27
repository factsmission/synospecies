<template>
  <div>
    <a v-if="links.wikidata || links.gbif || links.enwikipedia || links.wikipedia.length || links.wikispecies" :href="links.wikidata" aria-label="associated wikidata page"
    class="button" :disabled="!links.wikidata">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.2"
        viewBox="0 0 1050 590"
      >
        <path
          d="m 120,545 h 30 V 45 H 120 V 545 z m 60,0 h 90 V 45 H 180 V 545 z M 300,45 V 545 h 90 V 45 h -90 z"
          style="fill: #990000"
          id="path2"
        />
        <path
          d="m 840,545 h 30 V 45 H 840 V 545 z M 900,45 V 545 h 30 V 45 H 900 z M 420,545 h 30 V 45 H 420 V 545 z M 480,45 V 545 h 30 V 45 h -30 z"
          style="fill: #339966"
          id="path4"
        />
        <path
          d="m 540,545 h 90 V 45 h -90 V 545 z m 120,0 h 30 V 45 H 660 V 545 z M 720,45 V 545 h 90 V 45 H 720 z"
          style="fill: #006699"
          id="path6"
        />
      </svg>
    </a>
    <a v-if="links.gbif" :href="'https://www.gbif.org/species/' + links.gbif">GBIF ID: {{ links.gbif }}</a>
    <a
      v-if="links.wikipedia.length || links.enwikipedia" :href="links.enwikipedia"
      aria-label="associated english wikipedia page"
      :class="links.wikipedia.length ? 'button split' : 'button'"
      :disabled="!links.enwikipedia"
    >
      <svg
        version="1.0"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m95.869 23.909v2.139c-2.8213 0.50109-4.9569 1.3875-6.4066 2.6592-2.0768 1.8885-4.5256 4.779-6.132 8.6714l-32.685 66.712h-2.1747l-32.813-67.579c-1.5282-3.4685-3.6058-5.5882-4.2327-6.359-0.97961-1.1947-2.1845-2.1292-3.6147-2.8038-1.4302-0.67437-3.3601-1.1079-5.7895-1.3007v-2.139h31.928v2.139c-3.6834 0.34693-5.4394 0.96357-6.5365 1.8499-1.0972 0.88649-1.6458 2.0234-1.6457 3.4108-2.6e-5 1.9271 0.90121 4.9331 2.7037 9.0183l24.232 45.959 23.693-45.38c1.8416-4.4705 3.3695-7.573 3.3695-9.3073-6.3e-5 -1.1176-0.56824-2.1871-1.7045-3.2084-1.1364-1.0212-2.4222-1.7438-5.1259-2.1679-0.19598-0.038463-0.52904-0.096273-0.9992-0.17343v-2.139h23.934z"
        />
        <path
          d="m123.98 23.909v2.139c-2.8213 0.50109-4.9569 1.3875-6.4066 2.6592-2.0768 1.8885-4.5256 4.779-6.132 8.6714l-28.685 66.712h-2.1747l-30.313-67.579c-1.5282-3.4685-3.6058-5.5882-4.2327-6.359-0.97962-1.1947-2.1845-2.1292-3.6147-2.8038-1.4302-0.67437-2.7259-1.1079-5.1553-1.3007v-2.139h31.294v2.139c-3.6834 0.34693-5.4394 0.96357-6.5365 1.8499-1.0972 0.88649-1.6458 2.0234-1.6457 3.4108-2.5e-5 1.9271 0.90121 4.9331 2.7037 9.0183l21.732 45.959 19.693-45.38c1.8416-4.4705 3.3695-7.573 3.3696-9.3073-6e-5 -1.1176-0.56824-2.1871-1.7045-3.2084-1.1364-1.0212-3.0564-1.7438-5.7601-2.1679-0.19598-0.038463-0.52904-0.096273-0.9992-0.17343v-2.139h24.568z"
        />
      </svg>
    </a>
    <button v-if="links.wikipedia.length" class="button split" aria-label="other language wikipedia pages">
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
      </svg>
    </button>
    <a
      v-if="links.wikispecies"
      :href="links.wikispecies"
      aria-label="associated wikispecies page"
      class="button"
    >
      <svg
        viewBox="0 0 941 1103"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        height="24px"
      >
        <defs>
          <radialGradient
            id="d"
            cx="510"
            cy="110"
            r="210"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#D8ABA5" offset=".04" />
            <stop stop-color="#AD604E" offset=".4" />
            <stop stop-color="#9C4029" offset=".6" />
            <stop stop-color="#92331F" offset=".7" />
            <stop stop-color="#43180F" offset="1" />
          </radialGradient>
          <radialGradient
            id="i"
            cx="470.5"
            cy="650"
            r="430"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#4F8FB3" offset=".8" />
            <stop stop-color="#0C5178" offset=".95" />
            <stop stop-color="#002D4A" offset="1" />
          </radialGradient>
          <clipPath id="h">
            <path d="m0 199 470.5 428 470.5-428v904h-941z" />
          </clipPath>
          <linearGradient id="b">
            <stop stop-color="#00090E" offset="0" />
            <stop stop-color="#082E45" offset=".1" />
            <stop stop-color="#0A6997" offset=".5" />
            <stop stop-color="#082E45" offset=".9" />
            <stop stop-color="#00090E" offset="1" />
          </linearGradient>
          <linearGradient id="j">
            <stop stop-color="#375D72" offset="0" />
            <stop stop-color="#407B9B" offset=".1" />
            <stop stop-color="#A0C0CF" offset=".5" />
            <stop stop-color="#407B9B" offset=".9" />
            <stop stop-color="#375D72" offset="1" />
          </linearGradient>
          <linearGradient id="g">
            <stop stop-color="#0F3119" offset="0" />
            <stop stop-color="#01703B" offset=".1" />
            <stop stop-color="#89C4AE" offset=".5" />
            <stop stop-color="#01703B" offset=".9" />
            <stop stop-color="#0F3119" offset="1" />
          </linearGradient>
          <linearGradient id="a">
            <stop stop-color="#476C5A" offset="0" />
            <stop stop-color="#52A27D" offset=".1" />
            <stop stop-color="#A7D2BE" offset=".5" />
            <stop stop-color="#52A27D" offset=".9" />
            <stop stop-color="#476C5A" offset="1" />
          </linearGradient>
        </defs>
        <g stroke-width="0">
          <g fill="url(#b)">
            <path
              id="c"
              d="m213 218c39 137 436 101 436 202v90c0-111-404.5-64.7-436-200"
            />
          </g>
          <g fill="url(#b)">
            <path
              id="e"
              d="m649 800c0-94.5-411-72.4-411-192v90c0 112.5 411 89.5 411 192"
            />
          </g>
          <use
            transform="translate(941) scale(-1 1)"
            fill="url(#g)"
            xlink:href="#f"
          />
          <use
            transform="translate(941) scale(-1 1)"
            fill="url(#a)"
            xlink:href="#e"
          />
          <use
            transform="translate(941) scale(-1 1)"
            fill="url(#a)"
            xlink:href="#c"
          />
          <g fill="url(#j)">
            <path
              id="f"
              d="m649 420c0 99.7-411 81-411 188v90c0-103.7 411-91.8 411-188"
            />
          </g>
        </g>
        <circle
          cx="470.5"
          cy="628"
          r="388.5"
          clip-path="url(#h)"
          fill="none"
          stroke="url(#i)"
          stroke-width="100px"
        />
        <circle cx="470.5" cy="161" r="125" fill="url(#d)" stroke="#555" />
      </svg>
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class WikidatatButtons extends Vue {
  @Prop() taxonName!: string;

  links = {
    wikidata: undefined as string|undefined,
    gbif: undefined as string|undefined,
    enwikipedia: undefined as string|undefined,
    wikipedia: [] as string[],
    wikispecies: undefined as string|undefined
  }

  @Watch('taxonName')
  getData () {
    if (!this.taxonName) return;
    const endpointURL = 'https://query.wikidata.org/sparql'
    const query = `
SELECT DISTINCT ?item ?gbif (group_concat(?page;separator="|") as ?pages)
WHERE {
  ?item wdt:P225 "${this.taxonName}" .
  OPTIONAL { ?item wdt:P846 ?gbif . }
  OPTIONAL { ?page schema:about ?item . }
}
GROUP BY ?item ?gbif
`
    fetch(endpointURL + '?query=' + encodeURIComponent(query), {
      headers: {accept: 'application/sparql-results+json'}
    }).then(r => r.json()).then(j => {
      const result = j.results.bindings[0]
      if (result) {
        this.links.wikidata = result.item?.value
        this.links.gbif = result.gbif?.value
        const pages: string[] = (result.pages?.value || '').split('|')
        if (pages.length) {
          console.log(pages)
          this.links.enwikipedia = pages.find(p => p.match(/^https?:\/\/en\.wikipedia\.org\//))
          this.links.wikispecies = pages.find(p => p.match(/^https?:\/\/species\.wikimedia\.org\//))
          this.links.wikipedia = pages.filter(p => p !== this.links.enwikipedia && p !== this.links.wikispecies)
        }
      }
    })
  }

  mounted () {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  margin-right: -0.2rem;
}

a {
  line-height: calc(.4rem + 24px);
  margin: 0 0.2rem;
}

.button {
  background: #eeeeee;
  display: block;
  border: none;
  border-radius: 0.2rem;
  margin: 0 0.2rem;
  padding: 0.2rem;

  & svg {
    display: block;
    height: 24px;
  }

  &[disabled] {
    background: none;
  }
}

.button.split {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  margin-right: 1px;
}

.button.split + .split {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: .2rem;
  border-top-left-radius: 0;
  border-top-right-radius: .2rem;
  margin-left: 1px;
  margin-right: 0.2rem;
}
</style>