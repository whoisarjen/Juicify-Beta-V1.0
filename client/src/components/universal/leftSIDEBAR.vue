<template>
    <div class="leftSIDEBAR">
        <router-link :to="'/'+this.$store.state.userToken.login">
            <img :src="[ this.$store.state.userToken.avatar ? urlToAvatar : '/img/logo.png' ]" onerror="javascript:this.src='/img/logo.png'" class="leftSIDEBARavatar"/>
        </router-link>
        <h1>{{ this.$store.state.userToken.login }}</h1>
        <div class="leftSIDEBARinformations">
            <router-link to="/settings"><div class="leftSIDEBARinformationsBUTTON rounded-pill">{{ $t("universal.edit") }} {{ $t("profile.profile_small") }}</div></router-link>
            <a v-if="this.$store.state.userToken.website" :href="'https://'+this.$store.state.userToken.website" rel="nofollow" target="_blank"><div v-if="this.$store.state.userToken.website" class="leftSIDEBARinformationsELEMENT"><i class="fa-fw fas fa-link"></i><div>{{$t("settings.website")}}</div></div></a>
            <a v-if="this.$store.state.userToken.facebook" :href="'https://www.facebook.com/'+this.$store.state.userToken.facebook" rel="nofollow" target="_blank"><div v-if="this.$store.state.userToken.facebook" class="leftSIDEBARinformationsELEMENT"><i class="fa-fw fab fa-facebook-square"></i><div>Facebook</div></div></a>
            <a v-if="this.$store.state.userToken.twitter" :href="'https://www.twitter.com/'+this.$store.state.userToken.twitter" rel="nofollow" target="_blank"><div v-if="this.$store.state.userToken.twitter" class="leftSIDEBARinformationsELEMENT"><i class="fa-fw fab fa-twitter"></i><div>Twitter</div></div></a>
            <a v-if="this.$store.state.userToken.instagram" :href="'https://www.instagram.com/'+this.$store.state.userToken.instagram" rel="nofollow" target="_blank"><div v-if="this.$store.state.userToken.instagram" class="leftSIDEBARinformationsELEMENT"><i class="fa-fw fab fa-instagram"></i><div>Instagram</div></div></a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'leftSIDEBAR',
    data: () => ({
        urlToAvatar: ''
    }),
    props:{
        loggedUser: Boolean,
        synchroMessage: Boolean
    },
    mounted(){
        this.urlToAvatar = this.$baseURLserver + 'avatar/' + this.$store.state.userToken._id + '.jpg'
    }
}
</script>

<style scoped>

    h1{
        line-height: 1;
    }

    @media(max-width: 1030px){
        .leftSIDEBAR{
            display: none;
        }
    }

    .leftSIDEBAR{
        width: 100%;
        max-width: 260px;
        min-height: 1px;
        float: left;
    }

    .leftSIDEBARavatar{
        width: calc(100% - 42px);
        height: 218px;
        border-radius: 50%;
        margin: 20px;
        border: 1px solid #e4e4e4;
    }

    .leftSIDEBARinformationsELEMENT{
        width: 100%;
        display: grid;
        grid-template-columns: 28px auto;
        margin-top: 10px;
        font-size: 0.875rem;
    }

    .leftSIDEBARinformationsELEMENT i{
        margin: 4px;
    }

    .leftSIDEBARinformationsBUTTON{
        width: 100%;
        text-align: center;
        border-radius: 4px;
        margin: 20px 0;
        background: #333;
        color: #fff;
        padding: 8px 0;
        font-size: 0.875rem !important;
    }

</style>