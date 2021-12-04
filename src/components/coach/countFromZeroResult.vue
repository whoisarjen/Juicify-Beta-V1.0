<template>
    <div class="result">
        <h1>{{$t("coach.step20.title")}}</h1>
        <div class="loader" v-if="!resultLoaded">
            <v-progress-circular
            style="margin: auto;"
            :size="90"
            color="#e4e4e4"
            indeterminate
            ></v-progress-circular>
        </div>
        <div v-if="!resultLoaded" style="text-align: center;">{{this.$t("coach.countFromZeroResult.analyzing")}}...</div>
        <div v-if="resultLoaded">
            <div style="text-align: center;">{{this.$t("coach.countFromZeroResult.your_daily_macronutrients")}}:</div>
            <div style="text-align: center; font-weight: bold; margin: 15px 0;">{{proteins}}g {{this.$t("universal.proteins")}}, {{carbs}}g {{this.$t("universal.carbs")}}, {{fats}}g {{this.$t("universal.fats")}}, {{proteins * 4 + carbs * 4 + fats * 9}}kcal</div>
            <warningMessage v-if="proteins * 4 + carbs * 4 + fats * 9 < 1300" :calories="proteins * 4 + carbs * 4 + fats * 9"/>
            <div style="font-weight: bold;">{{this.$t("coach.countFromZeroResult.rules")}}:</div>
            <tutorial open="1"/>
        </div>
        <div/>
        <v-btn
        v-if="resultLoaded"
        class="rounded-pill"
        color="primary"
        @click="$router.push('/')"
        >
        {{$t("universal.read")}}
        </v-btn>
    </div>
</template>

<script>
import tutorial from '@/components/coach/tutorial'
import warningMessage from '@/components/coach/warningMessage'
export default {
    data: () => ({
        resultLoaded: false,
        proteins: 0,
        carbs: 0,
        fats: 0,
        calories: 0
    }),
    methods: {
        async create(object){
            object = JSON.parse(JSON.stringify(object))
            object.today = await this.$getCorrectDate()
            let daily = await this.$getAllIndexedDB("daily_measurement")
            daily = daily.sort((a, b) => {
                if(a.whenAdded < b.whenAdded) return 1;
                if(b.whenAdded < a.whenAdded) return -1;
                return 0;
            })
            if(daily.length > 0){
                for(let i=0; i<daily.length; i++){
                    if(daily[i].weight){
                        object.theNewestWeight = daily[i].weight
                        break;
                    }
                }
            }
            this.$http.post('requests/coach/create', {
                array: [object]
            })
            .then(async (response) => {
                await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                const token = this.$decodeToken(response.data.jwt)
                this.$store.state.userToken = token
                this.$cookies.set("token", response.data.jwt, "200y")
                this.$http.defaults.headers.common['Authorization'] = response.data.jwt
                await this.$tellAboutSynchronization("settings", "change", response.data.jwt)
                this.$store.state.settingsFLAG = await this.$currentTime()
                localStorage.setItem('lastUpdated', (await this.$currentTime()) + 1000)
                this.proteins = token.macronutrients[0].proteins
                this.carbs = token.macronutrients[0].carbs
                this.fats = token.macronutrients[0].fats
                this.calories = token.macronutrients[0].proteins * 4 + token.macronutrients[0].carbs * 4 + token.macronutrients[0].fats * 9
                this.resultLoaded = true
            })
        }
    },
    components: {
        tutorial,
        warningMessage
    }
}
</script>

<style scoped>

    .result{
        padding: 12px 0;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: auto auto 10px 36px;
    }

    .loader{
        width: 100%;
        display: grid;
        height: calc( calc( 100vh - 183px ) / 4 * 3 );
    }

</style>