<template>
    <div class="endDietCheck">
        <h1>{{$t("coach.end_diet")}}?</h1>
        <div>{{$t("coach.endDietCheck.description")}}:</div>
        <ol>
            <li>{{$t("coach.endDietCheck.option_1")}}</li>
            <li>{{$t("coach.endDietCheck.option_2")}}</li>
            <li>{{$t("coach.endDietCheck.option_3")}}</li>
        </ol>
        <v-btn
            class="rounded-pill"
            color="#b1272f"
            style="color: #fff"
            @click="standard"
        >
        {{$t("universal.yes_end")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            color="primary"
            @click="changeStep(whereToGo)"
        >
        {{$t("universal.no_keep_going")}}
        </v-btn>
    </div>
</template>

<script>
export default {
    data: () => ({
        whereToGo: 'welcome'
    }),
    methods: {
        changeStep(goToStep){
            this.$emit("changeStep", goToStep)
        },
        standard(){
            this.$emit("analyzeResults", {
                'activity': this.$store.state.userToken.activity,
                'goal': 0,
                'kind_of_diet': this.$store.state.userToken.kind_of_diet,
                'sport_active': this.$store.state.userToken.sport_active,
                'reverse_diet': this.$store.state.userToken.reverse_diet,
                'useProteinsG': this.$store.state.userToken.useProteinsG,
                'proteinsG': this.$store.state.userToken.proteinsG,
                'proteins': this.$store.state.userToken.proteins,
                'carbs': this.$store.state.userToken.carbs,
                'fats': this.$store.state.userToken.fats,
                'checkIfEverythingIsFine': false,
                'holdMacronutrients': false,
                'dietBreak': true
            })
        },
        endDietCheckWhereToGoNext(whereToGo){
            this.whereToGo = whereToGo
        }
    }
}
</script>

<style scoped>

    .endDietCheck{
        min-height: calc( 100vh - 116px );
        margin: 12px 0;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: auto auto auto 40px 36px;
    }

</style>