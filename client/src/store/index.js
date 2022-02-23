import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    online: false,
    visibility: true,
    userToken: [],

    // ----- ----- FLAGI ----- ----- //
    productsFLAG: 0,
    favourite_productFLAG: 0,
    dziennikFLAG: 0,
    weightFLAG: 0,
    settingsFLAG: 0,
    workout_connectionsFLAG: 0,
    workout_exercisesFLAG: 0,
    workout_plansFLAG: 0,
    workout_resultsFLAG: 0,
    workout_results_infoFLAG: 0,
    daily_measurementFLAG: 0,
    // ----- ----- FLAGI DLA BARS ----- ----- //
    barsWeightFLAG: 0,
    barsCarloriesFLAG: 0,
    barsWorkoutResultFLAG: 0,
    // ----- ----- GUEST ----- ----- //
    guest: {},
    // ----- ----- MESSAGES ----- ----- //
    number_of_messages: 0,
    last_message_time: 0,
    // ----- ----- WARNING ----- -----
    notificationFLAG: 0,
    notificationMessage: ''
  },
  mutations: {
    SET_USER(state, payload){
      state.userToken = payload;
    }
  },
  actions: {
  },
  getters:{
    user: state => { return state.userToken.data }
  },
  modules: {
  }
})