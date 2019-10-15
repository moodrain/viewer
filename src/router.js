import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Gallery from './views/Gallery'
import Player from './views/Player'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }, {
      path: '/gallery',
      name: 'gallery',
      component: Gallery
    }, {
      path: '/player',
      name: 'player',
      component: Player
    }
  ]
})
