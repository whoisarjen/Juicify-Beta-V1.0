<template>
    <div class="productsBOX" v-if="!productITEM.deleted">
        <v-lazy
            v-model="isActive"
            :options="{
                threshold: .5
            }"
            min-height="88"
            transition="fade-transition"
        >
            <div class="BoxProductAdding" :style='[productITEM.user_ID == this.$store.state.userToken._id ? { "border-left": "5px solid rgb(233, 145, 35)" } : productITEM.v ? { "border-left": "5px solid #4caf50" } : {}]'>
                <div class="BoxProductAddingGrid">{{productITEM.name}}</div>
                <div class="BoxProductAddingGrid" @click="deleteFromFavourite()" v-if="productITEM.favourite"><v-btn icon><v-icon style="color: #e99123">fas fa-star</v-icon></v-btn></div>
                <div class="BoxProductAddingGrid" @click="addToFavourite()" v-else><v-btn icon><v-icon>far fa-star</v-icon></v-btn></div>
                <div class="BoxProductAddingGrid" @click="showMoreInfo()"><v-btn icon><v-icon>fas fa-info-circle</v-icon></v-btn></div>
                <div/>
                <div class="BoxProductAddingGrid"><input type="number" @input="checkValue()" v-model="productITEM.how_many" placeholder="1"></div>
                <div class="BoxProductAddingGrid">
                    <v-checkbox v-model="productITEM.checked" @change="selectProdukt()"></v-checkbox>
                </div>
                <div class="BoxProductAddingGrid">
                    <span v-if="productITEM.p">{{productITEM.p.toFixed(1)}}</span><span v-else>0.0</span>{{$t("universal.proteins_short")}} 
                    <span v-if="productITEM.c">{{productITEM.c.toFixed(1)}}</span><span v-else>0.0</span>{{$t("universal.carbs_short")}} 
                    <span v-if="productITEM.f">{{productITEM.f.toFixed(1)}}</span><span v-else>0.0</span>{{$t("universal.fats_short")}} | 100g/ml
                </div>
            </div>
        </v-lazy>
    </div>
</template>

<script>
export default {
    name: 'productsBOX',
    data: () => {
        return {
            isActive: false
        }
    },
    props: {
        productITEM: Object
    },
    methods: {
        selectProdukt(){
            let object = JSON.parse(JSON.stringify(this.productITEM))
            parseFloat(this.productITEM.how_many) ? object.how_many = parseFloat(this.productITEM.how_many) : object.how_many = 1
            this.$emit('checkBoxedIT', object)
        },
        async addToFavourite(){
            this.$emit('addToFavourite');
            this.productITEM.favourite = true
            this.$forceUpdate();
        },
        async deleteFromFavourite(){
            this.$emit('deleteFromFavourite');
            this.productITEM.favourite = false
            this.$forceUpdate();
        },
        async showMoreInfo(){ this.$emit("showMoreInfo") },
        checkValue(){
            if(this.productITEM.how_many && parseFloat(this.productITEM.how_many) < 0 || parseFloat(this.productITEM.how_many) > 30) this.productITEM.how_many = 1
            if(this.productITEM.checked){
                this.$emit('changeValueOfarrayTOadd', {
                    "_id": this.productITEM._id,
                    "how_many": this.productITEM.how_many
                });
            }
        }
    }
}
</script>

<style scoped>

    .v-text-field.v-text-field--enclosed .v-text-field__details{
        display: none !important;
    }

    .productsBOX .add-product .d-flex{
        padding-bottom: 0;
    }

    .productsBOX .add-product .v-input{
        padding-top: 0;
    }

    .productsBOX .add-product .v-text-field__details{
        display: none;
    }

    .productsBOX .BoxProductAdding{
        width: 100%;
        padding: 10px 5px 10px 20px;
        border-radius: 4px;
        min-height: 1px;
        border: 1px solid #e4e4e4;
        display: grid;
        grid-template-columns: auto 30px 30px 6px 42px 42px;
        margin-top: 10px;
        position: relative;
    }

    .productsBOX .BoxProductAddingGrid{
        margin: auto;
        width: 100%;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(2){
        width: 100%;
        grid-column: 2;
        grid-row: 1 / 3;
        display: grid;
    }

    .productsBOX .v-btn{
        margin: auto;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(2) i{
        margin: auto;
        font-size: 1rem;
    }
    .productsBOX .BoxProductAddingGrid:nth-child(3) i{
        margin: auto;
        font-size: 1rem;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(3){
        width: 100%;
        grid-column: 3;
        grid-row: 1 / 3;
        display: grid;
    }
    
    .productsBOX .BoxProductAddingGrid:nth-child(4){
        width: 100%;
        grid-column: 4;
        grid-row: 1 / 3;
        display: grid;
    }
    
    .productsBOX .BoxProductAddingGrid:nth-child(5){
        width: 100%;
        height: 44px;
        line-height: 44px;
        border-radius: 4px;
        grid-column: 5;
        grid-row: 1 / 3;
    }

    .productsBOX .BoxProductAddingGrid input{
        margin: auto;
        text-align: center;
        width: 100%;
        background: #fff;
        border: 1px solid #e4e4e4;
    }

    .productsBOX .BoxProductAddingGrid i{
        margin: auto;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(1){
        margin: auto auto 0 0;
        font-size: 1rem;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(6){
        grid-column: 6;
        grid-row: 1 /3;
        padding-left: 10px;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(7){
        grid-column: 1 / 2;
        grid-row: 2;
        margin: 0 auto auto 0;
        font-size: 0.8rem;
        color: #a4a4a4;
    }

    .productsBOX .BoxProductAddingGrid .v-input__slot{
        margin-bottom: none;
        margin: 8px 0;
    }

    .productsBOX .BoxProductAdding .v-input--selection-controls__input{
        margin: auto !important;
    }

</style>