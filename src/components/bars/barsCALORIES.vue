<template>
    <div class="Bars">
        <router-link :to="'/'+this.$store.state.userToken.login+'/nutrition_diary/'+today">
            <div class="barsBOX">
                <div class="barBOXheader">{{ $t("universal.calories") }}</div>
                <div class="GRID">
                    <v-progress-circular
                        :rotate="-90"
                        :size="95"
                        :width="7"
                        :value="value"
                        :color="color"
                        >
                        <span>{{ ate }}</span>
                    </v-progress-circular>
                </div>
                <div class="barsBOXgridDOWN">
                    <div class="barsBOXgridDOWNauto">{{ calories }}kcal</div>
                    <div class="barsBOXgridDOWNicon">
                        <div class="barsBOXgridDOWNiconCIRCLE">
                            <i class="fas fa-book"></i>
                        </div>    
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>
<script>
export default {
    name: 'barsCALORIES',
    data: () => ({
        value: 0,
        ate: 0,
        calories: 0,
        today: ''
    }),
    props:{
        color: String
    },
    methods: {
        async loadBarsCALORIES(){
            this.today = await this.$shortDATE(await this.$getCorrectDate())
            let nutrition_diary = await this.$getIndexedDBbyID("daily_measurement", await this.$getCorrectDate())
            let calories = this.$store.state.userToken.macronutrients
            let todayHERE = await this.$todayDAY()
            for(let i=0; i<calories.length; i++){
                if(calories[i].day == todayHERE){
                    calories = calories[i]
                    break;
                }
            }
            this.calories = calories.proteins * 4 + calories.carbs * 4 + calories.fats * 9
            if(nutrition_diary && nutrition_diary.nutrition_diary){
                nutrition_diary = nutrition_diary.nutrition_diary
                let nutrition_diaryHOLDER = 0;
                for(let i=0;i<nutrition_diary.length;i++){
                    if(nutrition_diary[i].p) nutrition_diaryHOLDER += nutrition_diary[i].p * 4 * nutrition_diary[i].how_many
                    if(nutrition_diary[i].c) nutrition_diaryHOLDER += nutrition_diary[i].c * 4 * nutrition_diary[i].how_many
                    if(nutrition_diary[i].f) nutrition_diaryHOLDER += nutrition_diary[i].f * 9 * nutrition_diary[i].how_many
                    if(nutrition_diary[i].ethanol) nutrition_diaryHOLDER += nutrition_diary[i].ethanol * 7 * nutrition_diary[i].how_many
                    if(nutrition_diary[i].calories) nutrition_diaryHOLDER += nutrition_diary[i].calories
                }

                this.ate = nutrition_diaryHOLDER.toFixed()
                this.value = (this.ate / this.calories) * 100
            }
        }
    },
    async mounted(){
        await this.loadBarsCALORIES()
    },
    watch: {
        '$store.state.barsCarloriesFLAG': async function(){
            await this.loadBarsCALORIES()
        },
        '$store.state.daily_measurementFLAG': async function() {
            await this.loadBarsCALORIES();
        }
    }
}
</script>

<style scoped>

    .barBOXheader{
        font-weight: bold;
    }

    .barsBOX{
        min-height: 200px;
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
    }

    .GRID{
        display: grid;
        width: 100%;
        min-height: 1px;
    }

    .v-progress-circular{
        margin: 10px auto;
    }

    .barsBOXgridDOWN{
        width: 100%;
        padding: 0 10px;
        display: grid;
        grid-template-columns: auto 20px;
        min-height: 40px;
    }

    .barsBOXgridDOWNauto{
        margin: auto 0;
        font-size: 0.875rem;
        grid-column: 1;
        grid-row: 1 / 3;
    }

    .barsBOXgridDOWNicon{
        grid-column: 2;
        grid-row: 1 / 3;
        display: grid;
    }

    .barsBOXgridDOWNiconCIRCLE{
        margin: auto;
        margin-right: 0;
        width: 20px;
        height: 20px;
        display: grid;
    }

    .barsBOXgridDOWNiconCIRCLE i{
        margin: auto;
        margin-right: 0;
        font-size: 0.875rem;
    }

</style>