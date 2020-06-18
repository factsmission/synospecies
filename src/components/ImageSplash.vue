<template>
<!-- eslint-disable vue/require-v-for-key -->
<div :class="images.length <= 2 ? 'twocol card' : images.length === 3 ? 'threecol card' : 'card'">
  <figure
    v-for="image in images"
    :key="image.url"
  >
    <img
      :src="image.url"
      :alt="image.description||''"
    />
    <figcaption>
      {{ image.description||'' }}
    </figcaption>
  </figure>
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

  images: Image[] = []

  @Watch('taxa')
  splash () {
    this.images = []
    this.taxa.forEach((taxon) => {
      this.taxamanager.getImages(taxon.value).then((images: Image[]) => {
        this.images = this.images.concat(images)
        this.images = this.images.filter((item, index) => this.images.findIndex(i => i.url === item.url) === index)
      })
    })
  }
}
</script>

<style scoped lang="scss">
div {
  -webkit-column-count: 4;
  -webkit-column-gap: 0.5em;
  -moz-column-count: 4;
  -moz-column-gap: 0.5em;
  column-count: 4;
  column-gap: 0.5em;
}

.twocol {
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;
}

.threecol {
  -webkit-column-count: 3;
  -moz-column-count: 3;
  column-count: 3;
}

img {
  width: 100% !important;
  height: auto !important;
}

figure {
  margin: 0.5rem;
  width: 100%;

  &:not(:last-child) {
    padding-bottom: 0.5em;
    border-bottom: 1px solid #00000033;
  }

  & figcaption {
    /*background-color: #7d7d7d54;
      padding: .5em;*/
    padding: 0.5rem 0;
    font-size: 0.8rem;
    font-family: serif;
  }
}
</style>
