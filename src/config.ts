export const endpoint = function () {
  const localValue = localStorage.getItem('plazi-treatments-endpoint')
  return localValue || 'https://treatment.ld.plazi.org/sparql' // 'https://trifid-lindas.test.cluster.ldbar.ch/query'
}
export default {
  endpoint
}
