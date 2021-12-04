<template>
    <div class="settings">
        <v-btn
            rounded
            color="primary"
            dark
            @click="sendNewSettings"
            class="buttonToSubmitFIXED rounded-pill"
            v-show="worthTOsubmit > 0"
            :loading="loading"
        >
            {{$t("universal.save")}}
        </v-btn>
        <div style="padding: 12px;">
            <div class="titleOfSite">
                <p>{{$t("settings.title")}}</p>
            </div>
            <div class="bannerOfSiteTOPads">
            {{$t("settings.status_of_account.basic")}}
            </div>
        </div>
        <v-form ref="form" style="padding-right: 16px">
            <v-card>
                <v-tabs vertical>
                <v-tab>
                    <v-icon left>
                    fa-fw fas fa-user
                    </v-icon>
                </v-tab>
                <v-tab>
                    <v-icon left>
                    fa-fw fas fa-book
                    </v-icon>
                </v-tab>
                <v-tab>
                    <v-icon left>
                    fa-fw fas fa-cog
                    </v-icon>
                </v-tab>
                <v-tab>
                    <v-icon left>
                    fas fa-user-lock
                    </v-icon>
                </v-tab>
                <v-tab v-if="this.$store.state.userToken.users_roles_ID === 9999" @click="(() => this.$router.push('/admin'))">
                    <v-icon left>
                    fas fa-users-cog
                    </v-icon>
                </v-tab>
                <v-tab v-if="this.$store.state.userToken.users_roles_ID === 9999" @click="(() => this.$socket.emit('newVersionOfApplication',{ token: this.$cookies.get('refresh_jwt') }))">
                    <v-icon left>
                    fas fa-power-off
                    </v-icon>
                </v-tab>
                <v-tab @click="$logout()" v-if="this.$store.state.online">
                    <v-icon left>
                    fa-fw fas fa-sign-out-alt
                    </v-icon>
                </v-tab>

                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <v-text-field hide-details :label='$t("settings.name")' :rules="inputTEXToptionalSHORT" v-model="name" @change="changedSETTINGS"/>
                        <v-text-field hide-details :label='$t("settings.surname")' :rules="inputTEXToptionalSHORT" v-model="surname" @change="changedSETTINGS"/>
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
                                    hide-details
                                    v-model="birth"
                                    :label='$t("settings.date_of_birth")'
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                />
                            </template>
                            <v-date-picker
                                ref="picker"
                                v-model="birth"
                                :max="new Date().toISOString().substr(0, 10)"
                                min="1900-01-01"
                                @change="save"
                            ></v-date-picker>
                        </v-menu>
                        <v-text-field hide-details :label='$t("logouted.height_with_cm")' :rules="basicNumberSecurityOver0" v-model="height" @change="changedSETTINGS"/>
                        <v-text-field hide-details :label='$t("settings.profile_description")' :rules="inputTEXToptional" v-model="description" @change="changedSETTINGS"/>
                        <v-text-field hide-details :label='$t("settings.website")' :rules="inputTEXToptionalSHORT" v-model="website" @change="changedSETTINGS"/>
                        <v-text-field hide-details :label='$t("settings.facebook")' :rules="inputTEXToptionalSHORT" v-model="facebook" @change="changedSETTINGS"/>
                        <v-text-field hide-details :label='$t("settings.instagram")' :rules="inputTEXToptionalSHORT" v-model="instagram" @change="changedSETTINGS"/>
                        <v-text-field hide-details :label='$t("settings.twitter")' :rules="inputTEXToptionalSHORT" v-model="twitter" @change="changedSETTINGS"/>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <v-text-field type="number" :label='$t("settings.number_of_meals")' :rules="[
                                v => v >= 0 && v <= 100 || $t('error_notify.number0to100')
                            ]" v-model="meal_number" @change="changedSETTINGS"/>
                            <v-text-field type="number" :label='$t("settings.fiber")' :rules="[
                                v => v >= 0 && v <= 100 || $t('error_notify.number0to100')
                            ]" v-model="fiber" @change="changedSETTINGS"/>
                            <v-text-field type="number" :label='$t("settings.sugar_percent")' :rules="[
                                v => v >= 0 && v <= 100 || $t('error_notify.number0to100')
                            ]" v-model="sugar_percent" @change="changedSETTINGS"/>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <v-select
                            hide-details
                            v-model="lang"
                            :items="$langITEMS"
                            :label='$t("settings.prefered_lang")'
                            item-text="text"
                            item-value="value"
                            required
                        ></v-select>
                        <v-switch
                            hide-details
                            v-model="public_profile"
                            inset
                            :label='$t("settings.public_profile")'
                            @change="changedSETTINGS"
                        ></v-switch>
                        <v-switch
                            hide-details
                            v-model="template"
                            inset
                            :label='$t("settings.dark_mode")'
                            @change="changedTEMPLATE"
                        ></v-switch>
                        <v-switch
                            hide-details
                            v-model="water_adder"
                            inset
                            :label='$t("settings.water_adder")'
                            @change="changedSETTINGS"
                        ></v-switch>
                        <v-switch
                            hide-details
                            v-model="workout_watch"
                            inset
                            :label='$t("settings.workout_watch")'
                            @change="changedSETTINGS"
                        ></v-switch>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <v-text-field
                            hide-details
                            v-model="password"
                            :append-icon="showPASSWORD1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="inputTEXTpassword"
                            :type="showPASSWORD1 ? 'text' : 'password'"
                            name="input-10-1"
                            :label='$t("settings.new_password")'
                            counter
                            @change="changedSETTINGS"
                            @click:append="showPASSWORD1 = !showPASSWORD1"
                        />
                        <v-text-field
                            hide-details
                            v-model="password2"
                            :append-icon="showPASSWORD2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="inputTEXTpassword"
                            :type="showPASSWORD2 ? 'text' : 'password'"
                            name="input-10-1"
                            :label='$t("settings.repeat_password")'
                            counter
                            @click:append="showPASSWORD2 = !showPASSWORD2"
                        />
                        <v-text-field
                            hide-details
                            v-model="password3"
                            :append-icon="showPASSWORD3 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPASSWORD3 ? 'text' : 'password'"
                            name="input-10-1"
                            :rules="inputTEXTpassword"
                            :label='$t("settings.pass_actually_password")'
                            counter
                            @click:append="showPASSWORD3 = !showPASSWORD3"
                        />
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item v-if="this.$store.state.userToken.users_roles_ID === 9999">
                    <v-card flat>
                    <v-card-text>
                        Sent.
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        {{$t("settings.logout_message")}}
                    </v-card-text>
                    </v-card>
                </v-tab-item>
                </v-tabs>
            </v-card>
        </v-form>
        <div class="settingsDownButtonFixer"/>
    </div>
</template>
<script>
export default {
    name: 'Settings',
    data () {
        return {
            loading: false,
            birth: null,
            menu: false,
            showPASSWORD1: false,
            showPASSWORD2: false,
            showPASSWORD3: false,
            password: '',
            password2: '',
            password3: '',
            meal_number: 0,
            height: 0,
            lang: '',
            worthTOsubmit: 0,
            changedSETTINGSobject: {},
            name: '',
            surname: '',
            description: '',
            website: '',
            facebook: '',
            instagram: '',
            twitter: '',
            public_profile: true,
            sugar_percent: 0,
            fiber: 0,
            template: false,
            workout_watch: false,
            water_adder: false
        }
    },
    watch:{
        loader () {
            const l = this.loader
            this[l] = !this[l]

            setTimeout(() => (this[l] = false), 3000)

            this.loader = null
        },
        menu (val) { val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR')) },
        '$store.state.settingsFLAG': async function(){ await this.loadSETTINGS() },
        'password': function(){ this.changedSETTINGS() },
        'meal_number': function(){ this.changedSETTINGS() },
        'birth': function(){ this.changedSETTINGS() },
        'height': function(){ this.changedSETTINGS() },
        'lang': function(){ this.changedSETTINGS() },
        'name': function(){ this.changedSETTINGS() },
        'surname': function(){ this.changedSETTINGS() },
        'description': function(){ this.changedSETTINGS() },
        'website': function(){ this.changedSETTINGS() },
        'facebook': function(){ this.changedSETTINGS() },
        'instagram': function(){ this.changedSETTINGS() },
        'twitter': function(){ this.changedSETTINGS() },
        'public_profile': function(){ this.changedSETTINGS() },
        'sugar_percent':function(){ this.changedSETTINGS() },
        'fiber': function(){ this.changedSETTINGS() }
    },
    methods:{
        async changedSETTINGS(){
            this.worthTOsubmit = 0
            this.changedSETTINGScounter("name", true)
            this.changedSETTINGScounter("surname", true)
            this.changedSETTINGScounter("description", true)
            this.changedSETTINGScounter("website", true)
            this.changedSETTINGScounter("facebook", true)
            this.changedSETTINGScounter("instagram", true)
            this.changedSETTINGScounter("twitter", true)

            this.changedSETTINGScounter("password")
            this.changedSETTINGScounter("birth")
            this.changedSETTINGScounter("height")
            this.changedSETTINGScounter("meal_number")
            this.changedSETTINGScounter("lang")
            this.changedSETTINGScounter("public_profile")
            this.changedSETTINGScounter("sugar_percent")
            this.changedSETTINGScounter("fiber")
            this.changedSETTINGScounter("workout_watch")
            this.changedSETTINGScounter("water_adder")
        },
        changedSETTINGScounter(what, canBeNull, avoidRepeat){
            if(this[what] != this.$store.state.userToken[what] && (this[what] !== '' || canBeNull)){
                if(!avoidRepeat && what == 'website'){ this[what] = this[what].replace('http://', '').replace('https://', ''); return this.changedSETTINGScounter(what, true, true); }
                if(!avoidRepeat && what == 'facebook'){ this[what] = this[what].replace('https://www.facebook.com/', ''); return this.changedSETTINGScounter(what, true, true); }
                if(!avoidRepeat && what == 'instagram'){ this[what] = this[what].replace('https://www.instagram.com/', ''); return this.changedSETTINGScounter(what, true, true); }
                if(!avoidRepeat && what == 'twitter'){ this[what] = this[what].replace('https://twitter.com/', ''); return this.changedSETTINGScounter(what, true, true); }
                this.changedSETTINGSobject[what] = this[what]
                if(what != 'password' || what == 'password' && this.password != '') this.worthTOsubmit++;
            }else this.changedSETTINGSobject[what] = this.$store.state.userToken[what]
        },
        save (birth) {
            this.$refs.menu.save(birth)
        },
        async sendNewSettings(){
            this.loading = true
            if(this.$refs.form.validate()){
                if(this.password != ''){
                    if(this.password == this.password2){
                        this.changedSETTINGSobject.prev_password = this.password3
                        await this.$changeSETTINGS(this.changedSETTINGSobject, true)
                    }else this.$notification("alert", this.$t('error_notify.passwords_need_to_match'))
                }else{
                    await this.$changeSETTINGS(this.changedSETTINGSobject)
                }
            }
            this.loading = false
        },
        async changedTEMPLATE(){
            let darkChecker = false;
            if(localStorage.getItem('dark_mode')){
                darkChecker = JSON.parse(localStorage.getItem('dark_mode'))
            }else if(window.matchMedia('(prefers-color-scheme: dark)').matches){
                darkChecker = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            darkChecker = !darkChecker
            if(darkChecker){
                document.documentElement.style.setProperty('--theme-contrast-color', '#fff')
                document.documentElement.style.setProperty('--theme-background-color', this.$dark_theme_color)
            }else{
                document.documentElement.style.setProperty('--theme-contrast-color', '#000')
                document.documentElement.style.setProperty('--theme-background-color', '#fff')
            }
            this.$vuetify.theme.dark = darkChecker
            localStorage.setItem('dark_mode', JSON.stringify(darkChecker) )
        },
        async loadSETTINGS(){
            this.loading = false
            this.worthTOsubmit = 0
            if(this.$store.state.userToken.name) this.name = this.$store.state.userToken.name
            if(this.$store.state.userToken.surname) this.surname = this.$store.state.userToken.surname
            if(this.$store.state.userToken.description) this.description = this.$store.state.userToken.description
            if(this.$store.state.userToken.website) this.website = this.$store.state.userToken.website
            if(this.$store.state.userToken.facebook) this.facebook = this.$store.state.userToken.facebook
            if(this.$store.state.userToken.instagram) this.instagram = this.$store.state.userToken.instagram
            if(this.$store.state.userToken.twitter) this.twitter = this.$store.state.userToken.twitter

            this.meal_number = this.$store.state.userToken.meal_number
            this.birth = this.$store.state.userToken.birth
            this.height = this.$store.state.userToken.height
            this.lang = this.$store.state.userToken.lang
            this.public_profile = this.$store.state.userToken.public_profile
            this.sugar_percent = this.$store.state.userToken.sugar_percent
            this.fiber = this.$store.state.userToken.fiber
            this.workout_watch = this.$store.state.userToken.workout_watch
            this.water_adder = this.$store.state.userToken.water_adder
            
            this.password = ''
            this.password2 = ''
            this.password3 = ''
            this.template = this.$vuetify.theme.dark
        },
    },
    mounted(){
        this.loadSETTINGS()
    }
}
</script>

<style scoped>

    .v-input{
        margin-top: 10px;
    }

    .buttonToSubmitFIXED{
        position: fixed !important;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 rgb(0 0 0 / 12%);
    }

    .buttonToSubmitFIXED .v-btn:before{
        opacity: 1 !important;
    }

    .settingsDownButtonFixer{
        margin-top: 17px;
        height: 36px;
    }

    .bannerOfSiteTOPads{
        background: #333;
        color: #fff;
        padding: 20px 8px;
        width: 100%;
        border-radius: 4px;
        margin: 12px 0;
        text-align: center;
    }

    .settingsGRID{
        display: grid;
        grid-template-columns: 44px auto;
    }

    .settingsLINKS{
        text-decoration: none;
        color: #e99123;
        display: grid;
        cursor: pointer;
        grid-template-columns: 44px auto;
        margin-bottom: 15px;
    }

    .settingsLINKS p{
        margin: auto 0;
    }
    
    i{
        margin: auto;
        padding-right: 10px;
    }

    .smallInformation{
        width: 100%;
        font-weight: bold;
        margin-bottom: 15px;
    }

    .smallInformationNoMargin{
        width: 100%;
        font-weight: bold;
        margin-bottom: 0;
    }

    .v-card{
        box-shadow: none !important;
    }

    .v-card i{
        font-size: 1.25rem;
    }

    .v-card__text{
        padding-top: 0;
        padding-left: 5px;
    }
    
    .theme--dark.v-card,
    .theme--dark.v-sheet{
        background-color: transparent !important;
    }
    
</style>