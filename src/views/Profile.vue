<template>
    <div class="profile">
        <div class="contenerLOGGED" v-show="showProfile">
            <profileTOPbannerWITHuser
                v-if="showTOPbanner"
                :tabs="'1'"
            />
            <div class="profileTitleOverBars" id="profileWidth">{{ $t("profile.progress_in_last_days") }}</div>
            <v-lazy
                v-model="isActive"
                :options="{
                threshold: .5
                }"
                min-height="51"
                transition="fade-transition"
            >
                <div class="profileBars">
                    <div class="profileBarsTitle">{{ $t("universal.weight") }}</div>
                    <v-card-text>
                        <v-sheet>
                            <v-sparkline
                                :value="dataWeight"
                                height="140"
                                padding="24"
                                stroke-linecap="round"
                                smooth
                            >
                                <template v-slot:label="item">
                                {{ item.value }}kg
                                </template>
                            </v-sparkline>
                        </v-sheet>
                    </v-card-text>
                </div>
            </v-lazy>
            <v-lazy
                v-model="isActive2"
                :options="{
                threshold: .5
                }"
                min-height="51"
                transition="fade-transition"
            >
                <div class="profileBars">
                    <div class="profileBarsTitle">{{ $t("universal.calories") }}</div>
                    <v-card-text>
                        <v-sheet>
                            <v-sparkline
                                :value="dataCalories"
                                height="140"
                                padding="24"
                                stroke-linecap="round"
                                smooth
                            >
                                <template v-slot:label="item">
                                {{ item.value }}k
                                </template>
                            </v-sparkline>
                        </v-sheet>
                    </v-card-text>
                </div>
            </v-lazy>
            <v-lazy
                v-model="isActive3"
                :options="{
                threshold: .5
                }"
                min-height="51"
                transition="fade-transition"
            >
                <div class="profileBars">
                    <div class="profileBarsTitle">{{ $t("universal.workout") }}</div>
                    <v-card-text>
                        <v-sheet>
                            <v-sparkline
                                :value="dataWorkout"
                                height="140"
                                padding="24"
                                stroke-linecap="round"
                                smooth
                            >
                                <template v-slot:label="item">
                                {{ item.value }}
                                </template>
                            </v-sparkline>
                        </v-sheet>
                    </v-card-text>
                </div>
            </v-lazy>
        </div>
    </div>
</template>
<script>
import profileTOPbannerWITHuser from '@/components/profile/profileTOPbannerWITHuser'
export default {
    name: 'profile',
    data: () => ({
        showProfile: false,
        showTOPbanner: false,
        dataWeight: [],
        dataCalories: [],
        dataWorkout: [],
        profileWidth: 0,
        isActive: false,
        isActive2: false,
        isActive3: false,
        todayDateShort: '',
        twoWeeksBeforeDateShort: ''
    }),
    components:{
        profileTOPbannerWITHuser
    },
    methods: {
        async loadProfile(){
            this.showProfile = false
            this.showTOPbanner = false
            this.dataWeight = []
            this.dataCalories = []
            this.dataWorkout = []
            this.profileWidth = 0
            this.isActive = false
            this.isActive2 = false
            this.isActive3 = false
            this.todayDateShort = ''
            this.twoWeeksBeforeDateShort = ''
            const todayDate = await this.$addDAYStoISO(await this.$getCorrectDate(), -1);
            this.twoWeeksBeforeDateShort = await this.$addDAYStoISO(todayDate, -7)
            this.todayDateShort = todayDate.substr(8, 2)+"."+todayDate.substr(5, 2)+"."+todayDate.substr(0, 4)
            this.twoWeeksBeforeDateShort = this.twoWeeksBeforeDateShort.substr(8, 2)+"."+this.twoWeeksBeforeDateShort.substr(5, 2)+"."+this.twoWeeksBeforeDateShort.substr(0, 4)
            this.profileWidth = document.getElementById('profileWidth').offsetWidth
            
            function sortByWhenAdded(a, b) {
                if((new Date(a.whenAdded)).getTime() < (new Date(b.whenAdded)).getTime()) return 1;
                if((new Date(b.whenAdded)).getTime() < (new Date(a.whenAdded)).getTime()) return -1;
                return 0;
            }
            let counter = 0
            let daily_measurement = await this.$properlyValueLoader(null, todayDate, 7, false, this.$route.params.login, this.$route.params.date)
            this.showTOPbanner = true // Without waiting for data, there is weird transition between fail and push to 403 / 404

            // Deleting dates over today
            if(daily_measurement && daily_measurement.length > 0){
                daily_measurement = daily_measurement.sort(sortByWhenAdded)
                for(let i=daily_measurement.length - 1; i>=0; i--){
                    if(daily_measurement[i].whenAdded > todayDate){
                        daily_measurement.splice(i, 1)
                    }
                }

                let today = todayDate
                for(let i=0; i<7; i++){
                    if(daily_measurement[i] && daily_measurement[i].whenAdded != today){
                        daily_measurement.splice(i, 0, {
                            "whenAdded": today,
                            "weight": 0,
                            "nutrition_diary": [],
                            "workout_result": []
                        })
                    }
                    today = await this.$addDAYStoISO(today, -1)
                }
                // Load all owned values
                for(let i=0; i<daily_measurement.length;i ++){
                    daily_measurement[i].weight ? this.dataWeight.push(daily_measurement[i].weight) : this.dataWeight.push(0)
                    let ateCaloriesWhileOneDay = 0
                    if(daily_measurement[i].nutrition_diary && daily_measurement[i].nutrition_diary.length > 0){
                        for(let a=0; a<daily_measurement[i].nutrition_diary.length; a++){
                            if(daily_measurement[i].nutrition_diary[a].p) ateCaloriesWhileOneDay += daily_measurement[i].nutrition_diary[a].p * 4 * daily_measurement[i].nutrition_diary[a].how_many
                            if(daily_measurement[i].nutrition_diary[a].c) ateCaloriesWhileOneDay += daily_measurement[i].nutrition_diary[a].c * 4 * daily_measurement[i].nutrition_diary[a].how_many
                            if(daily_measurement[i].nutrition_diary[a].f) ateCaloriesWhileOneDay += daily_measurement[i].nutrition_diary[a].f * 9 * daily_measurement[i].nutrition_diary[a].how_many
                            if(daily_measurement[i].nutrition_diary[a].calories) ateCaloriesWhileOneDay += daily_measurement[i].nutrition_diary[a].calories
                        }
                    }
                    ateCaloriesWhileOneDay /= 1000
                    ateCaloriesWhileOneDay = parseFloat(ateCaloriesWhileOneDay.toFixed(2))
                    this.dataCalories.push(ateCaloriesWhileOneDay)
                    daily_measurement[i].workout_result ? this.dataWorkout.push(daily_measurement[i].workout_result.length) : this.dataWorkout.push(0)
                    counter++
                    if(counter == 7) break;

                    if(daily_measurement[i + 1]){
                        const nextDate = await this.$addDAYStoISO(daily_measurement[i].whenAdded, -1)
                        if(nextDate != daily_measurement[i + 1].whenAdded){ // Checking if there are all values in row
                            let howManyTimeBetweenDates = (new Date(daily_measurement[i].whenAdded)).getTime() - (new Date(nextDate)).getTime()
                            howManyTimeBetweenDates = howManyTimeBetweenDates / (1000 * 3600 * 24)
                            for(let a=0; a<howManyTimeBetweenDates; a++){
                                this.dataWeight.push(0)
                                this.dataCalories.push(0)
                                this.dataWorkout.push(0)
                                counter++
                                if(counter == 7) break;
                            }
                        }
                    }
                }
            }
            // Loading extra values if needed
            if(counter < 7){
                const howManyToLoadExtra = 7 - counter
                for(let i=0; i<howManyToLoadExtra; i++){
                    this.dataWeight.push(0)
                    this.dataCalories.push(0)
                    this.dataWorkout.push(0)
                }
            }
            this.dataWeight.reverse()
            this.dataCalories.reverse()
            this.dataWorkout.reverse()
            this.showProfile = true
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
        await this.loadProfile()
    },
    watch: {
        '$route': async function() {
            await this.loadProfile()
        },
    }
}
</script>

<style>

    .profileBars{
        width: 100%;
        margin-bottom: 12px;
        position: relative;
    }

    .profileBarsTitle{
        font-weight: bold;
        margin-bottom: 10px;
    }

    .profileTitleOverBars{
        margin: 20px 0;
        text-align: center;
        text-transform: uppercase;
        font-size: 0.875rem;
        color: var(--theme-contrast-color) !important;
    }

    .profileBarsDates{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .profileBarsLeft{
        width: 100%;
        font-size: 0.875rem;
        margin: auto auto auto 0;
        color: #757575;
    }

    .profileBarsRight{
        width: 100%;
        font-size: 0.875rem;
        margin: auto 0 auto auto;
        text-align: right;
        color: #757575;
    }

    .profile .v-card__subtitle, .profile .v-card__text, .profile .v-card__title{
        padding: 0;
    }

    .profile g{
        color: var(--theme-contrast-color) !important;
    }

</style>