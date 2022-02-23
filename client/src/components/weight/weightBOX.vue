<template>
    <div class="weightBOX">
        <v-lazy
            v-model="isActive"
            :options="{
                threshold: .5
            }"
            min-height="80"
            transition="fade-transition"
        >
            <v-timeline>
                <v-timeline-item small>
                    <template v-slot:opposite>
                        <span @click="changeWeight()" :class="`headline font-weight-bold`">{{ data.weight+'kg' }}</span>
                        <div style="font-size: 0.7rem">
                            <span v-if="data.neck">{{$t('universal.neck')}} {{data.neck}}cm, </span>
                            <span v-if="data.shoulders">{{$t('universal.shoulders')}} {{data.shoulders}}cm, </span>
                            <span v-if="data.chest">{{$t('universal.chest')}} {{data.chest}}cm, </span>
                            <span v-if="data.biceps">{{$t('universal.biceps')}} {{data.biceps}}cm, </span>
                            <span v-if="data.waist">{{$t('universal.waist')}} {{data.waist}}cm, </span>
                            <span v-if="data.hips">{{$t('universal.hips')}} {{data.hips}}cm, </span>
                            <span v-if="data.thigh">{{$t('universal.thigh')}} {{data.thigh}}cm, </span>
                            <span v-if="data.calf">{{$t('universal.calf')}} {{data.calf}}cm</span>
                        </div>
                    </template>
                    <div class="py-4">
                        <span>{{ data.whenAdded.substr(0, 10) }}</span>
                        <div>
                        {{ data.weight_description }}
                        </div>
                    </div>
                </v-timeline-item>
            </v-timeline>
        </v-lazy>
    </div>
</template>
<script>
export default {
    name: 'weightBOX',
    data: () => {
        return {
            isActive: false
        }
    },
    props: {
        data: Object
    },
    methods: {
        changeWeight(){
            this.$emit('changeWeight')
        }
    },
    mounted(){
        this.$emit('addToHowManyLoaded')
    }
}
</script>

<style>

    .weightBOX .theme--light.v-sheet{
        border-radius: 4px;
        box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 rgb(0 0 0 / 12%);
    }

    .weightBOX .v-card__text{
        padding: 20px 0 0;
    }

    .weightBOX .v-card__text svg{
        width: 100%;
        padding: 20px 0;
    }

    .weightBOX .loadMore{
        padding-top: 10px;
        text-align: center;
        width: 100%;
    }

    .weightBOX .dialogErrorCSS{
        width: 100%;
        color: red;
    }

    .weightBOX .mainButtonContener{
        display: grid;
        width: 100%;
        padding: 20px 0;
    }

    .weightBOX .mainButtonContener .v-btn{
        margin: auto !important;
    }

    .weightBOX .v-timeline-item__opposite{
        text-align: center !important;
    }

    .weightBOX .v-timeline-item .py-4{
        font-size: 0.875rem;
        text-align: center;
        word-wrap: break-word;
    }

    .weightBOX .v-timeline-item .py-4 span{
        font-size: 1rem;
    }

</style>