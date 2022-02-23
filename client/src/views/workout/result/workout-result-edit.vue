<template>
    <div class="workout-results-change">
        <div class="contenerLOGGED">
        <div class="titleOfSite">
            <p>{{$t("workout_result.title")}}</p>
        </div>
        <dialogDelete
            v-if="dialogDelete"
            @close="dialogDelete = false"
            @delete="deleteWorkout()"
        />
        <div class="workoutNav">
        <router-link :to="{name:'workout-result'}">
            <div class="workoutNavBoxes">
                <v-btn icon><v-icon>fas fa-arrow-left</v-icon></v-btn>
            </div>
        </router-link>
        <div/>
        <div v-if="this.$store.state.userToken.login != this.$route.params.login"/>
        <shareButton v-if="showShareButton"/>
        <div v-else/>
        <div
            v-if="this.$store.state.userToken.login == this.$route.params.login"
            class="workoutNavBoxes"
            style="margin: auto !important"
        >
            <div @click="dialogDelete = true" class="productsChoiced">
                <v-btn
                    icon
                >
                    <v-icon>fas fa-trash-alt</v-icon>
                </v-btn>
            </div>
        </div>
        <div
            v-if="this.$store.state.userToken.login == this.$route.params.login"
            class="workoutNavBoxes"
        >
            <v-btn
                rounded
                color="primary"
                dark
                :loading="loading"
                @click="saveWorkout"
            >
                {{$t("universal.save")}}
            </v-btn>
        </div>
        </div>
        <v-form ref="form">
            <v-text-field
                v-model="whenAdded"
                :label='$t("universal.date")'
                disabled
            ></v-text-field>
            <v-textarea
                v-if="workout_plan_description && this.$store.state.userToken.login == this.$route.params.login"
                :disabled="true"
                :rows="1"
                :rules="inputTEXToptional"
                :label='$t("workout_plan.description_of_workout_plan")'
                v-model="workout_plan_description"
                auto-grow
            ></v-textarea>
            <v-text-field
                v-if="burned !== false"
                :hint="$t('workout_plan.burned_hint')"
                :rules="basicNumberSecurity"
                @change="saveCHANGES()"
                v-model="burned"
                type="number"
                :label='$t("workout_plan.burned")'
            ></v-text-field>
            <v-textarea
                :disabled="this.$store.state.userToken.login != this.$route.params.login"
                :rules="inputTEXToptional"
                :label='$t("universal.notes")'
                v-model="description"
                @blur="saveCHANGES()"
                auto-grow
            ></v-textarea>
            <workoutResultsBOX
                v-for="(data, i) in results"
                :key="data._id"
                v-bind:item="data"
                v-bind:index="i"
                :prevWorkoutResult="prevWorkoutResult"
                @saveCHANGES="saveCHANGES()"
            />
        </v-form>
        <guestBanner/>
        <timer v-if="this.$store.state.userToken.login == this.$route.params.login && this.$store.state.userToken.workout_watch" />
        </div>
    </div>
</template>

<script>
import timer from '@/components/workout/timer'
import shareButton from '@/components/universal/shareButton'
import guestBanner from '@/components/universal/guestBanner'
import dialogDelete from '@/components/universal/dialog/dialogDelete'
import workoutResultsBOX from '@/components/workout/workout-resultsBOX'
export default {
    name: 'workout-result-change',
    data: () => ({
        loading: false,
        modal: false,
        title: "",
        description: "",
        burned: false,
        whenAdded: "",
        results: [],
        workout_plan_ID: 0,
        workout_plan_description: false,
        workout_ID: 0,
        dialogDelete: false,
        deleteWorkoutLoading: false,
        prevWorkoutResult: false,
        showShareButton: false
    }),
    components: {
        timer,
        shareButton,
        guestBanner,
        dialogDelete,
        workoutResultsBOX
    },
    methods: {
        async saveCHANGES(){
            let workout = [{
                "_id": this.workout_ID,
                "title": this.title,
                "whenAdded": this.whenAdded,
                "description": this.description,
                "workout_plan_ID": this.workout_plan_ID,
                "results": this.results
            }]
            if(this.burned) workout[0].burned = this.burned
            if(!this.burned && await !this.$is_id(this.workout_ID)) workout[0].burned = 0
            await this.$deleteIndexedDB("workout_result", this.workout_ID)
            await this.$addIndexedDB("workout_result", workout)
        },
        async saveWorkout(){
            this.loading = true
            if( this.$refs.form.validate() ){
                let workout = [{
                    "_id": this.workout_ID,
                    "title": this.title,
                    "whenAdded": this.whenAdded,
                    "workout_plan_ID": this.workout_plan_ID,
                    "results": this.results
                }]
                if(this.description) workout[0].description = this.description
                if(this.burned > 0) workout[0].burned = this.burned
                let countResultsNumber = 0
                for(let i=0;i<workout[0].results.length;i++){
                    countResultsNumber += parseInt(workout[0].results[i].values.length)
                }
                if(countResultsNumber > 0){
                    await this.$deleteIndexedDB("workout_result", workout[0]._id)
                    workout = await this.$daily_measurement(
                        workout,
                        "workout_result",
                        "change"
                    )
                    this.$router.push('/' + this.$store.state.userToken.login + '/workout-result')
                }else this.$notification("alert", this.$t('error_notify.workout_result_save'))
                this.$store.state.barsWorkoutResultFLAG = await this.$currentTime()
            }
            this.loading = false
        },
        async deleteWorkout(){
            this.deleteWorkoutLoading = true
            await this.$deleteIndexedDB("workout_result", this.$route.params.id)
            await this.$daily_measurement([{
                "_id": this.$route.params.id,
                "whenAdded": this.$route.params.date
            }],
                "workout_result",
                "delete"
            )
            this.deleteWorkoutLoading = false
            this.dialogDelete = false
            this.$router.push("/" + this.$store.state.userToken.login + "/workout-result")
        },
        async tryFindPrevWorkoutResult(workout_plan_ID){
            if(this.$store.state.userToken.login == this.$route.params.login){
                let daily_measurement = (await this.$getAllIndexedDB('daily_measurement')).sort(function(a,b){
                    return new Date(b.whenAdded) - new Date(a.whenAdded);
                });
                let endLoop = false
                if(daily_measurement && daily_measurement.length>0){
                    for(let i=0; i<daily_measurement.length; i++){
                        if(daily_measurement[i].workout_result && daily_measurement[i].workout_result.length>0){
                            for(let a=daily_measurement[i].workout_result.length - 1; a>=0; a--){
                                if(daily_measurement[i].workout_result[a]._id != this.$route.params.id && daily_measurement[i].workout_result[a].workout_plan_ID == workout_plan_ID){
                                    this.prevWorkoutResult = daily_measurement[i].workout_result[a]
                                    endLoop = true;
                                    break;
                                }
                            }
                        }
                        if(endLoop) break;
                    }
                }
            }
        },
        async loadWorkoutTheme(){
            this.workout_plan_description = false;
            this.showShareButton = await this.$is_id(this.$route.params.id)
            let workout_result
            if(this.$store.state.userToken.login == this.$route.params.login && await this.$getIndexedDBbyID("workout_result", this.$route.params.id)){
                workout_result = await this.$getIndexedDBbyID("workout_result", this.$route.params.id)
                await this.tryFindPrevWorkoutResult(workout_result.workout_plan_ID)
                this.title = workout_result.title
                this.whenAdded = await this.$shortDATE(workout_result.whenAdded)
                workout_result.description ? this.description = workout_result.description : this.description = ''
                this.results = workout_result.results
                this.workout_plan_ID = workout_result.workout_plan_ID
                workout_result.burned ? this.burned = workout_result.burned : this.burned = 0
                this.workout_ID = this.$route.params.id
                let workout_plan = await this.$getIndexedDBbyID("workout_plan", workout_result.workout_plan_ID)
                if(workout_plan) this.workout_plan_description = workout_plan.description
                else this.workout_plan_description = false;
            }else{
                workout_result = await this.$properlyValueLoader(this.$route.params.date, false, false, false, this.$route.params.login, this.$route.params.date)
                let daily_measurement = workout_result
                let testIfResultExist = {}
                if(workout_result.workout_result.length){
                    for(let i=0;i<workout_result.workout_result.length;i++){
                        if(workout_result.workout_result[i]._id == this.$route.params.id){
                            testIfResultExist = workout_result.workout_result[i]
                            break
                        }
                    }
                }
                if(testIfResultExist._id){
                    await this.tryFindPrevWorkoutResult(testIfResultExist.workout_plan_ID)
                    this.title = testIfResultExist.title
                    this.whenAdded = await this.$shortDATE(daily_measurement.whenAdded)
                    testIfResultExist.description ? this.description = testIfResultExist.description : this.description = ''
                    this.results = testIfResultExist.results
                    this.workout_plan_ID = testIfResultExist.workout_plan_ID
                    this.workout_ID = this.$route.params.id
                    let workout_plan = await this.$getIndexedDBbyID("workout_plan", testIfResultExist.workout_plan_ID)
                    if(workout_plan) this.workout_plan_description = workout_plan.description;
                    else this.workout_plan_description = false;
                }else this.$router.push("/404")
            }
        }
    },
    beforeRouteEnter (to, from, next) { 
        next( async vm => {
            await vm.loadWorkoutTheme();
            next();
        }) 
    },
    watch: {
        '$store.state.workout_resultsFLAG': function(){
            this.loadWorkoutTheme()
        },
        '$store.state.workout_results_infoFLAG': function(){
            this.loadWorkoutTheme()
        },
    }
}
</script>

<style>

    .workoutNavBoxes{
        display: grid !important;
    }

    .workout-results-change .titleOfSite{
        grid-template-columns: 100%;
    }
    
    .workout-results-change .titleOfSite p{
        width: 100%;
    }

    .workout-results-change .workoutNav{
        width: 100%;
        padding: 20px 0;
        display: grid;
        grid-template-columns: 44px 1fr 44px 44px auto;
        font-size: 1.1rem;
    }

    .workout-results-change .workoutNav a{
        color: rgba(0,0,0,.87);
        text-decoration: none;
        margin: auto 0;
    }

    .workout-results-change .workoutNav .workoutNavBoxes i{
        margin: auto 0;
    }

    .workout-results-change .workoutNav .router-link-active{
        display: grid;
    }

    .workout-results-change .workoutNav span{
        margin: auto 0;
    }

    .workout-results-change .workoutNav .workoutNavBoxes div{
        text-transform: uppercase;
        font-weight: bold;
        text-align: right;
        width: 100%;
        margin: auto;
    }

    .workout-results-change .productsChoiced{
        display: grid;
        grid-template-columns: auto;
    }

    .workout-results-change .productsChoiced p{
        margin: auto 0;
    }

    .workout-results-change .productsChoiced input{
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        border-radius: 4px;
        padding: 8px 0;
        text-transform: uppercase;
        font-size: 0.75rem;
        background: #e99123;
        color: #fff;
    }

</style>