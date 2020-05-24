<template>
<!-- eslint-disable vue/require-v-for-key -->
<div class="card" v-if="names && years">
  <div class="timeline">
    <div class="labels">
      <div class="label"></div>
      <div class="label" v-for="name in names" :key="name" > {{ getFormattedName(name) }} </div>
    </div>
    <div class="sep">
    </div>
    <div class="scroll-x">
      <div v-for="year in years" :class="year === 'sep' ? 'sep' : 'year'">
        <div class="label center" v-if="year !== 'sep'"> {{ year.year }} </div>
        <div class="treatments" v-if="year !== 'sep'">
          <div class="treatment" v-for="treatment in year.treatments">
            <div class="label" v-for="dot in treatment.data">
              <svg v-if="dot === 'def'" class="green" viewBox="0 0 24 24">
                <path fill="currentcolor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              <svg v-else-if="dot === 'ass'" class="green" viewBox="0 0 24 24">
                <path fill="currentcolor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"/>
              </svg>
              <svg v-else-if="dot === 'aug'" class="blue" viewBox="0 0 24 24">
                <path fill="currentcolor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
              </svg>
              <svg v-else-if="dot === 'dpr'" class="red" viewBox="0 0 24 24">
                <path fill="currentcolor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="label">
    <svg class="green" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
    </svg>
    Defining treatment
  </div>
  <!--<div class="label">
    <svg class="green" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"/>
    </svg>
    Assumed defining treatment
  </div>-->
  <div class="label">
    <svg class="blue" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
    </svg>
    Augmenting treatment
    <br>
  </div>
  <div class="label">
    <svg class="red" viewBox="0 0 24 24">
      <path fill="currentcolor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
    </svg>
    Deprecating treatment
    <br>
  </div>
</div>
</template>

<script lang="ts">
/* eslint-disable comma-dangle */
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Timeline extends Vue {
  @Prop() names!: string[];
  @Prop() years!: ({ year: number; treatments: { data: ('def'|'ass'|'aug'|'dpr'|false)[]; url?: string }[] }|'sep')[];

  getFormattedName (uri: string) {
    const nameSection = uri.substring(uri.lastIndexOf('/') + 1)
    const lastSeparator = nameSection.lastIndexOf('_')
    return nameSection.substring(0, lastSeparator)
      .replace(new RegExp('_', 'g'), ' ') +
      ', ' +
      nameSection.substring(lastSeparator + 1)
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

.timeline {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.scroll-x {
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  width: 100%;
}

@media (max-width: 140ch) {
  .timeline {
    overflow-x: auto;
  }

  .scroll-x {
    overflow-x: initial;
    width: initial;
  }
}

.treatments {
  display: flex;
  flex-direction: row;
}

.treatment {
  margin: .4rem;
  padding: .4rem 0;
  background-color: beige;
  border-radius: .4rem;

  .label:nth-child(6n+2),
  .label:nth-child(6n+4){
    background-color: #0000000f;
  }

  .label:nth-child(6n) {
    background: #0000001f;
  }
}

.labels {
  font-size: 1rem;
  margin: 0 .8rem;
  padding: .8rem .4rem;

  // Offset by 1 because of the empty label on top for spacing
  .label:nth-child(6n+3),
  .label:nth-child(6n+5){
    background-color: #0000000f;
    border-radius: .2rem;
  }

  .label:nth-child(6n+1) {
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
  text-align: center;
  padding: 0;
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
