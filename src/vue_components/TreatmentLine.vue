<template>
  <li>
    <svg
      v-if="type === 'def'"
      class="green"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentcolor"
        d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
    </svg>
    <svg
      v-else-if="type === 'aug'"
      class="blue"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentcolor"
        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
    </svg>
    <svg
      v-else-if="type === 'dpr'"
      class="red"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentcolor"
        d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
      />
    </svg>
    <svg
      v-else
      class="gray"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentcolor"
        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
      />
    </svg>
    <a :href="treat.url">
      <span v-if="treat.details.creators"> {{ treat.details.creators }}</span>
      <span v-else> {{ treat.url }}</span>,
      <span v-if="treat.details.date">{{ treat.details.date }}</span>
      <span v-else>(No Date)</span>
      <span
        v-if="treat.details.title"
        class="title"
      > “{{ treat.details.title }}”</span>
    </a>
    <CitedMaterials :mcs="treat.details.materialCitations" />
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import type { SyncTreatment } from '@/utilities/SynogroupSync'
import CitedMaterials from './CitedMaterials.vue';

@Component({
  components: { CitedMaterials }
})
export default class TreatmentLine extends Vue {
  @Prop() type!: "def"|"aug"|"dpr"|"cite";
  @Prop() treat!: SyncTreatment;
}
</script>

<style scoped lang="scss">
svg {
  height: 1em;
  vertical-align: middle;
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

.gray {
  color: #666666;
}

.mc:not(:last-of-type)::after {
  content: ", "
}

.title {
  opacity: 0.6;
}
</style>
