<template>
    <div>
        <div style="height: 50px; width: 100%;"/>
        <div class="joinBanner">
            <div>{{this.$t("logouted.join_us")}}!</div>
            <v-btn color="primary" @click="$router.push('/login')">{{this.$t("logouted.sign_in")}}</v-btn>
            <v-btn color="primary" @click="$router.push('/register')">{{this.$t("logouted.register")}}</v-btn>
        </div>
    </div>
</template>

<style scoped>

    .joinBanner{
        width: 100%;
        min-height: 44px;
        background: #333;
        position: fixed;
        bottom: 0;
        left: 0;
        display: grid;
        grid-template-columns: 1fr auto auto;
    }

    .joinBanner div{
        margin: auto;
        color: #fff;
    }

    .joinBanner .v-btn{
        margin: auto 5px auto auto;
    }

</style>