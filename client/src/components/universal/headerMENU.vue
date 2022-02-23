<template>
    <div :class="[this.$vuetify.theme.dark ? 'headerMENU darkTheme' : 'headerMENU lightTheme']">
        <div id="nav">
            <router-link class="navA" to="/settings"><v-btn icon><v-icon>fas fa-cog</v-icon></v-btn></router-link>
            <div/>
            <router-link class="navA" to="/"><img class="headerMENUicon" src="/img/logo.png"></router-link>
            <noInternetWarning  v-if="!this.$store.state.online && this.$store.state.visibility"/>
            <div v-else/>
            <router-link class="navA" to="/search"><v-btn icon><v-icon>fas fa-search</v-icon></v-btn></router-link>
        </div>
    </div>
</template>
<script>
import noInternetWarning from '@/components/universal/noInternetWarning'
export default {
    name: 'headerMENU',
    props: {
        number_of_messages: Number
    },
    components: { noInternetWarning }
}
</script>

<style scoped>

    #nav .v-btn{
        margin: auto;
    }

    #nav{
        width: 100%;
        padding: 0 5px;
        min-height: 44px;
        display: grid;
        grid-template-columns: 44px 1fr 44px 1fr 44px;
        border-bottom: 1px solid #e4e4e4;
    }

    @media(max-width: 750px){
        #nav{
            grid-template-columns: 44px 1fr 44px 1fr 44px;
        }
    }

    #nav i{
        font-size: 1.5rem;
        margin: auto;
    }

    #nav div{
        margin: auto;
    }

    .navA{
        text-decoration: none;
        display: grid;
    }

    .headerMENUicon{
        margin: auto;
        width: 36px;
    }

</style>