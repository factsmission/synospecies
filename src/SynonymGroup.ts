import type SparqlEndpoint from '@retog/sparql-client'

interface Justification {
  toString: () => string;
  precedingSynonym?: JustifiedSynonym; // eslint-disable-line no-use-before-define
}

interface TreatmentJustification extends Justification {
  treatment: { uri: string; creators: string; date?: string };
}

type LexicalJustification = Justification

export type JustifiedSynonym = {
  taxonConceptUri: string
  taxonNameUri: string
  justifications: Set<(Justification)>
}

type SparqlJson = {
  head: {
    vars: string[];
  };
  results: {
    bindings: { [key: string]: { type: string; value: string } }[];
  };
}

export async function SynonymGroupBuilder (sparqlEndpoint: SparqlEndpoint, taxonName: string): Promise<SynonymGroup> {
  /** Maps from taxonConceptUris to their synonyms */
  const justifiedSynonyms: Map<string, JustifiedSynonym> = new Map()

  function getStartingPoints (taxonName: string): Promise<JustifiedSynonym[]> {
    const [genus, species, subspecies] = taxonName.split(' ')
    const query = `PREFIX dwc: <http://rs.tdwg.org/dwc/terms/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT ?tn ?tc WHERE {
  ?tc dwc:genus "${genus}";
      treat:hasTaxonName ?tn;
      ${species ? `dwc:species "${species}";` : ''}
      ${subspecies ? `dwc:subspecies "${subspecies}";` : ''}
      a <http://filteredpush.org/ontologies/oa/dwcFP#TaxonConcept>.
}`
    return sparqlEndpoint.getSparqlResultSet(query)
      .then((json: SparqlJson) => json.results.bindings.map(t => {
        return { taxonConceptUri: t.tc.value, taxonNameUri: t.tn.value, justifications: new Set([`Matches "${genus}${species ? ' ' + species : ''}${subspecies ? ' ' + subspecies : ''}"`]) }
      }))
  }

  const synonymFinders = [
    function getLexicalMatches (taxon: JustifiedSynonym): Promise<JustifiedSynonym[]> {
      return Promise.resolve([])
    },
    /* Get the Synonyms deprecating {taxon} */
    (taxon: JustifiedSynonym): Promise<JustifiedSynonym[]> => {
      const query =
        `PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT
?tc ?tn ?treat ?date (group_concat(DISTINCT ?creator;separator="; ") as ?creators)
WHERE {
  ?treat treat:deprecates <${taxon.taxonConceptUri}> ;
         (treat:augmentsTaxonConcept|treat:definesTaxonConcept) ?tc ;
         dc:creator ?creator .
  ?tc <http://plazi.org/vocab/treatment#hasTaxonName> ?tn .
  OPTIONAL {
    ?treat treat:publishedIn ?publ .
    ?publ dc:date ?date .
  }
}
GROUP BY ?tc ?tn ?treat ?date`
      return sparqlEndpoint.getSparqlResultSet(query).then((json: SparqlJson) => json.results.bindings.map(t => {
        if (!t.tc) return undefined
        return {
          taxonConceptUri: t.tc.value,
          taxonNameUri: t.tn.value,
          justifications: new Set([{
            toString: () => `${t.tc.value} deprecates ${taxon.taxonConceptUri} according to ${t.treat.value}`,
            precedingSynonym: taxon,
            treatment: { uri: t.treat.value, creators: t.creators.value, date: t.date?.value }
          }])
        }
      }).filter(v => !!v))
    },
    async function getThoseDeprecating (taxon: JustifiedSynonym): Promise<JustifiedSynonym[]> {
      return []
    }
  ]

  function lookUpRound (taxon: JustifiedSynonym): Promise<JustifiedSynonym[]> {
    const foundGroupsP = synonymFinders.map(finder => finder(taxon))
    return Promise.all(foundGroupsP).then(foundGroups => foundGroups.reduce((a, b) => a.concat(b), []))
  }

  const justifiedSynsToExpand: JustifiedSynonym[] = await getStartingPoints(taxonName)
  justifiedSynsToExpand.forEach(justsyn => justifiedSynonyms.set(justsyn.taxonConceptUri, justsyn))
  const expandedTaxonConcepts: string[] = []
  while (justifiedSynsToExpand.length > 0) {
    const taxonConcept = justifiedSynsToExpand.pop()!
    const newSynonyms = await lookUpRound(taxonConcept)
    expandedTaxonConcepts.push(taxonConcept.taxonConceptUri)
    newSynonyms.forEach(justsyn => {
      if (justifiedSynonyms.has(justsyn.taxonConceptUri)) {
        justsyn.justifications.forEach(jsj => justifiedSynonyms.get(justsyn.taxonConceptUri)!.justifications.add(jsj))
      } else {
        justifiedSynonyms.set(justsyn.taxonConceptUri, justsyn)
      }
      if (!~expandedTaxonConcepts.indexOf(justsyn.taxonConceptUri)) {
        justifiedSynsToExpand.push(justsyn)
      }
    })
  }

  return new SynonymGroup(justifiedSynonyms)
}

export class SynonymGroup {
  constructor (public justifiedSynonyms: Map<string, JustifiedSynonym>) {
    this.justifiedSynonyms = justifiedSynonyms
  }

  getAllSynonyms (): JustifiedSynonym[] {
    return Array.from(this.justifiedSynonyms.values())
  }
}
