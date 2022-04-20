export const allEndpoints = [
  'https://lindas-cached.cluster.ldbar.ch/query',
  'https://lindas.admin.ch/query',
  'https://treatment.ld.plazi.org/sparql',
  'https://trifid-lindas.test.cluster.ldbar.ch/query'
]

export const defaultEndpoint = 'https://lindas-cached.cluster.ldbar.ch/query'

export function getEndpoint () {
  const localValue = localStorage.getItem('plazi-treatments-endpoint')
  return localValue || defaultEndpoint
}
