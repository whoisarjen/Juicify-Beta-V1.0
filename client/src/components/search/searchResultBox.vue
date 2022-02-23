<template>
    <v-lazy
        v-model="isActive"
        :options="{
            threshold: .5
        }"
        min-height="51"
        transition="fade-transition"
    >
        <router-link :disabled="!this.$store.state.online" :event="this.$store.state.online ? 'click' : ''"  :to="'/' + user.login" class="searchResultElement" :id="'divWithImage' + index">
            <img :src="urlToAvatar">
            <div class="heightLikeWidthHolder"/>
            <div class="searchResultsGridInfo">{{user.login}}</div>
        </router-link>
    </v-lazy>
</template>

<script>
export default {
    data: () => ({
        isActive: false,
        urlToAvatar: '/img/logo.png'
    }),
    props: {
        user: Object,
        index: Number
    },
    mounted(){
        let img = new Image()
        img.onload = () => {
            this.urlToAvatar = img.src
        }
        img.src = this.$baseURLserver + 'avatar/' + this.user._id + '.jpg';
    }
}
</script>