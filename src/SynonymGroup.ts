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
  justifications: Set<(TreatmentJustification|LexicalJustification)[]>
}

type SparqlJson = {
  head: {
    vars: string[];
  };
  results: {
    bindings: { [key: string]: { type: string; value: string } }[];
  };
}

class SynonymGroup {

  private justifiedSynonyms: Map<string, JustifiedSynonym> = new Map()

  constructor(public sparqlEndpoint: SparqlEndpoint, taxonName: string, justifications: boolean) {
    const justifiedSynsToExpand: JustifiedSynonym[] = this.getStartingPoints(taxonName)
    justifiedSynsToExpand.forEach(justsyn => this.justifiedSynonyms.set(justsyn.taxonConceptUri, justsyn))
    const expandedTaxonConcepts: string[] = []
    while (justifiedSynsToExpand.length > 0) {
      const taxonConcept = justifiedSynsToExpand.pop()!
      const newSynonyms = this.lookUpRound(taxonConcept)
      expandedTaxonConcepts.push(taxonConcept.taxonConceptUri)
      newSynonyms.forEach(justsyn => {
        if (this.justifiedSynonyms.has(justsyn.taxonConceptUri)) {
          justsyn.justifications.forEach(jsj => this.justifiedSynonyms.get(justsyn.taxonConceptUri)!.justifications.add(jsj))
        } else {
          this.justifiedSynonyms.set(justsyn.taxonConceptUri, justsyn)
        }
        if (!~expandedTaxonConcepts.indexOf(justsyn.taxonConceptUri)) {
          justifiedSynsToExpand.push(justsyn)
        }
      })
    }
  }

  getStartingPoints (taxonName: string): JustifiedSynonym[] {
    const [ genus, species, subspecies ] = taxonName.split(' ')
    const query = `PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT ?tn ?tc WHERE {
  ?tc dwc:genus "${genus}";
      treat:hasTaxonName ?tn;
      ${species ? `dwc:species "${species}";` : ''}
      ${subspecies ? `dwc:subspecies "${subspecies}";` : ''}
      a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcepts>.
}`
    return this.sparqlEndpoint.getSparqlResultSet(query)
      .then((json: SparqlJson) => json.results.bindings.map(t => {
        return { taxonConceptUri: t.tc.value, taxonNameUri: t.tn.value, justification: `Matches ${genus}${species ? ' ' + species : ''}${subspecies ? ' ' + subspecies : ''}` }
      }))
  }

  synonymFinders = [
    function getLexicalMatches (taxon: JustifiedSynonym): JustifiedSynonym[] {
      return []
    },
    /* Get the Synonyms deprecating {taxon} */
    (taxon: JustifiedSynonym): JustifiedSynonym[] => {
      const query =
`PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT
?tc ?treat ?date (group_concat(DISTINCT ?creator;separator="; ") as ?creators)
WHERE {
  ?treat treat:deprecates <${taxon.taxonConceptUri}> ;
         (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?tc ;
         dc:creator ?creator .
  OPTIONAL {
    ?treat treat:publishedIn ?publ .
    ?publ dc:date ?date .
  }
}
GROUP BY ?tc ?treat ?date`
      return this.sparqlEndpoint.getSparqlResultSet(query).then((json: SparqlJson) => json)
    },
    function getThoseDeprecating (taxon: JustifiedSynonym): JustifiedSynonym[] {
      return []
    }
  ]

  lookUpRound (taxon: JustifiedSynonym): JustifiedSynonym[] {
    return this.synonymFinders.map(finder => finder(taxon)).reduce((a, b) => a.concat(b), [])
  }

  getAllSynonyms (): JustifiedSynonym[] {
    return Array.from(this.justifiedSynonyms.values())
  }

}
