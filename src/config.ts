export const endpoint = function () {
  const localValue = localStorage.getItem('plazi-treatments-endpoint')
  return localValue || 'https://lindas-cached.cluster.ldbar.ch/query' // 'https://lindas.admin.ch/query' // 'https://treatment.ld.plazi.org/sparql'
}

export default {
  endpoint
}
