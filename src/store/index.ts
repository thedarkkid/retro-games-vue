import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigation:[
      { title: 'Flappy Bird', icon: 'fab fa-earlybirds', link: '/flappybird'},
      { title: 'Candy Crush', icon: 'fas fa-candy-cane', link: '/candycrush' },
    ]
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
