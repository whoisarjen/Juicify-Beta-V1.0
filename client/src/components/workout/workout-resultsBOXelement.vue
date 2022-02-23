<template>
    <div class="workout-resultsBOXelement">
        
        <dialogDelete
            v-if="dialogDelete"
            @close="dialogDelete = false"
            @delete="deleteTheBox(element)"
        />
        
        <v-lazy
            v-model="isActive"
            :options="{
                threshold: .5
            }"
            min-height="51"
            transition="fade-transition"
        >
            <div class="boxTrainingResultHeader" v-if="!element.deleted">
                <div v-if="(!element.active) || (element.active == false)">
                    <div class="boxTrainingResult" @click="showTheBox()" style="padding: 9px 0;">
                        <v-btn style="margin: auto;" v-if="(this.$route.params.login == this.$store.state.userToken.login && this.$route.params.id)" @click="dialogDelete = true" icon><v-icon style="font-size: 0.875rem;">fas fa-trash-alt</v-icon></v-btn>
                        <i v-else class="fas fa-dumbbell"></i>
                        <span style="margin: auto;">{{element.weight}}kg</span>
                        <span style="margin: auto;">#{{number}}</span>
                        <span style="margin: auto;">{{element.reps}}{{$t("workout_result.reps_small_short")}}.</span>
                        <i class="far fa-check-circle"></i>
                    </div>
                </div>
                <div v-else>
                    <div class="boxTrainingResult" @click="addResultToDB(element)">
                        <span class="doubleGridValue">{{$t("workout_result.click_to_save")}}</span>
                        <span>#{{number}}</span>
                        <i class="fas fa-arrow-right"></i>
                        <i class="far fa-circle"></i>
                    </div>
                    <div class="boxTrainingElements">
                    <v-autocomplete
                        v-model="element.weight"
                        :items="availableWeight"
                        dense
                        solo
                        type="number"
                        prepend-icon="mdi-dumbbell"
                    ></v-autocomplete>
                    </div>
                    <div class="boxTrainingElements">
                    <v-autocomplete
                        v-model="element.reps"
                        :items="availableReps"
                        dense
                        solo
                        type="number"
                        prepend-icon="mdi-repeat"
                    ></v-autocomplete>
                    </div>
                </div>
            </div>
        </v-lazy>
    </div>
</template>

<script>
import dialogDelete from '@/components/universal/dialog/dialogDelete'
export default {
    name: 'workout-resultsBOXelement',
    data: () => ({
        dialogDelete: false,
        isActive: false,
        numberCOUNTER: 0
    }),
    props: {
        element: Object,
        number: Number
    },
    computed: {
        availableWeight(){
            return Array.from({ length: 9999 }, (k, v) => (v / 4).toFixed(2))
        },
        availableReps(){
            return Array.from({ length: 255 }, (k, v) => v + 1)
        },
    },
    methods: {
        showTheBox(){
            if(this.$route.params.login == this.$store.state.userToken.login && this.$route.params.id){
                this.element.active = true
                this.$emit("showTheBox")
                this.$forceUpdate();
            }
        },
        addResultToDB(){
            if(this.$route.params.login == this.$store.state.userToken.login && this.$route.params.id){
                this.element.active = false
                this.$emit("addResultToDB")
                this.$forceUpdate();
            }
        },
        deleteTheBox(){
            if(this.$route.params.login == this.$store.state.userToken.login && this.$route.params.id) this.$emit("deleteTheBox")
            this.dialogDelete = false
        }
    },
    components: {
        dialogDelete
    },
    watch:{
        'numberCOUNTER': function(){ this.element.active ? this.element.active = false : this.element.active = true },
    }
}
</script>

<style>

    .workout-resultsBOXelement .boxTrainingElements .v-input__prepend-outer{
        margin-left: 12px !important;
        margin-top: 9px !important;
        margin-bottom: 9px !important;
        margin-right: 12px !important;
    }

    .workout-resultsBOXelement .boxTrainingResultHeader{
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 10px;
        font-size: 0.875rem;
    }

    .workout-resultsBOXelement .boxTrainingElements{
        text-align: center;
        border-bottom: 1px solid #eee;
    }

    .workout-resultsBOXelement .boxTrainingResult{
        width: 100%;
        padding: 15px 0;
        text-align: center;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }

    .workout-resultsBOXelement .boxTrainingResult i{
        margin: auto;
    }

    .workout-resultsBOXelement .boxTrainingElements:last-child{
        border-bottom: none;
    }

    .workout-resultsBOXelement .v-text-field__details{
        min-height: 0px !important;
        margin-bottom: 0 !important;
    }

    .workout-resultsBOXelement .v-messages{
        min-height: 0px !important;
    }

    .workout-resultsBOXelement .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)>.v-input__control>.v-input__slot{
        box-shadow: none;
    }

</style>