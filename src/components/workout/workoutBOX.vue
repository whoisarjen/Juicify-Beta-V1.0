<template>
    <div class="workoutBOX">
        <v-lazy
            v-model="isActive"
            :options="{
                threshold: .5
            }"
            min-height="96"
            transition="fade-transition"
        >
            <v-row>
                <v-col
                    cols="20"
                >
                    <router-link :disabled="!whereTOroute" :event="whereTOroute ? 'click' : ''"  :to="whereTOroute + '/' + item._id">
                        <v-card
                            :color="item.color"
                            dark
                        >
                            <div class="d-flex flex-no-wrap justify-space-between" style="background-color: rgb(51, 51, 51); border-color: rgb(51, 51, 51);">
                                <div>
                                <v-card-title
                                    class="headline"
                                    v-text="item.title"
                                ></v-card-title>
                                <v-card-subtitle v-text="item.description"></v-card-subtitle>
                                <v-card-subtitle v-if="item.whenAdded">{{item.whenAdded.substr(8, 2)+"."+item.whenAdded.substr(5, 2)+"."+item.whenAdded.substr(0, 4)}}</v-card-subtitle>
                                <v-card-subtitle style="text-transform: uppercase;" v-if="item.notSaved" v-text="item.notSaved"></v-card-subtitle>
                                </div>
                                <v-avatar
                                    class="ma-3"
                                    size="125"
                                    tile
                                >
                                <i v-if="!(item.icon) && !item.whenAdded" :class="iconPLANS"/>
                                <i v-if="!(item.icon) && item.whenAdded"  :class="iconRESULTS"/>
                                <i v-if="item.icon == 'nutrition_diary'" :class="iconNUTRITION_DIARY"/>
                                <i v-if="item.icon == 'plan'" :class="iconPLANS"/>
                                <i v-if="item.icon == 'result'" :class="iconRESULTS"/>
                                </v-avatar>
                            </div>
                        </v-card>
                    </router-link>
                </v-col>
            </v-row>
        </v-lazy>
    </div>
</template>

<script>
export default {
    name: 'workoutBOX',
    data(){
        return{
            isActive: false,
            iconPLANS: "fa-fw far fa-clipboard",
            iconRESULTS: "fa-fw fas fa-dumbbell",
            iconNUTRITION_DIARY: "fa-fw fas fa-book"
        }
    },
    props: {
        item: Object,
        whereTOroute: String
    }
}
</script>

<style scoped>

    .workoutBOX i{
        color: #fff;
        font-size: 36px !important;
    }

    .col, .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col-auto, .col-lg, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-auto, .col-md, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md-auto, .col-sm, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-auto, .col-xl, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl-auto{
        padding: 4px 12px !important;
    }

    .workoutBOX .v-card__title{
        word-wrap: break-word !important;
        word-break: break-all !important;
    }

    .workoutBOX a{
        text-decoration: none;
    }

</style>