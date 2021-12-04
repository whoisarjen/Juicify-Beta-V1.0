<template>
    <div class="holderForMoreOptions">
        <v-menu
            bottom
            left
        >
            <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            </template>

            <v-list>
            <v-list-item>
                <v-dialog
                v-model="dialog"
                max-width="500px"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-list-item-title v-bind="attrs" v-on="on">{{$t("add_product.add_calories")}}</v-list-item-title>
                </template>
                <v-card>
                    <v-card-title>
                    <span class="headline">{{$t("quick_add.title")}}</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                        {{$t("quick_add.description")}}
                        <v-form ref="form">
                        <v-row>
                            <v-col
                                cols="12"
                            >
                            <v-text-field
                                v-model="name_of_add_calories"
                                :placeholder="$t('quick_add.product_name')"
                                :rules="inputTEXToptionalSHORT"
                                :label='$t("quick_add.name")'
                            ></v-text-field>
                            <v-text-field
                                type="number"
                                v-model="calories_to_add"
                                placeholder="1"
                                :rules="basicNumberSecurityOver0"
                                :label='$t("add_product.how_many_calories")'
                            ></v-text-field>
                            </v-col>
                        </v-row>
                        </v-form>
                    </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        @click="dialog = false"
                    >
                        {{$t("universal.deny")}}
                    </v-btn>
                    <v-btn
                        text
                        :loading="addCaloriesToDBLoader"
                        @click="addCaloriesToDB()"
                    >
                        {{$t("universal.confirm")}}
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-list-item>
            <v-list-item @click="copyMeal()">
                <v-list-item-title>{{$t("add_product.copy_meal")}}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="pasteMeal()">
                <v-list-item-title>{{$t("add_product.paste_meal")}}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="scaleMealDialog = true">
                <v-list-item-title>{{$t("add_product.scale_meal")}}</v-list-item-title>
            </v-list-item>
            </v-list>
        </v-menu>
        <v-dialog
            v-model="scaleMealDialog"
            persistent
            max-width="500px"
        >
            <v-card>
                <v-card-title>
                <span class="headline">{{$t("add_product.scale_meal")}}</span>
                </v-card-title>
                <v-card-text>
                <v-container>
                    {{$t("add_product.scale_meal_description")}}
                    <v-form ref="form">
                    <v-row>
                        <v-col
                            cols="12"
                        >
                        <v-text-field
                            type="number"
                            v-model="ratio"
                            placeholder="1"
                            :rules="basicNumberSecurityOver0"
                            :label='$t("universal.ratio")'
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    </v-form>
                </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="scaleMealDialog = false"
                >
                    {{$t("universal.deny")}}
                </v-btn>
                <v-btn
                    text
                    :loading="scaleMealLoader"
                    @click="scaleMeal"
                >
                    {{$t("universal.confirm")}}
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        ratio: '',
        scaleMealDialog: false,
        scaleMealLoader: false,
        calories_to_add: '',
        name_of_add_calories: "",
        addCaloriesToDBLoader: false
    }),
    methods: {
        async scaleMeal(){
            this.scaleMealLoader = true
            if(!this.ratio) this.ratio = 1
            if(this.allAddedProducts.length > 0 && this.ratio != 1){
                let diary = await this.$getIndexedDBbyID("daily_measurement", await this.$dateTOiso(this.$route.params.date))
                let anyChanges = false
                for(let i=0; i<diary.nutrition_diary.length; i++){
                    if(diary.nutrition_diary[i].meal == this.mealNumber){
                        if(diary.nutrition_diary[i].calories && diary.nutrition_diary[i].calories < 0){
                            // Skip burned calories
                        }else{
                            if(diary.nutrition_diary[i].calories && diary.nutrition_diary[i].calories > 0){
                                diary.nutrition_diary[i].calories = diary.nutrition_diary[i].calories * this.ratio
                                anyChanges = true
                            }else{
                                diary.nutrition_diary[i].how_many = diary.nutrition_diary[i].how_many * this.ratio
                                anyChanges = true
                            }
                        }
                    }
                }
                if(anyChanges){
                    await this.$overwriteThoseIDSinDB("daily_measurement", [diary], false, 'whenAdded')
                    this.$store.state.daily_measurementFLAG = await this.$currentTime()
                }
            }
            this.scaleMealLoader = false
            this.scaleMealDialog = false
            this.ratio = ''
        },
        async copyMeal(){
            if(this.allAddedProducts.length > 0){
                let array = JSON.parse(JSON.stringify(this.allAddedProducts))
                if(array.length>0){
                    for(let i=0; i<array.length; i++){
                        delete array[i]._id
                        delete array[i].meal
                        if(array[i].whenAdded) delete array[i].whenAdded
                        if(array[i].calories && array[i].calories < 0) array.splice(i, 1)
                    }
                }
                localStorage.setItem("copiedMeal", JSON.stringify(array))
                this.$notification("success", this.$t("success_notify.basic"))
            }
        },
        async pasteMeal(){
            if(!localStorage.getItem('copiedMeal')) this.$notification("alert", this.$t('error_notify.there_is_not_copied_meal'))
            else{
                let array = JSON.parse(localStorage.getItem('copiedMeal'))
                let date = await this.$dateTOiso(this.$route.params.date)
                if(array.length>0){
                    for(let i=0; i<array.length; i++){
                        if(array[i]._id) delete array[i]._id
                        array[i].whenAdded = date
                        array[i].meal = this.mealNumber
                    }
                    await this.$daily_measurement(array,
                        "nutrition_diary",
                        "add"
                    )
                    this.$store.state.daily_measurementFLAG = await this.$currentTime()
                }
                localStorage.removeItem('copiedMeal')
            }
        },
        async addCaloriesToDB(){
            if(!this.calories_to_add) this.calories_to_add = 1
            let object = {
                "calories": parseInt(this.calories_to_add),
                "whenAdded": this.$route.params.date,
                "meal": this.mealNumber
            }
            if(this.name_of_add_calories) object['activity'] = this.name_of_add_calories
            this.addCaloriesToDBLoader = true
            if( this.$refs.form.validate() ){
                await this.$daily_measurement(
                    [object],
                    "nutrition_diary",
                    "add"
                )
                this.dialog = false
                this.calories_to_add = ''
                this.name_of_add_calories = ""
                this.$store.state.daily_measurementFLAG = await this.$currentTime()
            }
            this.addCaloriesToDBLoader = false
        }
    },
    props: {
        mealNumber: Number,
        allAddedProducts: Array
    }
}
</script>

<style scoped>

    .holderForMoreOptions button{
        margin: auto;
    }

</style>