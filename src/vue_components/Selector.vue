<template>
  <div>
    <label
      v-for="o in options"
      :key="o"
    >
      <input
        v-model="val"
        type="radio"
        :value="o"
        name="server"
      >{{ o }}
    </label>
    <label>
      <input
        v-model="val"
        type="radio"
        :value="custom"
        name="server"
      >Custom:<input
        v-model="custom"
        type="text"
        @click="val = custom"
      >
    </label>
  </div>
</template>

<script lang="ts">
/* eslint-disable comma-dangle */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class Selector extends Vue {
  @Prop() options!: string[];
  @Prop() value!: string;
  val = ''
  custom = 'https://'

  @Watch('value')
  changeVal (v: string) {
    if (this.options.indexOf(v) === -1) {
      this.custom = v
    }
    this.val = v
  }

  @Watch('val')
  @Watch('custom')
  changeValue (v: string) {
    this.$emit('input', v)
  }

  mounted () {
    this.changeVal(this.value)
  }
}
</script>

<style scoped lang="scss">
div {
  margin: 0.4rem 0;
}

label {
  display: block;
  line-height: 1.8rem;
  font-size: 1rem;
}

input[type=radio] {
  margin-right: 0.4rem;
}

input[type=text] {
  display: inline-block;
  padding: 0 0.4rem;
  margin: 0 0.4rem;
  border-radius: 0.2rem;
  border: 1px solid #00000033;
  width: 290px;
  line-height: 1.8rem;
  font-size: 1rem;
}
</style>