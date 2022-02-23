<template>
    <div class="result">
        <h1 v-if="resultLoaded">{{$t("coach.step20.title")}}</h1>
        <div v-else/>
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
            <div v-if="coachAnswer" style="font-weight: bold; text-transform: uppercase;">{{$t("coach.step2.title")}}:</div>
            <div v-else/>
            <div>
                {{coachAnswer}}
            </div>
            <div style="font-weight: bold; text-transform: uppercase; margin-top: 15px;">{{$t("coach.countFromZeroResult.remind_about_rules")}}:</div>
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
        calories: 0,
        coachAnswer: ''
    }),
    methods: {
        changeStep(goToStep){
            this.$emit("changeStep", goToStep)
        },
        async analyze(object){
            object = JSON.parse(JSON.stringify(object))
            object.results = []
            let daily = await this.$getAllIndexedDB("daily_measurement")
            let today = await this.$getCorrectDate()
            object.today = today
            daily = daily.sort((a, b) => {
                if(a.whenAdded < b.whenAdded) return 1;
                if(b.whenAdded < a.whenAdded) return -1;
                return 0;
            })
            if(daily.length > 0){
                for(let i=0; i<daily.length; i++){
                    if(object.results.length == 14) break;
                    if(daily[i].whenAdded == today){
                        object.theNewestWeight = daily[i].weight
                    }else if(daily[i].whenAdded == await this.$addDAYStoISO(today, -1)){
                        if(!object.theNewestWeight) object.theNewestWeight = daily[i].weight
                        today = daily[i].whenAdded
                        let holder = {
                            "weight": daily[i].weight,
                            "whenAdded": daily[i].whenAdded,
                            "calories": 0,
                            "proteins": 0,
                            "fiber": 0,
                            "sugar": 0,
                            "today": today,
                            "burned": 0
                        }
                        if(daily[i].nutrition_diary && daily[i].nutrition_diary.length>0){
                            for(let a=0; a<daily[i].nutrition_diary.length; a++){
                                if(daily[i].nutrition_diary[a].p){
                                    holder.calories += daily[i].nutrition_diary[a].p * 4 * daily[i].nutrition_diary[a].how_many
                                    holder.proteins += daily[i].nutrition_diary[a].p * 4 * daily[i].nutrition_diary[a].how_many
                                }
                                if(daily[i].nutrition_diary[a].c) holder.calories += daily[i].nutrition_diary[a].c * 4 * daily[i].nutrition_diary[a].how_many
                                if(daily[i].nutrition_diary[a].s) holder.sugar += daily[i].nutrition_diary[a].s * 4 * daily[i].nutrition_diary[a].how_many
                                if(daily[i].nutrition_diary[a].f) holder.calories += daily[i].nutrition_diary[a].f * 9 * daily[i].nutrition_diary[a].how_many
                                if(daily[i].nutrition_diary[a].fi) holder.fiber += daily[i].nutrition_diary[a].fi * daily[i].nutrition_diary[a].how_many
                                if(daily[i].nutrition_diary[a].calories) holder.calories += daily[i].nutrition_diary[a].calories
                                if(daily[i].nutrition_diary[a].calories && daily[i].nutrition_diary[a].calories < 0) holder.burned += daily[i].nutrition_diary[a].calories
                            }
                        }
                        holder.calories = parseInt(holder.calories)
                        object.results.push(holder)
                    }
                }
            }
            this.$http.post('requests/coach/analyze', {
                array: [object]
            })
            .then(async (response) => {
                if(response.data.analyzeSomethingWentWrong){
                    this.changeStep('analyzeSomethingWentWrong');
                }else{
                    await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                    this.coachAnswer = response.data.coachAnswer
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
                }
            })
        }
    },
    components: { tutorial, warningMessage }
}
</script>

<style scoped>

    .result{
        min-height: calc( 100vh - 116px );
        margin: 12px 0;
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