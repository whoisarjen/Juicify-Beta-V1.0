<template>
    <v-stepper v-model="tutorialStepper" vertical>
        
        <v-stepper-step step="1" @click="tutorialStepper = 1" :complete="1 < tutorialStepper">{{this.$t("coach.countFromZeroResult.title_1")}}</v-stepper-step>
        <v-stepper-content step="1">
            <v-card color="lighten-1" class="margin-bottom">
            <div class="content">{{this.$t("coach.countFromZeroResult.rules_1")}}</div>
            </v-card>
            <v-btn color="primary" @click="tutorialStepper = 2">
                {{this.$t("universal.next")}}
            </v-btn>
        </v-stepper-content>

        <v-stepper-step step="2" @click="tutorialStepper = 2" :complete="2 < tutorialStepper">{{this.$t("coach.countFromZeroResult.title_2")}}</v-stepper-step>
        <v-stepper-content step="2">
            <v-card color="lighten-2" class="margin-bottom">
            <img class="image" src="/img/tutorial/step2.jpg"/>
            <div class="icons"><i class="fas fa-book"></i> <i class="fas fa-long-arrow-alt-right"></i> <i class="fas fa-plus-square"></i></div>
            <div class="content">{{this.$t("coach.countFromZeroResult.rules_2")}}</div>
            </v-card>
            <v-btn color="primary" @click="tutorialStepper = 3">
                {{this.$t("universal.next")}}
            </v-btn>
            <v-btn text @click="tutorialStepper = 1">
                {{this.$t("universal.back")}}
            </v-btn>
        </v-stepper-content>
        
        <v-stepper-step step="3" @click="tutorialStepper = 3" :complete="3 < tutorialStepper">{{this.$t("coach.countFromZeroResult.title_3")}}</v-stepper-step>
        <v-stepper-content step="3">
            <v-card color="lighten-1" class="margin-bottom">
            <img class="image" src="/img/tutorial/step3.jpg"/>
            <div class="content">{{this.$t("coach.countFromZeroResult.rules_3")}}</div>
            </v-card>
            <v-btn color="primary" @click="tutorialStepper = 4">
                {{this.$t("universal.next")}}
            </v-btn>
            <v-btn text @click="tutorialStepper = 2">
                {{this.$t("universal.back")}}
            </v-btn>
        </v-stepper-content>
        
        <v-stepper-step step="4" @click="tutorialStepper = 4" :complete="4 < tutorialStepper">{{this.$t("coach.countFromZeroResult.title_4")}}</v-stepper-step>
        <v-stepper-content step="4">
            <v-card color="lighten-1" class="margin-bottom">
            <div class="content">{{this.$t("coach.countFromZeroResult.rules_4")}}</div>
            </v-card>
            <v-btn color="primary" @click="tutorialStepper = 5">
                {{this.$t("universal.next")}}
            </v-btn>
            <v-btn text @click="tutorialStepper = 3">
                {{this.$t("universal.back")}}
            </v-btn>
        </v-stepper-content>
        
        <v-stepper-step step="5" @click="tutorialStepper = 5" :complete="5 < tutorialStepper">{{this.$t("coach.countFromZeroResult.title_5")}}</v-stepper-step>
        <v-stepper-content step="5">
            <v-card color="lighten-1" class="margin-bottom">
            <div class="icons"><i class="fas fa-home"></i> <i class="fas fa-long-arrow-alt-right"></i> <i class="fas fa-weight"></i></div>
            <div class="content">{{this.$t("coach.countFromZeroResult.rules_5")}}</div>
            </v-card>
            <v-btn color="primary" @click="tutorialStepper = 6">
                {{this.$t("universal.next")}}
            </v-btn>
            <v-btn text @click="tutorialStepper = 4">
                {{this.$t("universal.back")}}
            </v-btn>
        </v-stepper-content>
        
        <v-stepper-step step="6" @click="tutorialStepper = 6" :complete="6 < tutorialStepper">{{this.$t("coach.countFromZeroResult.title_6")}}</v-stepper-step>
        <v-stepper-content step="6">
            <v-card color="lighten-1" class="margin-bottom">
            <div class="icons"><i class="fas fa-book"></i> <i class="fas fa-long-arrow-alt-right"></i> <i class="fas fa-fire"></i></div>
            <div class="content">{{this.$t("coach.countFromZeroResult.rules_6")}}</div>
            </v-card>
            <v-btn color="primary" @click="tutorialStepper = 7">
                {{this.$t("universal.next")}}
            </v-btn>
            <v-btn text @click="tutorialStepper = 5">
                {{this.$t("universal.back")}}
            </v-btn>
        </v-stepper-content>
        
        <v-stepper-step step="7" @click="tutorialStepper = 7" :complete="7 < tutorialStepper">{{this.$t("coach.countFromZeroResult.title_7")}}</v-stepper-step>
        <v-stepper-content step="7">
            <v-card color="lighten-1" class="margin-bottom">
            <div class="icons"><i class="fas fa-home"></i> <i class="fas fa-long-arrow-alt-right"></i> <i class="fas fa-diagnoses"></i></div>
            <div class="content">{{this.$t("coach.countFromZeroResult.rules_7")}}</div>
            </v-card>
            <v-btn text @click="tutorialStepper = 6">
                {{this.$t("universal.back")}}
            </v-btn>
        </v-stepper-content>
    </v-stepper>
</template>

<script>
export default {
    data: () => ({
        tutorialStepper: 1
    }),
    props: {
        open: [Number, String]
    },
    // mounted() {
    //     if(this.open) this.tutorialStepper = this.open
    // }
}
</script>

<style scoped>

    .v-stepper, .v-stepper__header,
    .v-sheet.v-card:not(.v-sheet--outlined){
        box-shadow: none;
    }

    .v-stepper--vertical{
        padding-bottom: 12px;
    }

    .icons{
        text-align: center;
    }

    .icons i{
        margin-top: 12px;
    }

    .content{
        margin: 12px;
    }

    .margin-bottom{
        margin-bottom: 12px;
    }

    .image{
        width: 100%;
    }

</style>