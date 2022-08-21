<template>
  <!-- eslint-disable vue/require-v-for-key -->
  <div
    v-if="taxa && years"
    :class="collapsed ? 'card collapsed' : 'card'"
    aria-hidden="true"
  >
    <div class="timeline">
      <div class="labels">
        <div class="row">
          <button
            class="label"
            @click.prevent="fullscreen()"
          >
            <svg
              v-if="isFullscreen"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentcolor"
                d="M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z"
              />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
            >
              <path
                fill="currentcolor"
                d="M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z"
              />
            </svg>
          </button>
          <button
            class="label legend"
            @click.prevent="legendOpen = !legendOpen"
          >
            <svg viewBox="0 0 24 24">
              <path
                v-if="legendOpen"
                fill="currentColor"
                d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
              />
              <path
                v-else
                fill="currentColor"
                d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
              />
            </svg>
            <div
              :hidden="!legendOpen"
              class="card"
            >
              <div class="top">
                Explanation:
                <br>
                <div class="small">
                  Each yellow vertical bar represents and links to one treatment.
                </div>
              </div>
              <div class="treatments">
                <div class="treatment">
                  <div class="label">
                    <svg
                      class="green"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentcolor"
                        d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </div><!--
                <div class="label">
                  <svg class="green" viewBox="0 0 24 24">
                    <path fill="currentcolor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"/>
                  </svg>
                </div>
                --><div class="label">
                  <svg
class="blue"
viewBox="0 0 24 24"
>
                    <path
fill="currentcolor"
d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
/>
                  </svg>
                </div>
                  <div class="label">
                    <svg
                      class="red"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentcolor"
                        d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
                      />
                    </svg>
                  </div>
                  <div class="label" />
                </div>
                <div class="labels">
                  <div class="label">
                    T. defines this taxon
                  </div><!--
                <div class="label">
                  Assumed defining treatment
                </div>
                --><div class="label">
                  T. augments this taxon
                </div>
                  <div class="label">
                    T. deprecates this taxon
                  </div>
                  <div class="label">
                    T. ignores this taxon
                  </div>
                </div>
              </div>
              <div class="top">
                <div class="small">
                  If there are multiple treatments in one year, they are combined into one gray bar. Clicking on the year will expand it.
                </div>
              </div>
              <div class="treatments compacted">
                <div class="treatment">
                  <div class="label">
                    <svg
                      class="blue"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentcolor"
                        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </div><div class="label">
                    2
                    <svg
                      class="blue"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentcolor"
                        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  </div>
                  <div class="label">
                    2
                    <svg
                      class="gray"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5M6.5,10.5A1.5,1.5 0 0,0 5,12A1.5,1.5 0 0,0 6.5,13.5A1.5,1.5 0 0,0 8,12A1.5,1.5 0 0,0 6.5,10.5M17.5,10.5A1.5,1.5 0 0,0 16,12A1.5,1.5 0 0,0 17.5,13.5A1.5,1.5 0 0,0 19,12A1.5,1.5 0 0,0 17.5,10.5Z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="labels">
                  <div class="label">
                    As above
                  </div><div class="label">
                    2 t.s augmenting this taxon
                  </div>
                  <div class="label">
                    2 differing t.s
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
        <div class="scroll-opt">
          <!-- NEW -->
          <div
            v-for="taxon in result"
            :key="taxon.taxonConceptUri"
            class="label"
          >
            {{ getFormattedName(taxon.taxonConceptUri) }}
            <spinner v-if="taxon.loading" />
          </div>
          <!-- OLD -->
          <div
            v-for="taxon in taxa"
            :key="taxon.url"
            class="label"
          >
            {{ getFormattedName(taxon.url) }}
            <spinner v-if="taxon.loading" />
          </div>
        </div>
      </div>
      <div class="scroll-x">
        <div
          v-for="year in years"
          :class="year === 'sep' ? 'sep' : 'year'"
          tabindex="0"
          @click="year.exp = !year.exp"
          @keyup.enter.prevent="year.exp = !year.exp"
        >
          <div
            v-if="year !== 'sep'"
            class="label center"
          >
            {{ year.year }}
          </div>
          <div
            v-if="year !== 'sep' && (year.exp || year.treatments.length === 1)"
            class="treatments"
          >
            <a
              v-for="treatment in year.treatments"
              :key="treatment.url"
              class="treatment"
              :href="treatment.url"
              :title="treatment.creators"
            >
              <div
                v-for="dot in treatment.data"
                class="label"
              >
                <svg
                  v-if="dot === 'def'"
                  class="green"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                  />
                </svg>
                <svg
                  v-else-if="dot === 'ass'"
                  class="green"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"
                  />
                </svg>
                <svg
                  v-else-if="dot === 'aug'"
                  class="blue"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                  />
                </svg>
                <svg
                  v-else-if="dot === 'dpr'"
                  class="red"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
                  />
                </svg>
              </div>
            </a>
          </div>
          <div
            v-else-if="!year.exp"
            class="treatments compacted"
          >
            <a
              class="treatment"
              :title="`Click to expand ${year.treatments.length} treatments`"
            >
              <div
                v-for="dot in aggregate(year)"
                class="label"
              >
                {{ dot[0] > 1 ? dot[0] : '' }}
                <svg
                  v-if="dot[1] === 'def'"
                  class="green"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                  />
                </svg>
                <svg
                  v-else-if="dot[1] === 'ass'"
                  class="green"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"
                  />
                </svg>
                <svg
                  v-else-if="dot[1] === 'aug'"
                  class="blue"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                  />
                </svg>
                <svg
                  v-else-if="dot[1] === 'dpr'"
                  class="red"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
                  />
                </svg>
                <svg
                  v-else-if="dot[0] > 0"
                  class="gray"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5M6.5,10.5A1.5,1.5 0 0,0 5,12A1.5,1.5 0 0,0 6.5,13.5A1.5,1.5 0 0,0 8,12A1.5,1.5 0 0,0 6.5,10.5M17.5,10.5A1.5,1.5 0 0,0 16,12A1.5,1.5 0 0,0 17.5,13.5A1.5,1.5 0 0,0 19,12A1.5,1.5 0 0,0 17.5,10.5Z"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div tabindex="0" v-if="collapsed && !isFullscreen" class="expander" @click="collapsed = false">
      Show full timeline
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable comma-dangle */
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import Spinner from '@/components/Spinner.vue'
import type { SyncJustifiedSynonym, SyncTreatment } from '@/utilities/SynogroupSync'

// Required as typescript doesn't know about these nonstandard functions
declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }

  interface Element {
    mozRequestFullScreen?: (..._: any) => any;
    webkitRequestFullscreen?: (..._: any) => any;
    msRequestFullscreen?: (..._: any) => any;
  }
}

type TT = ('def'|'ass'|'aug'|'dpr')

type Year = {
  year: number;
  exp: boolean;
  treatments: {
    data: (TT|false)[]
    url?: string
    creators?: string
  }[]
}

@Component({
  components: { Spinner }
})
export default class Timeline extends Vue {
  @Prop({ default: () => [] }) taxa!: {
    url?: string;
    def: any[];
    aug: any[];
    dpr: any[];
    loading: boolean;
  }[] // OLD

  @PropSync('years', { default: () => [] }) internal!: (Year|'sep')[];

  @Prop({ default: () => [] }) result!: SyncJustifiedSynonym[]

  @Watch('result', { deep: true })
  updateYears () {
    this.collapsed = this.result.length > 7
    if (this.result.length === 0) {
      // empty results => reset
      this.internal = []
      return
    }
    const addTreatment = (index: number, t: SyncTreatment, type: TT) => {
      const date = t.date ?? -1
      const yearIndex = this.internal.findIndex(y => y !== 'sep' && y.year === date)
      if (~yearIndex) {
        // This year already exists
        const year = this.internal[yearIndex] as Year
        const treatmentIndex = year.treatments.findIndex(y => y.url === t.url)
        if (~treatmentIndex) {
          // This treatment already exists
          // year.treatments[treatmentIndex].data.splice(index, 1, type)
          Vue.set(year.treatments[treatmentIndex].data, index, type)
        } else {
          // Add treatment to year
          const data: (TT|false)[] = []
          data.length = this.result.length
          data[index] = type
          year.treatments.push({
            creators: t.creators,
            url: t.url,
            data
          })
        }
      } else {
        // Add year
        const data: (TT|false)[] = []
        data.length = this.result.length
        data[index] = type
        this.internal.push({
          year: date,
          exp: false,
          treatments: [{
            creators: t.creators,
            url: t.url,
            data
          }]
        })
      }
    }

    this.result.forEach((v, i) => {
      v.treatments.def.forEach(t => addTreatment(i, t, 'def'))
      v.treatments.aug.forEach(t => addTreatment(i, t, 'aug'))
      v.treatments.dpr.forEach(t => addTreatment(i, t, 'dpr'))
    });

    // Sort

    (this.internal as Year[]).sort((a, b) => {
      if (a.year < b.year) {
        return -1
      }
      if (a.year > b.year) {
        return 1
      }
      return 0
    })

    // Fill

    this.internal.forEach(y => {
      if (y === 'sep') { return }
      y.treatments.forEach(t => {
        t.data = t.data.concat(Array(this.result.length - t.data.length).fill(false))
      })
    })
  }

  mounted () {
    this.updateYears()
  }

  isFullscreen = false;
  collapsed = true;
  legendOpen = false;

  aggregate (year: Year) {
    const length = this.result.length || this.taxa.length
    const result: (TT|false)[][] = []
    for (let i = 0; i < length; i++) {
      result[i] = year.treatments.map(a => {
        return a.data[i]
      })
    }
    return result.map(a => {
      const def = a.filter(d => d === 'def').length
      const ass = a.filter(d => d === 'ass').length
      const aug = a.filter(d => d === 'aug').length
      const dpr = a.filter(d => d === 'dpr').length
      if (+!!def + +!!ass + +!!aug + +!!dpr > 1) return [a.filter(d => d).length, 'multiple']
      else return [a.filter(d => d).length, a.filter(d => d)[0]]
    })
  }

  getFormattedName (uri: string) {
    const nameSection = uri.substring(uri.lastIndexOf('/') + 1)
    const lastSeparator = nameSection.lastIndexOf('_')
    return nameSection.substring(0, lastSeparator)
      .replace(new RegExp('_', 'g'), ' ') +
      ', ' +
      nameSection.substring(lastSeparator + 1)
  }

  fullscreen () {
    if (this.isFullscreen) {
      document.body.classList.remove('fullscreen-on')
      this.$el.classList.remove('fullscreen')
      this.isFullscreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    } else {
      document.body.classList.add('fullscreen-on')
      this.$el.classList.add('fullscreen')
      this.isFullscreen = true
      if (this.$el.requestFullscreen) {
        this.$el.requestFullscreen()
      } else if (this.$el.mozRequestFullScreen) {
        this.$el.mozRequestFullScreen()
      } else if (this.$el.webkitRequestFullscreen) {
        this.$el.webkitRequestFullscreen((Element as any).ALLOW_KEYBOARD_INPUT)
      } else if (this.$el.msRequestFullscreen) {
        this.$el.msRequestFullscreen()
      }
    }
  }

  exampleYears = [
    {
      year: 1884,
      treatments: [
        { data: ['ass', false, false, false, false] },
        { data: [false, 'def', false, false, false] },
      ]
    },
    {
      year: 1888,
      treatments: [
        { data: [false, false, false, false, 'ass'] },
      ]
    },
    'sep',
    {
      year: 1969,
      treatments: [
        { data: [false, false, 'ass', false, false] },
      ]
    },
    {
      year: 1988,
      treatments: [
        { data: [false, false, false, 'ass', false] },
      ]
    },
    'sep',
    {
      year: 2010,
      treatments: [
        { data: ['aug', 'dpr', 'dpr', 'dpr', 'dpr'], url: 'https://example.org/' },
        { data: ['aug', 'dpr', false, false, false], url: 'https://example.org/' },
      ]
    },
    {
      year: 2012,
      treatments: [
        { data: [false, false, 'aug', false, false] },
      ]
    },
  ]
}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

html {
  font-size: 25px;
}

.card {
  padding: 0 !important;
  overflow: hidden;
}

.card.collapsed {
  max-height: 18rem;
  position: relative;
}

.expander {
  --fade-height: 2rem;
  background: linear-gradient(#ffffff00 0, #ffffffff var(--fade-height), #ffffffff 100%);
  bottom: 0;
  color: #388e3c;
  display: block;
  font-style: italic;
  padding: var(--fade-height) 0.5rem 0.5rem;
  position: absolute;
  text-align: center;
  width: 100%;

  &:hover,
  &:focus {
    color: #000000;
  }
}

.timeline {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.scroll-x {
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  padding: .8rem 0 .4rem;

  &>*:last-child {
    padding-right: .8rem;
  }
}

.row {
  display: flex;
}

.legend {
  margin-left: 0.8rem;
  position: relative;

  .card {
    line-height: 1.8rem;
    position: absolute;
    top: 34px;
    left: -1px;
    margin: 0;
    background: white;
    border: 1px solid grey;
    border-radius: 0.2rem;
    box-shadow: 2px 4px 9px -4px #212121;
    z-index: 900;
    width: min-content;

    &[hidden] {
      display: none;
    }
  }

  .top {
    text-align: left;
    margin-left: 3rem;
  }

  .small {
    white-space: normal;
    font-size: 0.8rem;
    line-height: normal;
  }

  .label {
    background: none !important;
  }

  .label:nth-child(6n+2),
  .label:nth-child(6n+4){
    background-color: #0000000f !important;
  }

  .labels {
    margin-top: 0.8rem;
    padding: 0;
    border-right: none;
    flex: auto;
  }

  svg {
    height: 1em;
    vertical-align: top;
    //margin: 0 0.4rem 0 0.8rem;
  }
}

@media (max-width: 65rem) {
  .scroll-x {
    min-width: 140px;
    max-width: 65%;
    flex: 1 1 auto;
  }

  .timeline > .labels {
    min-width: 35%;
    flex: 1 0.5 auto;

    & > .scroll-opt {
      overflow-x: auto;
      padding: 0 .8rem .8rem .8rem;
      margin: 0 -.8rem -.8rem -.8rem;
    }
  }
}

.treatments {
  display: flex;
  flex-direction: row;
}

.treatment {
  display: block;
  margin: .4rem;
  padding: .4rem 0;
  background-color: beige;
  border-radius: .4rem;

  .label {
    justify-content: center;
  }

  .label:nth-child(6n+2),
  .label:nth-child(6n+4){
    background-color: #0000000f;
  }

  .label:nth-child(6n) {
    background: #0000001f;
  }
}

.compacted .treatment {
  background-color: #0000000f;
}

.labels {
  font-size: 1rem;
  margin: 0;
  padding: .8rem;
  border-right: 1px solid #ccc;
  background-color: white;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow: visible;

  .label:nth-child(6n+2),
  .label:nth-child(6n+4){
    background-color: #0000000f;
    border-radius: .2rem;
  }

  .label:nth-child(6n) {
    background: #0000001f;
    border-radius: .2rem;
  }

  .label:nth-child(1) {
    background: none;
  }
}

.year {
  font-size: 1rem;
  line-height: 1.8rem;
  margin: 0;
  padding: 0 .4rem;
}

.label {
  height: 1.8rem;
  line-height: 1.8rem;
  padding: 0 .4rem;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
}

button.label {
  background: #ffffff;
  border-radius: .2rem;
  display: block;
  font: inherit;
  border: 1px solid grey;
  margin-bottom: .8rem;
}

.label>svg {
  height: 1rem;
  margin-top: .4rem
}

.sep {
  width: 0px;
  border-left: 2px dotted grey;
}

.center {
  display: block;
  text-align: center;
  padding: 0;
  cursor: pointer;
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

.gray {
  color: #666666;
}
</style>
