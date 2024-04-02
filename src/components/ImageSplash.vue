<template>
  <!-- eslint-disable vue/require-v-for-key -->
  <div
    v-if="images.length > 0"
    :class="images.length <= 2 ? 'twocol card' : images.length === 3 ? 'threecol card' : 'card'"
    style="margin-top: 2rem;"
  >
    <figure
      v-for="image in (loadAll ? images : images.slice(0, 7))"
      :key="image.url"
      :title="'Click to show details\n' + image.url"
      tabindex="0"
      @click="e => e.currentTarget.classList.toggle('open')"
      @keyup.space="e => e.currentTarget.classList.toggle('open')"
      @keyup.enter="e => e.currentTarget.classList.toggle('open')"
    >
      <img
        :src="image.url"
        :alt="image.description||''"
        loading="lazy"
      >
      <figcaption>
        <div>{{ image.description||'' }}</div>
        <a :href="image.url">{{ image.url }}</a>
      </figcaption>
    </figure>
    <button
      v-if="!loadAll && images.length > 7"
      @click="loadAll = true"
    >
      Load all {{ images.length }} images
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import type { FigureCitation } from '@factsmission/synogroup'

@Component
export default class ImageSplash extends Vue {
  @Prop() images!: FigureCitation[];
  loadAll = false;
}
</script>

<style scoped lang="scss">
.card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  // grid-template-rows: repeat(2, 1fr);
  column-gap: 0.5em;
  row-gap: 0.5em;
  gap: 0.5em;
}

.twocol {
  grid-template-columns: repeat(2, 1fr);
}

.threecol {
  grid-template-columns: repeat(3, 1fr);
}

img {
  width: 100% !important;
  height: auto !important;
  display: block;
}

figure {
  margin: 0;
  width: 100%;

  & figcaption {
    display: none;
  }

  &:hover,
  &:focus {
    outline: 1px solid green;
  }
}

figure.open {
  position: fixed;
  z-index: 2000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 3rem;
  background: #ffffffee;
  overflow: auto;

  & img {
    box-shadow: 1px 3px 8px -4px #333;
  }

  & figcaption {
    display: block;
    // font-size: 0.8rem;

    & div {
      font-family: serif;
    }

    & a {
      display: block;
      padding: 1rem 0;
    }

    &::after {
      content: 'click anywhere to close';
      color: #666666;
    }

  }
}

button {
  border: none;

  &:hover,
  &:focus {
    outline: 1px solid green;
  }
}
</style>
