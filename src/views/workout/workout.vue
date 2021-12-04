<template>
    <div class="workout">
        <div class="paddingForCol">
            <v-container>
                <v-row dense>
                    <v-col
                      cols="20"
                    >
                        <v-lazy
                            :v-model="isActive"
                            :options="{
                            threshold: .5
                            }"
                            min-height="51"
                            transition="fade-transition"
                        >
                            <v-card
                                color="#333"
                                dark
                            >
                                <router-link :to="'/' + this.$store.state.userToken.login + '/workout-result'">
                                    <div class="d-flex flex-no-wrap justify-space-between">
                                        <div>
                                            <v-card-title
                                                class="headline"
                                            >{{this.$t("workout_result.title")}}</v-card-title>
                                            <v-card-subtitle>{{this.$t("workout_result.description")}}</v-card-subtitle>
                                        </div>
                                        <v-avatar
                                            class="ma-3"
                                            size="125"
                                            tile
                                        ><i class="fas fa-dumbbell fa-fw"></i></v-avatar>
                                    </div>
                                </router-link>
                            </v-card>
                        </v-lazy>
                    </v-col>
                    <v-col
                        cols="20"
                    >
                        <v-lazy
                            :v-model="isActive"
                            :options="{
                            threshold: .5
                            }"
                            min-height="51"
                            transition="fade-transition"
                        >
                            <v-card
                                color="#333"
                                dark
                            >
                                <router-link :to="'/' + this.$store.state.userToken.login + '/workout-plan'">
                                    <div class="d-flex flex-no-wrap justify-space-between">
                                        <div>
                                            <v-card-title
                                                class="headline"
                                            >{{this.$t("workout_plan.title")}}</v-card-title>
                                            <v-card-subtitle>{{this.$t("workout_plan.description")}}</v-card-subtitle>
                                        </div>
                                        <v-avatar
                                            class="ma-3"
                                            size="125"
                                            tile
                                        ><i class="far fa-clipboard fa-fw"></i></v-avatar>
                                    </div>
                                </router-link>
                            </v-card>
                        </v-lazy>
                    </v-col>
                    <!-- <v-col
                        v-if="this.$store.state.online"
                        cols="20"
                    >
                        <v-lazy
                            :v-model="isActive"
                            :options="{
                            threshold: .5
                            }"
                            min-height="51"
                            transition="fade-transition"
                        >
                            <v-card
                                color="#333"
                                dark
                            >
                                <router-link :to="'/' + this.$store.state.userToken.login + '/workout-statistic'">
                                    <div class="d-flex flex-no-wrap justify-space-between">
                                        <div>
                                            <v-card-title
                                                class="headline"
                                            >{{this.$t("statistics.title")}}</v-card-title>
                                            <v-card-subtitle>{{this.$t("statistics.description")}}</v-card-subtitle>
                                        </div>
                                        <v-avatar
                                            class="ma-3"
                                            size="125"
                                            tile
                                        ><i class="fas fa-chart-line fa-fw"></i></v-avatar>
                                    </div>
                                </router-link>
                            </v-card>
                        </v-lazy>
                    </v-col> -->
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script>
export default {
    name: 'workout',
    data: () => ({
        isActive: false
    }),
    methods: {
        async checkCoachTutorial(){
            if(await this.$addDAYStoISO(await this.$dateTOiso(this.$store.state.userToken.registered), 30) > await this.$dateTOiso(new Date())){
                if(!localStorage.getItem('coach_tutorial')){
                    if(this.$store.state.userToken.coach == '2020-01-01'){
                        this.$notification("alert", this.$t('error_notify.checkCoachTutorial'))
                        this.$router.push("/coach")
                    }
                }else{
                    localStorage.removeItem('coach_tutorial');
                    if(this.$store.state.userToken.coach == '2020-01-01') this.$router.push("/coach")
                }
            }
        }
    },
    async mounted(){
        await this.checkCoachTutorial()
    }
}
</script>

<style>

  .workout a{
      text-decoration: none;
  }

  .workout .headline {
      font-size: 1.1rem!important;
      text-transform: uppercase;
      color: #fff !important;
  }

  .workout .mt-3{
      margin-top: 0 !important;
  }

  .workout i{
      color: #fff;
      font-size: 36px;
  }

  .workout .col:last-child{
      margin-bottom: 44px;
  }

  .workout .v-card__title{
      word-break: normal;
  }

</style>