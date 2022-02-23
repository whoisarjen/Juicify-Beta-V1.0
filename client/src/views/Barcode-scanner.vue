<template>
    <div class="barcode-scanner">
        <StreamBarcodeReader
        @decode="(a, b, c) => onDecode(a, b, c)"
        @loaded="() => onLoaded()"
        ></StreamBarcodeReader>
        <div v-show="showSpinnerText" class="barcodeSpinner">
            {{ SpinnerText }}
        </div>
        <productInformationBox v-if="ShowObjectWithProduct" :objectProduct="objectWithProductToShow" @close="reOpenScanner" :key="productInformationBoxKey"/>
        <addCustomeProduct v-if="showAddCustomProduct" @close="reOpenScanner" :foundBarcode="foundBarcode"/>
        <v-dialog
            v-model="isBarcodeCorrectDialog"
            persistent
            max-width="500px"
            >
            <v-card>
                <v-card-title>
                <span class="headline">{{$t("add_product.barcode_check")}}</span>
                </v-card-title>
                <v-card-text>
                <v-container>
                    {{$t("add_product.barcode_check_description")}} {{foundBarcode}}
                </v-container>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="reOpenScanner()"
                >
                    {{$t("universal.deny")}}
                </v-btn>
                <v-btn
                    text
                    @click="barcodeIsCorrect()"
                >
                    {{$t("universal.confirm")}}
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import { StreamBarcodeReader } from "vue-barcode-reader";
import addCustomeProduct from '@/components/nutrition_diary/products/addCustomeProduct'
import productInformationBox from '@/components/nutrition_diary/products/productInformationBox'
export default {
    name: "barcode-scanner",
    components: {
        StreamBarcodeReader,
        addCustomeProduct,
        productInformationBox
    },
    data: () => ({
        showScanner: true,
        text: "",
        id: null,
        dialogCONFIRME: false,
        dialog: false,
        showSpinnerText: false,
        status: '',
        SpinnerText: '',
        objectWithProductToShow: {},
        ShowObjectWithProduct: false,
        foundBarcode: false,
        showAddCustomProduct: false,
        isBarcodeCorrectDialog: false,
        productInformationBoxKey: 0
    }),
    methods: {
        async onDecode(a) {
            if(parseInt(a) > 0 && this.showScanner){
                this.SpinnerText = this.$t("universal.loading") + "..."
                this.showScanner = false
                this.foundBarcode = false
                this.showAddCustomProduct = false
                if(this.$store.state.online){
                    await this.$http.post('requests/api/barcode', {
                        array: [{
                            barcode: a
                        }]
                    })
                    .then(async (response) => {
                        await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                        if(response.data.item && response.data.item.name){
                            this.objectWithProductToShow = response.data.item
                            this.ShowObjectWithProduct = true
                        }else{
                            this.foundBarcode = a
                            this.isBarcodeCorrectDialog = true
                        }
                    })
                    .catch(async (err) => {
                        await this.$catchThis(err)
                    })
                    .finally(() => this.SpinnerText = this.$t("barcode_scanner.scan_barcode") + "...")
                }else this.$notification("alert", this.$t('error_notify.not_available_in_offline'))
            }else this.SpinnerText = this.$t("barcode_scanner.scan_barcode") + "..."
        },
        onLoaded() {
            this.showSpinnerText = true
        },
        reOpenScanner(objectWithProduct){
            this.ShowObjectWithProduct = false
            this.objectWithProductToShow = false;

            if(objectWithProduct){
                this.objectWithProductToShow = JSON.parse(JSON.stringify(objectWithProduct));
                this.ShowObjectWithProduct = true
            }
            this.productInformationBoxKey += 1
            this.showScanner = true;
            this.dialog = false
            this.showAddCustomProduct = false
            this.isBarcodeCorrectDialog = false
        },
        barcodeIsCorrect(){
            this.showAddCustomProduct = true
            this.isBarcodeCorrectDialog = false
        },
        async checkCoachTutorial(){
            if(await this.$addDAYStoISO(await this.$dateTOiso(this.$store.state.userToken.registered), 30) > await this.$dateTOiso(new Date())){
                if(!localStorage.getItem('coach_tutorial')){
                    if(this.$store.state.userToken.coach == '2020-01-01'){
                        this.$notification("alert", this.$t('error_notify.checkCoachTutorial'))
                        this.$router.push("/coach")
                    }
                }else{
                    localStorage.removeItem('coach_tutorial');
                    if(this.$store.state.userToken.coach == '2020-01-01') this.$router.push("/coach")
                }
            }
        }
    },
    mounted(){
        this.checkCoachTutorial()
        this.lang = this.$store.state.userToken.lang
        this.SpinnerText = this.$t("barcode_scanner.scan_barcode") + "..."
    }
}
</script>

<style scoped>

    .barcode-scanner{
        display: grid;
        grid-template-rows: auto 1fr;
        min-height: calc( 100vh - 88px );
    }

    .barcodeSpinner{
        margin: auto;
    }

</style>