import Vue from 'vue'
import store from '../store'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import isEqual from 'lodash.isequal';

Vue.use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true
});

Vue.prototype.$notification = (kind, message) => {
    if(kind == 'alert') kind = 'error'
    if(kind == 'warning') kind = 'info'
    Vue.prototype.$toast[kind](message, {
        position: "bottom-right",
        timeout: 2000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false
    });
}

Vue.prototype.$langITEMS = [{
    "value": "pl",
    "text": "Polski"
},
{
    "value": "en",
    "text": "English"
}]

Vue.prototype.$catchThis = async (err) => {
    try{
        store.state.notificationMessage = err.response.data.error
    }catch{
        store.state.notificationMessage = 'server_down'
    }finally{
        store.state.notificationFLAG = await Vue.prototype.$currentTime()
    }
}

Vue.prototype.$is_id = async (_id) => {
    return new Promise(resolve => {
        (async () => {
            if((_id).substring(0, 2) != "XD") resolve(true)
            else resolve(false)
        })();
    })
}

Vue.prototype.$currentTime = async () => {
    return Vue.prototype.$time_in_ms()
}

Vue.prototype.$changeSETTINGS = async (object, stopBLOCKINGpassword) => {
    if(!stopBLOCKINGpassword || stopBLOCKINGpassword != true) delete object.password
    return new Promise(resolve => {
        (async () => {
            if(navigator.onLine){
                await Vue.prototype.$http.post('requests/auth/change', {
                    array: [object],
                    user_ID: store.state.userToken._id
                })
                .then(async (response) => {
                    await Vue.prototype.$gotNewToken(response.data.jwt, response.data.refresh_jwt)
                    await Vue.prototype.$tellAboutSynchronization("settings", "change", response.data.jwt)
                    if(stopBLOCKINGpassword) Vue.prototype.$notification("success", Vue.prototype.$t('success_notify.basic'))
                })
                .catch((err) => Vue.prototype.$catchThis(err))
                .finally(() => resolve())
            }else{
                Vue.prototype.$notification("alert", Vue.prototype.$t('error_notify.not_available_in_offline'))
                resolve();
            }
        })();
    })
}

Vue.prototype.$refreshToken = async () => {
    return new Promise(resolve => {
        (async () => {
            await Vue.prototype.$http.post('requests/auth/refreshToken')
            .then(async (response) => {
                await Vue.prototype.$gotNewToken(response.data.jwt, response.data.refresh_jwt)
            })
            .catch(async (err) => {
                Vue.prototype.$catchThis(err)
            })
            .finally(() => resolve())
        })();
    });
}

Vue.prototype.$dateTOiso = async (date) => {
    return new Date(date).toISOString()
}

Vue.prototype.$shortDATE = async (date) => {
    return date.substr(0, 10)
}

Vue.prototype.$currentTime = async () => {
    return new Date().getTime()
}

Vue.prototype.$array = async (array) => {
    return new Promise(resolve => {
        (async () => {
            resolve([array])
        })();
    })
}

Vue.prototype.$todayDAY = async (value) => {
    let todayDAY = ""
    if(value) todayDAY = (new Date(value)).getDay()
    else todayDAY = (new Date()).getDay()
    if(todayDAY == 0) todayDAY = 7
    return todayDAY
}

Vue.prototype.$addDAYStoISO = async (whenAdded, howManyDaysToAdd) => {
    return new Promise(resolve => {
        (async () => {
            resolve(await Vue.prototype.$dateTOiso(new Date( Date.parse(whenAdded) + howManyDaysToAdd * 24 * 60 * 60 * 1000)))
        })();
    })
}

Vue.prototype.$getCorrectDate = async (withoutCuttingExactValue) => {
    return new Promise(resolve => {
        (async () => {
            var date = new Date();
            date.setHours(date.getHours() + new Date().getTimezoneOffset() / -60);
            date = date.toISOString();
            if(!withoutCuttingExactValue){
                date = await Vue.prototype.$shortDATE(date)
                date = await Vue.prototype.$dateTOiso(date)
            }
            resolve(date)
        })();
    })
}

Vue.prototype.$gotNewToken = async (token, refreshToken) => {
    return new Promise(resolve => {
        (async () => {
            if(token && refreshToken){
                const newToken = Vue.prototype.$decodeToken(token)
                store.state.userToken = JSON.parse(JSON.stringify(newToken))
                if(newToken._id == store.state.userToken._id){
                    Vue.prototype.$http.defaults.headers.common['Authorization'] = token
                    Vue.prototype.$http.defaults.headers['refresh_jwt'] = refreshToken
                    Vue.$cookies.set("token", token, "200y")
                    Vue.$cookies.set("refresh_jwt", refreshToken, "200y")
                    const oldToken = JSON.parse(JSON.stringify(store.state.userToken))
                    delete oldToken.iat
                    delete oldToken.exp
                    delete oldToken.macronutrients
                    delete newToken.iat
                    delete newToken.exp
                    delete newToken.macronutrients
                    localStorage.setItem('lang', store.state.userToken.lang)
                    if(!isEqual(newToken, oldToken)) store.state.settingsFLAG = await Vue.prototype.$currentTime()
                }
            }
            resolve()
        })()
    })
}