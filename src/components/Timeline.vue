<template>
  <!-- eslint-disable vue/require-v-for-key -->
  <div
    v-if="result || _years"
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
              Explanation:
              <div class="small">
                Each yellow vertical bar represents and links to one treatment.
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
                  <div class="label">
                    <svg
                      class="blue"
                      viewBox="0 0 24 24"
                    ><path
                      fill="currentcolor"
                      d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                    /></svg>
                  </div>
                </div>
                <div class="">
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
                  <div class="label">
                    T. cites this taxon
                  </div>
                  <div class="small">
                    Note that a treatment might cite taxon concepts and names not indicated,
                    only citations are shown for taxons concepts found via other links.
                  </div>
                </div>
              </div>
              <div class="small">
                If there are multiple treatments in one year, they are combined into one gray bar. Clicking on the year will expand it.
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
                <div>
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
        <div>
          <!-- NEW -->
          <div
            v-for="taxon in result"
            :key="taxon.taxonConceptUri"
            class="label"
          >
            <span v-if="taxon.taxonConceptAuthority">
              {{ taxon.taxonName.displayName || getFormattedName(taxon.taxonName.uri) }}
              <span class="gray">{{ taxon.taxonConceptAuthority }}</span>
            </span>
            <span v-else>{{ getFormattedName(taxon.taxonConceptUri) }}</span>
            <dot-spinner v-if="taxon.loading" />
          </div>
        </div>
      </div>
      <div class="scroll-x">
        <div
          v-for="year in _years"
          :class="year === 'sep' ? 'sep' : 'year'"
          tabindex="0"
          @click="(year !== 'sep') && (year.exp = !year.exp)"
          @keyup.enter.prevent="(year !== 'sep') && (year.exp = !year.exp)"
        >
          <div
            v-if="year !== 'sep'"
            class="label center"
          >
            <span v-if="year.year > 0">{{ year.year }}</span>
            <abbr
              v-else
              title="year missing in RDF data"
            >?</abbr>
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
                v-for="(dot,i) in treatment.data"
                :class="!dot && result[i].loading ? 'label loading' : 'label'"
                @animationstart="snycAnimations"
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
                  v-else-if="dot === 'cite'"
                  class="gray"
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
            v-else-if="year !== 'sep' && !year.exp"
            class="treatments compacted"
          >
            <a
              class="treatment"
              :title="`Click to expand ${year.treatments.length} treatments`"
            >
              <div
                v-for="(dot,i) in aggregate(year)"
                :class="dot[0] < dot.length && result[i].loading ? 'label loading' : 'label'"
                @animationstart="snycAnimations"
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
                  v-else-if="dot[1] === 'cite'"
                  class="gray"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentcolor"
                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
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
    <button
      v-if="collapsed && result.length > 7 && !isFullscreen"
      tabindex="0"
      class="expander"
      @click="collapsed = false"
    >
      Show full timeline
    </button>
  </div>
</template>

<script lang="ts">
/* eslint-disable comma-dangle */
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator'
import DotSpinner from '@/components/DotSpinner.vue'
import type { SyncJustifiedSynonym, SyncTreatment } from '@/utilities/SynogroupSync'

// Required as typescript doesn't know about these nonstandard functions
declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }

  interface Element {
    mozRequestFullScreen?: (..._: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    webkitRequestFullscreen?: (..._: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    msRequestFullscreen?: (..._: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

type TT = ('def'|'ass'|'aug'|'dpr'|'cite')

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
  components: { DotSpinner }
})
export default class Timeline extends Vue {
  @PropSync('years', { default: () => [] }) _years!: (Year|'sep')[];

  @Prop({ default: () => [] }) result!: SyncJustifiedSynonym[]

  @Watch('result', { deep: true })
  updateYears () {
    // this.collapsed = this.result.length > 7
    if (this.result.length === 0) {
      // empty results => reset
      this._years = []
      return
    }
    const addTreatment = (index: number, t: SyncTreatment, type: TT) => {
      const date = t.details.date ?? -1
      const yearIndex = this._years.findIndex(y => y !== 'sep' && y.year === date)
      if (~yearIndex) {
        // This year already exists
        const year = this._years[yearIndex] as Year
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
            creators: t.details.creators,
            url: t.url,
            data
          })
        }
      } else {
        // Add year
        const data: (TT|false)[] = []
        data.length = this.result.length
        data[index] = type
        this._years.push({
          year: date,
          exp: false,
          treatments: [{
            creators: t.details.creators,
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
      v.treatments.cite.forEach(t => addTreatment(i, t, 'cite'))
    });

    // Sort

    this._years.sort((a, b) => {
      if (a === "sep" || b === "sep") return 0;
      if (a.year < b.year) {
        return -1
      }
      if (a.year > b.year) {
        return 1
      }
      return 0
    });

    // Fill

    this._years.forEach(y => {
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

  aggregate (year: Year): [number, TT|"multiple"][] {
    const length = this.result.length;
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
      const cite = a.filter(d => d === 'cite').length
      if (+!!def + +!!ass + +!!aug + +!!dpr + +!!cite > 1) return [a.filter(d => d).length, 'multiple'] as [number, "multiple"]
      else return [a.filter(d => d).length, a.filter(d => d)[0]] as [number, TT]
    })
  }

  getFormattedName (uri = "URI MISSING") {
    const nameSection = (uri as string).substring((uri as string).lastIndexOf('/') + 1)
    // const lastSeparator = nameSection.lastIndexOf('_')
    // return nameSection.substring(0, lastSeparator)
    //   .replace(new RegExp('_', 'g'), ' ') +
    //   ', ' +
    //   nameSection.substring(lastSeparator + 1)
    return nameSection.replace(/_/g, ' ')
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.$el.webkitRequestFullscreen((Element as any).ALLOW_KEYBOARD_INPUT)
      } else if (this.$el.msRequestFullscreen) {
        this.$el.msRequestFullscreen()
      }
    }
  }

  snycAnimations(e: AnimationEvent) {
    if (e.animationName.startsWith("shimmer") && e.target) {
      const a = (e.target as Element).getAnimations({ subtree: true })[0];
      if (!a) return;
      if (!a.startTime || (a.startTime as number) > 0.01) a.startTime = 0;
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  padding: 0 !important;
  overflow: hidden;
}

.card.collapsed {
  max-height: 18rem;
  position: relative;
}

.expander {
  --fade-height: 2em;
  background: linear-gradient(#ffffff00 0, #ffffffff var(--fade-height), #ffffffff 100%);
  bottom: 0;
  color: #388e3c;
  display: block;
  font-style: italic;
  padding: var(--fade-height) 0.5rem 0.5rem;
  position: absolute;
  text-align: center;
  width: 100%;
  border: none;

  &:hover,
  &:focus {
    color: #000000;
  }
}

.timeline {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-width: 280px;
}

.scroll-x {
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  gap: .6rem;
  padding: .6rem 0 .2rem .6rem;
  min-width: 140px;
  flex: 1 0.5 content;
  max-width: calc(100% - max(40%,140px));

  background-image: 
    /* Shadow Cover LEFT */
    linear-gradient(to right, white 50%, rgb(255 255 255 / 0%)),
    /* Shadow Cover RIGHT */
    linear-gradient(to left, white 50%, rgb(255 255 255 / 0%)),
    /* Shadow LEFT */
    linear-gradient(to right, rgb(100 100 100 / 20%), rgb(255 255 255 / 0%)),
    /* Shadow RIGHT */
    linear-gradient(to left, rgb(100 100 100 / 20%), rgb(255 255 255 / 0%));
  background-attachment: local, local, scroll, scroll;
  background-position: left, right, left, right;
  background-repeat: no-repeat;
  background-size: .6rem, .6rem, .5rem, .5rem;
  border-radius: 0 8px 8px 0;

  &>*:last-child {
    padding-right: .6rem;
  }
}

.row {
  display: flex;
  margin-bottom: .25rem;
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

.treatments {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.treatment {
  display: block;
  margin: 0 .25rem;
  padding: .25rem 0;
  border-radius: .4rem;
  position: relative;

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

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: beige;
    border-radius: .4rem;
    z-index: -1;
  }
}

.compacted .treatment::before {
  background-color: #0000000f;
}

.labels {
  font-size: 1rem;
  margin: 0;
  padding: .6rem 0 .6rem .6rem;
  border-right: 1px solid #ccc;
  background-color: white;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow: visible;
  flex: 0 1 content;
  min-width: max(140px, 40%);
  max-width: calc(100% - 140px);
  .label {
    align-items: center;

    & > span {
      min-width: 0;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .label:nth-child(6n+2),
  .label:nth-child(6n+4){
    background-color: #0000000f;
    border-radius: .2rem 0 0 .2rem;
  }

  .label:nth-child(6n) {
    background: #0000001f;
    border-radius: .2rem 0 0 .2rem;
  }

  .label:nth-child(1) {
    background: none;
  }
}

.year {
  font-size: 1rem;
  line-height: 1.8rem;
  margin: 0;
  // padding: 0 .4rem;
}

.label {
  height: 1.8rem;
  line-height: 1.8rem;
  padding: 0 .4rem;
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
}

.treatment .label.loading {
  position: relative;
  overflow: hidden;
}
.treatment .label.loading::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient( 90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) );
  animation: shimmer 2s infinite;
  content: '';
}
@keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

button.label {
  background: #ffffff;
  border-radius: .2rem !important;
  display: block;
  font: inherit;
  border: 1px solid grey;
}

.label>svg {
  height: 1rem;
  margin-top: .4rem
}

.sep {
  width: 0px;
  border-left: 2px dotted grey;
}

:fullscreen {
  .labels, .scroll-x {
    flex: 0 0 content;
  }

  .card.collapsed {
    max-height: unset;
  }

  .timeline {
    height: 100vh;
    overflow: auto;
    width: 100vw;
  }
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
