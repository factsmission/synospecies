import Vue from 'vue'
import VueRouter from 'vue-router'
import Classic from '@/views/Classic.vue'
import About from '@/views/About.vue'
import Settings from '@/views/Settings.vue'
import SynonymGrouper from '@/views/SynonymGrouper.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'classic',
    component: Classic
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/syg',
    name: 'SynonymGrouper',
    props: (route: any) => ({ s: route.query.s }),
    component: SynonymGrouper
  },
  {
    path: '/advanced',
    name: 'advanced',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Advanced.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
