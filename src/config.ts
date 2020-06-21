export const endpoint = function () {
  const localValue = localStorage.getItem('plazi-treatments-endpoint')
  return localValue || 'https://trifid-lindas.test.cluster.ldbar.ch/query' // 'https://treatment.ld.plazi.org/sparql'
}
export default {
  endpoint
}
