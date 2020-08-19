import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigation:[
      { title: 'Flappy Bird', icon: 'fab fa-earlybirds', link: '/flappybird'},
      { title: 'Candy Crush', icon: 'fas fa-candy-cane', link: '/candycrush' },
    ],
    difficulty: [1.5, 2.5, 3.5, 4.5, 5.5],
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
