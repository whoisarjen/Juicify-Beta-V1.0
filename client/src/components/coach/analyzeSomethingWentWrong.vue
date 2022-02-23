<template>
    <div class="analyzeSomethingWentWrong">
        <h1>{{$t("coach.analyzeSomethingWentWrong.title")}}</h1>
        <div style="margin-bottom: 10px; font-weight: bold; color: red;">{{$t("coach.analyzeSomethingWentWrong.part_1")}}</div>
        <div style="text-transform: uppercase; font-weight: bold; margin: 10px 0;">{{$t("coach.analyzeSomethingWentWrong.part_2")}}:</div>
        <ol>

            <li>{{$t("coach.analyzeSomethingWentWrong.part_3")}}</li>
            <li>{{$t("coach.analyzeSomethingWentWrong.part_4")}}</li>
            <li>{{$t("coach.analyzeSomethingWentWrong.part_5")}}</li>
            <li>{{$t("coach.analyzeSomethingWentWrong.allergy")}}</li>
        </ol>
        <div style="text-transform: uppercase; font-weight: bold; margin: 10px 0;">{{$t("coach.analyzeSomethingWentWrong.part_6")}}:</div>
        <ol style="margin: 10px;">
            <li><b>{{$t("coach.analyzeSomethingWentWrong.option_1")}}</b> - {{$t("coach.analyzeSomethingWentWrong.part_7")}}</li>
            <li><b>{{$t("coach.analyzeSomethingWentWrong.option_2")}}</b> - {{$t("coach.analyzeSomethingWentWrong.part_8")}}</li>
            <li><b>{{$t("coach.analyzeSomethingWentWrong.option_3")}}</b> - {{$t("coach.analyzeSomethingWentWrong.part_9")}}</li>
        </ol>
        <div style="margin-bottom: 10px; font-weight: bold; color: red;">{{$t("coach.analyzeSomethingWentWrong.part_10")}}</div>
        <v-btn
            class="rounded-pill"
            color="#b1272f"
            style="color: #fff"
            @click="$emit('analyzeResultsSomethingWentWrongKEEP')"
        >
        {{$t("coach.analyzeSomethingWentWrong.option_1")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            color="primary"
            @click="$emit('analyzeResultsSomethingWentWrongHOLD')"
        >
        {{$t("coach.analyzeSomethingWentWrong.option_2")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            color="#006400"
            style="color: #fff"
            @click="$emit('analyzeResultsSomethingWentWrongDietBreak')"
        >
        {{$t("coach.analyzeSomethingWentWrong.option_3")}}
        </v-btn>
    </div>
</template>

<script>
export default {
    methods: {
        changeStep(goToStep){
            this.$emit("changeStep", goToStep)
        },
    }
}
</script>

<style scoped>

    .analyzeSomethingWentWrong{
        min-height: calc( 100vh - 92px );
        padding: 12px 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto auto auto auto auto auto 40px 40px 36px;
    }

</style>