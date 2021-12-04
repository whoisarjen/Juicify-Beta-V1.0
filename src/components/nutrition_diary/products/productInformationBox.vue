<template>
    <div class="productInformationBox">
        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            scrollable
            >
            <dialogDelete
                v-if="dialogDelete"
                @close="dialogDelete = false"
                @delete="deleteOWN()"
            />
            <v-card tile>
                <div class="dialogBackground">
                    <div class="contenerLOGGED">
                        <div class="centred750">
                            <div class="valueInDialog">
                                <v-card>
                                    <v-card-title class="subheading font-weight-bold">
                                        {{ product.Name }} <i v-if="product.v" style="color: #4caf50" class="fas fa-check-circle"/>
                                    </v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                        <div>
                                            <v-list-item>
                                            <v-list-item-content>{{this.$t("universal.calories")}}</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                {{product['Calories']}}kcal
                                            </v-list-item-content>
                                            </v-list-item>
                                        </div>
                                        <div>
                                            <v-list-item>
                                            <v-list-item-content>Barcode</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                {{product['Barcode']}}
                                            </v-list-item-content>
                                            </v-list-item>
                                        </div>
                                        <div v-for="element in Object.keys(product)" :key="element">
                                            <v-list-item v-if="element != 'Name' && element != 'v' && element != 'Calories' && element != 'Barcode'">
                                            <v-list-item-content>{{element}}</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                {{product[element]}}g
                                            </v-list-item-content>
                                            </v-list-item>
                                        </div>
                                    </v-list>
                                </v-card>
                            </div>
                            <v-bottom-navigation class="dialogMenu">
                                <v-btn class="rounded-pill" @click="dialogDelete = true" icon :disabled="objectProduct.user_ID != this.$store.state.userToken._id || !this.$store.state.online">
                                    <span>{{this.$t("universal.delete")}}</span>
                                    <v-icon>fas fa-trash-alt</v-icon>
                                </v-btn>

                                <reportBug where="product" :_id="objectProduct._id"/>

                                <productInformationBoxAdder :objectProduct="objectProduct" @close="$emit('close')"/>

                                <v-btn class="rounded-pill" @click="dialog = false; $emit('close')" icon>
                                    <span>{{this.$t("universal.exit")}}</span>
                                    <v-icon>fas fa-times-circle</v-icon>
                                </v-btn>
                            </v-bottom-navigation>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import reportBug from '@/components/universal/reportBug'
import dialogDelete from '@/components/universal/dialog/dialogDelete'
import productInformationBoxAdder from '@/components/nutrition_diary/products/productInformationBoxAdder'
export default {
    data: () => ({
        dialogDelete: false,
        dialog: true,
        product: {}
    }),
    props: {
        objectProduct: Object
    },
    mounted(){
        this.product = {}
        if(this.objectProduct.name) this.product['Name'] = this.objectProduct.name
        this.objectProduct.code ? this.product['Barcode'] = this.objectProduct.code : '-'
        this.objectProduct.p ? this.product[ this.$t('universal.proteins') ] = this.objectProduct.p : this.product[ this.$t('universal.proteins') ] = 0
        this.objectProduct.c ? this.product[ this.$t('universal.carbs') ] = this.objectProduct.c : this.product[ this.$t('universal.carbs') ] = 0
        this.objectProduct.s ? this.product[ this.$t('universal.sugar') ] = this.objectProduct.s : this.product[ this.$t('universal.sugar') ] = 0
        this.objectProduct.f ? this.product[ this.$t('universal.fats') ] = this.objectProduct.f : this.product[ this.$t('universal.fats') ] = 0
        this.objectProduct.fi ? this.product[ this.$t('universal.fiber') ] = this.objectProduct.fi : this.product[ this.$t('universal.fiber') ] = 0
        this.objectProduct.na ? this.product[ this.$t('universal.salt') ] = this.objectProduct.na : this.product[ this.$t('universal.salt') ] = 0
        this.objectProduct.ethanol ? this.product[ this.$t('universal.ethanol') ] = this.objectProduct.ethanol : this.product[ this.$t('universal.ethanol') ] = 0
        this.product['Calories'] = (this.product[ this.$t('universal.proteins') ] * 4 + this.product[ this.$t('universal.carbs') ] * 4 + this.product[ this.$t('universal.fats') ] * 9 + this.product[ this.$t('universal.ethanol') ] * 7).toFixed()
        if(this.objectProduct.v) this.product['v'] = true
    },
    methods: {
        async deleteOWN(){
            let fav = await this.$getAllIndexedDB("favourite_product")
            fav = fav.filter(x => x.product_ID == this.objectProduct._id)
            if(fav.length > 0) await this.$deleteThoseIDSfromDB("favourite_product", fav)

            await this.$deleteThoseIDSfromDB("product", [this.objectProduct])
            .then(async () => {
                await this.$deleteIndexedDB("last_used_product", this.objectProduct._id)
            })
            this.$emit('loadDefaultValues')
            this.dialogDelete = false
            this.dialog = false
        }
    },
    components: { dialogDelete, productInformationBoxAdder, reportBug }
}
</script>

<style scoped>

    .centred750{
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        min-height: calc( 100vh - 64px );
        font-family: 'Quicksand', sans-serif !important;
        display: grid;
    }

    .valueInDialog img{
        max-height: 200px;
        max-width: 100%;
        margin: auto;
    }

    .buttonDIALOG{
        width: 100%;
        position: fixed;
        bottom: 5px;
        left: 50%;
        transform: translate(-50%);
        background: #fff;
    }

    .buttonDIALOG button{
        width: calc( 100% - 16px );
        margin: 0 8px;
    }

    .centred750 .titleOfSite{
        grid-template-columns: 100%;
    }
    
    .centred750 .titleOfSite p{
        width: 100%;
    }

    .v-dialog,
    .v-dialog--scrollable{
        background: #fff !important;
    }

    .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined){
        background-color: #333;
        color: #fff;
    }

    .v-sheet.v-card:not(.v-sheet--outlined){
        box-shadow: none;
    }

    .deleteButton{
        width: 100%;
        margin: 15px 0;
        display: grid;
    }

    .deleteButton v-btn{
        margin: auto;
    }

    .dialogMenu{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        height: 51px;
        border-top: 1px solid #e4e4e4;
    }

    .dialogMenu .v-btn{
        margin: auto;
    }

</style>