<template>
    <footer :class="[this.$vuetify.theme.dark ? 'footerMENU darkTheme' : 'footerMENU lightTheme']">
        <router-link class="footerA" to="/"><div class="footerElement"><v-btn icon><v-icon>fa-fw fas fa-home</v-icon></v-btn></div></router-link>
        <router-link class="footerA" to="/workout"><div class="footerElement" ><v-btn icon><v-icon>fa-fw fas fa-dumbbell</v-icon></v-btn></div></router-link>
        <router-link class="footerA" to="/barcode-scanner"><div class="footerElement" ><v-btn icon><v-icon>fa-fw fas fa-camera</v-icon></v-btn></div></router-link>
        <div class="footerElement" @click="nutrition_diary_route()"><v-btn icon><v-icon>fa-fw fas fa-book</v-icon></v-btn></div>
        <router-link class="footerA" :to="'/'+this.$store.state.userToken.login">
            <div class="footerElement" >
                <v-btn icon>
                    <img :src="urlToAvatar" v-if="this.$store.state.userToken.avatar">
                    <v-icon v-else>fas fa-user-circle</v-icon>
                </v-btn>
            </div>
        </router-link>
    </footer>

    <!-- <v-bottom-navigation v-model="value" color="primary" class="footerMENU" >
        <router-link class="footerA" to="/">
            <v-btn value="home">
            <span>Start</span>

            <v-icon>fa-fw fas fa-home</v-icon>
            </v-btn>
        </router-link>

        <router-link class="footerA" to="/workout">
            <v-btn value="workout">
            <span>{{$t("workout.title")}}</span>

            <v-icon>fa-fw fas fa-dumbbell</v-icon>
            </v-btn>
        </router-link>

        <router-link class="footerA" to="/barcode-scanner">
            <v-btn value="barcode">
            <span>{{$t("barcode_scanner.title")}}</span>

            <v-icon>fa-fw fas fa-camera</v-icon>
            </v-btn>
        </router-link>

        <router-link class="footerA" :to='"/"+this.$store.state.userToken.login+"/nutrition_diary/"+this.$userDate().substr(0, 10)'>
            <v-btn value="nutrition_diary">
            <span>{{$t("nutrition_diary.title")}}</span>

            <v-icon>fa-fw fas fa-book</v-icon>
            </v-btn>
        </router-link>

        <router-link class="footerA" :to="'/'+this.$store.state.userToken.login">
            <v-btn value="profile">
            <span>{{$t("profile.title")}}</span>

            <v-icon>fas fa-user-circle</v-icon>
            </v-btn>
        </router-link>
    </v-bottom-navigation> -->
</template>
<script>
export default {
    name: 'footerMENU',
    data: () => ({
        // value: 'home',
        direction: 'top',
        fab: false,
        fling: false,
        hover: false,
        tabs: null,
        urlToAvatar: '',
        transition: 'slide-y-reverse-transition',
    }),
    methods: {
        async nutrition_diary_route(){
            if("/"+this.$store.state.userToken.login+"/nutrition_diary/"+(await this.$getCorrectDate()).substr(0, 10) != this.$route.path){
                this.$router.push("/"+this.$store.state.userToken.login+"/nutrition_diary/"+(await this.$getCorrectDate()).substr(0, 10))
            }
        }
    },
    async mounted(){
        this.todaysDateInISO = await this.$getCorrectDate()
        this.urlToAvatar = this.$baseURLserver + 'avatar/' + this.$store.state.userToken._id + '.jpg'
        // this.value = this.$route.name
    }
}
</script>

<style scoped>

    /* .footerMENU{
        height: 56px;
        width: 100%;
        position: fixed;
        bottom: 0;
        z-index: 2;
    }

    .footerMENU .v-btn{
        cursor: pointer;
        min-width: auto !important;
    }

    .footerA{
        text-decoration: none;
        display: grid;
    } */

    .footerMENU{
        height: 44px;
        /* border-top: 1px solid #e4e4e4; */
        box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%);
        width: 100%;
        position: fixed;
        bottom: 0;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        z-index: 2;
    }

    .footerMENU .v-btn{
        font-size: 1.5rem;
        margin: auto;
        cursor: pointer;
    }

    .v-speed-dial a{
        width: 40px;
        height: 40px;
        display: grid;
        margin: auto;
        display: grid;
        text-decoration: none;
    }

    .footerA{
        text-decoration: none;
        display: grid;
    }

    .footerElement{
        width: 100%;
        display: grid;
    }

    .footerElement img{
        height: 32px;
        width: 32px;
        border-radius: 50%;
        margin: auto;
    }

</style>