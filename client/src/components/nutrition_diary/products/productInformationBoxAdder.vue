<template>
        <v-btn class="rounded-pill" @click="dialog = true;" icon>
            <span>{{this.$t("universal.add")}}</span>
            <v-icon>fas fa-plus-square</v-icon>
            <v-dialog
                v-model="dialog"
                persistent
                max-width="500px"
                >
                <v-card>
                    <v-card-title>
                    <span class="headline">{{$t("add_product.title")}}</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                        <v-form ref="form">
                        <v-row>
                            <v-col
                                cols="12"
                            >
                                <v-select
                                    :items="mealOptions"
                                    label="Dodaj do"
                                    v-model="meal"
                                    item-text="text"
                                    item-value="value"
                                    hide-details
                                    dense
                                    outlined
                                ></v-select>
                            </v-col>
                            <v-col
                                cols="12"
                            >
                            <v-text-field
                                type="Number"
                                v-model="how_many"
                                placeholder="1"
                                :rules="basicNumberSecurityOver0"
                                :label='$t("add_product.how_many_time")'
                                hide-details
                                dense
                                outlined
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
                        :loading="addToDiaryLoader"
                        @click="addToDiary()"
                    >
                        {{$t("universal.confirm")}}
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        how_many: '',
        addToDiaryLoader: false,
        meal: 0,
        mealOptions: []
    }),
    methods: {
        async addToDiary(){
            if(!this.how_many || this.how_many <= 0) this.how_many = 1
            if( this.$refs.form.validate() ){
                this.addToDiaryLoader = true;
                let array = [JSON.parse(JSON.stringify(this.objectProduct))]
                await this.$deleteIndexedDB('last_used_product', array[0]._id)
                await this.$addIndexedDB('last_used_product', array)
                array[0].meal = this.meal
                array[0].product_ID = this.objectProduct._id
                array[0].whenAdded = await this.$getCorrectDate()
                array[0].how_many = this.how_many
                await this.$daily_measurement(
                    array,
                    "nutrition_diary",
                    "add"
                )
                this.$notification("success", this.$t('success_notify.basic'))
                this.dialog = false;
                this.addToDiaryLoader = false;
                this.$emit('close');
            }
        }
    },
    mounted(){
        this.mealOptions = []
        for(let i=0; i<this.$store.state.userToken.meal_number; i++){
            this.mealOptions.push({
                "text": this.$t("nutrition_diary.meal") + " " + (i + 1),
                "value": i
            })
        }
    },
    props: {
        objectProduct: Object
    }
}
</script>

<style scoped>

    .addToDiary{
        width: 100%;
        height: 36px;
        background: #fff;
        position: fixed;
        bottom: 46px;
        margin-top: 10px;
        width: 100%;
        left: 50%;
        transform: translate(-50%);
    }

    .addToDiary button{
        width: calc( 100% - 16px );
        margin: 0 8px;
    }

</style>