<template>
  <!-- eslint-disable vue/require-v-for-key -->
  <div :class="images.length <= 2 ? 'twocol card' : images.length === 3 ? 'threecol card' : 'card'">
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

type Image = {
  url: string;
  description?: string;
}

@Component
export default class ImageSplash extends Vue {
  @Prop() taxa!: {[key: string]: any}[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Prop() taxamanager!: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  // functions as a way to check whether there's a new search going on or if there's just some new taxa
  firstTaxaUrl?: string = undefined
  images: Image[] = []
  loadAll = false

  @Watch('taxa')
  splash () {
    if (this.taxa[0]?.url !== this.firstTaxaUrl) {
      this.images = []
      this.firstTaxaUrl = this.taxa[0]?.url
    }
    this.taxa.forEach((taxon) => {
      this.taxamanager.getImages(taxon.url).then((images: Image[]) => {
        images.forEach(i => {
          if (!~this.images.findIndex(j => j.url === i.url)) {
            this.images.push(i)
          }
        })
      })
    })
  }

  clear () {
    this.images = []
  }
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
      color: gray;
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
