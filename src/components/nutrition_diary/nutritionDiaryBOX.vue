<template>
    <div class="nutrition_diaryBox">
      <v-lazy
          v-model="isActive"
          :options="{
              threshold: .5
          }"
          min-height="72"
          transition="fade-transition"
      >
        <div class="loadAllnutrition_diary" v-show="loadAllnutrition_diarySHOW">
          <div class="loadAllnutrition_diaryHeader">
            <div class="loadAllnutrition_diaryHeaderThing">
              <p>{{ $t("nutrition_diary.meal") }} {{mealNumber+1}}</p>
            </div>
            <nutritionDiaryBoxMoreOptions :allAddedProducts="sortedArray" :mealNumber="mealNumber" v-if="this.$store.state.userToken.login == this.$route.params.login"/>
            <div v-else/>
            <div class="holderForPlus" @click="openDialogAddProducts()" v-if="this.$store.state.userToken.login == this.$route.params.login">
              <div class="loadAllnutrition_diaryHeaderThing">
                <i class="fas fa-plus"></i>
              </div>
            </div>
            <div @click="copyMeal(sortedArray)" class="holderForPlus" style="background: transparent !important; height: auto; width: auto;" v-else-if="this.$store.state.userToken.login">
              <v-btn style="margin: auto;" icon><v-icon>fas fa-copy</v-icon></v-btn>
            </div>
            <div class="loadAllnutrition_diaryHeaderThing" v-else style="background: transparent !important;"/>
            <transition name="fade">
              <div class="loadAllnutrition_diaryHeaderThing">
                {{headerThing()}}
              </div>
            </transition>
          </div>
          <div v-if="this.$route.params.login == this.$store.state.userToken.login">
              <nutritionDiaryBOXproduct
                  v-for="(item, index) in sortedArray" v-bind:key="sortedArray[index].id"
                  v-bind:nutrition_diaryElement="sortedArray[index]"
                  @deletedFROMnutrition_diary="deletedFROMnutrition_diary(index)"
              />
          </div>
          <div v-else>
              <nutritionDiaryBOXproduct
                  v-for="(item, index) in sortedArray" v-bind:key="sortedArray[index].id"
                  v-bind:nutrition_diaryElement="sortedArray[index]"
              />
          </div>
        </div>
      </v-lazy>
    </div>
</template>

<script>
import nutritionDiaryBOXproduct from '@/components/nutrition_diary/nutritionDiaryBOXproduct'
import nutritionDiaryBoxMoreOptions from '@/components/nutrition_diary/nutritionDiaryBoxMoreOptions'
export default {
  name: 'nutrition_diaryBox',
  data: () => {
    return{
      isActive: false,
      loadAllnutrition_diarySHOW: false
    }
  },
  props: {
    sortedArray: Array,
    mealNumber: Number
  },
  components: {
    nutritionDiaryBOXproduct,
    nutritionDiaryBoxMoreOptions
  },
  methods:{
    async copyMeal(allAddedProducts){
        let array = JSON.parse(JSON.stringify(allAddedProducts))
        if(array.length>0){
            for(let i=0; i<array.length; i++){
                delete array[i]._id
                delete array[i].meal
                if(array[i].calories && array[i].calories < 0) array.splice(i, 1)
            }
        }
        localStorage.setItem("copiedMeal", JSON.stringify(array))
        this.$notification("success", this.$t("success_notify.basic"))
    },
    openDialogAddProducts(){
      this.$emit('openDialogAddProducts')
    },
    headerThing(){
        let bialko = 0;
        let wegle = 0;
        let tluszcze = 0;
        let ethanol = 0;
        let kcal = 0;
        if(this.$props.sortedArray){
          this.$props.sortedArray.forEach((v) => {
              if(!v.calories){
                if(v.p) bialko += v.p * v.how_many;
                if(v.c) wegle += v.c * v.how_many;
                if(v.f) tluszcze += v.f * v.how_many;
                if(v.ethanol) ethanol += v.ethanol * v.how_many
              }else{
                kcal += v.calories
              }
          })
          kcal += bialko * 4 + wegle * 4 + tluszcze * 9 + ethanol * 7
        }
        this.loadAllnutrition_diarySHOW = true
        return bialko.toFixed(1)+this.$t("universal.proteins_short")+' '+wegle.toFixed(1)+this.$t("universal.carbs_short")+" "+tluszcze.toFixed(1)+this.$t("universal.fats_short")+' '+kcal.toFixed()+'Kcal';
    },
    deletedFROMnutrition_diary(index){
      this.sortedArray.splice(index, 1)
      this.$emit('deletedFROMnutrition_diary', this.sortedArray[index])
    }
  }
}
</script>

<style scoped>

  .v-application .primary--text{
    color: #e99123 !important;
  }

  .loadAllnutrition_diary{
    width: 100%;
    border: 1px solid #e4e4e4;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 12px;
  }

  .loadAllnutrition_diaryHeader{
    width: 100%;
    min-height: 50px;
    display: grid;
    grid-template-columns: auto 44px 44px;
  }

  .holderForMoreOptions{
    display: grid;
    grid-column: 2;
    grid-row: 1 / 3;
    cursor: pointer;
  }

  .loadAllnutrition_diaryHeader .holderForPlus{
    display: grid;
    background: #333;
    grid-column: 3;
    grid-row: 1 / 3;
    border-radius: 4px;
    height: 30px;
    width: 30px;
    margin: auto;
    cursor: pointer;
  }

  .v-application a{
    color: #333 !important;
  }

  .loadAllnutrition_diaryHeaderThing{
    width: 100%;
    font-size: 0.875rem;
    display: grid;
  }

  .loadAllnutrition_diaryHeaderThing p{
    font-size: 1rem;
    margin: auto auto 0 0;
    font-weight: bold;
  }

  .loadAllnutrition_diaryHeaderThing:nth-child(3){
    color: #a4a4a4 !important;
  }

  .loadAllnutrition_diaryHeader i{
    font-size: 1rem;
    margin: auto;
    color: #fff;
  }

  .loadAllnutrition_diaryElement{
    width: 100%;
    min-height: 50px;
    border-top: 1px solid #e4e4e4;
    margin-top: 10px;
    padding: 15px 0 5px;
    display: grid;
    grid-template-columns: 44px auto;
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

</style>
