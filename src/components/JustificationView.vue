<template>
  <div>
    <ul>
      <li v-for="j in js.justifications.values()" :key="j.toString()">
        <span class="just" v-for="i in prosaify(j)" :key="i.toString()" v-html="i"/>
      </li>
    </ul>
    <!--{{ Array.from(js.justifications.values()) }}-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import type { JustifiedSynonym, Justification } from '@/SynonymGroup'

@Component
export default class JustifcationView extends Vue {
  @Prop() js!: JustifiedSynonym;

  prosaify (j: Justification): string[] {
    const predececessor: (t: JustifiedSynonym) => string[] = (t) => {
      return this.prosaify([...t.justifications.values()][0])
    }
    return [this.linkify(j.toString())].concat(j.precedingSynonym ? predececessor(j.precedingSynonym) : [])
  }

  linkify (str: string): string {
    const shorten = (s: string) => s.replace(/http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/([^/]*\/)?/g, '').replace(/\/|_/g, ' ')
    return str.replace(/(http:\/\/(taxon-(name|concept)|treatment)\.plazi\.org\/id\/[^ ]*)/g, (_, g) => `<a href="${g}">${shorten(g)}</a>`)
  }
}
</script>

<style scoped lang="scss">
$icon: url('data:image/svg+xml;charset=UTF-8, <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24" width="1em" height="1em"><path fill="gray" d="M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M10,17L15,12L10,7V17Z"></path></svg>');

.just::before {
  display: inline-block;
  content: $icon;
  background-size: 24px 24px;
  height: 1em;
  width: 1em;
  margin: 0 1ch;
  vertical-align: sub;
}

.just:first-child::before {
  content: unset;
}

ul {
  list-style: '— ' outside none;
  padding: 0 0 0 calc(1em + 1ch);
  margin: 0;
}
</style>
<style lang="scss">
/* .just > a:first-child {
  display: none;
} */
</style>
