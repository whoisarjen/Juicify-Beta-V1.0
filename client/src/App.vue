<template>
    <v-app>
        <div id="app">
            <v-overlay v-if="synchroMessage">
                <v-progress-circular
                    indeterminate
                    size="210"
                >
                {{$t("universal.synchronization")}}...{{(synchroPercent / 7 * 100).toFixed()}}%
                </v-progress-circular>
                <div style="text-align: center; padding: 0 10px;">{{$t("universal.synchronization_description")}}</div>
                <div style="text-align: center; padding: 0 10px;" v-if="showSynchroNeedMoreTime">{{$t("universal.synchronization_description_extra_time")}}</div>
            </v-overlay>
            <headerMENU v-if="$cookies.get('token') && !synchroMessage" :number_of_messages="this.$store.state.number_of_messages"/>
            <div id="mainContener">
                <leftSIDEBAR v-if="$cookies.get('token') && !synchroMessage" :key="leftSidebarKEY"/>
                <div :class="[ $cookies.get('token') ? 'appGrid' : 'appGridLogout' ]">
                    <router-view/>
                </div>
                <rightSIDEBAR v-if="$cookies.get('token') && !synchroMessage" :key="rightSidebarKEY"/>
            </div>
            <footerMENU v-if="$cookies.get('token') && !synchroMessage" :key="footerKEY"/>
        </div>
    </v-app>
</template>

<script>
import headerMENU from '@/components/universal/headerMENU'
import footerMENU from '@/components/universal/footerMENU'
import leftSIDEBAR from '@/components/universal/leftSIDEBAR'
import rightSIDEBAR from '@/components/universal/rightSIDEBAR'
import socketSynchronization from '@/mixins/socketSynchronization'
export default {
    data: () => ({
        synchroMessage: false,
        showSynchroNeedMoreTime: false,
        synchroPercent: 0,
        footerKEY: 0,
        leftSidebarKEY: 2,
        rightSidebarKEY: 4,
        offlineBannerKEY: 6
    }),
    components: {
        headerMENU,
        footerMENU,
        leftSIDEBAR,
        rightSIDEBAR
    },
    async mounted(){
        if(this.$route.params.login && this.$route.params.login != this.$store.state.userToken.login && !this.$store.state.online) this.$router.push('/') // Redirect if user is offline and not on available site.
        if(!this.$cookies.get("token")) this.$store.state.online = true
        else{
            const that = this
            window.addEventListener('offline', async function(){
                that.$store.state.online = false
                that.synchroMessage = false
                that.$socket.disconnect()
                that.$socket.connected = false
                that.$socket.disconnected = true
            });
            window.addEventListener('online', function(){
                that.$socket.connect()
            });
            // Way to handle socket's break
            let hidden;
            let visibilityChange;
            if(typeof document.hidden !== 'undefined'){ // Opera 12.10 and Firefox 18 and later support
                hidden = 'hidden';
                visibilityChange = 'visibilitychange';
            }else if(typeof document.msHidden !== 'undefined'){
                hidden = 'msHidden';
                visibilityChange = 'msvisibilitychange';
            }else if(typeof document.webkitHidden !== 'undefined'){
                hidden = 'webkitHidden';
                visibilityChange = 'webkitvisibilitychange';
            }
            window.document.addEventListener(visibilityChange, () => {
                if(!document[hidden]){
                    this.$store.state.online = false
                    this.$store.state.visibility = true
                    this.$socket.disconnect().connect()
                }else this.$store.state.visibility = false
                // if(!document[hidden]){
                //     this.$store.state.visibility = true
                //     this.$socket.connect()
                // }else{
                //     this.$store.state.visibility = false
                //     this.$socket.disconnect()
                //     this.$socket.connected = false
                //     this.$socket.disconnected = true
                // }
                // this.$store.state.online = false
            })
        }
    },
    watch: {
        '$store.state.settingsFLAG': function(){
            this.footerKEY += 1
            this.leftSidebarKEY += 2
            this.rightSidebarKEY += 3
            if(this.$store.state.userToken.lang && this.$i18n.locale != this.$store.state.userToken.lang){
                this.$i18n.locale = this.$store.state.userToken.lang
                this.$vuetify.lang.current = this.$store.state.userToken.lang
            }
        },
        '$store.state.notificationFLAG': async function(){
            if(this.$store.state.notificationMessage == 'server_down'){
                this.$store.state.online = false;
                if(!this.$store.state.online) this.$notification("warning", this.$t('error_notify.server_down'))
            }else{
                try{
                    if(this.$store.state.notificationMessage == 403) this.$router.push('/403')
                    else if(this.$store.state.notificationMessage == 404) this.$router.push('/404')
                    else{
                        this.$notification("alert", this.$t('error_notify.' + this.$store.state.notificationMessage))
                        if(this.$store.state.notificationMessage && this.$store.state.notificationMessage == 'banned') await this.$logout()
                    }
                }catch{
                    console.log("Unknow error on app.vue")
                }
            }
        } 
    },
    mixins: [socketSynchronization]
}

</script>

<style>

    :root{
        --theme-background-color: #000; 
        --theme-contrast-color: #fff;
        --padding-bottom-footer-menu: 43px;
    }

    .dialogBackground{
        background: var(--theme-background-color);
        background-color: var(--theme-background-color);
    }

    .buttonDIALOG{
        background: var(--theme-background-color) !important;
    }

    html,
    body{
        background: var(--theme-background-color);
        background-color: var(--theme-background-color);
    }

    body{
        user-select: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        display: inline-block;
        word-break: break-word;
        width: 100%;
        max-width: 100%;
        height: 100vh;
        max-height: 100vh;
        margin: 0;
        padding: 0;
    }

    a{
        text-decoration: none;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }

    .v-system-bar{
        text-align: center;
        color: #fff !important;
    }

    .bottomFIX{
        height: 44px;
    }

    .appGrid{
        max-width: 750px;
        width: 100%;
        margin: 0 auto;
        min-height: calc( 100vh - 88px );
        float: left;
        padding-bottom: var(--padding-bottom-footer-menu);
        overflow-x: hidden;
    }

    .appGridLogout{
        max-width: 700px;
        width: 100%;
        margin: 0 auto;
        min-height: calc( 100vh - 44px );
    }

    .contenerLOGGED{
        padding: 12px 12px 0;
    }

    .titleOfSite{
        width: 100%;
        font-size: 2rem;
        font-weight: 700;
        display: grid;
        grid-template-columns: auto 44px;
    }

    .titleOfSite p{
        margin: auto auto 0 0 !important;
    }

    .titleOfSite i{
        margin: auto;
        color:#333;
    }

    .buttonOverMenu{
        position: fixed;
        bottom: 54px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
    }

    .v-badge{
        display: grid;
        margin: auto;
    }

    .v-badge__badge{
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        height: 16px !important;
        letter-spacing: 0;
        min-width: 16px !important;
        padding: 2px 4px !important;
        pointer-events: auto;
        position: absolute;
        text-align: center;
        text-indent: 0;
    }

    .loadMoreValueButtonCenter{
        width: 100%;
        display: grid;
    }

    .loadMoreDailyMeasurement{
        margin: 0 auto;
    }

    #mainContener{
        width: 100%;
        margin: 0 auto;
    }

    @media(min-width: 755px){
        #mainContener{
            width: 755px;
        }
        .appGrid{
            padding: 0 12px var(--padding-bottom-footer-menu);
        }
    }
    
    @media(min-width: 1031px){ #mainContener{ width: 1031px } }
    @media(min-width: 1281px){ #mainContener{ width: 1281px } }

    .marginAuto{
        margin: auto;
    }

    .v-overlay__content{
        height: 100vh;
        display: grid;
        grid-template-rows: 3fr 1fr 1fr;
    }

    .v-overlay__content .v-progress-circular{
        margin: auto;
    }
    
    .offlineCommunicate{
        width: 100%;
        padding: 5px 0;
        text-align: center;
        color: #fff;
        background: #e99123;
    }

    .theme--dark.v-tabs-items,
    .theme--dark.v-tabs>.v-tabs-bar,
    .theme--light.v-toolbar.v-sheet,
    .theme--dark.v-toolbar.v-sheet,
    .theme--dark.v-stepper,
    .v-dialog, .v-dialog--scrollable{
        background: transparent !important;
        background-color: transparent !important;
    }

    .lightTheme{
        background: #fff;
        color: rgba(0,0,0,.87);
    }

    .lightTheme i{
        color: rgba(0,0,0,.87) !important;
    }

    .darkTheme{
        background: var(--theme-background-color);
        color: #fff !important;
    }

    .darkTheme i{
        color: #fff !important;
    }

    .v-application--is-ltr .v-card__actions>.v-btn.v-btn+.v-btn{
        margin-left: 0 !important;
    }

</style>