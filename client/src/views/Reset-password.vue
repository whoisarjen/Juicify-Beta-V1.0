<template>
    <div class="formLOGIN">
        <v-container>
            <div class="login">
                <v-form ref="form">
                    <router-link to="/login"><img src="/img/logo.png"></router-link>
                    <h1>{{$t("logouted.reset_password_title")}}</h1>
                    <v-text-field outlined dense type="email" :label='$t("logouted.email")' :rules="inputEMAIL" v-model="email"></v-text-field>
                    <vue-recaptcha class="captcha" @verify="reCaptchaVerify()" @expired="reCaptchaExpired()" @error="reCaptchaError()" sitekey="6Ld6f_saAAAAAGEEdqsxkCkz87NPMbuYH5fvDF3u" :loadRecaptchaScript="true"></vue-recaptcha>
                    <v-btn outlined block @click="resetEmail">{{$t("logouted.reset_password_title")}}</v-btn>
                </v-form>
            </div>
        </v-container>
        <div class="registerBoxDown">
            <router-link to="/login">
                {{$t("logouted.one_of_us")}} {{$t("logouted.sign_in")}}
            </router-link>
        </div>
    </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
export default {
    name: "reset-password",
    data: () => ({
        email: '',
        reCaptcha: false
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
        async resetEmail(){
            if(this.$refs.form.validate()){
                if(this.reCaptcha){
                    await this.$http.post('requests/auth/reset_password_request', {
                        email: this.email
                    })
                    .then(() => this.$notification("success", this.$t('success_notify.check_email')))
                    .catch(() => this.$notification("alert", this.$t('error_notify.email_not_valid')))
                }else this.$notification("alert", this.$t('error_notify.reCaptcha'))
            }
        },
        async checkValueInURL(){
            if(this.$route.params.login && this.$route.params.code){
                await this.$http.post('requests/auth/reset_password_handler', {
                    login: this.$route.params.login,
                    code: this.$route.params.code
                })
                .then(() => {
                    this.$notification("success", this.$t('success_notify.check_email'))
                    this.$router.push("/login")
                })
            }
        }
    },
    mounted(){ this.checkValueInURL() },
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
        grid-template-rows: auto 43px;
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