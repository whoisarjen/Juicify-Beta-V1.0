<template>
    <div class="coachWelcome">
        <h1>{{$t("coach.step1.title")}}</h1>
        <tutorial/>
        <v-btn
            class="rounded-pill"
            v-if="this.$store.state.online && this.$store.state.userToken.macronutrients[0].proteins && this.$store.state.userToken.goal != 0"
            color="#b1272f"
            style="color: #fff"
            @click="$emit('endDietCheck', 'welcome')"
        >
            {{$t("coach.end_diet")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            v-else-if="!this.$store.state.online && this.$store.state.userToken.macronutrients[0].proteins && this.$store.state.userToken.goal != 0"
            color="primary"
            disabled
        >
            {{$t("universal.not_available_in_offline")}}
        </v-btn>
        <div v-else/>
        <v-btn
            class="rounded-pill"
            v-if="this.$store.state.online && this.$store.state.userToken.coach > '2020-01-01'"
            color="primary"
            @click="changeStep('countFromZeroCheck')"
        >
            {{$t("coach.step1.count_again")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            v-else-if="this.$store.state.userToken.coach == '2020-01-01'"
            color="primary"
            @click="changeStep('countFromZeroCheck')"
        >
            {{$t("coach.step1.lets_start")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            v-else-if="!this.$store.state.online"
            color="primary"
            disabled
        >
            {{$t("universal.not_available_in_offline")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            v-if="!this.$store.state.online"
            color="primary"
            disabled
        >
            {{$t("universal.not_available_in_offline")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            v-else-if="this.$store.state.userToken.goal == 0 && this.$store.state.userToken.coach > '2020-01-01' && timeForNewCheck()"
            color="primary"
            @click="changeStep('analyzeCheck')"
        >
            {{$t("coach.step1.analyze_progress")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            v-else-if="this.$store.state.userToken.coach > '2020-01-01' && timeForNewCheck()"
            color="primary"
            @click="$emit('endDietCheck', 'analyzeCheck')"
        >
            {{$t("coach.step1.analyze_progress")}}
        </v-btn>
        <v-btn
            class="rounded-pill"
            v-else-if="!timeForNewCheck()"
            color="primary"
            @click="changeStep('notTimeForAnalyze')"
        >
            {{$t("coach.step1.available_in")}} {{this.nextCheck()}} {{$t("universal.days")}}
        </v-btn>
    </div>
</template>

<script>
import tutorial from '@/components/coach/tutorial'
export default {
    methods: {
        changeStep(goToStep){
            this.$emit("changeStep", goToStep)
        },
        nextCheck(){
            const date1 = new Date(this.$store.state.userToken.coach);
            const date2 = new Date();
            const diffTime = Math.abs(date2 - date1);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        timeForNewCheck(){
            return new Date(this.$store.state.userToken.coach) <= new Date()
        },
        daysFrom(value){
            let result = new Date(this.$store.state.userToken.coach)
            result.setDate(result.getDate() + value)
            return ("0"+result.getDate()).slice(-2)+"."+("0"+(result.getMonth()+1)).slice(-2)+"."+result.getFullYear()
        }
    },
    components: { tutorial }
}
</script>

<style scoped>

    .coachWelcome{
        min-height: calc( 100vh - 92px );
        padding: 12px 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto 40px 40px 36px;
    }

    .coachWelcome i{
        font-size: 3.6rem;
        text-align: center;
    }

    .coachWelcomeText{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .coachWelcomeTextELEMENTS{
        width: 100%;
    }

    .coachWelcomeTextELEMENTS:nth-child(2){
        text-align: right;
    }

    .coachWelcomeTextELEMENTS p{
        margin: 0;
    }

</style>