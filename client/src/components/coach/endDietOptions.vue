<template>
    <div class="endDietOptions">
        <h1>{{$t("coach.analyzeSomethingWentWrong.title")}}</h1>
        <div>
            <div style="padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #e4e4e4;">Standard</div>
            <div>{{$t("coach.endDietOptions.standard")}}</div>
        </div>
        <div>
            <div style="padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #e4e4e4;">Reverse diet</div>
            <div>{{$t("coach.endDietOptions.reverse_diet")}}</div>
        </div>
        <v-btn
            class="rounded-pill"
            color="primary"
            @click="standard"
        >
        {{$t("universal.standard")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            color="primary"
            disabled
            @click="reverse_diet"
        >
        Reverse diet
        </v-btn>
    </div>
</template>

<script>
export default {
    methods: {
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
        reverse_diet(){
            this.$emit("analyzeResults", {
                'activity': this.$store.state.userToken.activity,
                'goal': 0,
                'kind_of_diet': this.$store.state.userToken.kind_of_diet,
                'sport_active': this.$store.state.userToken.sport_active,
                'reverse_diet': true,
                'useProteinsG': this.$store.state.userToken.useProteinsG,
                'proteinsG': this.$store.state.userToken.proteinsG,
                'proteins': this.$store.state.userToken.proteins,
                'carbs': this.$store.state.userToken.carbs,
                'fats': this.$store.state.userToken.fats,
                'checkIfEverythingIsFine': false,
                'holdMacronutrients': false,
                'dietBreak': false
            })
        }
    }
}
</script>

<style scoped>

    .endDietOptions{
        min-height: calc( 100vh - 116px );
        margin: 12px 0;
        height: 100%;
        width: 100%;
        display: grid;
        grid-template-rows: auto auto auto 40px 36px;
    }

</style>