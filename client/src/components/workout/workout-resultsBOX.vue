<template>
    <div class="workout-resultsBOX">
        <v-lazy
            v-model="isActive"
            :options="{
            threshold: .5
            }"
            min-height="54"
            transition="fade-transition"
        >
            <div class="boxTraining">
                {{index+1}}. {{item.name}}
            </div>
        </v-lazy>
        <div v-if="this.$route.params.login == this.$store.state.userToken.login && this.$route.params.id">
            <div style="text-align: center; margin-bottom: 10px; font-size: 0.875rem;" v-if="previously">{{previously}}</div>
            <workoutResultsBOXelement
                v-for="(data, i) in item.values"
                :key="i"
                v-bind:element="data"
                v-bind:number="i+1"
                @showTheBox="showTheBox(i)"
                @addResultToDB="addResultToDB(i)"
                @deleteTheBox="deleteTheBox(i)"
            />
        </div>
        <div v-else>
            <workoutResultsBOXelement
                v-for="(data, i) in item.values"
                :key="i"
                v-bind:element="data"
                v-bind:number="i+1"
            />
        </div>
        <div class="mainButtonContener" v-if="this.$route.params.login == this.$store.state.userToken.login && this.$route.params.id">
            <v-btn class="mx-2" fab dark color="primary" @click="newResult(item)">
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
import workoutResultsBOXelement from '@/components/workout/workout-resultsBOXelement'
export default {
    name: 'workout-resultsBOX',
    data: () => ({
        isActive: false,
        previously: false
    }),
    props: {
        item: Object,
        index: Number,
        prevWorkoutResult: [Object, Boolean]
    },
    components: {
        workoutResultsBOXelement
    },
    methods: {
        showTheBox(index){
            this.item.values[index].active = true
        },
        async addResultToDB(index){
            this.item.values[index].active = false
            await this.$emit("saveCHANGES")
        },
        async deleteTheBox(index){
            this.item.values.splice(index, 1)
            await this.$emit("saveCHANGES")
        },
        newResult(){
            if(this.item.values.length>0){
                for(let i=0; i<this.item.values.length;i++){
                    this.item.values[i].active = false
                }
                this.item.values.push({
                    "weight": this.item.values[this.item.values.length - 1].weight,
                    "reps": this.item.values[this.item.values.length - 1].reps,
                    "active": true
                })
            }else{
                this.item.values.push({
                    "weight": 0.00,
                    "reps": 1,
                    "active": true
                })
            }
        }
    },
    mounted(){
        if(this.prevWorkoutResult && this.prevWorkoutResult['results'] && this.prevWorkoutResult['results'].length>0){
            let prev = this.prevWorkoutResult['results'].find(x => x._id == this.item._id)
            if(prev && prev['values']){
                prev = prev['values']
                this.previously = this.$t("universal.previously") + ': ';
                for(let i=0; i<prev.length; i++){
                    this.previously += prev[i].weight + 'x' + prev[i].reps + ', '
                }
                this.previously = this.previously.substring(0, this.previously.length - 2);
            }
        }
        
    }
}
</script>

<style>

    .workout-resultsBOX .boxTraining{
        width: 100%;
        padding: 15px 0;
        background: #333;
        color: #fff;
        margin-bottom: 10px;
        text-align: center;
        border-radius: 4px;
    }

    .workout-resultsBOX .doubleGridValue{
        grid-column: 1/3;
        grid-row: 1;
        text-align: center;
        margin: auto;
    }

    .workout-resultsBOX .mainButtonContener{
        display: grid;
        width: 100%;
        padding: 10px 0 20px;
    }

    .workout-resultsBOX .mainButtonContener .v-btn{
        margin: auto !important;
        width: 40px;
        height: 40px;
    }

    .workout-resultsBOX .mainButtonContener a{
        display: grid;
    }

</style>