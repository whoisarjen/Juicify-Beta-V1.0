<template>
    <div class="workout-plan-edit">
        <div class="contenerLOGGED">
            <div class="titleOfSite">
                <p v-if="this.$store.state.userToken.login == this.$route.params.login">
                    {{$t("workout_plan.edit_plan")}}
                </p>
                <p v-else>
                    {{$t("workout_plan.title")}}
                </p>
            </div>
            <dialogDelete
                v-if="dialogDelete"
                @close="dialogDelete = false"
                @delete="deleteWorkout()"
            />
            <div class="workoutNav">
                <router-link :to="{name:'workout-plan'}">
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
                    class="workoutNavBoxes" style="margin: auto !important"
                >
                    <div @click="dialogDelete = true" class="productsChoiced"><v-btn icon><v-icon>fas fa-trash-alt</v-icon></v-btn></div>
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
                        @click="saveCHANGES"
                    >
                        {{$t("universal.save")}}
                    </v-btn>
                </div>
            </div>

            <v-form ref="form">
                <v-text-field :disabled="isThisGuest" :rules="inputTEXTrequested" counter @change="pushTOcache" v-model="workout_plan.title" :label='$t("workout_plan.name_of_workout_plan")' ></v-text-field>
                <v-text-field :disabled="isThisGuest" :rules="inputTEXToptional" counter @change="pushTOcache" v-model="workout_plan.description" :label='$t("workout_plan.description_of_workout_plan")'></v-text-field>
                <v-text-field type="number" :disabled="isThisGuest" :hint="$t('workout_plan.burned_hint')" :rules="basicNumberSecurity" @change="pushTOcache" v-model="workout_plan.burned" :label='$t("workout_plan.burned")'></v-text-field>
             </v-form>

            <div v-if="workout_plan.exercises"><label for="input-416" class="v-label v-label--active theme--light">{{this.$t("workout_plan.list_of_exercises")}} ({{workout_plan.exercises.length}}):</label></div>

            <draggable
                :list="workout_plan.exercises"
                ghost-class="ghost"
                :options="{delay:50}"
                @start="dragging = true"
                @end="dragging = false"
            >
                <v-chip
                    :disabled="isThisGuest"
                    v-for="(element, index) in workout_plan.exercises" 
                    v-bind:key="element.name"
                    close
                    @click:close="dialogForDeleteExerciseFromPlan(element)"
                >
                    <span><i class="fas fa-arrows-alt-v"></i> {{index+1}}. {{element.name}}</span>
                </v-chip>
            </draggable>

            <dialogDelete
                v-if="dialogDeleteExercise"
                @close="dialogDeleteExercise = false"
                @delete="deleteExercise(indexOfExerciseToDelete._id)"
            />


            <v-dialog
                v-if="!isThisGuest"
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                scrollable
            >
                <template v-slot:activator="{ on, attrs }">
                    <div class="mainButtonContener">
                        <v-btn class="mx-2" fab dark v-bind="attrs" v-on="on" color="primary">
                            <v-icon dark>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </div>
                </template>
                <v-card tile>
                    <div class="dialogBackground">
                        <div class="centred750">
                            <addExercise
                                :key="workout_plan.exercises.length"
                                :alreadyUsedExercises="workout_plan.exercises"
                                @addThoseExercisesToPlan="addThoseExercisesToPlan"
                            />
                            <div class="buttonDIALOG" @click="dialog = false">
                                <v-btn
                                    class="rounded-pill ma-2"
                                    >
                                    {{$t("universal.close")}}
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-dialog>
            <copyFromGuestToSelf
                :objectTOadd="workout_plan"
                v-if="this.$store.state.userToken.login && this.$store.state.userToken.login != this.$route.params.login && workout_plan"
            />
            <guestBanner/>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import guestBanner from '@/components/universal/guestBanner'
import shareButton from '@/components/universal/shareButton'
import addExercise from '@/components/workout/exercise/add-exercise'
import dialogDelete from '@/components/universal/dialog/dialogDelete'
import copyFromGuestToSelf from '@/components/universal/copyFromGuestToSelf'
export default {
    name: 'workout-plan-edit',
    data: () => ({
        loading: false,
        dialogDelete: false,
        dialog: false,
        workout_plan: {
            "title": "",
            "description": "",
            "exercises": [],
            "burned": 0
        },
        newExerciseTitle: '',
        isThisGuest: true,
        deleteWorkoutLoading: false,
        indexOfExerciseToDelete: {},
        dialogDeleteExercise: false,
        showShareButton: false
    }),
    components: { 
        guestBanner,
        draggable,
        shareButton,
        addExercise,
        dialogDelete,
        copyFromGuestToSelf
    },
    methods: {
        async saveCHANGES(){ // Saving workout_plan
            this.loading = true
            if(this.$refs.form.validate()){
                if(this.workout_plan.exercises.length > 0){
                    let toSend = JSON.parse(JSON.stringify(this.workout_plan));
                    if(toSend.notSAVED) delete toSend.notSAVED
                    if(toSend.burned == 0) delete toSend.burned
                    if(toSend.description == '') delete toSend.description
                    if(await this.$is_id(toSend._id)) await this.$overwriteThoseIDSinDB("workout_plan", [toSend])
                    else await this.$insertThoseIDStoDB("workout_plan", [toSend])
                    this.$router.push('/' + this.$store.state.userToken.login + '/workout-plan')
                }else this.$notification("alert", this.$t('error_notify.workout_plan_save'))
            }
            this.loading = false
        },
        async deleteWorkout(){ // Deleting whole workout_plan
            this.deleteWorkoutLoading = true
            if(await this.$is_id(this.$route.params.id)) await this.$deleteThoseIDSfromDB('workout_plan', [await this.$getIndexedDBbyID("workout_plan", this.$route.params.id)])
            else await this.$deleteIndexedDB("workout_plan", this.$route.params.id)
            this.deleteWorkoutLoading = false
            this.dialogDelete = false
            this.$router.push('/' + this.$store.state.userToken.login + '/workout-plan')
        },
        async deleteExercise(_id){ // Deleting exercise from workout_plan
            for(let i=0; i<this.workout_plan.exercises.length; i++){
                if(this.workout_plan.exercises[i]._id == _id){
                    this.workout_plan.exercises.splice(i, 1)
                    break
                }
            }
            this.dialogDeleteExercise = false
            await this.pushTOcache()
        },
        async addThoseExercisesToPlan(arrayWithNewExercisesToAdd){ // Adding new exercises to workout_plan
            this.workout_plan.exercises = this.workout_plan.exercises.concat(arrayWithNewExercisesToAdd)
            this.dialog = false
            await this.pushTOcache()
        },
        async pushTOcache(){ // Saving new version of workout_plan to indexedDB
            this.workout_plan.notSAVED = await this.$currentTime()
            if(await this.getIndexedDBbyID("workout_plan", this.$route.params.id)) await this.$deleteIndexedDB("workout_plan", this.$route.params.id)
            await this.$addIndexedDB("workout_plan", await this.array(this.workout_plan))
        },
        async loadWorkoutToEdit(){ // Loading workout
            this.showShareButton = await this.$is_id(this.$route.params.id)
            if(this.$store.state.userToken.login != this.$route.params.login) this.isThisGuest = true // Checking if this is owner
            else this.isThisGuest = false
            let workout = await this.$properlyValueLoaderByID("workout_plan", this.$route.params.id, this.$route.params.login)
            if(!workout.description) workout.description = ''
            if(!workout.burned) workout.burned = 0
            this.workout_plan = workout
            if(!workout._id) this.$router.push('/404') // If not exists, redirect out
        },
        async dialogForDeleteExerciseFromPlan(object){ // Handling dialog deleting exercise from plan
            this.indexOfExerciseToDelete = object
            this.dialogDeleteExercise = true
        }
    },
    beforeRouteEnter (to, from, next) { 
        next(vm => {
            vm.loadWorkoutToEdit();
            next();
        }) 
    },
    watch: {
        '$route': async function() {
            await this.loadWorkoutToEdit()
        },
    },
    mixins: [indexedDB]
}
</script>

<style>

    .workoutNavBoxes{
        display: grid !important;
    }

    .workout-plan-edit .workoutNav{
        width: 100%;
        padding: 20px 0;
        display: grid;
        grid-template-columns: 44px 1fr 44px 44px auto;
        font-size: 1.1rem;
    }

    .workout-plan-edit .workoutNav a{
        color: rgba(0,0,0,.87);
        text-decoration: none;
    }

    .workout-plan-edit .workoutNav .workoutNavBoxes i{
        margin: auto 0;
    }

    .workout-plan-edit .workoutNav .router-link-active{
        display: grid;
    }

    .workout-plan-edit .workoutNav span{
        margin: auto 0;
    }

    .workout-plan-edit .workoutNav .workoutNavBoxes div{
        text-transform: uppercase;
        font-weight: bold;
        text-align: right;
        width: 100%;
        margin: auto;
    }

    .workout-plan-edit .submitButton{
        padding: 10px 20px !important;
    }

    .workout-plan-edit .mainButtonContener{
        display: grid;
        width: 100%;
        padding: 20px 0 32px;
    }

    .workout-plan-edit .mainButtonContener .v-btn{
        margin: auto !important;
    }

    .workout-plan-edit .productsChoiced{
        display: grid;
        grid-template-columns: auto;
    }

    .workout-plan-edit .productsChoiced p{
        margin: auto 0;
    }

    .workout-plan-edit .productsChoiced input{
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        border-radius: 4px;
        padding: 8px 0;
        text-transform: uppercase;
        font-size: 0.75rem;
        background: #e99123;
        color: #fff;
    }

    .workout-plan-edit .BoxProductAdding{
        width: 100%;
        padding: 10px 20px;
        border-radius: 4px;
        min-height: 1px;
        border: 1px solid #e4e4e4;
        display: grid;
        grid-template-columns: auto 44px;
        margin-top: 10px;
        position: relative;
    }

    .workout-plan-edit .BoxProductAddingGrid{
        margin: auto;
        width: 100%;
    }

    .workout-plan-edit .BoxProductAdding span{
        margin: auto;
    }

    .workout-plan-edit .BoxProductAddingStar{
        position: absolute;
        left: -13px;
        top: 50%;
        transform: translateY(-50%);
        background: #fff;
    }

    .workout-plan-edit .BoxProductAddingStar i{
        color: #e4e4e4;
    }

    .workout-plan-edit .BoxProductAddingStarINSIDE{
        border: 1px solid #e4e4e4;
        border-radius: 50%;
        width: 26px;
        height: 26px;
        display: grid;
    }

    .workout-plan-edit .BoxProductAddingStarINSIDE i{
        margin: auto;
        font-size: 0.8rem;
    }

    .workout-plan-edit .v-input--selection-controls__input{
        margin: auto !important;
    }

    .workout-plan-edit .VisibleButtonHERE{
        display: grid;
        background: #333;
        opacity: 1;
        z-index: 8;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
    }

    .workout-plan-edit .VisibleButtonHERE span{
        margin: auto;
        font-size: 1.6rem;
        color: #fff;
        text-transform: uppercase;
    }

    .workout-plan-edit .v-select.v-input--dense .v-chip{
        margin-top: 10px;
    }

    .workout-plan-edit .v-select.v-input--dense span span{
        margin: auto;
    }

    .workout-plan-edit .v-select.v-input--dense span:last-child{
        margin-bottom: 10px;
    }

    .workout-plan-edit .boxForExercise{
        width: 100%;
        border: 1px solid #e4e4e4;
        margin-top: 10px;
        display: grid;
        padding: 0 20px;
        border-radius: 4px;
        text-align: center;
        grid-template-columns: auto 44px;
    }

    .workout-plan-edit .boxForExerciseTitle{
        width: 100%;
        margin: auto;
    }

    .workout-plan-edit .checkbox{
        display: grid;
    }

    .workout-plan-edit .checkbox .v-input__slot{
        margin-bottom: none;
        margin: 8px 0;
    }

    .workout-plan-edit .checkbox .v-input--selection-controls__input{
        margin: auto !important;
    }

    .workout-plan-edit .v-chip.v-size--default{
        width: 100% !important;
        margin: 10px 10px 0 0;
        border-radius: 4px;
        padding-right: 0px;
        height: 40px;
    }

    .workout-plan-edit .ghost{
        opacity: 0.5;
        background: #c8ebfb;
    }

    .workout-plan-edit .v-chip__content{
        width: 100%;
        display: grid;
        grid-template-columns: auto 40px;
    }

    .workout-plan-edit .v-chip__content span{
        text-overflow: ellipsis;
        overflow: hidden; 
        white-space: nowrap;
    }

    .workout-plan-edit .v-chip .v-chip__close.v-icon{
        margin: auto;
        margin-right: auto !important;
        font-size: 20px !important;
        padding: 10px;
        max-height: 40px;
        max-width: 40px;
    }

    .centred750{
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        font-family: 'Quicksand', sans-serif !important;
    }

    .buttonDIALOG{
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background: #fff;
    }

    .buttonDIALOG button{
        width: calc( 100% - 16px );
    }

    .centred750 .titleOfSite{
        grid-template-columns: 100%;
    }
    
    .centred750 .titleOfSite p{
        width: 100%;
    }

    .v-dialog,
    .v-dialog--scrollable{
        background: #fff !important;
    }

    .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined){
        background-color: #333;
        color: #fff;
    }

</style>