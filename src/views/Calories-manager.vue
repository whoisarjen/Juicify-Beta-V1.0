<template>
    <div class="Calories-manager">
        <div class="BOX">
            <caloriesMANAGER
                v-for="(item, index) in items" :key="keyFOrMacro + index"
                :dayINFO="item"
                :day="index+1"
                @saveNEWmacro="saveNEWmacro"
                @saveNEWmacroForALL="saveNEWmacroForALL"
                :dayNAME="switchDAY(index+1)"
                class="BOXcard"/>
        </div>
        <ul>
            <li>{{$t("universal.proteins")}} (g)</li>
            <li>{{$t("universal.carbs")}} (g)</li>
            <li>{{$t("universal.fats")}} (g)</li>
            <li>{{$t("universal.calories")}}</li>
        </ul>
        <table class="table">
            <tr class="border_top">
                <td></td>
                <td>{{$t("universal.now")}}</td>
                <td>{{$t("universal.settled")}}</td>
            </tr>
            <tr class="border_top">
                <td>{{$t("calories_manager.average_consumption_of_proteins")}}:</td>
                <td>{{ allPROTEINS }}</td>
                <td v-if="allPROTEINSafter < allPROTEINS" class="less">{{ allPROTEINSafter }}</td>
                <td v-if="allPROTEINSafter > allPROTEINS" class="more">{{ allPROTEINSafter }}</td>
                <td v-if="allPROTEINSafter == allPROTEINS">{{ allPROTEINSafter }}</td>
            </tr>
            <tr class="border_top">
                <td>{{$t("calories_manager.average_consumption_of_carbs")}}:</td>
                <td>{{ allCARBS }}</td>
                <td v-if="allCARBSafter < allCARBS" class="less">{{ allCARBSafter }}</td>
                <td v-if="allCARBSafter > allCARBS" class="more">{{ allCARBSafter }}</td>
                <td v-if="allCARBSafter == allCARBS">{{ allCARBSafter }}</td>
            </tr>
            <tr class="border_top">
                <td>{{$t("calories_manager.average_consumption_of_fats")}}:</td>
                <td>{{ allFATS }}</td>
                <td v-if="allFATSafter < allFATS" class="less">{{ allFATSafter }}</td>
                <td v-if="allFATSafter > allFATS" class="more">{{ allFATSafter }}</td>
                <td v-if="allFATSafter == allFATS">{{ allFATSafter }}</td>
            </tr>
            <tr class="border_top">
                <td>{{$t("calories_manager.average_consumption_of_calories")}}:</td>
                <td>{{ allCALORIES }}</td>
                <td v-if="allCALORIESafter < allCALORIES" class="less">{{ allCALORIESafter }}</td>
                <td v-if="allCALORIESafter > allCALORIES" class="more">{{ allCALORIESafter }}</td>
                <td v-if="allCALORIESafter == allCALORIES">{{ allCALORIESafter }}</td>
            </tr>
        </table>
        <v-btn
            v-if="(allPROTEINSafter != allPROTEINS) || (allCARBSafter != allCARBS) || (allFATSafter != allFATS)"
            class="buttonHERE rounded-pill"
            color="primary"
            dark
            :loading="saveCaloriesManagerLoading"
            @click="saveCaloriesManager"
        >
          Zapisz zmiany
        </v-btn>
    </div>
</template>

<script>
import caloriesMANAGER from '@/components/calories-manager/caloriesMANAGERbox'
export default {
    name: 'Calories-manager',
    data: () => ({
        items: Array,
        changeVALUE: false,
        loadedPROTEINS: 0,
        loadedCARBS: 0,
        loadedFATS: 0,
        allPROTEINS: 0,
        allCARBS: 0,
        allFATS: 0,
        allCALORIES: 0,
        allPROTEINSafter: 0,
        allCARBSafter: 0,
        allFATSafter: 0,
        allCALORIESafter: 0,
        keyFOrMacro: 0,
        saveCaloriesManagerLoading: false
    }),
    components:{
        caloriesMANAGER
    },
    methods:{
        async saveCaloriesManager(){
            this.saveCaloriesManagerLoading = true
            await this.$changeSETTINGS({
                "macronutrients": this.items
            })
            this.saveCaloriesManagerLoading = false
            await this.loadMANAGER()

        },
        countMACRO(){
            this.allPROTEINSafter = 0
            this.allCARBSafter = 0
            this.allFATSafter = 0
            this.allCALORIESafter = 0
            for(let i=0;i<this.items.length;i++){
                this.allPROTEINSafter += parseInt(this.items[i].proteins)
                this.allCARBSafter += parseInt(this.items[i].carbs)
                this.allFATSafter += parseInt(this.items[i].fats)
                this.allCALORIESafter += this.items[i].proteins * 4 + this.items[i].carbs * 4 + this.items[i].fats * 9
            }
            this.allPROTEINSafter = (this.allPROTEINSafter / 7).toFixed(0)
            this.allCARBSafter = (this.allCARBSafter / 7).toFixed(0)
            this.allFATSafter = (this.allFATSafter / 7).toFixed(0)
            this.allCALORIESafter = (this.allCALORIESafter / 7).toFixed(0)
        },
        saveNEWmacro(value){
            this.items[value.index].proteins = parseInt(value.array.proteins)
            this.items[value.index].carbs = parseInt(value.array.carbs)
            this.items[value.index].fats = parseInt(value.array.fats)
            this.countMACRO()
        },
        saveNEWmacroForALL(value){
            for(let i=0; i<this.items.length; i++){
                this.items[i].proteins = parseInt(value.array.proteins)
                this.items[i].carbs = parseInt(value.array.carbs)
                this.items[i].fats = parseInt(value.array.fats)
            }
            this.keyFOrMacro += 7
            this.countMACRO()
        },
        switchDAY(day){
            switch(day){
                case 1: return this.$t("days.monday_short")
                case 2: return this.$t("days.tuesday_short")
                case 3: return this.$t("days.wednesday_short")
                case 4: return this.$t("days.thursday_short")
                case 5: return this.$t("days.friday_short")
                case 6: return this.$t("days.saturday_short")
                case 7: return this.$t("days.sunday_short")
            }
        },
        async loadMANAGER(){
            let users_macronutrients = this.$store.state.userToken.macronutrients
            let proteins = 0
            let carbs = 0
            let fats = 0
            let calories = 0
            for(let i=0;i<users_macronutrients.length;i++){
                proteins += parseInt(users_macronutrients[i].proteins)
                carbs += parseInt(users_macronutrients[i].carbs) 
                fats += parseInt(users_macronutrients[i].fats)
                calories += users_macronutrients[i].proteins * 4 + users_macronutrients[i].carbs * 4 + users_macronutrients[i].fats * 9
            }
            this.allPROTEINS = ( proteins / 7 ).toFixed(0)
            this.allCARBS = ( carbs / 7 ).toFixed(0)
            this.allFATS = ( fats / 7 ).toFixed(0)
            this.allCALORIES = ( calories / 7 ).toFixed(0)
            this.items = users_macronutrients
            this.countMACRO()
        }
    },
    async mounted(){
        this.loadMANAGER()
    }
}
</script>

<style>

    .Calories-manager{
        padding: 12px;
        width: 100%;
        height: calc( ( 100vh - 44px ) - 44px );
        display: grid;
        grid-template-rows: 2.5fr 56px 1fr 56px;
    }

    .Calories-manager .ma-4{
        width: 40px !important;
    }

    .Calories-manager .BOX{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }

    .Calories-manager .BOXcard{
        height: calc( 100% - 10px );
        margin: 5px;
    }

    .Calories-manager ul{
        margin: 0 !important;
        padding: 0 !important;
        list-style-type: none;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        font-size: 0.75rem;
        text-align: center;
    }

    .Calories-manager li{
        margin: auto;
    }

    .Calories-manager td:nth-child(2){
        text-align: center;
    }

    .Calories-manager td:nth-child(3){
        text-align: center;
    }

    .Calories-manager li:before {
        content: '■';
        padding-right: 2px;
        color: #333;
        vertical-align: text-bottom;
    }

    .Calories-manager li:nth-child(1):before {
        color: #f9a85e;
    }

    .Calories-manager li:nth-child(2):before {
        color: #69d44b;
    }

    .Calories-manager li:nth-child(3):before {
        color: #1867c0;
    }

    .Calories-manager li:nth-child(4):before {
        color: #333;
    }

    .Calories-manager .table{
        font-size: 0.875rem;
        width: calc( 100% - 30px );
        margin: 0 15px;
        height: 100%;
    }

    .Calories-manager .buttonHERE{
        max-width: 200px;
        margin: 20px auto 0;
    }

    .Calories-manager tr.border_top td {
        border-top: 1px solid #e4e4e4;
        padding-top: 2px;
    }

    .Calories-manager tr.border_top:first-child td {
        border: none;
    }

    .Calories-manager tr.border_bottom td {
        padding-bottom: 2px;
    }

    .Calories-manager .less{
        color: green;
        font-weight: bold;
    }

    .Calories-manager .more{
        color: red;
        font-weight: bold;
    }

</style>