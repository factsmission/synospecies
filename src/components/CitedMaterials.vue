<template>
  <div
    v-if="mcs.length > 0"
    style="margin-left: 0.4rem;"
  >
    <div
      class="dropdown"
      :data-open="open"
    >
      <button @click="open = !open">
        <div class="icon">
          <svg
            viewBox="0 0 24 24"
            :title="open ? 'hide' : 'show'"
          >
            <path
              fill="currentColor"
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            />
          </svg>
        </div>
        {{ mcs.length > 1 ? `${mcs.length} material citations` : `Material citation` }}
        {{ mcs.find(mc => mc.typeStatus?.toLocaleLowerCase().includes('holotype')) ? '(incl. holotype)' : '' }}
      </button>
      <div class="dropdown_menu">
        <table>
          <tr
            v-for="mc in mcs"
            :key="JSON.stringify(mc)"
            :title="pretty(mc)"
          >
            <td :class="`mc_type ${mc.typeStatus?.toLocaleLowerCase().includes('holotype') ? 'green' : ''}`">
              {{ mc.typeStatus?.[0].toUpperCase() }}
            </td>
            <td class="mc_code">
              {{ mc.collectionCode }}<span
                v-if="mc.collectionCode"
              >:</span>
              {{ mc.collectionCode && mc.catalogNumber.startsWith(mc.collectionCode) ? mc.catalogNumber.slice(mc.collectionCode.length) : mc.catalogNumber }}
            </td>
            <td
              v-if="mc.eventDate"
              class="mc_date"
            >
              ({{ date(mc) }})
            </td>
            <td v-else />
            <td class="mc_links">
              <a
                v-for="uri in mc.httpUri"
                v-if="(!mc.gbifSpecimenId || !uri.endsWith(mc.gbifSpecimenId)) && (!mc.gbifOccurrenceId || !uri.endsWith(mc.gbifOccurrenceId))"
                :href="uri"
              >Link ➶</a>
            </td>
            <td
              v-if="mc.gbifSpecimenId || mc.gbifOccurrenceId"
              class="mc_links"
            >
              <small>GBIF:</small> <a
                v-if="mc.gbifSpecimenId"
                :href="'https://www.gbif.org/specimen/' + mc.gbifSpecimenId"
              >Specimen</a> <a
                v-if="mc.gbifOccurrenceId"
                :href="'https://www.gbif.org/occurrence/' + mc.gbifSpecimenId"
              >Occurrence</a>
            </td>
          </tr>
          <tr>
            <td
              colspan="5"
              style="text-align: center;"
            >
              <small><i>hover over a row for more details</i></small>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import type { MaterialCitation } from '@factsmission/synogroup';

function unCamelCase(string: string) {
  const result = string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1').trim();
  return result.replace(/gbif/gi, "GBIF").replace(/id/gi, "ID").replace(/http/gi, "HTTP").replace(/uri/gi, "URI");
}

@Component({})
export default class CitedMaterials extends Vue {
  @Prop() mcs!: MaterialCitation[];
  open = false;

  date(mc: MaterialCitation): string {
    if (!mc.eventDate) return "";
    const date = (new Date(mc.eventDate)).getFullYear();
    if (isNaN(date)) return mc.eventDate;
    return date.toString();
  }

  pretty(mc: MaterialCitation): string {
    let result = "";
    if (mc.typeStatus) result += `Status: ${mc.typeStatus}\n`;
    if (mc.recordedBy) result += `Recorded by ${mc.recordedBy}\n`
    for (const [key, value] of Object.entries(mc)) {
      if (value && !(["collectionCode", "catalogNumber", "typeStatus", "recordedBy"].includes(key))) {
        result += `${unCamelCase(key)}: ${value}\n`
      }
    }
    if (result === "") result = "no additional details provided";
    return result;
  }
}
</script>

<style scoped lang="scss">
.mc_links {
  padding-left: 0.4em;
  a+a {
    padding-left: 0.2em;
  }
}

.mc_links:empty {
  padding: 0;
}

.mc_date {
  padding-left: 0.4em;
  display: block;
}

.mc_type {
  font-weight: bold;
  min-width: 1.2em;
  text-align: center;
}

.green {
  color: #388e3c;
}

table {
  * {
    background: none;
    border: none;
    white-space: nowrap;
    text-align: left;
  }

  td {
    padding: 0;
  }
}

button {
  background: none;
  display: block;
  border: none;
  overflow: visible;
  margin: 0;
  padding: 0;

  & .icon {
    border-radius: 0.2rem;
    display: inline-block;
    margin: 0 0.2rem 0 0;
    vertical-align: text-bottom;
  }

  & svg {
    display: block;
    width: 1rem;
    height: 1rem;
  }

  &:hover .icon {
    background: #00000066 !important;
  }

  &:focus,
  &:focus-visible{
    outline: none;
    .icon {
      outline: 2px solid #81951d;}
    }
}

.dropdown {
  position: relative;

  svg {
    transition: 500ms transform;
  }
}

.dropdown_menu {
  display: none;
}

.dropdown[data-open="true"] {
  overflow: visible;

  svg {
    transform: rotate(180deg);
  }

  .icon {
    background: #00000033;
  }

  .dropdown_menu {
    background: white;
    border: 1px solid #00000033;
    border-radius: 0.25rem;
    box-shadow: 2px 4px 9px -4px #212121;
    display: block;
    max-height: 80vh;
    max-width: 80vw;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 1.2rem;
    width: max-content;
    z-index: 990;
    overflow: auto;
    padding: 0.2rem 0.4em;
  }
}
</style>
