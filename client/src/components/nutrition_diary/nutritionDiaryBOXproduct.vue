<template>
    <div class="nutrition_diaryBOXproduct">
        <div class="loadAllnutrition_diaryElement">
            <div class="loadAllnutrition_diaryElementFirst" v-if="this.$route.params.login == this.$store.state.userToken.login && this.$route.params.date" @click="dialogDelete = true">
                <v-btn icon><v-icon>fas fa-edit</v-icon></v-btn>
                <nutritionDiaryBOXproductEdit
                    v-if="dialogDelete"
                    :product="nutrition_diaryElement"
                    @close="dialogDelete = false"
                />
            </div>
            <div class="loadAllnutrition_diaryElementFirst" v-else>
                <i class="fas fa-hamburger"></i>
            </div>
                <div class="loadAllnutrition_diaryElementFirst">
                <div class="loadAllnutrition_diaryElementSecond" style="color: rgb(226, 88, 34)" v-if="nutrition_diaryElement.calories < 0 && nutrition_diaryElement.activity">{{ nutrition_diaryElement.activity }}</div>
                <div class="loadAllnutrition_diaryElementSecond" style="color: rgb(226, 88, 34)" v-else-if="nutrition_diaryElement.calories < 0 && !nutrition_diaryElement.activity">{{ this.$t("burned.title") }}</div>
                <div class="loadAllnutrition_diaryElementSecond" style="color: rgb(76, 175, 80)" v-else-if="nutrition_diaryElement.calories > 0 && nutrition_diaryElement.activity">{{ nutrition_diaryElement.activity }}</div>
                <div class="loadAllnutrition_diaryElementSecond" style="color: rgb(76, 175, 80)" v-else-if="nutrition_diaryElement.calories > 0 && !nutrition_diaryElement.activity">{{ this.$t("quick_add.product_name") }}</div>
                <div class="loadAllnutrition_diaryElementSecond" v-else>{{ nutrition_diaryElement.name }}</div>
                <div class="loadAllnutrition_diaryElementSecond" v-if="nutrition_diaryElement.calories < 0"><div>{{nutrition_diaryElement.calories}}kcal</div></div>
                <div class="loadAllnutrition_diaryElementSecond" v-else-if="nutrition_diaryElement.calories > 0"><div>{{nutrition_diaryElement.calories}}kcal</div></div>
                <div class="loadAllnutrition_diaryElementSecond" v-else-if="nutrition_diaryElement.ethanol"><div>{{ ((nutrition_diaryElement.p * 4 + nutrition_diaryElement.c * 4 + nutrition_diaryElement.f * 9 + nutrition_diaryElement.ethanol * 7) * nutrition_diaryElement.how_many).toFixed() }}Kcal</div></div>
                <div class="loadAllnutrition_diaryElementSecond" v-else><div>{{ ((nutrition_diaryElement.p * 4 + nutrition_diaryElement.c * 4 + nutrition_diaryElement.f * 9) * nutrition_diaryElement.how_many).toFixed() }}Kcal</div></div>
                <div class="loadAllnutrition_diaryElementSecond" v-if="nutrition_diaryElement.calories">0B 0W 0T</div>
                <div class="loadAllnutrition_diaryElementSecond" v-else>{{ (nutrition_diaryElement.p * nutrition_diaryElement.how_many).toFixed(1) }}{{$t("universal.proteins_short")}} {{ (nutrition_diaryElement.c * nutrition_diaryElement.how_many).toFixed(1) }}{{$t("universal.carbs_short")}} {{ (nutrition_diaryElement.f * nutrition_diaryElement.how_many).toFixed(1) }}{{$t("universal.fats_short")}}</div>
                <div class="loadAllnutrition_diaryElementSecond" v-if="nutrition_diaryElement.calories">-</div>
                <div class="loadAllnutrition_diaryElementSecond" v-else>{{(Math.abs(100 * nutrition_diaryElement.how_many).toFixed(0))}}g/ml</div>
            </div>
        </div>
    </div>
</template>

<script>
import nutritionDiaryBOXproductEdit from '@/components/nutrition_diary/nutritionDiaryBOXproductEdit'
export default {
    name: 'nutrition_diaryBOXproduct',
    data: () => ({
        dialogDelete: false,
        deleteAcceptLoader: false
    }),
    props: {
        nutrition_diaryElement: Object
    },
    methods:{
        async deleteFROMnutrition_diary(_id){
            this.deleteAcceptLoader = true
            await this.$daily_measurement([{
                "_id": _id,
                "whenAdded": this.$route.params.date
            }],
                "nutrition_diary",
                "delete"
            )
            this.$emit('deletedFROMnutrition_diary')
            this.$store.state.barsCarloriesFLAG = await this.$currentTime()
            this.deleteAcceptLoader = false
            this.dialogDelete = false
        },
    },
    components: {
        nutritionDiaryBOXproductEdit
    }
}
</script>

<style scoped>

    .loadAllnutrition_diaryElement{
        width: 100%;
        min-height: 50px;
        border-top: 1px solid #e4e4e4;
        margin-top: 10px;
        padding: 15px 0 5px;
        display: grid;
        grid-template-columns: 44px auto;
    }

    .loadAllnutrition_diaryElementFirst{
        width: 100%;
        display: grid;
    }

    .loadAllnutrition_diaryElementFirst i{
        margin: auto;
        color: #e4e4e4 !important;
        font-size: 1rem !important;
    }

    .loadAllnutrition_diaryElementFirst .v-btn{
        margin: auto;
    }

    .loadAllnutrition_diaryElementFirst:nth-child(2){
        grid-template-columns: auto 70px;
        margin: 0 10px;
        width: calc( 100% - 20px );
    }

    .loadAllnutrition_diaryElementSecond{
        width: 100%;
        font-size: 0.8rem;
        margin: 0 auto auto 0;
    }

    .loadAllnutrition_diaryElementSecond:nth-child(1),
    .loadAllnutrition_diaryElementSecond:nth-child(2){
        margin: auto auto 0 0;
        font-size: 0.9rem;
    }

    .loadAllnutrition_diaryElementSecond:nth-child(2),
    .loadAllnutrition_diaryElementSecond:nth-child(4){
        text-align: right;
    }

    .loadAllnutrition_diaryElementSecond:nth-child(3),
    .loadAllnutrition_diaryElementSecond:nth-child(4){
        color: #a4a4a4;
    }

</style>