<template>
  <details>
    <summary>
      Treatments
      (<spinner v-if="js.loading"/><svg v-for="n in js.treatments.def.length" :key="n + 'def'" class="green" viewBox="0 0 24 24">
        <path fill="currentcolor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
      <svg v-for="n in js.treatments.aug.length" :key="n + 'aug'" class="blue" viewBox="0 0 24 24">
        <path fill="currentcolor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
      <svg v-for="n in js.treatments.dpr.length" :key="n + 'dpr'" class="red" viewBox="0 0 24 24">
        <path fill="currentcolor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
      </svg>)
    </summary>
    <div>
      Augmenting Treatments:
      <ul class="nobullet">
        <li
          v-for="t in js.treatments.def"
          :key="t.url"
        >
          <svg class="green" viewBox="0 0 24 24">
            <path fill="currentcolor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
          <a :href="t.url">
            {{ t.creators }} ({{ t.date }}) <code>{{ t.url.substring(t.url.indexOf('/id/') + 4) }}</code>
          </a>
          <!--<ul v-if="deprecates.find(d => d.url === t.url)">
            <li v-for="d in deprecates.filter(d => d.url === t.url)" :key="d.old">
              Deprecates {{ getFormattedName(d.old) }}
            </li>
          </ul>-->
        </li>
        <li v-if="!js.treatments.def.length">
          <svg class="green" viewBox="0 0 24 24">
            <path fill="currentcolor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z"/>
          </svg>
          Defining treatment not yet on Plazi
        </li>
        <li
          v-for="t in js.treatments.aug"
          :key="t.url"
        >
          <svg class="blue" viewBox="0 0 24 24">
            <path fill="currentcolor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
          <a :href="t.url">
            {{ t.creators }} ({{ t.date }}) <code>{{ t.url.substring(t.url.indexOf('/id/') + 4) }}</code>
          </a>
          <!--<ul v-if="deprecates.find(d => d.url === t.url)">
            <li v-for="d in deprecates.filter(d => d.url === t.url)" :key="d.old">
              Deprecates {{ getFormattedName(d.old) }}
            </li>
          </ul>-->
        </li>
      </ul>
    </div>
    <div v-if="js.treatments.dpr.length">
      Deprecating Treatments:
      <ul class="nobullet">
        <li
          v-for="t in js.treatments.dpr"
          :key="t.url"
        >
          <svg class="red" viewBox="0 0 24 24">
            <path fill="currentcolor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
          </svg>
          <a :href="t.url">
            {{ t.creators }} ({{ t.date }}) <code>{{ t.url.substring(t.url.indexOf('/id/') + 4) }}</code>
          </a>
          <!--<ul v-if="deprecations.find(d => d.url === t.url)">
            <li v-for="d in deprecations.filter(d => d.url === t.url)" :key="d.new">
              Deprecated by {{ getFormattedName(d.new) }}
            </li>
          </ul>-->
        </li>
      </ul>
    </div>
  </details>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import type { JustifiedSynonym } from '@/SynonymGroup'
import Spinner from '@/components/Spinner.vue'

@Component({
  components: { Spinner }
})
export default class TreatmentView extends Vue {
  @Prop() js!: JustifiedSynonym;
}
</script>

<style scoped lang="scss">
svg {
  height: 1em;
  vertical-align: middle;
  margin: 0;
}

ul,
ul.nobullet ul {
  list-style: '— ' outside none;
}

ul.nobullet {
  list-style: none;

  svg {
    margin: 0 0 3px calc(-.5ch - 1em);
  }
}

p,
ul {
  padding: 0 0 0 calc(1em + 1ch);
  margin: 0;
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
