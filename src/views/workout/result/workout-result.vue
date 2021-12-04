<template>
    <div class="workout-results">
        <div v-if="this.$store.state.userToken.login == this.$route.params.login" class="titleOfSite">
            <p>{{$t("workout_result.title")}}</p>
        </div>
        <div v-else>
            <profileTOPbannerWITHuser
                :tabs="'3'"
            />
        </div>

        <v-dialog
            v-if="this.$route.params.login == this.$store.state.userToken.login"
            v-model="dialog"
            persistent
            max-width="600px"
        >
            <template v-slot:activator="{ on, attrs }">
                <div class="mainButtonContener">
                    <v-btn class="mx-2" fab dark v-bind="attrs" v-on="on" color="primary">
                        <v-icon @click="id = 0" dark>
                        mdi-plus
                        </v-icon>
                    </v-btn>
                </div>
            </template>
            <v-form ref="form">
                <v-card>
                    <v-card-title>
                        <span class="headline">Rozpocznij trening</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col
                                    cols="12"
                                >
                                    <v-dialog
                                        ref="dialog"
                                        v-model="datePICKER"
                                        :return-value.sync="date"
                                        persistent
                                        width="290px"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="date"
                                                :label="$t('workout_plan.date_of_workout')"
                                                readonly
                                                v-bind="attrs"
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            :min="$dateMINlimit"
                                            :max="$dateMAXlimit"
                                            v-model="date"
                                            scrollable
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="datePICKER = false"
                                            >
                                            Cancel
                                            </v-btn>
                                            <v-btn
                                                text
                                                color="primary"
                                                @click="$refs.dialog.save(date)"
                                            >
                                            OK
                                            </v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                    <v-select
                                        v-model="buildNewWorkout"
                                        :items="activeTranings"
                                        item-text="title"
                                        item-value="_id"
                                        :label="$t('workout_plan.choose_workout')"
                                    ></v-select>
                                <div class="noWorkoutNotify" v-if="noWorkoutNotify">{{this.$t("workout_result.no_workout_plan")}} <i class="fas fa-dumbbell"/> <i class="fas fa-long-arrow-alt-right"/> <i class="far fa-clipboard"/></div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            @click="dialog = false"
                            >
                            Zamknij
                        </v-btn>
                        <v-btn
                            text
                            @click="createNewThemeForWorkout()"
                            >
                            Dodaj
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
        <div class="noWorkoutNotify" v-if="noWorkoutNotify">{{this.$t("workout_result.no_workout_plan")}} <i class="fas fa-dumbbell"/> <i class="fas fa-long-arrow-alt-right"/> <i class="far fa-clipboard"/></div>
        <workoutBOX
            v-for="data in items" :key="data.id"
            v-bind:item="data"
            v-bind:whereTOroute="data.whereTOroute"
        />
        <div class="loadMoreValueButtonCenter">
            <v-btn
                v-if="showLoadMoreButton && (this.$store.state.guest.public_profile > 0 || this.$store.state.userToken.login == this.$route.params.login) && this.$store.state.online"
                @click="loadMoreValue()"
                class="rounded-pill ma-2 loadMoreDailyMeasurement"
                color="primary"
                :loading="loadMoreButtonLoading"
                >
                {{$t("universal.load_next")}} {{ this.$howManyValuesToLoad }} {{$t("universal.days")}}
            </v-btn>
        </div>
        <div class="bottomFIX"/>
    </div>
</template>

<script>
import workoutBOX from '@/components/workout/workoutBOX'
import profileTOPbannerWITHuser from '@/components/profile/profileTOPbannerWITHuser'
export default {
    name: 'workout-results',
    data: () => ({
        buildNewWorkout: [],
        items: [],
        activeTranings: [],
        dialog: false,
        date: '',
        datePICKER: false,
        lastLoadedDate: '',
        showLoadMoreButton: false,
        loadMoreButtonLoading: false,
        noWorkoutNotify: false
    }),
    components: {
        workoutBOX,
        profileTOPbannerWITHuser
    },
    methods: {
        async createNewThemeForWorkout(){
            if(parseInt(this.buildNewWorkout) > 0){
                let workout_plan = await this.$getIndexedDBbyID("workout_plan", this.buildNewWorkout)
                let generateID = "XD"+await this.$currentTime()
                let array = [{
                    "_id": generateID,
                    "title": workout_plan.title,
                    "description": "",
                    "whenAdded": this.date,
                    "workout_plan_ID": this.buildNewWorkout,
                    "user_ID": this.$store.state.userToken._id,
                    "results": [],
                }]
                workout_plan.burned ? array[0].burned = workout_plan.burned : array[0].burned = 0
                for(let i=0; i<workout_plan.exercises.length;i++){
                    array[0].results.push({
                        "_id": workout_plan.exercises[i]._id,
                        "name": workout_plan.exercises[i].name,
                        "values": []
                    })
                }
                await this.$addIndexedDB("workout_result", array)
                this.$router.push("/" + this.$store.state.userToken.login + "/workout-result/" + this.date + "/" + generateID)
            }
        },
        async loadWorkoutResults(){
            this.date = await this.$shortDATE(await this.$getCorrectDate())
            function compareREVERSE(a, b) {
                if(a.whenAdded > b.whenAdded) return 1;
                if(b.whenAdded > a.whenAdded) return -1;
                return 0;
            }

            let workout_result_ARRAY = []
            let daily_measurement = await this.$properlyValueLoader(null, '9999-01-01', 14, false, this.$route.params.login, this.$route.params.date)
            if(daily_measurement.length>0){
                daily_measurement = daily_measurement.sort(compareREVERSE)
                for(let i=0;i<daily_measurement.length;i++){
                    if(daily_measurement[i].workout_result && daily_measurement[i].workout_result.length>0){
                        for(let a=0;a<daily_measurement[i].workout_result.length;a++){
                            daily_measurement[i].workout_result[a].whenAdded = daily_measurement[i].whenAdded
                            daily_measurement[i].workout_result[a].whereTOroute = '/' + this.$route.params.login + '/workout-result/' + await this.$shortDATE(daily_measurement[i].whenAdded)
                            workout_result_ARRAY.unshift(daily_measurement[i].workout_result[a])
                        }
                    }
                    this.lastLoadedDate = daily_measurement[0].whenAdded
                }
            }
            if(this.$route.params.login == this.$store.state.userToken.login){
                let workout_result = (await this.$getAllIndexedDB("workout_result")).sort(compareREVERSE)
                if(workout_result.length>0){
                    for(let i=0;i<workout_result.length;i++){
                        let checker = 0
                        for(let a=0;a<workout_result_ARRAY.length;a++){
                            if(workout_result_ARRAY[a]._id == workout_result[i]._id){
                                workout_result_ARRAY.splice(a, 1)
                                checker++
                                workout_result[i].color = "#b1272f"
                                workout_result[i].notSaved = this.$t("universal.notsaved")
                                workout_result[i].whereTOroute = '/' + this.$route.params.login + '/workout-result/' + await this.$shortDATE(workout_result[i].whenAdded)
                                workout_result_ARRAY.unshift(workout_result[i])
                                break;
                            }
                        }
                        if(checker == 0){
                            workout_result[i].color = "#b1272f"
                            workout_result[i].notSaved = this.$t("universal.notsaved")
                            workout_result[i].whereTOroute = '/' + this.$route.params.login + '/workout-result/' + await this.$shortDATE(workout_result[i].whenAdded)
                            workout_result_ARRAY.unshift(workout_result[i])
                        }
                    }
                }
            }
            this.items = workout_result_ARRAY
            this.activeTranings = (await this.$getAllIndexedDB("workout_plan")).sort(function(a, b){
                if(a.title < b.title) { return -1; }
                if(a.title > b.title) { return 1; }
                return 0;
            })
            if(this.activeTranings.length == 0) this.noWorkoutNotify = true
            this.showLoadMoreButton = true
        },
        async loadMoreValue(){
            this.loadMoreButtonLoading = true
            let daily_measurement = await this.$loadMOREvalueFROMmongoDB(this.lastLoadedDate, this.$howManyValuesToLoad)
            if(daily_measurement.length < this.$howManyValuesToLoad) this.showLoadMoreButton = false
            for(let i=0;i<daily_measurement.length;i++){
                if(daily_measurement[i].workout_result && daily_measurement[i].workout_result.length>0){
                    for(let a=0;a<daily_measurement[i].workout_result.length;a++){
                        daily_measurement[i].workout_result[a].whenAdded = daily_measurement[i].whenAdded
                        daily_measurement[i].workout_result[a].whereTOroute = '/' + this.$route.params.login + '/workout-result/' + await this.$shortDATE(daily_measurement[i].whenAdded)
                        this.items.push(daily_measurement[i].workout_result[a])
                    }
                }
            }
            this.loadMoreButtonLoading = false
        },
    },
    watch: {
        '$store.state.daily_measurementFLAG': async function() {
            await this.loadWorkoutResults();
        }
    },
    beforeRouteEnter (to, from, next) { 
        next(vm => {
            vm.loadWorkoutResults();
            next();
        }) 
    },
    mixins: [indexedDB]
    }
</script>

<style>

    .workout-results{
        padding: 12px 12px 0;
    }

    .workout-results a{
        text-decoration: none;
    }

    .workout-results .mainButtonContener{
        display: grid;
        width: 100%;
        padding: 20px 0;
    }

    .workout-results .mainButtonContener .v-btn{
        margin: auto !important;
    }

    .workout-results .mainButtonContener a{
        display: grid;
    }

    .workout-results .headline{
        font-size: 1.1rem!important;
        text-transform: uppercase;
    }

    .workout-results .mt-3{
        margin-top: 0 !important;
    }

    .noWorkoutNotify{
        width: 100%;
        text-align: center;
        margin-bottom: 15px;
    }

</style>