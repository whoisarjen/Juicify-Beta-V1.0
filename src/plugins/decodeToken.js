import Vue from 'vue'
import store from '../store'
    
const token = Vue.$cookies.get("token")
const decodeToken = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

Vue.prototype.$decodeToken = decodeToken

if(token){
    store.state.userToken = decodeToken(token)
    store.commit('SET_USER', decodeToken(token));
    Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
    Vue.prototype.$http.defaults.headers['refresh_jwt'] = Vue.$cookies.get("refresh_jwt");
}