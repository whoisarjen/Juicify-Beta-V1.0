<template>
    <div class="nutrition_diary">
            <div class="weAreNotSupportingThisDate" v-if="weAreNotSupportingThisDate">
                <div class="weAreNotSupportingThisDateText">{{this.$t("error_notify.dateMAXlimit")}}</div>
                <v-btn @click='$router.push({ name: "home" })'>OK!</v-btn>
            </div>
        <div class="contenerLOGGED">
            <div class="titleOfSite">
                <p>{{ $t("nutrition_diary.title") }}</p>
                <div v-if="this.$store.state.userToken.login != this.$route.params.login"/>
                <shareButton/>
                <selectDaysToPasteValue v-if="this.$store.state.userToken.login == this.$route.params.login" :foodInThisDay="straightSortedArray" :key="selectDaysToPasteValueKEY" @refresh="hideAddProductsAndRefresh"/>
                <calendarDATEchange v-bind:whereToGo="'/'+this.$route.params.login+'/nutrition_diary/'" />
            </div>
            <fastDATEchange v-bind:today="this.$route.params.date" v-bind:whereToGo="this.$route.params.login+'/nutrition_diary'"/>
            <nutritionDiaryCircular
                @addBurnedCalories="addBurnedCalories"
                v-bind:items="straightSortedArray"
                @reload="loadnutrition_diary"
            />
            <nutritionDiaryBOX
                v-for="(item, index) in meal_number"
                v-bind:key="item"
                @deletedFROMnutrition_diary="deletedFROMnutrition_diary"
                v-bind:sortedArray="sortedArray[index]"
                v-bind:mealNumber="index"
                @openDialogAddProducts="openDialogAddProducts(index)"
            />

            <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
                scrollable
            >
                <v-card tile>
                    <div class="dialogBackground">
                        <div class="centred750">
                            <addProducts
                                :selected="selected"
                                @hideAddProducts="hideAddProducts"
                                @hideAddProductsAndRefresh="hideAddProductsAndRefresh"
                            />
                            <div class="buttonDIALOG">
                                <v-btn
                                    class="rounded-pill ma-2"
                                    @click="dialog = false"
                                    >
                                    {{$t("universal.close")}}
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-dialog>
            <guestBanner/>
            <waterAdder :key="waterAdderKey" v-if="this.$store.state.userToken.login == this.$route.params.login && !weAreNotSupportingThisDate  && this.$store.state.userToken.water_adder"/>
        </div>
    </div>
</template>
<script>
import shareButton from '@/components/universal/shareButton'
import guestBanner from '@/components/universal/guestBanner'
import waterAdder from '@/components/nutrition_diary/waterAdder'
import fastDATEchange from '@/components/nutrition_diary/fastDATEchange'
import calendarDATEchange from '@/components/nutrition_diary/calendarDATEchange'
import selectDaysToPasteValue from '@/components/nutrition_diary/selectDaysToPasteValue'
import nutritionDiaryCircular from '@/components/nutrition_diary/nutritionDiaryCircular'
import nutritionDiaryBOX from '@/components/nutrition_diary/nutritionDiaryBOX'
import addProducts from '@/components/nutrition_diary/add-products'
export default {
    name: 'nutrition_diary',
    data: () => ({
        meal_number: 0,
        sortedArray: [],
        dialog: false,
        selected: 0,
        waterAdderKey: 'waterAdderKey',
        selectDaysToPasteValueKEY: 'selectDaysToPasteValueKEY',
        weAreNotSupportingThisDate: false
    }),
    components: {
        nutritionDiaryCircular,
        nutritionDiaryBOX,
        calendarDATEchange,
        fastDATEchange,
        addProducts,
        shareButton,
        guestBanner,
        waterAdder,
        selectDaysToPasteValue
    },
    computed:{
        straightSortedArray(){
            let array = []
            if(this.sortedArray.length>0){
                for(let i=0; i<this.sortedArray.length; i++){
                    if(this.sortedArray[i].length>0){
                        for(let a=0; a<this.sortedArray[i].length; a++){
                            array.push(this.sortedArray[i][a])
                        }
                    }
                }
            }
            return array
        }
    },
    methods: {
        addBurnedCalories(value){
            this.sortedArray[0].unshift(value[0])
        },
        deletedFROMnutrition_diary(array){
            if(array){
                for(let i=0;i<this.sortedArray.length;i++){
                    if(this.sortedArray[i] == array.meal){
                        for(let a=0;a<this.sortedArray[i].length;a++){
                            if(this.sortedArray[i][a].id == array.id){
                                this.sortedArray[i].splice(a, 1)
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        },
        async loadnutrition_diary(){
            return new Promise(resolve => {
                (async () => {
                    this.waterAdderKey = 'waterAdderKey' + await this.$currentTime()
                    try{
                        let meal_number = 10
                        if(this.$store.state.userToken.meal_number) meal_number = parseInt(this.$store.state.userToken.meal_number)
                        let array = await this.$properlyValueLoader(this.$route.params.date, this.$route.params.date, 1, false, this.$route.params.login, this.$route.params.date)
                        if(new Date(this.$dateMAXlimit).getTime() >= new Date(this.$route.params.date).getTime()){
                            if(array.nutrition_diary && array.nutrition_diary.length>0){
                                for(let i=0;i<array.nutrition_diary.length;i++){
                                    if(array.nutrition_diary[i].meal + 1 > meal_number) meal_number = array.nutrition_diary[i].meal + 1
                                    if(array.nutrition_diary[i].deleted) array.nutrition_diary.splice(i, 1)
                                }
                            }else array.nutrition_diary = []
                            this.meal_number = meal_number
                        }else{
                            this.meal_number = 0 
                            this.weAreNotSupportingThisDate = true
                        }
                        await this.loopnutrition_diary(array.nutrition_diary)
                        this.waterAdderKey = 'selectDaysToPasteValueKEY' + await this.$currentTime()
                    }catch{
                        this.sortedArray = []
                    }
                })();
                resolve();
            })
        },
        loopnutrition_diary(arrayWithnutrition_diary){
            this.sortedArray = []
            for(let i=0;i<this.meal_number;i++){
                let emptyArray = []
                this.sortedArray.push(emptyArray)
                for(let a=0;a<arrayWithnutrition_diary.length;a++){
                    if(!arrayWithnutrition_diary[a].deleted){
                        if(!arrayWithnutrition_diary[a].p) arrayWithnutrition_diary[a].p = 0
                        if(!arrayWithnutrition_diary[a].c) arrayWithnutrition_diary[a].c = 0
                        if(!arrayWithnutrition_diary[a].f) arrayWithnutrition_diary[a].f = 0
                        if(arrayWithnutrition_diary[a].calories && arrayWithnutrition_diary[a].calories < 0 && i == 0){
                            this.sortedArray[0].unshift(arrayWithnutrition_diary[a])
                        }else if(i == arrayWithnutrition_diary[a].meal){
                            this.sortedArray[i].push(arrayWithnutrition_diary[a])
                        }
                    }
                }
            }
        },
        openDialogAddProducts(index){
            this.selected = index + 1
            this.dialog = true
        },
        async hideAddProducts(){
            this.dialog = false
        },
        async hideAddProductsAndRefresh(){
            await this.loadnutrition_diary();
            this.dialog = false
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
    watch: {
        '$route': async function(){
            await this.loadnutrition_diary();
        },
        '$store.state.daily_measurementFLAG': async function(){
            await this.loadnutrition_diary();
        },
        '$store.state.settingsFLAG': async function(){
            await this.loadnutrition_diary();
        },
    },
    beforeRouteEnter (to, from, next) { 
        next(vm => {
            vm.checkCoachTutorial()
            vm.loadnutrition_diary();
            next();
        }) 
    }
}
</script>

<style scoped>

    .centred750{
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        font-family: 'Quicksand', sans-serif !important;
    }

    .buttonDIALOG{
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        background: #fff;
    }

    .buttonDIALOG button{
        width: calc( 100% - 16px );
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

    .weAreNotSupportingThisDate{
        position: fixed;
        width: 100%;
        padding: 0 40px;
        height: 100%;
        background: #fff;
        z-index: 99999999;
        display: grid;
        top: 0;
        left: 0;
        grid-template-rows: 1fr 1fr;
    }

    .weAreNotSupportingThisDateText{
        margin: auto auto 0;
        text-align: center;
    }

    .weAreNotSupportingThisDate .v-btn{
        margin-top: auto;
        margin-bottom: auto;
    }

    .nutrition_diary .titleOfSite{
        grid-template-columns: auto 44px 44px 44px;
    }

</style>