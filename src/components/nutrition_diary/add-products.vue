<template>
    <div class="add-products">
        <productInformationBox v-if="ShowObjectWithProduct" :objectProduct="objectWithProductToShow" :key="ShowObjectWithProductKEY" @loadDefaultValues="loadDefaultValues()"/>
        <div class="titleOfSite">
            <p>{{$t("add_product.title")}}</p>
        </div>
        <v-container fluid>
            <v-row align="center">
                <v-col
                    cols="12"
                >
                    <v-select
                        :items="selectITEMS"
                        label="Dodaj do"
                        v-model="selected"
                        item-text="text"
                        item-value="value"
                        hide-details
                        dense
                        outlined
                    ></v-select>
                </v-col>
            </v-row>
        </v-container>
        <div class="overlayProductsChoiced">
            <div class="productsChoiced"><p>{{$t("universal.selected")}} {{  arrayTOadd.length  }}: </p><input v-show="arrayTOadd.length>0"  @click="loadDefaultValues" :value='$t("universal.clear")' class="rounded-pill" type="button" /></div>
            <v-chip
                style="margin: 10px 5px 0 0"
                v-for="(product, index) in arrayTOadd" 
                v-bind:key="product._id"
                close
                @click:close="deleteFromArrayTOadd(index)"
            >
                {{product.name}} {{product.how_many * 100}}g
            </v-chip>
        </div>
            <v-tabs v-model="tab" grow>
                <v-tab>
                    {{$t("universal.everything")}}
                </v-tab>
                <v-tab style="display: grid; grid-template-columns: 44px auto;">
                    <i style="color: #e99123" class="fas fa-star"></i><span>{{$t("universal.favourite")}}</span>
                </v-tab>
            </v-tabs>
        <v-text-field
            v-model="search"
            @input="loadSearchedValue()"
            append-icon="mdi-magnify"
            :label='$t("universal.search")'
            single-line
            :disabled="searchDisabled"
            hide-details
            clearable
            @click:clear="loadDefaultValues()"
            :loading="search.length > 2 && circularLoader"
        ></v-text-field>
        <div class="buttonOverMenu" v-show="arrayTOadd.length>0" @click="submitNewFood">
            <v-btn
                :loading="submitNewFoodLoader"
                class="rounded-pill ma-2"
                color="primary"
                >
                {{$t("universal.confirm")}} ({{ arrayTOadd.length }})
            </v-btn>
        </div>
        <v-progress-circular
            class="divWithImageCircular"
            v-show="circularLoader"
            indeterminate
            color="#e4e4e4"
        ></v-progress-circular>
        <v-tabs-items v-model="tab">
            <v-tab-item>
                <productsBOX
                    v-for="item in filteredList" :key="item._id + loadedProductsKEY"
                    :productITEM="item"
                    @checkBoxedIT="checkBoxedIT"
                    @addToFavourite="addToFavourite(item)"
                    @deleteFromFavourite="deleteFromFavourite(item)"
                    @HideObjectWithProduct="ShowObjectWithProduct = false"
                    @showMoreInfo="showMoreInfo(item)"
                    @changeValueOfarrayTOadd="changeValueOfarrayTOadd"
                />
                <div v-if="!this.$store.state.online" style="margin: 20px 0; text-align: center; color: #a4a4a4;">
                    {{this.$t("add_product.notFoundInCacheWhileOffline")}}
                    <div>
                        <v-chip @click="changeSearch(item._id)" style="margin: 5px 5px 0 0" v-for="item in prevUsedWords" :key="item._id">{{ item._id }}</v-chip>
                    </div>
                </div>
            </v-tab-item>
            <v-tab-item>
                <productsBOX
                    v-for="item in filteredListForFavourite" :key="item._id + loadedProductsKEY"
                    :productITEM="item"
                    @checkBoxedIT="checkBoxedIT"
                    @addToFavourite="addToFavourite(item)"
                    @deleteFromFavourite="deleteFromFavourite(item)"
                    @HideObjectWithProduct="ShowObjectWithProduct = false"
                    @showMoreInfo="showMoreInfo(item)"
                    @changeValueOfarrayTOadd="changeValueOfarrayTOadd"
                />
                <div v-if="!this.$store.state.online" style="margin: 20px 0; text-align: center; color: #a4a4a4;">{{this.$t("add_product.notFoundInCacheWhileOffline")}}</div>
            </v-tab-item>
        </v-tabs-items>
        <addCustomeProduct v-if="showAddCustomProduct" @close="showAddCustomProduct = false" @madeProduct="madeProductFunction"/>
        <div style="display: grid; margin: 10px 0; width: 100%;">        
            <v-btn
                style="margin: auto;"
                class="rounded-pill"
                v-if="this.$store.state.online"
                color="primary"
                @click="showAddCustomProduct = true"
            >
                {{$t("add_product.create")}}
            </v-btn>
        </div>
    </div>
</template>

<script>
import productsBOX from '@/components/nutrition_diary/products/productsBOX'
import addCustomeProduct from '@/components/nutrition_diary/products/addCustomeProduct'
import productInformationBox from '@/components/nutrition_diary/products/productInformationBox'
export default {
    components: {
        productsBOX,
        addCustomeProduct,
        productInformationBox
    },
    name: 'add-products',
    data: () => ({
        showAddCustomProduct: false,
        circularLoader: true,
        ShowObjectWithProduct: false,
        ShowObjectWithProductKEY: 0,
        objectWithProductToShow: {},
        tab: 0,
        arrayTOadd: [],
        addCustomProductButton: false,
        selectITEMS: [],
        search: '',
        searchDisabled: false,
        arrayWithFavouriteProducts: [],
        submitNewFoodLoader: false,
        loadSearchedValueTimer: '',
        loadedProducts: [],
        loadedProductsKEY: 0,
        prevUsedWords: []
    }),
    props: {
        selected: Number
    },
    methods: {
        changeSearch(value){
            this.search = value
            this.loadSearchedValue()
        },
        async submitNewFood(){
            this.submitNewFoodLoader = true
            if(this.$dateMINlimit > this.$route.params.date && !this.$store.state.online){
                this.$notification("alert", this.$t('add_product.limit_of_days'))
                this.$emit("hideAddProducts")
            }else{
                let originalTOadd = JSON.parse(JSON.stringify(this.arrayTOadd));
                this.arrayTOadd.map((x) => {
                    x.meal = this.selected - 1
                    x.product_ID = x._id
                    x.whenAdded = this.$route.params.date
                    if(x.how_many <= 0) x.how_many = 1
                    return x
                })

                await this.$daily_measurement(
                    this.arrayTOadd,
                    "nutrition_diary",
                    "add"
                )
                let last_used_product = (await this.$getAllIndexedDB("last_used_product")).sort((a, b) => b.last_used_product - a.last_used_product);
                if(last_used_product.length>0){
                    for(let i=0; i<last_used_product.length; i++){
                        await this.$deleteIndexedDB("last_used_product", last_used_product[i]._id)
                    }
                }
                originalTOadd = originalTOadd.concat(last_used_product)
                let ids = originalTOadd.map(o => o._id)
                originalTOadd = originalTOadd.filter(({_id}, index) => !ids.includes(_id, index + 1))
                originalTOadd.slice(0, 10)
                const time = await this.$currentTime()
                await this.$addIndexedDB("last_used_product", originalTOadd.map((x) => {
                    x.last_used_product = time
                    if(x.checked) delete x.checked
                    return x
                }))
                this.$store.state.barsCarloriesFLAG = await this.$currentTime()
                this.$emit("hideAddProductsAndRefresh")
                this.loadDefaultValues()
            }
            this.submitNewFoodLoader = false
        },

        async addToFavourite(value){
            let response = (await this.$insertThoseIDStoDB("favourite_product", [{"product_ID": JSON.parse(JSON.stringify(value))._id}]))[0]
            response.favourite_ID = response._id
            response._id = response.product_ID
            if(!response.user_ID) response.user_ID = '0'
            this.arrayWithFavouriteProducts.unshift(response)
        },

        async deleteFromFavourite(item){
            for(let i=0; i<this.arrayWithFavouriteProducts.length; i++){
                if(this.arrayWithFavouriteProducts[i]._id == item._id){
                    await this.$deleteThoseIDSfromDB("favourite_product", [{
                        "_id": this.arrayWithFavouriteProducts[i].favourite_ID
                    }])
                    this.arrayWithFavouriteProducts.splice(i, 1)
                    break;
                }
            }
        },

        async madeProductFunction(nameOfNewProduct){
            this.showAddCustomProduct = false;
            this.search = nameOfNewProduct
            this.loadedProducts = (await this.$getAllIndexedDB("last_used_product")).sort((a, b) => b.last_used_product - a.last_used_product);
        },

        changeValueOfarrayTOadd(value){
            for(let i=0; i<this.arrayTOadd.length; i++){
                if(this.arrayTOadd[i]._id == value._id){
                    let object = this.arrayTOadd[i]
                    object.how_many = value.how_many
                    this.arrayTOadd.splice(i, 1)
                    this.arrayTOadd.push(object)
                    break;
                }
            }
        },

        checkBoxedIT(value){
            let checker = 0;
            for(let i=0;i<this.arrayTOadd.length;i++){
                if(this.arrayTOadd[i]._id == value._id){
                    checker++;
                    this.arrayTOadd.splice(i, 1)
                    break;
                }
            }
            if(checker == 0) this.arrayTOadd.push(value)
        },

        showMoreInfo(object){
            this.objectWithProductToShow = object
            this.ShowObjectWithProductKEY += 1
            this.ShowObjectWithProduct = true
        },

        deleteFromArrayTOadd(index){
            this.arrayTOadd.splice(index, 1)
            this.loadedProductsKEY++
        },

        async loadSearchedValue(){
            clearTimeout(this.loadSearchedValueTimer)
            if(this.search === null) this.search = ''
            if(this.search && this.search.trimEnd().trimStart().length>2){
                let lookingFor = this.search
                lookingFor = lookingFor.toLowerCase()
                const cache = await this.$getIndexedDBbyID("cache_product", lookingFor.trimEnd().trimStart())
                if(cache && cache.whenAdded >= this.dateCacheProduct || !this.$store.state.online){
                    let product = await this.$getAllIndexedDB("product")
                    product = product.filter(x => x.name.toLowerCase().includes(lookingFor.trimEnd().trimStart()))
                    if(product && product.length > 0 && cache.array && cache.array.length > 0) cache.array = cache.array.slice(0, 10 - product.length)
                    cache.array = product.concat(cache.array)

                    this.loadedProducts = cache.array.map((x) => {
                        if(!x.user_ID) x.user_ID = 0
                        return x
                    })
                    this.circularLoader = false
                }else if(this.$store.state.online){
                    this.loadedProducts = []
                    this.circularLoader = true
                    this.loadSearchedValueTimer = setTimeout(async () => {
                        this.searchDisabled = true
                        lookingFor = lookingFor.trimEnd().trimStart()
                        await this.$http.post('requests/find/product', {
                            key: lookingFor,
                            refresh_jwt: this.$cookies.get('refresh_jwt'),
                            user_ID: this.$store.state.userToken._id
                        })
                        .then(async (res) => {
                            let original_res = JSON.parse(JSON.stringify(res));
                            let product = await this.$getAllIndexedDB("product")
                            product = product.filter(x => x.name.toLowerCase().includes(lookingFor))
                            if(product && product.length > 0 && res.data.item && res.data.item.length > 0) res.data.item = res.data.item.slice(0, 10 - product.length)
                            res.data.item = product.concat(res.data.item)

                            res.data.item = res.data.item.map((x) => {
                                if(!x.user_ID) x.user_ID = 0
                                return x
                            })

                            res.data.item = res.data.item.sort((a, b) => a.name.length - b.name.length);
                            original_res.data.item = original_res.data.item.sort((a, b) => a.name.length - b.name.length);

                            if(await this.$getIndexedDBbyID("cache_product", lookingFor)) await this.$deleteIndexedDB("cache_product", lookingFor)
                            await this.$addIndexedDB("cache_product", [{
                                "_id": lookingFor,
                                "whenAdded": await this.$getCorrectDate(),
                                "array": original_res.data.item
                            }])
                            let allCachedProducts = await this.$getAllIndexedDB("cache_product")
                            if(allCachedProducts && allCachedProducts.length > 300){
                                allCachedProducts = allCachedProducts.splice(0, allCachedProducts.length - 300)
                                for(let i=0; i<allCachedProducts.length; i++){
                                    await this.$deleteIndexedDB("cache_product", allCachedProducts[i]._id)
                                }
                            }
                            this.loadedProducts = res.data.item
                        })
                        .finally(() => {
                            this.circularLoader = false
                            this.searchDisabled = false
                        })
                    }, 1100)
                }
            }else{
                this.loadedProducts = (await this.$getAllIndexedDB("last_used_product")).sort((a, b) => b.last_used_product - a.last_used_product);
                this.circularLoader = false
            }
        },

        async loadDefaultValues(){
            this.circularLoader = true
            this.addCustomProductButton = false
            this.arrayTOadd = []
            this.selectITEMS = []
            this.loadedProducts = []
            this.arrayWithFavouriteProducts = []
            this.search = ''
            this.loadedProductsKEY++
            for(var i=1;i<parseInt(this.$store.state.userToken.meal_number)+1;i++){
                this.selectITEMS[i-1] = {
                    "text": this.$t("nutrition_diary.meal") + " " + i,
                    "value": i
                }
            }
            let favourite_product = await this.$getAllIndexedDB("favourite_product")
            this.arrayWithFavouriteProducts = favourite_product.map((x) => {
                x.favourite_ID = x._id
                x._id = x.product_ID
                if(!x.user_ID) x.user_ID = '0'
                return x
            }).sort((a, b) => b.user_ID.localeCompare(a.user_ID) || a.name.length - b.name.length || a.name.localeCompare(b.name));
            this.loadedProducts = (await this.$getAllIndexedDB("last_used_product")).sort((a, b) => b.last_used_product - a.last_used_product);
            this.circularLoader = false
            this.addCustomProductButton = true;

            this.prevUsedWords = (await this.$getAllIndexedDB("cache_product")).slice(0, 10)
        }
    },
    computed: {
        filteredList(){
            let filteredList = this.loadedProducts.map((x) => {
                x.checked = false
                x.favourite = false
                return x
            })
            if(this.arrayTOadd.length>0){
                for(let i=0; i<this.arrayTOadd.length; i++){
                    for(let a=0; a<filteredList.length; a++){
                        if(this.arrayTOadd[i]._id == filteredList[a]._id){
                            filteredList[a].checked = true
                            filteredList[a].how_many = this.arrayTOadd[i].how_many
                            break;
                        }
                    }
                }
            }
            if(this.arrayWithFavouriteProducts.length>0){
                for(let i=0; i<this.arrayWithFavouriteProducts.length; i++){
                    if(filteredList.length>0){
                        for(let a=0; a<filteredList.length; a++){
                            if(this.arrayWithFavouriteProducts[i]._id == filteredList[a]._id){
                                filteredList[a].favourite = true
                                break;
                            }
                        }
                    }
                }
            }
            return filteredList
        },
        filteredListForFavourite(){
            let array = []
            if(this.arrayWithFavouriteProducts.length>0){
                let filter = v => (!v.deleted && v.name.toLowerCase().includes(this.search.toLowerCase()));
                let filterMax = (fn, c) => x => c && fn(x) && c--;
                array = this.arrayWithFavouriteProducts.filter(filterMax(filter, 10));
                array = array.map(x => {
                    x.checked = false
                    x.favourite = true
                    x._id = x.product_ID
                    return x
                })
                if(this.arrayTOadd.length>0){
                    for(let a=0;a<array.length;a++){
                        for(let i=0;i<this.arrayTOadd.length;i++){
                            if(array[a]._id == this.arrayTOadd[i]._id){
                                array[a].checked = true;
                                array[a].how_many = this.arrayTOadd[i].how_many
                                break;
                            }
                        }
                    }
                }
            }
            return array
        }
    },
    mounted(){
        this.loadDefaultValues();
    },
    watch: {
        '$store.state.favourite_productFLAG': function(){
            this.loadDefaultValues()
        },
    }
}

</script>

<style scoped>

    .v-tab{
        border-bottom: 1px solid #E4E4E4;
    }

    .add-products{
        padding: 12px 12px 54px;
    }

    .overlayProductsChoiced{
        margin-top: 10px;
        min-height: 36px;
    }

    .productsChoiced{
        display: grid;
        grid-template-columns: auto auto;
        min-height: 36px;
    }

    .productsChoiced p{
        margin: auto 0;
    }

    .productsChoiced input{
        border-radius: 4px;
        padding: 8px 0;
        text-transform: uppercase;
        font-size: 0.75rem;
        background: #e99123;
        color: #fff;
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }

    .add-products .container{
        padding: 0 !important;
    }

    .v-window-item{
        display: grid;
    }

    .divWithImageCircular{
        margin: 10px auto auto;
    }

</style>