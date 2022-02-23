import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import pl from 'vuetify/lib/locale/pl';
import en from 'vuetify/lib/locale/en';

Vue.use(Vuetify);

Vue.prototype.$dark_theme_color = '#000000'

const ua = navigator.userAgent.toLowerCase();
if(ua.indexOf("android") > -1) Vue.prototype.$dark_theme_color = '#121212'

let darkChecker = false;
if(localStorage.getItem('dark_mode')){
    darkChecker = JSON.parse(localStorage.getItem('dark_mode'))
}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){
    darkChecker = window.matchMedia('(prefers-color-scheme: dark)').matches;
}

if(darkChecker){
    document.documentElement.style.setProperty('--theme-contrast-color', '#fff')
    document.documentElement.style.setProperty('--theme-background-color', Vue.prototype.$dark_theme_color)
}else{
    document.documentElement.style.setProperty('--theme-contrast-color', '#000')
    document.documentElement.style.setProperty('--theme-background-color', '#fff')
}

export default new Vuetify({
    theme: {
        dark: darkChecker,
        themes: {
            light: {
                primary: '#e99123',
                anchor: '#333'
            },
            dark: {
                primary: '#e99123',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
                anchor: '#ffffff',
                background: Vue.prototype.$dark_theme_color
            },
        },
    },
    lang: {
        locales: { pl, en },
        current: localStorage.getItem('lang') || navigator.language,
    },
});
