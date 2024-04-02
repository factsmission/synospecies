<template>
  <main class="container">
    <h1>About</h1>
    <div class="section">
      <p>
        SynoSpecies is a tool developed by FactsMission AG to leverage the RDF data provided by Plazi. The RDF data of all treatments is stored in an
        <a href="https://allegrograph.com/">AllegroGraph</a> triple store allowing
        <a href="https://www.w3.org/TR/sparql11-overview/">SPARQL</a> queries over the data. SynoSpecies allows manually writing and submitting such queries in the advanced mode and send such queries in the background when using the easier interface.
      </p>
      <p>
        SynoSpecies is an Open Source application running purely in the browser, the source code is available on
        <a
          href="https://github.com/factsmission/synospecies/"
        >GitHub</a>.
      </p>
    </div>
    <div class="section">
      <h2>
        <a href="http://plazi.org/">Plazi</a>
      </h2>
      <p>Plazi is an association supporting and promoting the development of persistent and openly accessible digital taxonomic literature. To this end Plazi will:</p>
      <ul>
        <li>Maintain a digital taxonomic literature repository to enable archiving of taxonomic treatments.</li>
        <li>Enhance submitted taxonomic treatments by creating TaxonX and Taxpub XML versions.</li>
        <li>Participate in the development of new models for publishing taxonomic treatments in order to maximize interoperability with other relevant cyberinfrastructure components (e.g., name servers, biodiversity resources, etc...)</li>
        <li>Advocate and educate about the vital importance of maintaining free and open access to scientific discourse and data</li>
      </ul>
    </div>
    <div class="section">
      <h2>
        <a href="https://factsmission.com/">FactsMission</a>
      </h2>
      <p>FactsMission offers consulting and development services to create, process, store, publish, and consume linked data.</p>
      <p>FactsMission helps you provide data in such a way that it can be easily used as the foundation of different applications as well as linked to as an authoritative source.</p>
      <p>FactsMission helps you grow communities around your data to maximize its impact and increase your organization’s influence.</p>
    </div>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class About extends Vue {}
</script>
