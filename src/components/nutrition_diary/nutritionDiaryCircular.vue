<template>
    <div class="nutrition_diaryCircular">
            <v-tabs
                v-model="tab"
                grow
                style="margin-bottom: 24px;"
            >
                <v-tab>
                    {{$t("universal.consumed")}}
                </v-tab>
                <v-tab>
                    {{$t("universal.remaining")}}
                </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <div class="circularHolder">
                        <div class="circularBox">
                            <v-progress-circular
                                :rotate="-90"
                                :size="110"
                                :width="7"
                                color="primary"
                                :value="valueCalories"
                            >
                            <span :class="[this.$vuetify.theme.dark ? 'darkTheme' : 'lightTheme']">{{valueCaloriesLeft.toFixed()}}kcal</span>
                            </v-progress-circular>
                        </div>
                        <div/>
                        <table>
                            <tr>
                                <th>{{$t("universal.proteins")}}</th>
                                <td>{{valueProteinsLeft.toFixed(1)}}g</td>
                                <td>{{todayGOAL.proteins}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.carbs")}}</th>
                                <td>{{valueCarbsLeft.toFixed(1)}}g</td>
                                <td>{{todayGOAL.carbs}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.sugar")}}</th>
                                <td>{{valueSugarLeft.toFixed(1)}}g</td>
                                <td>{{todayGOAL.sugar}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.fats")}}</th>
                                <td>{{valueFatsLeft.toFixed(1)}}g</td>
                                <td>{{todayGOAL.fats}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.fiber")}}</th>
                                <td>{{valueFiberLeft.toFixed(1)}}g</td>
                                <td>{{todayGOAL.fiber}}g</td>
                            </tr>
                        </table>
                    </div>
                </v-tab-item>
                <v-tab-item>
                    <div class="circularHolder">
                        <div class="circularBox">
                            <v-progress-circular
                                :rotate="-90"
                                :size="110"
                                :width="7"
                                color="primary"
                                :value="valueCalories"
                            >
                            <span :class="[this.$vuetify.theme.dark ? 'darkTheme' : 'lightTheme']">{{caloriesLeftToEat.toFixed()}}kcal</span>
                            </v-progress-circular>
                        </div>
                        <div/>
                        <table>
                            <tr>
                                <th>{{$t("universal.proteins")}}</th>
                                <td>{{(todayGOAL.proteins - valueProteinsLeft).toFixed(1)}}g</td>
                                <td>{{todayGOAL.proteins}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.carbs")}}</th>
                                <td>{{(todayGOAL.carbs - valueCarbsLeft).toFixed(1)}}g</td>
                                <td>{{todayGOAL.carbs}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.sugar")}}</th>
                                <td>{{(todayGOAL.sugar - valueSugarLeft).toFixed(1)}}g</td>
                                <td>{{todayGOAL.sugar}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.fats")}}</th>
                                <td>{{(todayGOAL.fats - valueFatsLeft).toFixed(1)}}g</td>
                                <td>{{todayGOAL.fats}}g</td>
                            </tr>
                            <tr>
                                <th>{{$t("universal.fiber")}}</th>
                                <td>{{(todayGOAL.fiber - valueFiberLeft).toFixed(1)}}g</td>
                                <td>{{todayGOAL.fiber}}g</td>
                            </tr>
                        </table>
                    </div>
                </v-tab-item>
            </v-tabs-items>
        <div class="extraOPTIONS" v-if="this.$store.state.userToken.login == this.$route.params.login && this.$route.params.date">
            <div/>
            <router-link to="/calories-manager" class="extraOPTIONSbox">
                <i class="fa-fw fas fa-chart-pie"></i>
                <div class="extraOPTIONStext">{{ $t("nutrition_diary.rotation") }}</div>
            </router-link>
            <router-link to="/coach" class="extraOPTIONSbox">
                <i class="fa-fw fas fa-diagnoses"></i>
                <div class="extraOPTIONStext">{{ $t("universal.coach") }}</div>
            </router-link>
            <v-dialog
            v-model="dialog"
            persistent
            max-width="500px"
            >
            <template v-slot:activator="{ on, attrs }">
                <div class="iconWITHOUTlink"
                    v-bind="attrs"
                    v-on="on">
                    <i class="fa-fw fas fa-fire" v-if="burnedCalories > 0" style="color: #e25822;"></i>
                    <i class="fa-fw fas fa-fire" v-if="burnedCalories == 0"></i>
                    <div class="extraOPTIONStext">{{ burnedCalories }}kcal</div>
                </div>
            </template>
            <v-card>
                <v-card-title>
                <span class="headline">{{$t("burned.title")}}</span>
                </v-card-title>
                <v-card-text>
                <v-container>
                    {{$t("burned.description")}}
                    <v-form ref="form">
                    <v-row>
                        <v-col
                            cols="12"
                        >
                        <v-text-field
                            v-model="activity"
                            :rules="inputTEXToptionalSHORT"
                            :label='$t("add_exercise.name_of_exercise")'
                        ></v-text-field>
                        <v-text-field
                            type="number"
                            placeholder="0"
                            v-model="burnedCaloriesTOadd"
                            :rules="basicNumberSecurityOver0"
                            :label='$t("burned.how_many_burned")'
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    </v-form>
                </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="dialog = false"
                >
                    {{$t("universal.deny")}}
                </v-btn>
                <v-btn
                    text
                    :loading="burnedCalorieAcceptLoader"
                    @click="addBurnedCalories"
                >
                    {{$t("universal.confirm")}}
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <div/>
        </div>
        <div style="margin-bottom: 20px;" v-else></div>
    </div>
</template>

<script>
export default {
    name: 'nutrition_diaryCircular',
    data () {
    return {
        burnedCalorieAcceptLoader: false,
        dialog: false,
        activity: '',
        burnedCalories: 0,
        burnedCaloriesTOadd: "",
        burnedCaloriesNAME: "",
        valueProteins: 0,
        valueCarbs: 0,
        valueSugar: 0,
        valueFats: 0,
        valueFiber: 0,
        valueCalories: 0,
        valueProteinsLeft: 0,
        valueCarbsLeft: 0,
        valueFatsLeft: 0,
        valueEthanol: 0,
        valueCaloriesLeft: 0,
        valueSugarLeft: 0,
        valueFiberLeft: 0,
        caloriesLeftToEat: 0,
        todayGOAL: {
            "proteins": 0,
            "carbs": 0,
            "sugar": 0,
            "fats": 0,
            "fiber": 0
        },
        tab: 0
    }
    },
    props: {
        items: Array
    },
    mounted(){
        this.loadCircularValues()
    },
    methods:{
        async addBurnedCalories(){
            this.burnedCalorieAcceptLoader = true
            if( this.$refs.form.validate() ){
                let arrayToSend = [{
                    "whenAdded": this.$route.params.date,
                    "calories": -this.burnedCaloriesTOadd,
                }]
                if(this.activity) arrayToSend[0].activity = this.activity
                await this.$daily_measurement(arrayToSend,
                    "nutrition_diary",
                    "add"
                )
                this.$emit("reload")
                this.activity = ''
                this.burnedCaloriesTOadd = 0
                this.$store.state.barsCarloriesFLAG = await this.$currentTime()
                this.dialog = false
            }
            this.burnedCalorieAcceptLoader = false
        },
        async loadCircularValues(){
            let todayGOAL
            if(this.$store.state.userToken.login == this.$route.params.login){
                todayGOAL = this.$store.state.userToken.macronutrients
                let today = await this.$todayDAY()
                for(let i=0; i<todayGOAL.length; i++){
                    if(todayGOAL[i].day == today) {
                        todayGOAL = todayGOAL[i]
                        break;
                    }
                }
            }else{
                todayGOAL = {
                    "proteins": 0,
                    "carbs": 0,
                    "fats": 0
                }
            }
            this.valueProteins = 0;
            this.valueCarbs = 0;
            this.valueFats = 0;
            this.valueSugar = 0;
            this.valueFiber = 0;
            this.valueCalories = 0;
            this.burnedCalories = 0;
            this.$props.items.forEach((v) => {
                if(v.calories < 0){
                    this.burnedCalories += -v.calories
                }else if(v.calories > 0){
                    this.valueCalories += v.calories
                }else{
                    if(v.p) this.valueProteins += (v.p * v.how_many);
                    if(v.c) this.valueCarbs += (v.c * v.how_many);
                    if(v.f) this.valueFats += (v.f * v.how_many);
                    if(v.fi) this.valueFiber += (v.fi * v.how_many);
                    if(v.s) this.valueSugar += (v.s * v.how_many);
                    if(v.ethanol) this.valueEthanol += (v.ethanol * v.how_many)
                }
            })
            this.valueCalories += (this.valueProteins * 4 + this.valueCarbs * 4 + this.valueFats * 9 + this.valueEthanol * 7).toFixed() - this.burnedCalories
            this.valueProteinsLeft = this.valueProteins
            this.valueCarbsLeft = this.valueCarbs
            this.valueFatsLeft = this.valueFats
            this.valueSugarLeft = this.valueSugar
            this.valueFiberLeft = this.valueFiber
            this.valueCaloriesLeft = this.valueCalories
            this.valueProteins = this.valueProteins / todayGOAL.proteins * 100
            this.valueCarbs = this.valueCarbs / todayGOAL.carbs * 100
            this.valueFats = this.valueFats / todayGOAL.fats * 100
            const caloriesGoal = todayGOAL.proteins * 4 + todayGOAL.carbs * 4 + todayGOAL.fats * 9
            this.caloriesLeftToEat = caloriesGoal - this.valueCalories
            this.valueCalories  = this.valueCalories / caloriesGoal * 100
            const maxSugarRecommendaction = caloriesGoal / 100 * this.$store.state.userToken.sugar_percent
            if(maxSugarRecommendaction < todayGOAL.carbs * 4) todayGOAL.sugar = maxSugarRecommendaction / 4
            else todayGOAL.sugar = todayGOAL.carbs * 4
            todayGOAL.sugar = todayGOAL.sugar.toFixed()
            todayGOAL.fiber = parseInt( (todayGOAL.proteins * 4 + todayGOAL.carbs * 4 + todayGOAL.fats * 9) / 1000 * this.$store.state.userToken.fiber )
            this.todayGOAL = todayGOAL
        },
    },
    watch:{
        '$props.items': function(){
            this.loadCircularValues()
        },
    }
}
</script>

<style scoped>

    table{
        width: 100%;
        text-align: left;
        font-size: 0.875rem;
    }

    table td{
        text-align: center;
    }

    tr td:first-of-type{
        font-weight: bold;
    }

    .v-tab{
        border-bottom: 1px solid #E4E4E4;
    }

    .v-window__container{
        min-height: 110px;
        margin-bottom: 24px;
    }

    .circularHolder{
        width: 100%;
        display: grid;
        grid-template-columns: calc(50% - 12px) 12px auto;
    }

    .circularBox{
        display: grid;
    }

    .v-progress-circular{
        margin: auto;
    }

    .v-progress-circular span{
        color: #333;
    }

    .extraOPTIONS{
        margin: 12px 0;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto auto auto 1fr;
        column-gap: 12px;
    }

    .extraOPTIONS a{
        text-decoration: none;
    }

    .extraOPTIONSbox{
        display: grid;
        grid-template-columns: auto 1fr;
    }

    .iconWITHOUTlink{
        display: grid;
        grid-template-columns: auto 1fr;
    }

    .extraOPTIONS i{
        margin: auto;
        display: grid;
        height: 40px;
        width: 25px;
        font-size: 18px;
    }

    .extraOPTIONS i:before{
        margin: auto;
    }

    .extraOPTIONStext{
        color: #a4a4a4;
        margin: auto 0;
        font-size: 0.875rem;
    }

    .diagramInformation{
        width: 100%;
        display: grid;
    }

    .diagramInformationElement{
        width: 100%;
        font-size: 0.875rem;
        display: grid;
        margin: auto;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .diagramInformationElement1{
        text-align: center;
    }

    .diagramInformationElement1:nth-child(1){
        text-align: left;
        font-weight: bold;
    }

    .diagramInformationElement1:nth-child(2){
        font-weight: bold;
    }

    .diagramInformationElement1:nth-child(3){
        font-weight: normal !important;
    }

    .theme--light.v-tabs .v-tab--active:before, .theme--light.v-tabs .v-tab--active:hover:before, .theme--light.v-tabs .v-tab:focus:before{
        background: transparent !important;
    }

</style>