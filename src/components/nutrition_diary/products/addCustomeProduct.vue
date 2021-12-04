<template>
    <v-row justify="center">
        <v-dialog
        v-model="dialog"
        scrollable
        persistent
        max-width="500px"
        >
        <v-card>
            <v-card-title>{{$t("add_product.create")}}</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
            <v-container>
                <span v-if="foundBarcode" style="color: red">{{this.$t("add_product.not_found")}}</span>
                <v-form ref="form">
                    <v-row>                
                    <v-col cols="12" v-if="foundBarcode">
                        <v-text-field
                        :label='"Barcode (" + $t("universal.optional") + ")"'
                        v-model="barcode"
                        :rules="[v => v >= 0 || '']"
                        type="number"
                        placeholder="0"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            counter
                            :label='$t("add_product.name_of_product")'
                            :rules="inputTEXTrequested"
                            v-model="name"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_proteins")'
                        type="number"
                        placeholder="0"
                        :rules="basicNumberSecurity"
                        v-model="proteins"
                        v-on:input="count"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_carbs")'
                        :rules="basicNumberSecurity"
                        v-model="carbs"
                        v-on:input="count"
                        type="number"
                        placeholder="0"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_sugar")'
                        :rules="basicNumberSecurity"
                        v-model="sugar"
                        v-on:input="count"
                        type="number"
                        placeholder="0"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_fats")'
                        :rules="basicNumberSecurity"
                        v-model="fats"
                        v-on:input="count"
                        type="number"
                        placeholder="0"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_fiber")'
                        :rules="basicNumberSecurity"
                        v-model="fiber"
                        v-on:input="count"
                        type="number"
                        placeholder="0"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_sodium")'
                        :rules="basicNumberSecurity"
                        v-model="sodium"
                        v-on:input="count"
                        type="number"
                        placeholder="0"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_ethanol")'
                        :rules="basicNumberSecurity"
                        v-model="ethanol"
                        v-on:input="count"
                        type="number"
                        placeholder="0"
                        ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-text-field
                        :label='$t("add_product.number_of_calories")'
                        :rules="basicNumberSecurity"
                        disabled
                        v-model="calories"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-switch
                            v-model="checkMe"
                            inset
                            :label="$t('add_product.should_be_available_for_everyone?')"
                        ></v-switch>
                    </v-col>
                    </v-row>
                </v-form>
            </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-end">
                <v-btn
                    text
                    @click="close()"
                >
                    {{$t("universal.close")}}
                </v-btn>
                <v-btn
                    text
                    :loading="loading"
                    @click="saveNewProduct()"
                >
                    {{$t("universal.confirm")}}
                </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    data: () => ({
        dialog: true,
        barcode: 0,
        name: '',
        proteins: '',
        carbs: '',
        fats: '',
        sugar: '',
        fiber: '',
        sodium: '',
        ethanol: '',
        calories: '',
        checkMe: false,
        loading: false
    }),
    props: {
        foundBarcode: [Number, String],
        showCreateProduct: Boolean
    },
    methods: {
        async saveNewProduct(){
            if( this.$refs.form.validate() ){
                this.loading = true
                let object = {
                    name: this.name
                }

                if(this.proteins > 0) object.p = this.proteins
                if(this.carbs > 0) object.c = this.carbs
                if(this.sugar > 0) object.s = this.sugar
                if(this.fats > 0) object.f = this.fats
                if(this.fiber > 0) object.fi = this.fiber
                if(this.sodium > 0) object.na = this.sodium
                if(this.ethanol > 0) object.na = this.ethanol

                if(this.barcode > 0) object.code = this.barcode
                if(this.checkMe) object.checkMe = true

                await this.$insertThoseIDStoDB('product', [object])
                .then(async (response) => {
                    response[0].how_many = 1
                    response[0].checked = false
                    response[0].last_used_product = await this.$currentTime()
                    await this.$addIndexedDB("last_used_product", response[0])
                    this.$emit('madeProduct', this.name)
                    this.$notification("success", this.$t('success_notify.basic'))
                    this.close(response[0])
                })
                .finally(() => {
                    this.loading = false
                    this.proteins = 0
                    this.carbs = 0
                    this.sugar = 0
                    this.fats = 0
                    this.fiber = 0
                    this.calories = 0
                    this.sodium = 0
                    this.barcode = 0
                    this.checkMe = false
                    this.name = ''
                })
            }
        },
        close(object){
            this.$emit("close", object)
        },
        count(){
            this.calories = (this.proteins * 4 + this.carbs * 4 + this.fats * 9 + this.ethanol * 7).toFixed(0)
        }
    },
    mounted(){
        if(this.showCreateProduct) this.dialog = true;
        if(this.foundBarcode){
            this.barcode = this.foundBarcode
            this.checkMe = true   
        }
    }
}
</script>