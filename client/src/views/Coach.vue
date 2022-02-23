<template>
    <div class="coach">
        <v-stepper v-model="stepper">
            <v-stepper-items>
                <v-stepper-content step="welcome">
                    <welcome @changeStep="changeStep" @endDietCheck="endDietCheck"/>
                </v-stepper-content>
                <v-stepper-content step="countFromZeroCheck">
                    <countFromZeroCheck @changeStep="changeStep"/>
                </v-stepper-content>
                <v-stepper-content step="countFromZeroCounting">
                    <countFromZeroCounting @countNewMacro="countNewMacro"/>
                </v-stepper-content>
                <v-stepper-content step="countFromZeroResult">
                    <countFromZeroResult ref="countFromZeroResult"/>
                </v-stepper-content>

                <!-- ANALYZE -->

                <v-stepper-content step="notTimeForAnalyze">
                    <notTimeForAnalyze @changeStep="changeStep" @endDietCheck="endDietCheck"/>
                </v-stepper-content>
                <v-stepper-content step="endDietCheck">
                    <endDietCheck @changeStep="changeStep" ref="endDietCheckWhereToGoNext" @analyzeResults="analyzeResults"/>
                </v-stepper-content>
                <v-stepper-content step="analyzeCheck">
                    <analyzeCheck @changeStep="changeStep"/>
                </v-stepper-content>
                <v-stepper-content step="analyzeAnyChanges">
                    <analyzeAnyChanges @analyzeResults="analyzeResults"/>
                </v-stepper-content>
                <v-stepper-content step="analyzeResult">
                    <analyzeResult ref="analyzeResult" @changeStep="changeStep"/>
                </v-stepper-content>
                <v-stepper-content step="analyzeSomethingWentWrong">
                    <analyzeSomethingWentWrong
                        @analyzeResultsSomethingWentWrongKEEP="analyzeResultsSomethingWentWrongKEEP"
                        @analyzeResultsSomethingWentWrongHOLD="analyzeResultsSomethingWentWrongHOLD"
                        @analyzeResultsSomethingWentWrongDietBreak="analyzeResultsSomethingWentWrongDietBreak"
                    />
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
import welcome from '@/components/coach/welcome'
import endDietCheck from '@/components/coach/endDietCheck'
import analyzeCheck from '@/components/coach/analyzeCheck'
import analyzeResult from '@/components/coach/analyzeResult'
import analyzeAnyChanges from '@/components/coach/analyzeAnyChanges'
import notTimeForAnalyze from '@/components/coach/notTimeForAnalyze'
import countFromZeroCheck from '@/components/coach/countFromZeroCheck'
import countFromZeroResult from '@/components/coach/countFromZeroResult'
import countFromZeroCounting from '@/components/coach/countFromZeroCounting'
import analyzeSomethingWentWrong from '@/components/coach/analyzeSomethingWentWrong'
export default {
    data: () => ({
        stepper: 'welcome',
        analyzeResultObject: {}
    }),
    methods: {
        endDietCheck(whereToGo){
            this.stepper = 'endDietCheck'
            this.$refs.endDietCheckWhereToGoNext.endDietCheckWhereToGoNext(whereToGo)
        },
        countNewMacro(object){
            this.stepper = 'countFromZeroResult'
            this.$refs.countFromZeroResult.create(object)
        },
        analyzeResults(object){
            this.stepper = 'analyzeResult'
            this.analyzeResultObject = object
            this.$refs.analyzeResult.analyze(object)
        },
        analyzeResultsSomethingWentWrongKEEP(){
            this.stepper = 'analyzeResult'
            let object = JSON.parse(JSON.stringify(this.analyzeResultObject))
            object.checkIfEverythingIsFine = false;
            this.$refs.analyzeResult.analyze(object)
        },
        analyzeResultsSomethingWentWrongHOLD(){
            this.stepper = 'analyzeResult'
            let object = JSON.parse(JSON.stringify(this.analyzeResultObject))
            object.checkIfEverythingIsFine = false;
            object.holdMacronutrients = true;
            this.$refs.analyzeResult.analyze(object)
        },
        analyzeResultsSomethingWentWrongDietBreak(){
            this.stepper = 'analyzeResult'
            let object = JSON.parse(JSON.stringify(this.analyzeResultObject))
            object.checkIfEverythingIsFine = false;
            object.dietBreak = false;
            this.$refs.analyzeResult.analyze(object)
        },
        changeStep(goToStep){
            this.stepper = goToStep
        }
    },
    components: {
        welcome,
        analyzeCheck,
        endDietCheck,
        analyzeResult,
        analyzeAnyChanges,
        countFromZeroCheck,
        countFromZeroCounting,
        countFromZeroResult,
        notTimeForAnalyze,
        analyzeSomethingWentWrong
    }
}
</script>

<style>

    .coach .v-stepper__content{
        padding: 0 12px;
        height: 100%;
    }

    .coach .v-stepper__content .v-stepper__content{
        padding: 16px 60px 16px 23px;
        height: auto;
    }

    .coach .v-stepper, .coach .v-stepper__header{
        box-shadow: none;
    }

    .v-stepper:not(.v-stepper--vertical) .v-stepper__label{
        display: block !important;
    }

    .v-stepper:not(.v-stepper--vertical) .v-stepper__step__step{
        margin-right: 12px;
    }

</style>