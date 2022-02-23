<template>
    <div class="Bars">
        <div class="contenerLOGGED">
            <barsWEIGHT :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
            <barsCALORIES :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
            <barsWORKOUT :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
            <barsCOACH :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
        </div>
        <div class="reportBug"><v-btn :disabled="!this.$store.state.online" @click="routeMe()"><v-icon left>fas fa-bug</v-icon>{{this.$t("universal.reportBug")}}</v-btn></div>
    </div>
</template>

<script>
import barsCOACH from '@/components/bars/barsCOACH'
import barsWEIGHT from '@/components/bars/barsWEIGHT'
import barsWORKOUT from '@/components/bars/barsWORKOUT'
import barsCALORIES from '@/components/bars/barsCALORIES'
export default {
    components: {
        barsCOACH,
        barsWEIGHT,
        barsWORKOUT,
        barsCALORIES
    },
    name: 'Bars',
    methods: {
        routeMe(){
            this.$router.push("/contact")
        },
        async checkCoachTutorial(){
            if(await this.$addDAYStoISO(await this.$dateTOiso(this.$store.state.userToken.registered), 30) > await this.$dateTOiso(new Date())){
                if(!localStorage.getItem('coach_tutorial')){
                    if(this.$store.state.userToken.coach == '2020-01-01'){
                        this.$notification("alert", this.$t('error_notify.checkCoachTutorial'))
                        this.$router.push("/coach")
                    }
                }else{
                    localStorage.removeItem('coach_tutorial');
                    if(this.$store.state.userToken.coach == '2020-01-01') this.$router.push("/coach")
                }
            }
        }
    },
    async mounted(){
        this.checkCoachTutorial()
    }
}
</script>

<style scoped>

    .Bars .contenerLOGGED{
        display: grid;
        grid-template-columns: calc(50% - 6px) calc(50% - 6px);
        column-gap: 12px;
        row-gap: 12px;
        width: 100%;
    }

    .Bars .contenerLOGGED div{
        border: 1px solid #e4e4e4;
        border-radius: 10px;
    }

    .reportBug{
        width: 100%;
        display: grid;
        margin: 12px 0;
    }

    .reportBug .v-btn{
        margin: auto;
    }
    
</style>