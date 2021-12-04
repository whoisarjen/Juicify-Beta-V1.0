<template>
    <v-form class="contenerLOGGED" ref="form">
        <v-text-field
            :disabled="this.$store.state.userToken.login"
            v-model="formData.login"
            :counter="60"
            :rules="inputTEXTrequested"
            :label='$t("logouted.login")'
            required
        ></v-text-field>
        <v-text-field
            :disabled="this.$store.state.userToken.login"
            v-model="formData.email"
            :counter="255"
            :rules="inputEMAIL"
            label="E-mail"
            required
        ></v-text-field>
        <v-textarea
            :rules="inputTEXTpassword"
            :label='$t("universal.message")'
            v-model="formData.message"
            auto-grow
        ></v-textarea>
        <vue-recaptcha class="captcha" @verify="reCaptchaVerify()" @expired="reCaptchaExpired()" @error="reCaptchaError()" sitekey="6Ld6f_saAAAAAGEEdqsxkCkz87NPMbuYH5fvDF3u" :loadRecaptchaScript="true"></vue-recaptcha>
        <v-btn class="mr-4" @click="formData.message = ''">
        {{this.$t("universal.clear")}}
        </v-btn>
        <v-btn
            @click="sendMessage()"
        >
        {{this.$t("universal.submit")}}
        </v-btn>
    </v-form>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
export default {
    data: () => ({
        formData: {
            "login": '',
            "email": '',
            "message": ''
        },
        reCaptcha: false
    }),
    mounted(){
        if(this.$store.state.userToken.login) this.formData.login = this.$store.state.userToken.login
        if(this.$store.state.userToken.email) this.formData.email = this.$store.state.userToken.email
    },
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
        async sendMessage(){
            if(this.$refs.form.validate()){
                if(this.reCaptcha){
                    await this.$http.post('requests/emailHandler/', {
                        array: [{
                            "login": this.formData.login,
                            "email": this.formData.email,
                            "message": this.formData.message,
                            "title": "Report bugs & ideas"
                        }]
                    })
                    .then(() => {
                        this.$notification("success", this.$t('success_notify.basic'))
                        this.formData.message = ''
                    })
                    .catch(() => {
                        this.$notification("alert", this.$t('error_notify.basic'))
                    })
                }else this.$notification("alert", this.$t('error_notify.reCaptcha'))
            }
        }
    },
    components: { VueRecaptcha }
}
</script>

<style scoped>

    .captcha{
        margin-bottom: 20px;
    }

</style>