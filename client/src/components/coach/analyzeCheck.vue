<template>
    <div class="secondSTEP">
        <!-- <h1>{{$t("coach.step2.title")}}</h1> -->
        <table>
            <tr>
                <td>{{$t("universal.date")}}</td>
                <td>{{$t("universal.weight")}}</td>
                <td>{{$t("nutrition_diary.title")}}</td>
            </tr>
            <tr v-for="item in arrayWITHallNEEDEDvalues" :key="item.whenAdded">
                <td style='color: red; font-weight: bold;' v-if="item.weight == 0 || item.calories == 0">{{(item.whenAdded).substr(8, 2)+"."+(item.whenAdded).substr(5, 2)}}</td>
                <td v-else>{{(item.whenAdded).substr(8, 2)+"."+(item.whenAdded).substr(5, 2)}}</td>
                <td style='color: red; font-weight: bold;' v-if="item.weight == 0 || item.calories == 0">{{item.weight}}kg</td>
                <td v-else>{{item.weight}}kg</td>
                <td style='color: red; font-weight: bold;' v-if="item.weight == 0 || item.calories == 0">{{item.calories}}kcal</td>
                <td v-else>{{item.calories}}kcal</td>
            </tr>
        </table>
        <div class="secondSTEPimportantTEXT" v-if="arrayWITHallNEEDEDvalues.length < 14">
            <div>{{$t("coach.step2.not_enough_information")}}</div>
        </div>
        <div class="secondSTEPimportantTEXT" v-if="(arrayWITHallNEEDEDvalues.length > 6) && (todayWEIGHT > 0)">
            <div><b>{{$t("coach.step2.today_weight")}} {{todayWEIGHT}}kg!</b></div>
        </div>
        <div class="secondSTEPimportantTEXT" style="color: red;" v-if="todayWEIGHT == 0">
            <div>{{$t("coach.step2.today_weight_is_null")}}</div>
        </div>
        <div class="secondSTEPtext" v-if="(arrayWITHallNEEDEDvalues.length > 6) && (todayWEIGHT > 0)">
            {{$t("coach.step2.check_results")}}
        </div>
        <v-btn
            class="rounded-pill"
            v-if="(arrayWITHallNEEDEDvalues.length > 6) && (todayWEIGHT > 0)"
            color="primary"
            @click="changeStep('analyzeAnyChanges')"
        >
        {{$t("universal.confirm")}}
        </v-btn>
    </div>
</template>

<script>
export default {
    data: () => ({
        arrayWITHallNEEDEDvalues: [],
        todayWEIGHT: 0
    }),
    methods: {
        changeStep(goToStep){
            this.$emit("changeStep", goToStep)
        }
    },
    async mounted(){
        let daily = await this.$getAllIndexedDB("daily_measurement")
        let today = await this.$getCorrectDate()
        daily = daily.sort((a, b) => {
            if(a.whenAdded < b.whenAdded) return 1;
            if(b.whenAdded < a.whenAdded) return -1;
            return 0;
        })
        if(daily.length > 0){
            for(let i=0; i<daily.length; i++){
                if(this.arrayWITHallNEEDEDvalues.length == 14) break;
                if(daily[i].whenAdded == today){
                    this.todayWEIGHT = daily[i].weight || 0
                }else if(daily[i].whenAdded == await this.$addDAYStoISO(today, -1)){
                    today = daily[i].whenAdded
                    let object = {
                        "weight": daily[i].weight,
                        "whenAdded": daily[i].whenAdded,
                        "calories": 0,
                        "burned": 0
                    }
                    if(daily[i].nutrition_diary && daily[i].nutrition_diary.length>0){
                        for(let a=0; a<daily[i].nutrition_diary.length; a++){
                            if(daily[i].nutrition_diary[a].p) object.calories += daily[i].nutrition_diary[a].p * 4 * daily[i].nutrition_diary[a].how_many
                            if(daily[i].nutrition_diary[a].c) object.calories += daily[i].nutrition_diary[a].c * 4 * daily[i].nutrition_diary[a].how_many
                            if(daily[i].nutrition_diary[a].f) object.calories += daily[i].nutrition_diary[a].f * 9 * daily[i].nutrition_diary[a].how_many
                            if(daily[i].nutrition_diary[a].calories) object.calories += daily[i].nutrition_diary[a].calories
                            if(daily[i].nutrition_diary[a].calories && daily[i].nutrition_diary[a].calories < 0) object.burned += daily[i].nutrition_diary[a].calories
                        }
                    }
                    object.calories = parseInt(object.calories)
                    this.arrayWITHallNEEDEDvalues.push(object)
                }
            }
        }
    }
}
</script>

<style scoped>

    .secondSTEP{
        min-height: calc( 100vh - 116px );
        margin: 12px 0;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: auto auto auto 36px;
    }

    .secondSTEPtext{
        text-align: center;
        font-size: 0.875rem;
    }

    .secondSTEP .border_TOP{
        border-top: 1px solid #333;
    }

    .secondSTEPimportantTEXT{
        display: grid;
    }

    .secondSTEPimportantTEXT div{
        margin: auto;
        text-align: center;
    }

    table{
        width: 100%;
        text-align: center;
        color: #a4a4a4;
        border-collapse: collapse;
    }

    tr,
    td{
        border: 1px solid #e4e4e4;
    }

    tr:first-child{
        font-weight: bold;
    }

</style>