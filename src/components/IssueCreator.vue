<template>
  <div>
    <div @click="openModal" ref="slot">
      <slot></slot>
    </div>
    <div
      class="backdrop"
      @click="closeModal"
      :hidden="!open"
    >
      <div
        class="modal"
        ref="modal"
        @click.stop="/* do nothing */"
      >
        <div class="modal-header">
          <h2>Report Error</h2>
          <button @click="closeModal">Close</button>
        </div>
        <div class="modal-body">
          <div class="accordion">
            <div :data-open="accordion === 0">
              <div class="accordion-header" @click="accordion === 0 ? accordion = -1 : accordion = 0">
                <h3>Select offending taxon</h3>
              </div>
              <div class="list">
                <label
                  v-for="tc in taxonConceptList"
                  :key="tc.taxonConceptUri"
                >
                  <input
                    type="radio"
                    name="offending-taxon"
                    :value="tc.taxonConceptUri"
                    v-model="selectedTC"
                  >
                  {{ tc.taxonConceptUri }}
                </label>
              </div>
            </div>
            <div :data-open="accordion === 1">
              <div class="accordion-header" @click="accordion === 1 ? accordion = -1 : accordion = 1">
                <h3>Select Justification Step (optional)</h3>
              </div>
              <div class="list">
                <div v-if="!selectedTC">Please select a taxon first</div>
                <label
                  v-else
                  v-for="j in justificationSteps"
                  :key="j"
                >
                  <input
                    type="radio"
                    name="offending-taxon"
                    :value="j"
                    v-model="selectedJ"
                  >
                  {{ j }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { SyncJustifiedSynonym } from '@/utilities/SynogroupSync';

const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

@Component({})
export default class IssueCreator extends Vue {
  @Prop() input!: string
  @Prop() taxonConceptList!: SyncJustifiedSynonym[]
  @Prop() taxonConcept?: string
  @Prop() justification?: string

  focusableElements: HTMLElement[] = []

  selectedTC = ''
  selectedJ = ''
  justificationSteps: string[] = []

  open = false
  accordion = 0

  openModal () {
    if (this.taxonConcept) {
      this.selectedTC = this.taxonConcept
      this.accordion = 1
    }
    this.selectedTC = this.taxonConcept ?? ''
    this.open = true
    this.focusableElements = (this.$refs.modal as any).querySelectorAll(FOCUSABLE_SELECTORS)
    this.focusableElements[0].focus()
    this.focusableElements[0].addEventListener('keydown', event => {
      if (event.key !== 'Tab' || !event.shiftKey) return;
      event.preventDefault();
      this.focusableElements[this.focusableElements.length - 1].focus()
    })
    this.focusableElements[this.focusableElements.length - 1].addEventListener('keydown', event => {
      if (event.key !== 'Tab'|| event.shiftKey) return;
      event.preventDefault();
      this.focusableElements[0].focus()
    })
  }

  closeModal () {
    (this.$refs.slot as any).focus()
    this.open = false
  }

  @Watch('selectedTC')
  async getJustification () {
    if (!this.selectedTC) {
      this.justificationSteps = []
      return
    }
    let result: string[] = []
    let start = this.taxonConceptList.find(tc => this.selectedTC === tc.taxonConceptUri)?.justifications
    if (!start) {
      this.justificationSteps = []
      return
    }
    if (!start[0].precedingSynonym) {
      result.push(this.selectedTC + ' ' + start[0].toString())
    } else {
      let pc = start[0].precedingSynonym
      let next = await pc.justifications.first()
      let finished = false
      while (!finished) {
        if (next.precedingSynonym) {
          result.push(next.toString())
          pc = next.precedingSynonym
          next = await pc.justifications.first()
        } else {
          result.push(pc.taxonConceptUri + ' ' + next.toString())
          finished = true
        }
      }
    }
    console.log(result)
    this.justificationSteps = result
  }
}
</script>

<style>
.accordion > div h3::before {
  content: '> ';
}

.accordion > div[data-open=true] h3::before {
  content: '^ ';
}

.accordion > div > .list {
  display: none;
}

.accordion > div[data-open=true] > .list {
  display: block;
}

.backdrop {
  background: #00000033;
  bottom: 0;
  left: 0;
  padding: max(10vh, 1rem) max(20vw, 1rem);
  position: fixed;
  right: 0;
  top: 0;
  z-index: 3000;
}

.list label {
  display: block;
}

.modal {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  max-width: 100%;
  overflow: auto;
}

.modal-body {
  flex: 1;
  padding: 0 1rem 1rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}
</style>