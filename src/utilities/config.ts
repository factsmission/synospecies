export const allEndpoints = [
  'https://cached.lindas.admin.ch/query',
  'https://lindas.cz-aws.net/query',
  'https://treatment.ld.plazi.org/sparql',
  'https://qlever.ld.plazi.org/sparql'
]

export const defaultEndpoint = 'https://cached.lindas.admin.ch/query'

export function getEndpoint () {
  const localValue = localStorage.getItem('plazi-treatments-endpoint')
  return localValue || defaultEndpoint
}
