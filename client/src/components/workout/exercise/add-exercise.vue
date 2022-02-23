<template>
    <div class="addExercise">
        <div class="titleOfSite">
            <p>{{$t("add_exercise.title")}}</p>
        </div>
        <div class="overlayProductsChoiced">
            <div class="productsChoiced"><p>{{$t("universal.selected")}} {{  arrayTOadd.length  }}: </p><input v-show="arrayTOadd.length>0"  @click="loadDefaultValues" :value='$t("universal.clear")' class="rounded-pill" type="button" /></div>
            <v-chip
                style="margin: 10px 5px 0 0"
                v-for="(product, index) in arrayTOadd" 
                v-bind:key="product._id"
                close
                @click:close="deleteFromArrayTOadd(index)"
            >
                {{product.name}}
            </v-chip>
        </div>
        <v-text-field
            v-model="search"
            @input="loadSearchedValue"
            append-icon="mdi-magnify"
            :label='$t("universal.search")'
            single-line
            :disabled="searchDisabled"
            hide-details
            :loading="circularLoader"
            clearable
        ></v-text-field>
        <div class="buttonOverMenu" v-show="arrayTOadd.length>0" @click="submitNewExercisesToPlan">
            <v-btn
                class="rounded-pill ma-2"
                color="primary"
                >
                {{$t("universal.confirm")}} ({{ arrayTOadd.length }})
            </v-btn>
        </div>
        <div v-if="filteredArray.length > 0">
            <exerciseBox
                v-for="item in filteredArray"
                :key="item._id + loadedExerciseKEY"
                :exercise="item"
                @selectThisExercise="selectThisExercise(item)"
                @loadDefaultValues="loadDefaultValues"
            />
        </div>
        <addCustomeExercise v-if="showAddCustomeExerciseButton && this.$store.state.online" @loadDefaultValues="loadDefaultValues"/>
    </div>
</template>

<script>
import exerciseBox from '@/components/workout/exercise/exerciseBox'
import addCustomeExercise from '@/components/workout/exercise/add-custome-exercise'
export default {
    name: "addExercise",
    data: () => ({
        search: '',
        searchDisabled: false,
        arrayTOadd: [],
        loadedExercises: [],
        showAddCustomeExerciseButton: false,
        loadSearchedValueTimer: '',
        circularLoader: false,
        last_used_exercise: [],
        loadedExerciseKEY: 0
    }),
    computed: {
        filteredArray(){
            let array = []
            if(!this.search || this.search.length < 3){
                array = this.last_used_exercise
                for(let i=0; i<this.alreadyUsedExercises.length; i++){
                    for(let a=0; a<array.length; a++){
                        if(this.alreadyUsedExercises[i]._id == array[a]._id){
                            array.splice(a, 1)
                            break;
                        }
                    }
                }
            }else{
                array = this.loadedExercises
                for(let i=0; i<this.alreadyUsedExercises.length; i++){
                    for(let a=0; a<array.length; a++){
                        if(this.alreadyUsedExercises[i]._id == array[a]._id){
                            array.splice(a, 1)
                            break;
                        }
                    }
                }
            }
            array = array.map(x => {
                x.checked = false
                return x
            })
            if(this.arrayTOadd.length>0){
                for(let i=0; i<this.arrayTOadd.length; i++){
                    for(let a=0; a<array.length; a++){
                        if(this.arrayTOadd[i]._id == array[a]._id){
                            array[a].checked = true
                            break;
                        }
                    }
                }
            }
            return array
        }
    },
    methods:{
        async loadSearchedValue(){
            clearTimeout(this.loadSearchedValueTimer)
            if(this.search === null) this.search = ''
            if(this.search && this.search.trimEnd().trimStart().length>2){
                let lookingFor = this.search
                lookingFor = lookingFor.toLowerCase()
                const cache = await this.$getIndexedDBbyID("cache_exercise", lookingFor.trimEnd().trimStart())
                if(cache && cache.whenAdded >= this.dateCacheProduct || !this.$store.state.online){
                    let exercise = await this.$getAllIndexedDB("exercise")
                    exercise = exercise.filter(x => x.name.toLowerCase().includes(lookingFor.trimEnd().trimStart()))
                    if(exercise && exercise.length > 0 && cache.array && cache.array.length > 0) cache.array = cache.array.slice(0, 10 - exercise.length)
                    this.loadedExercises = exercise.concat(cache.array)
                    this.circularLoader = false
                }else if(this.$store.state.online){
                    this.loadedProducts = []
                    this.circularLoader = true
                    this.loadSearchedValueTimer = setTimeout(async () => {
                        this.searchDisabled = true
                        lookingFor = lookingFor.trimEnd().trimStart()
                        await this.$http.post('requests/find/exercise', {
                            key: lookingFor,
                            refresh_jwt: this.$cookies.get('refresh_jwt'),
                            user_ID: this.$store.state.userToken._id
                        })
                        .then(async (res) => {
                            const original_res = JSON.parse(JSON.stringify(res));
                            let exercise = await this.$getAllIndexedDB("exercise")
                            exercise = exercise.filter(x => x.name.toLowerCase().includes(lookingFor))
                            if(exercise && exercise.length > 0 && res.data.item && res.data.item.length > 0) res.data.item = res.data.item.slice(0, 10 - exercise.length)
                            this.loadedExercises = exercise.concat(res.data.item)

                            if(await this.$getIndexedDBbyID("cache_exercise", lookingFor)) await this.$deleteIndexedDB("cache_exercise", lookingFor)
                            await this.$addIndexedDB("cache_exercise", [{
                                "_id": lookingFor,
                                "whenAdded": await this.$getCorrectDate(),
                                "array": original_res.data.item
                            }])
                            let allCachedProducts = await this.$getAllIndexedDB("cache_exercise")
                            if(allCachedProducts && allCachedProducts.length > 100){
                                allCachedProducts = allCachedProducts.splice(0, allCachedProducts.length - 100)
                                for(let i=0; i<allCachedProducts.length; i++){
                                    await this.$deleteIndexedDB("cache_exercise", allCachedProducts[i]._id)
                                }
                            }
                        })
                        .finally(() => {
                            this.circularLoader = false
                            this.searchDisabled = false
                        })
                    }, 1100)
                }
            }else{
                this.loadedExercises = (await this.$getAllIndexedDB("last_used_exercise")).sort((a, b) => b.last_used_exercise - a.last_used_exercise);
                this.circularLoader = false
            }
        },
        async submitNewExercisesToPlan(){
            let last_used_exercise = (await this.$getAllIndexedDB("last_used_exercise")).sort((a, b) => b.last_used_exercise - a.last_used_exercise);
            if(last_used_exercise.length>0){
                for(let i=0; i<last_used_exercise.length; i++){
                    await this.$deleteIndexedDB("last_used_exercise", last_used_exercise[i]._id)
                }
            }
            
            let originalTOadd = JSON.parse(JSON.stringify(this.arrayTOadd));
            originalTOadd = originalTOadd.concat(last_used_exercise)
            let ids = originalTOadd.map(o => o._id)
            originalTOadd = originalTOadd.filter(({_id}, index) => !ids.includes(_id, index + 1))
            originalTOadd.slice(0, 10)
            const time = await this.$currentTime()
            await this.$addIndexedDB("last_used_exercise", originalTOadd.map((x) => {
                x.last_used_exercise = time
                if(x.checked) delete x.checked
                return x
            }))
            this.$emit('addThoseExercisesToPlan', this.arrayTOadd)
            this.loadDefaultValues()
        },
        async selectThisExercise(item){
            if(item.checked){
                for(let i=0; i<this.arrayTOadd.length; i++){
                    if(this.arrayTOadd[i]._id == item._id){
                        this.arrayTOadd.splice(i, 1)
                        break;
                    }
                }
            }else this.arrayTOadd.push(item)
        },
        async loadDefaultValues(nameOfNewExercise){
            this.showAddCustomeExerciseButton = false
            this.arrayTOadd = []
            this.last_used_exercise = (await this.$getAllIndexedDB("last_used_exercise")).reverse()
            this.showAddCustomeExerciseButton = true
            this.loadedExerciseKEY++
            if(nameOfNewExercise){
                this.search = nameOfNewExercise
                this.loadSearchedValue()
            }
        },

        deleteFromArrayTOadd(index){
            this.arrayTOadd.splice(index, 1)
            this.loadedExerciseKEY++
        },
    },
    async mounted(){
        await this.loadDefaultValues()
    },
    components: {
        exerciseBox,
        addCustomeExercise
    },
    props: {
        alreadyUsedExercises: Array
    }
}
</script>

<style scoped>

    .addExercise{
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

</style>