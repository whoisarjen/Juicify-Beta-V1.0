<template>
    <div>
        <div class="notSupportedBrowser" v-show="notSupportedBrowser">
            <div class="notSupportedBrowserText">
                <h1>Ups...</h1>
                {{$t("universal.not_supported_browser")}}
            </div>
        </div>
        <div class="formLOGIN">
            <v-container>
                <div class="login">
                    <router-link to="/login"><img src="/img/logo.png"></router-link>
                    <h1>{{$t("logouted.sign_in")}}</h1>
                    <v-form ref="form">
                        <v-text-field @keypress.enter="login" outlined dense type="text" :label='$t("logouted.login")' :rules="inputTEXTrequested" v-model="loginC"></v-text-field>
                        <v-text-field @keypress.enter="login" outlined dense :label='$t("logouted.password")' :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" :rules="inputTEXTpassword" v-model="password" @click:append="showPassword = !showPassword"/>
                        <vue-recaptcha class="captcha" @verify="reCaptchaVerify()" @expired="reCaptchaExpired()" @error="reCaptchaError()" sitekey="6Ld6f_saAAAAAGEEdqsxkCkz87NPMbuYH5fvDF3u" :loadRecaptchaScript="true"></vue-recaptcha>
                        <v-btn
                            outlined
                            block
                            @click="login"
                            :loading="loading"
                        >{{$t("logouted.sign_in")}}</v-btn>
                    </v-form>
                    <p>{{$t("logouted.did_you_forget_password")}} <router-link to="/reset-password">{{$t("logouted.reset_password")}}</router-link></p>
                </div>
            </v-container>
            <div class="registerBoxDown">
                <router-link to="/register">
                    {{$t("logouted.first_time_create_account")}}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
export default {
    name: "login",
    data: () => ({
        loginC: '',
        password: '',
        notSupportedBrowser: false,
        loading: false,
        reCaptcha: false,
        showPassword: false
    }),
    methods: {
        reCaptchaVerify(){
            this.reCaptcha = true
        },
        reCaptchaExpired(){
            this.reCaptcha = false
        },
        reCaptchaError(){
            this.reCaptcha = false
        },
        async login(){
            if(this.$refs.form.validate()){
                if(this.reCaptcha || window.location.hostname == 'localhost'){
                    this.loading = true
                    await this.$http.post('requests/auth/login', {
                        user_ID: this.loginC,
                        password: this.password,
                        overDatePlusTheDate: await this.$addDAYStoISO(await this.$getCorrectDate(), this.$valueFORdateMINlimit)
                    })
                    .then(async (response) => {
                        if(this.$decodeToken(response.data.jwt).email_confirmation){
                            if('serviceWorker' in navigator){
                                try{
                                    await navigator.serviceWorker.register('./service-worker.js').then(async registration => {
                                        await registration.unregister()
                                    });
                                }catch(err){
                                    console.log(err)
                                }
                            }
                            this.$http.defaults.headers.common['Authorization'] = response.data.jwt
                            this.$http.defaults.headers['test'] = 'test'
                            this.$cookies.set("token", response.data.jwt, "200y")
                            this.$cookies.set("refresh_jwt", response.data.refresh_jwt, "200y")
                            this.$store.state.userToken = this.$decodeToken(response.data.jwt)
                            delete response.data.jwt
                            delete response.data.refresh_jwt
                            await this.createIndexedDB()
                            const keys = Object.keys(response.data)
                            for(let i=0; i<keys.length; i++){
                                await this.$addIndexedDB(keys[i], response.data[keys[i]])
                            }
                            if(this.$store.state.userToken.coach == '2020-01-01') localStorage.setItem('coach_tutorial', JSON.stringify(true))
                            if(!localStorage.getItem('version')) localStorage.setItem('version', await this.$currentTime())
                            localStorage.setItem('lang', this.$store.state.userToken.lang)
                            localStorage.setItem('_id', JSON.stringify(this.$store.state.userToken._id))
                            return new Promise(resolve => {
                                setTimeout(async () => {
                                    localStorage.setItem('lastUpdated', await this.$currentTime() + 1000)
                                    document.location.href='/'
                                    resolve()
                                }, 500)
                            })
                        }else{
                            this.$notification("alert", this.$t('error_notify.account_not_activated'))
                            this.loading = false
                        }
                    })
                    .catch(async (err) => {
                        if(err.response.data.error && err.response.data.error == "banned"){
                            this.$notification("alert", this.$t('error_notify.banned'))
                        }else{
                            this.$notification("alert", this.$t('error_notify.sign_in'))
                        }
                        this.loading = false
                    })
                }else this.$notification("alert", this.$t('error_notify.reCaptcha'))
            }
        },
        async createIndexedDB(){
            await window.indexedDB.deleteDatabase("juicify");
            let request = window.indexedDB.open("juicify");
            return new Promise(resolve => {
                request.onupgradeneeded = function(event) {
                    const db = event.target.result;
                    let objectStore;

                    objectStore = db.createObjectStore("product", { keyPath: "_id" });
                    objectStore = db.createObjectStore("cache_product", { keyPath: "_id" });
                    objectStore = db.createObjectStore("last_used_product", { keyPath: "_id" });
                    objectStore = db.createObjectStore("favourite_product", { keyPath: "_id" });

                    objectStore = db.createObjectStore("exercise", { keyPath: "_id" });
                    objectStore = db.createObjectStore("cache_exercise", { keyPath: "_id" });
                    objectStore = db.createObjectStore("last_used_exercise", { keyPath: "_id" });

                    objectStore = db.createObjectStore("workout_plan", { keyPath: "_id" });
                    objectStore = db.createObjectStore("workout_result", { keyPath: "_id" });
                    objectStore = db.createObjectStore("daily_measurement", { keyPath: "whenAdded" });
                    objectStore = db.createObjectStore("last_searched_users", { keyPath: "_id" });
                    objectStore = db.createObjectStore("message", { keyPath: "_id" });
                    objectStore = db.createObjectStore("whatToUpdate", { keyPath: "_id" });

                    objectStore.transaction.oncomplete = async () => resolve();
                }
            })
        }
    },
    async mounted(){ // Checking if user's browser can handle websocket

        let agent = {browser:{name:null,version:null,v:null,userAgent:null,app:null}};
        let nAgt = navigator.userAgent;
        let browserName  = navigator.appName;
        let fullVersion  = ''+parseFloat(navigator.appVersion); 
        let majorVersion = parseInt(navigator.appVersion,10);
        let nameOffset, verOffset;

        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1) 
            fullVersion = nAgt.substring(verOffset+8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = nAgt.substring(verOffset+5);
        }
        // In Chrome, the true version is after "Chrome" 
        else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset+7);
        }
        // In Safari, the true version is after "Safari" or after "Version" 
        else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset+7);
            if ((verOffset=nAgt.indexOf("Version"))!=-1) 
            fullVersion = nAgt.substring(verOffset+8);
        }
        // In Firefox, the true version is after "Firefox" 
        else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset+8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
            browserName = nAgt.substring(nameOffset,verOffset);
            fullVersion = nAgt.substring(verOffset+1);
            if (browserName.toLowerCase()==browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }

        majorVersion = parseInt(''+fullVersion,10);
        if (isNaN(majorVersion)) {
            fullVersion  = ''+parseFloat(navigator.appVersion); 
            majorVersion = parseInt(navigator.appVersion,10);
        }
        agent.browser.name = browserName;
        agent.browser.version = fullVersion;
        agent.browser.v = majorVersion;
        agent.browser.app = navigator.appName;
        agent.browser.userAgent = navigator.userAgent;

        if(agent.browser.name == "Microsoft Internet Explorer" && parseInt(agent.browser.v) < 100) this.notSupportedBrowser = true // Not supporting IE
        if(agent.browser.name == "Chrome" && parseInt(agent.browser.v) < 4) this.notSupportedBrowser = true
        if(agent.browser.name == "Firefox" && parseInt(agent.browser.v) < 11) this.notSupportedBrowser = true
        if(agent.browser.name == "Opera" && parseInt(agent.browser.v) < 13) this.notSupportedBrowser = true
        if(agent.browser.name == "Safari" && parseInt(agent.browser.v) < 5) this.notSupportedBrowser = true

        // Checkinf if user is not trying to confirm email
        if(this.$route.params.login && this.$route.params.code){
            await this.$http.post('requests/auth/confirm_email', {
                user_ID: this.$route.params.login,
                code: this.$route.params.code
            })
            .then(() => this.$notification("success", this.$t('success_notify.your_account_has_been_activated')))
            .catch(() => this.$notification("alert", this.$t('error_notify.not_working_link')))
        }
    }, 
    components: { VueRecaptcha }
}
</script>

<style scoped>

    .formLOGIN{
        width: 100%;
        padding: 20px;
        display: grid;
        min-height: 100vh;
        text-align: center;
        grid-template-rows: 1fr 44px;
        font-size: 0.875rem;
    }

    .formLoginInfo{
        width: 100%;
        display: grid;
        grid-template-columns: auto 44px;
    }

    .formLoginInfo div{
        margin: auto;
    }

    .formLoginInfo a{
        text-decoration: underline;
    }

    .formLoginInfo .v-btn{
        display: grid;
        margin: auto;
    }

    .formLoginInfoButton{
        margin: auto;
    }

    .formLOGIN img{
        width: 150px;
        margin-bottom: 22px;
        margin: 0 auto;
    }

    .formLOGIN h1{
        text-align: left;
        margin-bottom: 22px;
        color: #333;
    }

    .formLOGIN .container{
        margin: auto;
    }

    .formLOGIN button{
        margin-bottom: 22px;
    }

    .formLOGIN p{
        font-size: 0.8rem;
    }

    .formLOGIN .registerBoxDown{
        width: 100%;
        display: grid;
        padding-top: 20px;
        border-top: 1px solid #e4e4e4;
        font-size: 0.9rem;
    }

    .formLOGIN .registerBoxDown a{
        margin: auto;
    }

    .notSupportedBrowser{
        width: 100%;
        height: 100vh;
        z-index: 99999;
        background: #fff;
        display: grid;
        position: fixed;
    }

    .notSupportedBrowserText{
        text-align: center;
        margin: auto;
    }

    .notSupportedBrowserText h1{
        text-align: center;
    }

    @media(min-width: 1000px){
        .formLOGIN{
            max-width: 1000px;
            margin: auto;
        }
    }

    .captcha{
        margin-bottom: 20px;
    }

</style>