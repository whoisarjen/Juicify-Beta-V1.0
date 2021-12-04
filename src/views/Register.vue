<template>
    <div class="formLOGIN">

        <v-dialog
        scrollable
        persistent
        v-model="regulations"
        width="600px"
        >
        <v-card>
            <v-card-title>
            </v-card-title>
            <v-card-text>
                <Regulations/>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn
                    text
                    @click="regulations = false"
                >
                    {{$t("universal.close")}}
                </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <v-container>
            <div class="register">
                <router-link to="/login"><img src="/img/logo.png"></router-link>
                <h1>{{$t("logouted.register")}}</h1>
                    <v-row justify="center">
                        <v-dialog
                        v-model="dialog"
                        persistent
                        max-width="290"
                        >
                        <v-card>
                            <v-card-title class="headline">
                            {{$t("logouted.important")}}
                            </v-card-title>
                            <v-card-text>{{$t("logouted.important_text")}}</v-card-text>
                            <v-card-text>
                                <table>
                                    <tr>
                                        <td>{{$t("universal.age")}}</td>
                                        <td>{{getAge(date)}}</td>
                                    </tr>
                                    <tr>
                                        <td>{{$t("universal.weight")}}</td>
                                        <td>{{weight}}kg</td>
                                    </tr>
                                    <tr>
                                        <td>{{$t("universal.sex.title")}}</td>
                                        <td>{{sexITEMS[sex].text}}</td>
                                    </tr>
                                    <tr>
                                        <td>{{$t("universal.height")}}</td>
                                        <td>{{height}}cm</td>
                                    </tr>
                                </table>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                @click="dialog = false"
                            >
                                {{$t("universal.deny")}}
                            </v-btn>
                            <v-btn
                                text
                                @click="register()"
                            >
                                {{$t("universal.confirm")}}
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                        </v-dialog>
                    </v-row>
                    <v-stepper v-model="e1">
                        <v-stepper-content step="1">
                            <v-form ref="form">
                                <v-text-field outlined @keypress.enter="formCHECKER" @input="deleteWhiteSpaces()" dense type="text" :label='$t("logouted.login")' :counter="60" :rules="inputTEXTrequested" v-model="login"></v-text-field>
                                <v-text-field outlined @keypress.enter="formCHECKER" @input="deleteWhiteSpaces()" dense type="email" :label='$t("logouted.email")' :counter="255" :rules="inputEMAIL" v-model="email"></v-text-field>
                                <v-text-field outlined @keypress.enter="formCHECKER" @input="deleteWhiteSpaces()" dense type="password" :label='$t("logouted.password")' :counter="60" :rules="inputTEXTrequested" v-model="password"></v-text-field>
                                <v-text-field 
                                    outlined
                                    @keypress.enter="formCHECKER"
                                    dense
                                    type="password"
                                    :label='$t("settings.repeat_password")'
                                    :counter="60"
                                    :rules="[
                                        v => v == password || $t('error_notify.passwords_need_to_match')
                                    ]"
                                    v-model="password2"
                                ></v-text-field>
                                <v-btn
                                color="primary"
                                class="rounded-pill"
                                style="margin-bottom: 12px"
                                @click="formCHECKER()">
                                {{$t("universal.next")}}
                                </v-btn>
                            </v-form>
                        </v-stepper-content>
                        <v-stepper-content step="2">
                            <v-form ref="form2">
                                <v-select
                                    v-model="lang"
                                    :items="$langITEMS"
                                    :label='$t("settings.prefered_lang")'
                                    item-text="text"
                                    item-value="value"
                                    required
                                ></v-select>
                                <v-select
                                    v-model="sex"
                                    :items="sexITEMS"
                                    :label='$t("universal.sex.title")'
                                    item-text="text"
                                    item-value="value"
                                    required
                                ></v-select>
                                <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                    @keypress.enter="openSUMMARY"
                                    v-model="date"
                                    :label='$t("settings.date_of_birth")'
                                    :rules="[
                                        v => v != '' || $t('error_notify.date'),
                                    ]"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    ref="picker"
                                    v-model="date"
                                    :max="this.today.substr(0, 10)"
                                    min="1900-01-01"
                                    @change="save"
                                ></v-date-picker>
                                </v-menu>
                                <v-text-field @keypress.enter="openSUMMARY" type="Number" :label='$t("logouted.height_with_cm")' :rules="basicNumberSecurityOver0" v-model="height"></v-text-field>
                                <v-text-field @keypress.enter="openSUMMARY" type="Number" :label='$t("logouted.weight_with_kg")' :rules="basicNumberSecurityOver0" v-model="weight"></v-text-field>
                                <v-checkbox
                                    v-model="checkbox"
                                    :rules="[v => !!v || $t('error_notify.accept')]"
                                    :label='$t("logouted.regulations.regulations_warning")'
                                    required
                                    @click="regulations = true"
                                ></v-checkbox>
                                <vue-recaptcha @verify="reCaptchaVerify()" @expired="reCaptchaExpired()" @error="reCaptchaError()" sitekey="6Ld6f_saAAAAAGEEdqsxkCkz87NPMbuYH5fvDF3u" :loadRecaptchaScript="true"></vue-recaptcha>
                                <v-btn style="margin-top: 22px" outlined color="primary" block @click="openSUMMARY">{{$t("logouted.register")}}</v-btn>
                            </v-form>
                        </v-stepper-content>
                    </v-stepper>
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
import Regulations from '@/views/Regulations'
export default {
    name: "register",
    data: () => ({
        e1: 1,
        checkbox: false,
        date: null,
        menu: false,
        login: '',
        email: '',
        password: '',
        password2: '',
        weight: '',
        height: '',
        sex: 0,
        sexITEMS: [],
        errorMessage: 'Taki użytkownik już istnieje!',
        dialog: false,
        today: '',
        reCaptcha: false,
        regulations: false,
        policy: false,
        lang: 'pl'
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
        formCHECKER(){
            if(this.$refs.form.validate()){
                this.e1 = 2
            }
        },
        save (date) {
            this.$refs.menu.save(date)
        },
        deleteWhiteSpaces(){
            setTimeout(() => this.login = this.login.replace(' ', ''), 500)
            setTimeout(() => this.password = this.password.replace(' ', ''), 500)
            setTimeout(() => this.email = this.email.replace(' ', ''), 500)
        },
        async register(){
            if(this.$refs.form.validate()){
                if(this.$refs.form2.validate()){
                    if(this.reCaptcha || window.location.hostname == 'localhost'){
                            console.log(this.date)
                        if(this.date > '1900-01-01'){
                            await this.$http.post('requests/auth/register', {
                                array: [{
                                    "login": this.login.trimEnd().trimStart(),
                                    "l": this.login.trimEnd().trimStart().length,
                                    "password": this.password.trimEnd().trimStart(),
                                    "email": this.email.trimEnd().trimStart(),
                                    "height": this.height,
                                    "weight": this.weight,
                                    "birth": this.date,
                                    "sex": this.sex,
                                    "lang": this.lang,
                                    "whenAdded": this.today.substr(0, 10),
                                    "registered": this.today.substr(0, 10),
                                    "macronutrients": [
                                        {"day": 1, "fats": 0, "carbs": 0, "proteins": 0},
                                        {"day": 2, "fats": 0, "carbs": 0, "proteins": 0},
                                        {"day": 3, "fats": 0, "carbs": 0, "proteins": 0},
                                        {"day": 4, "fats": 0, "carbs": 0, "proteins": 0},
                                        {"day": 5, "fats": 0, "carbs": 0, "proteins": 0},
                                        {"day": 6, "fats": 0, "carbs": 0, "proteins": 0},
                                        {"day": 7, "fats": 0, "carbs": 0, "proteins": 0}
                                    ]
                                }]
                            })
                            .then(() => {
                                this.$notification("success", this.$t('success_notify.register_account'))
                                this.$router.push('/login')
                            })
                            .catch(() => this.$notification("alert", this.$t('error_notify.register_account')) )
                        }else this.$notification("alert", this.$t('error_notify.wrong_birth_date'))
                    }else this.$notification("alert", this.$t('error_notify.reCaptcha'))
                }
            }
        },
        getAge(dateString){
            var today = new Date();
            var birthDate = new Date(dateString);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
            {
                age--;
            }
            return age;
        },
        openSUMMARY(){
            if(this.$refs.form2.validate()){
                this.dialog = true
            }
        }
    },
    async mounted(){
        this.sexITEMS = [{
            "value": 0,
            "text": this.$t("universal.sex.female")
        },
        {
            "value": 1,
            "text": this.$t("universal.sex.male")
        }]
        this.today = await this.$getCorrectDate()
    },
    components: { VueRecaptcha, Regulations },
    watch:{
        menu (val) { val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR')) },
    }
}
</script>

<style scoped>

    .v-text-field{
        padding-top: 5px;
    }
    .v-stepper__content,
    .v-stepper{
        padding: 0;
        box-shadow: none;
    }
    .v-input--selection-controls{
        margin-top: 0;
        padding-top: 0;
    }
    .formLOGIN{
        width: 100%;
        padding: 20px;
        display: grid;
        min-height: 100vh;
        text-align: center;
        grid-template-rows: 1fr;
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
        padding-top: 0;
        padding-bottom: 0;
    }

    .formLOGIN p{
        font-size: 0.8rem;
    }

    .formLOGIN .registerBoxDown{
        width: 100%;
        display: grid;
        margin-top: 20px;
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

    table{
        width: 100%;
        text-align: center;
        font-weight: bold;
    }

</style>