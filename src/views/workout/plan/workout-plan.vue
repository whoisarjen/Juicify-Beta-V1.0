<template>
    <div class="workout-plan">
        <div
            v-if="this.$store.state.userToken.login == this.$route.params.login"
            class="titleOfSite">
            <p>{{$t("workout_plan.title")}}</p>
        </div>
        <div v-else>
            <profileTOPbannerWITHuser
                :tabs="'4'"
            />
        </div>
        <div 
            v-if="this.$store.state.userToken.login == this.$route.params.login"
            class="mainButtonContener"
        >
            <v-btn @click="createNEWworkout" class="mx-2" fab dark color="primary">
                <v-icon @click="id = 0" dark>
                    mdi-plus
                </v-icon>
            </v-btn>
        </div>
        <workoutBOX
            v-for="data in items" :key="data.id"
            v-bind:item="data"
            v-bind:whereTOroute="data.whereTOroute"
        />
    </div>
</template>

<script>
import workoutBOX from '@/components/workout/workoutBOX'
import profileTOPbannerWITHuser from '@/components/profile/profileTOPbannerWITHuser'
export default {
    name: 'workout-plan',
    data: () => ({
        isActive: false,
        items: [],
    }),
    components: {
        workoutBOX,
        profileTOPbannerWITHuser
    },
    methods: {
        async loadWorkoutPlans(){
            this.items = []
            let workout_plan = await this.$properlyValueLoaderByID("workout_plan", false, this.$route.params.login)
            if(workout_plan && workout_plan.length>0){
                workout_plan = workout_plan.reverse()
                for(let i=0;i<workout_plan.length;i++){
                    if(workout_plan[i].notSAVED){
                        workout_plan[i].color = "#b1272f"
                        workout_plan[i].notSaved = this.$t("universal.notsaved")
                    }
                    if(workout_plan[i].deleted){
                        workout_plan.splice(i, 1)
                    }
                    workout_plan[i].whereTOroute = '/' + this.$route.params.login + '/workout-plan'
                }
                this.items = workout_plan
            }
        },
        async createNEWworkout(){
            let _id = "XD" + await this.$currentTime()
            await this.$addIndexedDB("workout_plan", [{
                "_id": _id,
                "title": "",
                "description": "",
                "exercises": [],
                "notSAVED": await this.$currentTime()
            }])
            this.$router.push("/" + this.$route.params.login + "/workout-plan/" + _id)
        }
    },
    beforeRouteEnter (to, from, next) { 
        next(vm => {
            vm.loadWorkoutPlans();
            next();
        }) 
    },
    watch: {
        '$store.state.workout_planFLAG': function(){
            this.loadWorkoutPlans()
        },
    }
}
</script>

<style>

    .workout-plan{
        padding: 12px 12px 0;
    }

    .workout-plan a{
        text-decoration: none;
    }

    .workout-plan .mainButtonContener{
        display: grid;
        width: 100%;
        padding: 20px 0;
    }

    .workout-plan .mainButtonContener .v-btn{
        margin: auto !important;
    }

    .workout-plan .mainButtonContener a{
        display: grid;
    }

    .workout-plan .headline{
        font-size: 1.1rem!important;
        text-transform: uppercase;
    }

    .workout-plan .mt-3{
        margin-top: 0 !important;
    }

    .workout-plan .v-card__title{
        word-break: normal;
    }

</style>