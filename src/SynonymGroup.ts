import type SparqlEndpoint from '@retog/sparql-client'
import { justifications } from './config'

interface Justification {
  toString: () => string;
  precedingSynonym?: JustifiedSynonym; // eslint-disable-line no-use-before-define
}

interface TreatmentJustification extends Justification {
  treatment: { uri: string; creators: string; date?: string };
}

type LexicalJustification = Justification

type anyJustification = (TreatmentJustification|LexicalJustification)

export class JustificationSet implements Set<anyJustification> {
  private contents: anyJustification[] = []

  get size () {
    return this.contents.length
  }

  add (value: anyJustification) {
    if (this.contents.findIndex(c => c.toString() === value.toString()) === -1) {
      this.contents.push(value)
    }
    return this
  }

  constructor (iterable?: Iterable<anyJustification>) {
    if (iterable) {
      for (const el of iterable) {
        this.add(el)
      }
    }
    return this
  }

  clear () {
    this.contents = []
  }

  delete (value: anyJustification) {
    return false
  }

  has (value: anyJustification) {
    return false
  }

  forEach (cb: (val: anyJustification, key: anyJustification, set: this) => void) {
    this.contents.forEach(v => cb(v, v, this))
  }

  [Symbol.toStringTag] = '';
  [Symbol.iterator] = this.contents[Symbol.iterator]

  values () {
    return this.contents.values()
  }

  keys () {
    return this.contents.values()
  }

  entries = ((Array.from(this.contents.values()).map(v => [v, v])) as [anyJustification, anyJustification][]).values
}

export type JustifiedSynonym = {
  taxonConceptUri: string
  taxonNameUri: string
  justifications: JustificationSet
}

type SparqlJson = {
  head: {
    vars: string[];
  };
  results: {
    bindings: { [key: string]: { type: string; value: string } }[];
  };
}

export async function SynonymGroupBuilder (sparqlEndpoint: SparqlEndpoint, taxonName: string, justifiedArray: JustifiedSynonym[] = []): Promise<SynonymGroup> {
  /** Maps from taxonConceptUris to their synonyms */
  const justifiedSynonyms: Map<string, number> = new Map()

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
        return { taxonConceptUri: t.tc.value, taxonNameUri: t.tn.value, justifications: new JustificationSet([`matches "${genus}${species ? ' ' + species : ''}${subspecies ? ' ' + subspecies : ''}"`]) }
      }))
  }

  const synonymFinders = [
    /** Get the Synonyms having the same {taxon-concept} */
    (taxon: JustifiedSynonym): Promise<JustifiedSynonym[]> => {
      const query =
        `PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT
?tc
WHERE {
  ?tc treat:hasTaxonName <${taxon.taxonNameUri}> .
  FILTER (?tc != <${taxon.taxonConceptUri}>)
}`
      return sparqlEndpoint.getSparqlResultSet(query).then((json: SparqlJson) => json.results.bindings.map(t => {
        if (!t.tc) return undefined
        return {
          taxonConceptUri: t.tc.value,
          taxonNameUri: taxon.taxonNameUri,
          justifications: new JustificationSet([{
            toString: () => `${t.tc.value} has taxon name ${taxon.taxonNameUri}`,
            precedingSynonym: taxon
          }])
        }
      }).filter(v => !!v))
    },
    /** Get the Synonyms deprecating {taxon} */
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
          justifications: new JustificationSet([{
            toString: () => `${t.tc.value} deprecates ${taxon.taxonConceptUri} according to ${t.treat.value}`,
            precedingSynonym: taxon,
            treatment: { uri: t.treat.value, creators: t.creators.value, date: t.date?.value }
          }])
        }
      }).filter(v => !!v))
    },
    /** Get the Synonyms deprecated by {taxon} */
    (taxon: JustifiedSynonym): Promise<JustifiedSynonym[]> => {
      const query =
        `PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX treat: <http://plazi.org/vocab/treatment#>
SELECT DISTINCT
?tc ?tn ?treat ?date (group_concat(DISTINCT ?creator;separator="; ") as ?creators)
WHERE {
  ?treat (treat:augmentsTaxonConcept|treat:definesTaxonConcept) <${taxon.taxonConceptUri}> ;
         treat:deprecates ?tc ;
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
          justifications: new JustificationSet([{
            toString: () => `${t.tc.value} deprecated by ${taxon.taxonConceptUri} according to ${t.treat.value}`,
            precedingSynonym: taxon,
            treatment: { uri: t.treat.value, creators: t.creators.value, date: t.date?.value }
          }])
        }
      }).filter(v => !!v))
    }
  ]

  function lookUpRound (taxon: JustifiedSynonym): Promise<JustifiedSynonym[]> {
    const foundGroupsP = synonymFinders.map(finder => finder(taxon))
    return Promise.all(foundGroupsP).then(foundGroups => foundGroups.reduce((a, b) => a.concat(b), []))
  }

  let justifiedSynsToExpand: JustifiedSynonym[] = await getStartingPoints(taxonName)
  justifiedSynsToExpand.forEach(justsyn => justifiedSynonyms.set(justsyn.taxonConceptUri, justifiedArray.push(justsyn) - 1))
  const expandedTaxonConcepts: string[] = []
  while (justifiedSynsToExpand.length > 0) {
    const foundThisRound: string[] = []
    const promises = justifiedSynsToExpand.map((j, index) => lookUpRound(j).then(newSynonyms => {
      newSynonyms.forEach(justsyn => {
        // Check whether we know about this synonym already
        if (justifiedSynonyms.has(justsyn.taxonConceptUri)) {
          // Check if we found that synonym in this round
          if (~foundThisRound.indexOf(justsyn.taxonConceptUri)) {
            justsyn.justifications.forEach(jsj => {
              justifiedArray[justifiedSynonyms.get(justsyn.taxonConceptUri)!].justifications.add(jsj)
            })
          }
        } else {
          justifiedSynonyms.set(justsyn.taxonConceptUri, justifiedArray.push(justsyn) - 1)
        }
        if (!~expandedTaxonConcepts.indexOf(justsyn.taxonConceptUri)) {
          justifiedSynsToExpand.push(justsyn)
          foundThisRound.push(justsyn.taxonConceptUri)
        }
      })
      expandedTaxonConcepts.push(j.taxonConceptUri)
      return true
    }))
    justifiedSynsToExpand = []
    await Promise.all(promises)
  }

  return new SynonymGroup(justifiedArray)
}

export class SynonymGroup {
  constructor (public justifiedSynonyms: JustifiedSynonym[]) {
    this.justifiedSynonyms = justifiedSynonyms
  }

  getAllSynonyms (): JustifiedSynonym[] {
    return this.justifiedSynonyms
  }
}
