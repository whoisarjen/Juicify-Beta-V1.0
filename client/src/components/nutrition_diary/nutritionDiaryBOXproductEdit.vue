<template>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="500px"
    >
        <dialogDelete
            v-if="dialogDelete"
            @close="dialogDelete = false"
            @delete="deleteFROMnutrition_diary(product._id)"
        />
        <v-card>
            <v-card-title>
            <span class="headline">{{$t("universal.edit")}}</span>
            </v-card-title>
            <v-card-text>
            <v-container>
                {{product.name || product.activity}}
                <v-form ref="form">
                <v-row>
                    <v-col
                        cols="12"
                    >
                    <v-select
                        v-if="meal > -1"
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
                        v-if="!product.product_ID"
                        type="number"
                        placeholder="0"
                        v-model="calories"
                        :rules="valueCanNotBe0"
                        :label='$t("add_product.how_many_calories")'
                    ></v-text-field>
                    <v-text-field
                        v-else
                        type="number"
                        placeholder="0"
                        v-model="how_many"
                        :rules="valueCanNotBe0"
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
                color="red"
                text
                :loader="deleteAcceptLoader"
                @click="dialogDelete = true"
            >
                {{$t("universal.delete")}}
            </v-btn>
            <v-btn
                text
                @click="close()"
            >
                {{$t("universal.deny")}}
            </v-btn>
            <v-btn
                text
                :loader="changeLoader"
                @click="change()"
            >
                {{$t("universal.confirm")}}
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import dialogDelete from '@/components/universal/dialog/dialogDelete'
export default {
    data: () => ({
        dialog: true,
        how_many: false,
        calories: 0,
        changeLoader: false,
        dialogDelete: false,
        deleteAcceptLoader: false,
        meal: -1,
        mealOptions: []
    }),
    props: {
        product: Object
    },
    methods: {
        async change(){
            if(this.$refs.form.validate()){
                if(!this.how_many || this.how_many != this.product.how_many || this.meal != this.product.meal && this.meal > -1){
                    this.changeLoader = true
                    let newProduct = JSON.parse(JSON.stringify(this.product))
                    newProduct.whenAdded = await this.$dateTOiso(this.$route.params.date)
                    !this.product.product_ID ? newProduct.calories = parseInt(this.calories) : newProduct.how_many = this.how_many
                    if(!this.product.product_ID && this.calories > 0 && this.product.calories < 0) newProduct.meal = 0
                    if(!this.product.product_ID && this.calories < 0 && this.product.calories > 0) delete newProduct.meal
                    if(this.meal > -1) newProduct.meal = this.meal
                    await this.$daily_measurement(
                        [newProduct],
                        "nutrition_diary",
                        "change"
                    )
                    this.$store.state.nutrition_diaryFLAG = await this.$currentTime()
                    this.$store.state.barsCarloriesFLAG = await this.$currentTime()
                    this.dialogDelete = false
                    this.changeLoader = false
                }
                this.$emit("close")
            }
        },
        async deleteFROMnutrition_diary(_id){
            this.deleteAcceptLoader = true
            await this.$daily_measurement([{
                "_id": _id,
                "whenAdded": this.$route.params.date
            }],
                "nutrition_diary",
                "delete"
            )
            this.$store.state.nutrition_diaryFLAG = await this.$currentTime()
            this.$store.state.barsCarloriesFLAG = await this.$currentTime()
            this.dialogDelete = false
            this.deleteAcceptLoader = false
            this.$emit("close")
        },
        close(){
            this.$emit("close")
        }
    },
    mounted(){
        if(this.product.how_many) this.how_many = this.product.how_many
        if(this.product.calories) this.calories = this.product.calories
        if(this.product.meal > -1) this.meal = this.product.meal
        this.mealOptions = []
        for(let i=0; i<this.$store.state.userToken.meal_number; i++){
            this.mealOptions.push({
                "text": this.$t("nutrition_diary.meal") + " " + (i + 1),
                "value": i
            })
        }
    },
    components: {dialogDelete}
}
</script>