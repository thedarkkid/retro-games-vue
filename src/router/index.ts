import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter);

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }

  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/flappybird',
    name: 'FlappyBird',
    meta: { title: 'Flappy Bird' },
    component: () => import(/* webpackChunkName: "about" */ '../views/FlappyBird.vue')
  },
  {
    path: '/candycrush',
    name: 'CandyCrush',
    meta: { title: 'Candy Crush' },
    component: () => import(/* webpackChunkName: "about" */ '../views/CandyCrush.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

const DEFAULT_TITLE = 'Retro-Games';
router.beforeEach((to, from, next) => {
  document.title = (document.title || DEFAULT_TITLE) + " - " + to.meta.title;
  next()
});
export default router
