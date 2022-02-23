<template>
    <div class="countFromZeroCounting">
        <h1>{{$t("coach.analyzeAnyChanges.title")}}</h1>
        <div>
            <v-select
                item-text="name"
                item-value="value"
                v-model="goal"
                :items="goalITEMS"
                menu-props="auto, auto"
                :label='$t("coach.countFromZeroCounting.body_goal")'
            ></v-select>
        </div>
        <div>
            <v-select
            item-text="name"
            item-value="value"
            v-model="activity"
            :items="[{
                'value': 1.2, 
                'name': this.$t('coach.activity_1')
            },
            {
                'value': 1.375, 
                'name': this.$t('coach.activity_1_2')
            },
            {
                'value': 1.55,
                'name': this.$t('coach.activity_1_4')
            },
            {
                'value': 1.715,
                'name': this.$t('coach.activity_1_6')
            },
            {
                'value': 1.9,
                'name': this.$t('coach.activity_1_8')
            }]"
            menu-props="auto, auto"
            :label='$t("coach.countFromZeroCounting.level_of_activity")'
            ></v-select>
        </div>
        <div>
            <v-select
            item-text="name"
            item-value="value"
            v-model="kind_of_diet"
            :items="[{
                'value': 0,
                'name': this.$t('coach.countFromZeroCounting.balanced_diet')
            },
            {
                'value': 1,
                'name': this.$t('coach.countFromZeroCounting.ketogenic_diet')
            },
            {
                'value': 2,
                'name': this.$t('coach.countFromZeroCounting.custom_macro')
            }]"
            menu-props="auto, auto"
            :label='$t("coach.countFromZeroCounting.kind_of_diet")'
            ></v-select>
        </div>
        <macroSliders v-show="kind_of_diet == 2" @macroSliders="macroSliders"/>
        <div v-show="kind_of_diet != 2">
            <v-select
            item-text="name"
            item-value="value"
            v-model="sport_active"
            :items="[{
                'value': false,
                'name': this.$t('universal.no')
            },
            {
                'value': true,
                'name': this.$t('universal.yes')
            }]"
            menu-props="auto, auto"
            :label='$t("coach.countFromZeroCounting.do_you_workout_on_gym")'
            ></v-select>
        </div>
        <div style="margin: 12px 0;">
            {{$t("coach.analyzeAnyChanges.information")}}
        </div>
        <v-btn
            class="rounded-pill"
            color="primary"
            @click="analyzeResults()"
        >
        {{$t("universal.analyze")}}
        </v-btn>
    </div>
</template>

<script>
import macroSliders from '@/components/coach/macroSliders'
export default {
    data: () => ({
        activity: 1.2,
        goal: 0,
        goalITEMS: [],
        kind_of_diet: 0,
        sport_active: true,
        reverse_diet: false,
        useProteinsG: false,
        proteinsG: 100,
        proteins: 25,
        carbs: 50,
        fats: 25
    }),
    methods: {
        analyzeResults(){
            this.$emit("analyzeResults", {
                'activity': this.activity,
                'goal': this.goal,
                'kind_of_diet': this.kind_of_diet,
                'sport_active': this.sport_active,
                'reverse_diet': this.reverse_diet,
                'useProteinsG': this.useProteinsG,
                'proteinsG': this.proteinsG,
                'proteins': this.proteins,
                'carbs': this.carbs,
                'fats': this.fats,
                'checkIfEverythingIsFine': true,
                'holdMacronutrients': false,
                'dietBreak': false
            })
        },
        macroSliders(object){
            this.useProteinsG = object.useProteinsG
            this.proteinsG = object.proteinsG
            this.proteins = object.proteins
            this.carbs = object.carbs
            this.fats = object.fats
        }
    },
    mounted(){
        this.activity = this.$store.state.userToken.activity
        this.goal = this.$store.state.userToken.goal
        this.kind_of_diet = this.$store.state.userToken.kind_of_diet
        this.sport_active = this.$store.state.userToken.sport_active
        this.reverse_diet = this.$store.state.userToken.reverse_diet
        this.useProteinsG = this.$store.state.userToken.useProteinsG
        this.proteinsG = this.$store.state.userToken.proteinsG
        this.proteins = this.$store.state.userToken.proteins
        this.carbs = this.$store.state.userToken.carbs
        this.fats = this.$store.state.userToken.fats
        let counter = -4;
        for(let i=0;i<33;i++){
            let object = {
                "value": counter,
                "name": counter + "kg / " + this.$t("universal.month")
            }
            if(counter == 2 || counter == -2){
                object = {
                    "value": counter,
                    "name": counter + "kg / " + this.$t("universal.month") + " " + this.$t("coach.max_recommended")
                }
            }
            this.goalITEMS.push(object)
            counter += 0.25
        }
    },
    components: {macroSliders}
}
</script>

<style scoped>

    .countFromZeroCounting{
        min-height: calc( 100vh - 92px );
        padding: 12px 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto auto auto auto auto 36px;
    }

    .countFromZeroCounting div:nth-child(6),
    .countFromZeroCounting div:nth-child(7){
        text-align: center;
    }

    .countFromZeroCounting .v-stepper__wrapper{
        height: 100%;
    }

</style>