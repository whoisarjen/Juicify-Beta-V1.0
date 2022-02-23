<template>
    <div class="countFromZeroCounting">
        <h1>{{$t("coach.countFromZeroCounting.title")}}</h1>
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
        <div>
            {{$t("coach.countFromZeroCounting.level_of_activity_warning")}}
        </div>
        <div style="margin: 12px 0"><i class="fa-fw fas fa-book"/> <i class="fas fa-long-arrow-alt-right"/><i class="fa-fw fas fa-fire"/></div>
        <v-btn
            class="rounded-pill"
            color="primary"
            @click="countNewMacro()"
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
        useProteinsG: false,
        proteinsG: 100,
        proteins: 25,
        carbs: 50,
        fats: 25,
    }),
    methods: {
        countNewMacro(){
            this.$emit("countNewMacro", {
                'activity': this.activity,
                'goal': this.goal,
                'kind_of_diet': this.kind_of_diet,
                'sport_active': this.sport_active,
                'reverse_diet': false,
                'useProteinsG': this.useProteinsG,
                'proteinsG': this.proteinsG,
                'proteins': this.proteins,
                'carbs': this.carbs,
                'fats': this.fats
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
        grid-template-rows: auto auto auto auto auto auto auto 36px;
    }

    .countFromZeroCounting div{
        text-align: center;
    }

    .countFromZeroCounting .v-stepper__wrapper{
        height: 100%;
    }

</style>