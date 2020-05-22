import Vue from 'vue'
import VueRouter from 'vue-router'
import Classic from '@/views/Classic.vue'
import Timeline from '@/views/Timeline.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'classic',
    component: Classic
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
