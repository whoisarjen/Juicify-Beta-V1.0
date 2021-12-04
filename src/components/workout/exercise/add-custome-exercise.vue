<template>
<div class="addCustomExercise">
        <v-row justify="center">
            <v-dialog
                v-model="dialog"
                persistent
                max-width="600px"
            >
                <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="rounded-pill"
                    style="margin: 10px 0;"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                >
                    {{$t("add_exercise.create")}}
                </v-btn>
                </template>
                <v-form ref="form">
                    <v-card>
                    <v-card-title>
                        <span class="headline">{{$t("add_exercise.create")}}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                        <v-row>
                            <v-col
                            cols="12"
                            >
                            <v-text-field
                                counter
                                :label='$t("add_exercise.name_of_exercise")'
                                :rules="inputTEXTrequested"
                                v-model="nameOfNewExercise"
                            ></v-text-field>
                            </v-col>
                        </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        text
                        @click="dialog = false"
                        >
                        {{$t("universal.close")}}
                        </v-btn>
                        <v-btn
                        text
                        :loading="addCustomExerciseLoader"
                        @click="addCustomExerciseToDB"
                        >
                        {{$t("universal.save")}}
                        </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "addCustomExercise",
    data: () => ({
        dialog: false,
        nameOfNewExercise: '',
        addCustomExerciseLoader: false
    }),
    methods:{
        async addCustomExerciseToDB(){
            this.addCustomExerciseLoader = true
            if( this.$refs.form.validate() ){
                    await this.$insertThoseIDStoDB('exercise', [{
                        "name": this.nameOfNewExercise,
                        "user_ID": this.$store.state.userToken._id,
                        "l": this.nameOfNewExercise.length
                    }])
                    .then(async (response) => {
                        response[0].last_used_exercise = await this.$currentTime()
                        await this.$addIndexedDB("last_used_exercise", response)
                        this.$emit('loadDefaultValues', this.nameOfNewExercise)
                    })
                    .finally(() => {
                        this.dialog = false
                        this.nameOfNewExercise = ''
                        this.addCustomExerciseLoader = false
                    })
            }
        }
    },
    mounted(){
        this.addCustomExerciseButton = true
    }
}
</script>


<style scoped>
    .addCustomExercise{
        margin-top: 10px;
    }
</style>