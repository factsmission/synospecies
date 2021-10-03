import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Classic.vue'
import About from '../views/About.vue'
import Settings from '../views/Settings.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/syg',
    name: 'syg',
    component: () => import(/* webpackChunkName: "syg" */ '../views/SynonymGrouper.vue')
  },
  {
    path: '/advanced',
    name: 'advanced',
    component: () => import(/* webpackChunkName: "advanced" */ '../views/Advanced.vue')
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
