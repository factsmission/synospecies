import type SparqlEndpoint from "@retog/sparql-client";

type TreatmentJustification = {
  treatment: string;
  toString: () => string;
}

type LexicalJustification = {
  toString: () => string;
}

type JustifiedSynonym = {
  taxonConceptUri: string
  taxonNameUri: string
  justifications?: (TreatmentJustification|LexicalJustification)[]
}

class SynonymGroup {

  private justifiedSynonyms: JustifiedSynonym[] = []

  constructor(sparqlEndpoint: SparqlEndpoint, taxonName: string, justifications: boolean) {
    const taxonNameUri = 
    const namesToLookUp: string[] = [getAnimaliaUri(taxonName), getPlantaeUri(taxonName)]
    const lookedUpNames: string[] = []
    while (namesToLookUp.length > 0) {
      const name: string = namesToLookUp.pop()!
      const newSynonyms = this.lookUpRound(name)
      lookedUpNames.push(name)
      newSynonyms.forEach(justsyn => {
        if (!lookedUpNames.indexOf[justsyn.taxonNameUri]) {
          namesToLookUp.push(justsyn.taxonNameUri)
        }
      })
    }
  }

  lookUpRound (taxonName: string): JustifiedSynonym[] {
    return []
  }

  getAllSynonyms (): JustifiedSynonym[] {
    return this.justifiedSynonyms
  }

}