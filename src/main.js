import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axiosC from 'axios'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import i18n from "./plugins/i18n";
import io from 'socket.io-client';
import VueCookies from 'vue-cookies';
import VueGtag from "vue-gtag";
import limits from '@/mixins/limits'

Vue.use(VueCookies)


// ----- ----- BASIC ----- -----


Vue.prototype.$time_in_ms = () => { return new Date().getTime() }

Vue.prototype.$userDate = () => {
    var date = new Date();
    date.setHours(date.getHours() + new Date().getTimezoneOffset() / -60);
    return date.toISOString();
}

Vue.prototype.$howManyValuesToLoad = 28 // How many values load extra
Vue.prototype.$valueFORdateMINlimit = -28 // Value in dateMINlimit
Vue.prototype.$valueFORdateMAXlimit = 7

Vue.prototype.$dateMINlimit = (new Date(Date.now(Vue.prototype.$userDate()) + Vue.prototype.$valueFORdateMINlimit * 24 * 3600 * 1000)).toISOString().substr(0, 10)
Vue.prototype.$dateMAXlimit = (new Date(Date.now(Vue.prototype.$userDate()) + Vue.prototype.$valueFORdateMAXlimit * 24 * 3600 * 1000)).toISOString().substr(0, 10)
Vue.prototype.$dateCacheProduct = (new Date(Date.now(Vue.prototype.$userDate()) + 24 * 3600 * 1000)).toISOString().substr(0, 10)

Vue.prototype.$connectIndexedDB = () => { return window.indexedDB.open("juicify"); }

Vue.prototype.$logout = async () => {
    Vue.$cookies.remove("token");
    Vue.$cookies.remove("refresh_jwt");
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization']
    delete axios.defaults.headers['refresh_jwt']
    await window.indexedDB.deleteDatabase("juicify");
    document.location.href="/";
}

Vue.prototype.$baseURLserver = 'https://juicify.app:4000/server/'

const axios = axiosC.create({
    baseURL: Vue.prototype.$baseURLserver,
    responseType: "json",
    headers: {
        'Content-Type': 'application/json',
        'refresh_jwt': Vue.$cookies.get("refresh_jwt")
    }
})

Vue.config.productionTip = false
Vue.prototype.$http = axios;

Vue.prototype.$synchroMessage = false;


// ----- ----- MIXINS ----- -----


require("./plugins/decodeToken")
require("./plugins/universal")
require("./plugins/indexedDB")
require("./plugins/properlyValueLoader")


// ----- ----- LOAD COMPONENTS ----- -----


if(!localStorage.getItem('componentsLoaded')){
    let req = require.context('./components/', true, /\.(js|vue)$/i);
    req.keys().map(key => {
        const name = key.match(/\w+/)[0];
        return Vue.component(name, req(key))
    });

    req = require.context('./views/', true, /\.(js|vue)$/i);
    req.keys().map(key => {
        const name = key.match(/\w+/)[0];
        return Vue.component(name, req(key))
    });
    localStorage.setItem('componentsLoaded', JSON.stringify(true))
}


// ----- ----- SOCKET + ANALYTICS ----- -----


if(localStorage.getItem('_id')){
    Vue.use(VueGtag, {
        config: { id: "G-RTCFC3JGV2" }
    });

    Vue.prototype.$socket = io("https://juicify.app:5000", {
        query: "_id=" + store.state.userToken._id + "&time=" + Vue.prototype.$time_in_ms()
    });
                
    Vue.prototype.$tellAboutSynchronization = async (where, WhatToDo, array) => {
        Vue.prototype.$socket.emit('tellAboutSynchronization', {
            where: where,
            WhatToDo: WhatToDo,
            array: array,
            time: await Vue.prototype.$currentTime(),
            token: Vue.$cookies.get("refresh_jwt") // SOCKET USES REFRESH TOKEN AS MAIN TOKEN
        })
        await Vue.prototype.$putInformationAboutNeededUpdate('tellAboutSynchronization')
    }
}

Vue.mixin(limits)

new Vue({
    i18n,
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app');
