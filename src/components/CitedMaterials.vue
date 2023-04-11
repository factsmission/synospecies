<template>
  <div v-if="mcs.length > 0">
    {{ mcs.length }} specimens referenced
    <button @click="open = !open">
      [{{ open ? "hide" : "show" }}]
    </button>
    {{ mcs.find(mc => mc.typeStatus?.toLocaleLowerCase().includes('holotype')) ? '(incl. holotype)' : '' }}
    <table v-if="open">
      <tr
        v-for="mc in mcs"
        :key="JSON.stringify(mc)"
        :title="pretty(mc)"
      >
        <td :class="`mc_type ${mc.typeStatus?.toLocaleLowerCase().includes('holotype') ? 'green' : ''}`">
          {{ mc.typeStatus?.[0].toUpperCase() }}
        </td>
        <td class="mc_code">
          {{ mc.collectionCode }}:
          {{ mc.catalogNumber }}
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
            v-if="mc.httpUri && (!mc.gbifSpecimenId || mc.httpUri.endsWith(mc.gbifSpecimenId)) && (!mc.gbifOccurrenceId || mc.httpUri.endsWith(mc.gbifOccurrenceId))"
            :href="mc.httpUri"
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

  date(mc:MaterialCitation): string {
    if (!mc.eventDate) return "";
    return (new Date(mc.eventDate)).getFullYear().toString();
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
template {
  position: relative;
}

button {
  font-family: "Fira Code", monospace;
}

.mc_type {
  font-weight: bold;
}

.mc_links {
  a+a::before {
    content: " ";
  }
}

.mc_date {
  margin-inline: 1em;
  display: block;
}

.mc_type {
  min-width: 1.2em;
  text-align: center;
}

.green {
  color: #388e3c;
}

table {
  background: #ffffff;
  border: 1px solid #00000033;
  border-radius: 0.2rem;
  font-size: 0.8rem;
  max-width: 100%;
  overflow: auto;
  width: auto;
  min-width: 33ch;
  border-collapse: separate;
  position: absolute;

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
</style>
