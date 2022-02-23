<template>
    <div class="profileTOPbannerWITHuser">
        <loader :loaderValue="loaderValue" :key="loaderValue"/>
        <div class="profileTOPbox">
            <div class="avatarWITHchange">
                <div class="avatarWITHchangeCHANGER" v-if="this.$store.state.userToken.login == this.$route.params.login && this.$store.state.online">
                    <v-file-input
                        :accept="['image/png', 'image/jpg']"
                        hide-input
                        type="file"
                        ref="file"
                        @change="uploadNewAvatar"
                    ></v-file-input>
                </div>
                <div class="profileTOPboxIMG" id="divWithImage">
                    <img src="/img/logo.png" v-show="userHasNotAvatar">
                </div>
            </div>
            <div class="profileTOPboxINFO">
                <div class="profileTOPboxINFOelement">
                    <div class="profileTOPboxINFOelementGRID">
                        <div/>
                        <shareButton v-if="userARRAY._id != this.$store.state.userToken._id"/>
                        <v-btn v-else icon @click="$router.push('/settings')"><v-icon>fa-fw fas fa-cog</v-icon></v-btn>
                    </div>
                </div>
                <h3>{{ userARRAY.login }}</h3>
                <div class="profileTOPboxINFOelement">{{ userARRAY.name }} {{ userARRAY.surname }}</div>
                <div class="profileTOPboxINFOelement">{{ userARRAY.description }}</div>
                <div class="profileTOPboxINFOelement">
                    <a v-if="userARRAY.sex"><i class="fa-fw fas fa-male"></i></a><a v-if="!userARRAY.sex"><i class="fa-fw fas fa-female"></i></a>
                    <a v-if="userARRAY.website" :href="'https://'+userARRAY.website" target="_blank"><i class="fa-fw fas fa-link"></i></a>
                    <a v-if="userARRAY.twitter" :href="'https://twitter.com/'+userARRAY.twitter" target="_blank"><i class="fa-fw fab fa-twitter"></i></a>
                    <a v-if="userARRAY.facebook" :href="'https://www.facebook.com/'+userARRAY.facebook" target="_blank"><i class="fa-fw fab fa-facebook-square"></i></a>
                    <a v-if="userARRAY.instagram" :href="'https://www.instagram.com/'+userARRAY.instagram" target="_blank"><i class="fa-fw fab fa-instagram"></i></a>
                </div>
            </div>
        </div>

        <div class="profileMENU">
            <v-toolbar flat>
                <template v-slot:extension>
                    <v-tabs v-model="tabs" fixed-tabs>
                        <v-tab href="#1" class="primary--text"> 
                            <router-link :to="'/' + loginFROMurl">
                                <div class="tabGRID">
                                    <v-icon>fa-fw far fa-question-circle</v-icon>
                                </div>
                            </router-link>
                        </v-tab>
                        <v-tab href="#2" class="primary--text">
                            <router-link :to="'/' + loginFROMurl + '/nutrition_diary/' + today">
                                <div class="tabGRID">
                                    <v-icon>fa-fw fas fa-book</v-icon>
                                </div>
                            </router-link>
                        </v-tab>
                        <v-tab href="#3" class="primary--text">
                            <router-link :to="'/' + loginFROMurl + '/workout-result/'">
                                <div class="tabGRID">
                                    <v-icon>fa-fw fas fa-dumbbell</v-icon>
                                </div>
                            </router-link>
                        </v-tab>
                        <v-tab href="#4" class="primary--text">
                            <router-link :to="'/' + loginFROMurl + '/workout-plan/'">
                                <div class="tabGRID">
                                    <v-icon>fa-fw far fa-clipboard</v-icon>
                                </div>
                            </router-link>
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
        </div>
    </div>
</template>

<script>
import loader from '@/components/universal/loader'
import shareButton from '@/components/universal/shareButton'
export default {
    name: 'profileMENU',
    data: () => ({
        loginFROMurl: '',
        today: '',
        userARRAY: {},
        isActive: false,
        loaderValue: 0,
        userHasNotAvatar: false
    }),
    props:{
        tabs: [Number, String]
    },
    components: { loader, shareButton },
    methods:{
        async uploadNewAvatar(event){
            const formData = new FormData();
            formData.append('file', event)
            formData.append('where', 'avatar')
            await this.$http.post('requests/upload', formData, {onUploadProgress: e => this.loaderValue = Math.round(e.loaded * 100 / e.total)})
            .then(async (response) => {
                await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                if(!this.userARRAY.avatar){
                    await this.$changeSETTINGS({
                        "avatar": true
                    })
                }else await this.$tellAboutSynchronization('refresh')
                localStorage.setItem('lastUpdated', (await this.$currentTime()))
                window.location.reload(true);
            })
            .catch((err) => this.$catchThis(err))
        },
        async loadProfile(){
            this.loginFROMurl = this.$route.params.login
            this.userARRAY = {}
            if(this.$route.params.login == this.$store.state.userToken.login) this.userARRAY = this.$store.state.userToken
            else this.userARRAY = this.$store.state.guest
            this.today = await this.$shortDATE(await this.$getCorrectDate())
            let img1 = document.createElement("img");
            img1.onload = function(){
                document.querySelectorAll('.imageToDeleteWhileLoadingNext').forEach(e => e.remove());
                this.classList.add("imageToDeleteWhileLoadingNext")
                document.getElementById("divWithImage").append(this);
            };
            if(!this.userARRAY.avatar){
                this.userHasNotAvatar = true
            }else{
                img1.src = this.$baseURLserver + 'avatar/' + this.userARRAY._id + '.jpg'
            }
        }
    },
    async mounted(){ await this.loadProfile() },
    watch: {
        '$route': async function() {
            await this.loadProfile()
        },
        '$store.state.guest': async function() {
            await this.loadProfile()
        },
        '$store.state.settingsFLAG': async function() {
            await this.loadProfile()
        },
    }
}
</script>


<style>

    .profileTOPbox{
        margin: 0 0 12px;
        width: 100%;
        min-height: 1px;
        display: grid;
        grid-template-columns: 130px auto;
    }

    .avatarWITHchange{
        width: 120px;
        height: 120px;
        margin: auto auto auto 0;
        border-radius: 50%;
        border: 1px solid #e4e4e4;
        position: relative;
    }

    .avatarWITHchangeCHANGER{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(51, 51, 51, 0.55);
        position: absolute;
        opacity: 0;
        transition: 0.5s;
        z-index: 5;
    }

    .avatarWITHchangeCHANGER:hover{
        opacity: 1;
        cursor: pointer;
        transition: 0.5s;
    }

    .avatarWITHchangeCHANGER .v-input{
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff !important;
        padding: 0;
        margin: 0;
        margin-right: 0 !important;
        height: 100%;
        position: absolute;
        width: 100%;
        z-index: 5;
    }

    .avatarWITHchange img{
        width: 94%;
        height: 94%;
        margin: 3%;
        border-radius: 50%;
        position: absolute;
        z-index: 3;
    }

    .profileTOPboxINFO{
        width: 100%;
        display: grid;
        grid-template-rows: 44px auto auto auto auto;
    }

    .profileTOPboxINFOelement{
        width: 100%;
    }

    .profileTOPboxINFOelement a{
        text-decoration: none;
    }

    .profileTOPboxINFOelementGRID{
        display: grid;
        grid-template-columns: auto 44px;
        height: 100%;
    }

    .profileTOPboxINFOelementGRID a{
        display: grid;
    }

    .profileTOPboxINFOelementGRID i:hover{
        cursor: pointer;
    }

    .profileTOPboxINFOelementGRID h3{
        margin: auto 0;
    }

    .profileTOPboxINFOelementGRID i{
        margin: auto;
        font-size: 24px;
    }

    .profileTOPboxINFOelementGRIDbutton{
        background: #333;
        text-align: center;
        color: #fff;
        padding: 8px 0;
        font-size: 0.875rem;
    }

    .profileMENU{
        font-family: 'Quicksand', sans-serif !important;
    }

    .v-toolbar__content{
        display: none !important;
        height: 48px !important;
        max-height: 48px !important;
    }

    header{
        height: 48px !important;
        max-height: 48px !important;
        background: transparent;
        background-color: transparent;
    }

    .v-sheet.v-card:not(.v-sheet--outlined){
        box-shadow: none;
        height: auto !important;
    }

    .v-toolbar__extension{
        border-bottom: 1px solid #e4e4e4;
    }

    .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right)>.v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes) .v-slide-group__prev{
        display: none;
    }

    .profileMENU .fa-fw{
        font-size: 1.25rem;
        margin: auto;
    }

    .profileMENU .router-link-active{
        width: 100%;
        height: 100%;
        margin: auto;
    }

    .tabGRID{
        display: grid;
        width: 100%;
        height: 100%;
    }

    .profileMENU a{
        width: 100%;
        height: 100%;
        margin: auto;
    }

    .v-input__prepend-outer{
        margin-right: 0 !important;
    }

</style>