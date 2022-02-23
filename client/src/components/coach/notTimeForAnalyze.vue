<template>
    <div class="notTimeForAnalyze">
        <div style="font-size: 2.6rem; font-weight: bold;">{{this.nextCheck()}} {{$t("universal.days_small")}}</div>
        <div>{{$t("coach.notTimeForAnalyze.description")}}</div>
        <v-btn
            class="rounded-pill"
            color="#b1272f"
            style="color: #fff"
            @click="$emit('endDietCheck', 'analyzeCheck')"
            v-if="this.$store.state.userToken.goal != 0"
        >
        {{$t("universal.continue")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            color="#b1272f"
            style="color: #fff"
            @click="changeStep('analyzeCheck')"
            v-else
        >
        {{$t("universal.continue")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            color="primary"
            @click="$router.push('/')"
        >
        {{$t("universal.comeback_later")}}
        </v-btn>
    </div>
</template>

<script>
export default {
    methods: {
        nextCheck(){
            const date1 = new Date(this.$store.state.userToken.coach);
            const date2 = new Date();
            const diffTime = Math.abs(date2 - date1);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        changeStep(goToStep){
            this.$emit("changeStep", goToStep)
        },
    }
}
</script>

<style scoped>

    .notTimeForAnalyze{
        min-height: calc( 100vh - 92px );
        padding: 12px 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto 40px 36px;
    }

    .notTimeForAnalyze div{
        margin: auto;
        text-align: center;
    }

</style>