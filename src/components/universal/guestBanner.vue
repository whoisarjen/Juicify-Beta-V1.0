<template>
    <div class="guestBannerComponent" v-if="this.$store.state.userToken.login != this.$route.params.login">
        <div class="guestFIXER"/>
        <router-link :to="'/' + this.$route.params.login">
            <div class="guestBannerHolder">
                <div class="guestBanner">
                    <img class="guestBannerLogo" :src="$baseURLserver + 'avatar/' + this.$store.state.guest._id + '.jpg'" onerror="javascript:this.src='/img/logo.png'">
                    <div class="guestBannerText">{{$t("guest.watching")}} {{ this.$route.params.login }}</div>
                </div>
            </div>
        </router-link>
        <joinBanner v-if="!this.$store.state.userToken.login"/>
    </div>
</template>

<script>
import joinBanner from '@/components/universal/joinBanner'
export default {
    components: {joinBanner}
}
</script>

<style scoped>

    .guestBanner{
        color: #fff;
        background: #e99123;
        display: grid;
        min-height: 40px;
        grid-template-columns: 40px auto;
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        border-radius: 9999px!important;
        text-align: center;
    }

    .guestBannerLogo{
        width: 36px;
        height: 36px;
        margin: auto;
        border-radius: 50%;
        background: #fff;
    }

    .guestBannerText{
        padding: 0 15px 0 5px;
        width: 100%;
        margin: auto 0;
    }

    .guestBannerHolder{
        position: fixed;
        bottom: 44px;
        width: calc( 100% - 24px );
        padding: 5px 0;
        display: grid;
        max-width: 676px;
        min-height: 1px;
    }

    .guestFIXER{
        min-height: 40px;
        width: 100%;
    }

</style>