<template>
    <div class="Bars">
        <router-link :to="'/'+this.$store.state.userToken.login+'/workout-result'">
            <div class="barsBOX">
                <div class="barBOXheader">{{ $t("universal.workout") }}</div>
                <div class="GRID">
                    <v-progress-circular
                        :rotate="-90"
                        :size="95"
                        :width="7"
                        :value="value"
                        :color="color"
                        >
                        <span>{{ workout }}</span>
                    </v-progress-circular>
                </div>
                <div class="barsBOXgridDOWN">
                    <div class="barsBOXgridDOWNauto">{{ today.substr(8, 2)+"."+today.substr(5, 2)+"."+today.substr(0, 4) }}</div>
                    <div class="barsBOXgridDOWNicon">
                        <div class="barsBOXgridDOWNiconCIRCLE">
                            <i class="fas fa-dumbbell"></i>
                        </div>    
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>
<script>
export default {
    name: 'barsWORKOUT',
    props:{
        color: String
    },
    data: () => ({
        value: 0,
        workout: 0,
        today: ''
    }),
    methods: {
        async loadBarsWORKOUT(){
            this.today = await this.$getCorrectDate()
            this.workout = 0;
            let workout_result = await this.$getIndexedDBbyID("daily_measurement", this.today)
            if(workout_result) workout_result = workout_result.workout_result
            if(workout_result && workout_result.length > 0){
                for(let i=0;i<workout_result.length;i++){
                    this.workout++
                    this.value = 100
                }
            }
        }
    },
    async mounted(){
        await this.loadBarsWORKOUT()
    },
    watch: {
        '$store.state.barsWorkoutResultFLAG': async function(){
            await this.loadBarsWORKOUT()
        },
        '$store.state.daily_measurementFLAG': async function() {
            await this.loadBarsWORKOUT();
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