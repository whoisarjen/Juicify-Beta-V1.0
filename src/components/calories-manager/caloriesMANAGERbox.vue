<template>
    <div class="calories-managerBOX">
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <div class="diagram"
                v-bind="attrs"
                v-on="on">
                <div class="day" v-bind:style="{ height: 10 + '%' }">{{ dayNAME }}.</div>
                <div class="proteins" v-bind:style="{ height: proteins * 4 / (proteins * 4 + carbs * 4 + fats * 9 ) * 80 + '%' }">{{ proteins }}</div>
                <div class="carbs" v-bind:style="{ height: carbs * 4 / (proteins * 4 + carbs * 4 + fats * 9 ) * 80 + '%' }">{{ carbs }}</div>
                <div class="fats" v-bind:style="{ height: fats * 9 / (proteins * 4 + carbs * 4 + fats * 9 ) * 80 + '%' }">{{ fats }}</div>
                <div class="calories" v-bind:style="{ height: 10 + '%' }">{{ proteins * 4 + carbs * 4 + fats * 9 }}</div>
            </div>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{$t("calories_manager.changing_macro_for")}} {{ dayNAME }}.</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="form">
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="proteins"
                        :rules="basicNumberSecurity"
                        :label="$t('universal.proteins')+ ' (g)'"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="carbs"
                        :rules="basicNumberSecurity"
                        :label="$t('universal.carbs')+ ' (g)'"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="fats"
                        :rules="basicNumberSecurity"
                        :label="$t('universal.fats')+ ' (g)'"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                @click="saveNEWmacroForALL"
              >
                {{$t('universal.all')}}
              </v-btn>
              <v-btn
                text
                @click="loadVALUES"
              >
                {{$t('universal.deny')}}
              </v-btn>
              <v-btn
                text
                @click="saveNEWmacro"
              >
                {{$t('universal.change')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'Calories-managerBOX',
    data: () => ({
        dialog: false,
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0
    }),
    props:{
        day: Number,
        dayINFO: Object,
        dayNAME: String,
    },
    methods:{
        saveNEWmacro(){
            if( this.$refs.form.validate() ){
                let object = {
                    "id": this.dayINFO.id,
                    "day": this.day,
                    "proteins": this.proteins,
                    "carbs": this.carbs,
                    "fats": this.fats
                }
                this.$emit("saveNEWmacro", {
                    "array": object,
                    "index": this.day - 1
                })
                this.dialog = false
            }
        },
        loadVALUES(){
            this.calories = this.proteins * 4 + this.carbs * 4 + this.fats * 9
            this.proteins = this.dayINFO.proteins
            this.carbs = this.dayINFO.carbs
            this.fats = this.dayINFO.fats
            this.dialog = false
        },
        saveNEWmacroForALL(){
            if( this.$refs.form.validate() ){
                let object = {
                    "id": this.dayINFO.id,
                    "day": this.day,
                    "proteins": this.proteins,
                    "carbs": this.carbs,
                    "fats": this.fats
                }
                this.$emit("saveNEWmacroForALL", {
                    "array": object
                })
                this.dialog = false
            }
        }
    },
    mounted(){
        this.loadVALUES()
    }
}
</script>

<style>

    .Calories-managerBOX{
        height: 100%;
        margin: 5px;
    }

    .diagram{
        height: 100%;
        font-size: 0.7rem;
    }

    .day{
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .proteins{
        background: #f9a85e;
        border-radius: 4px 4px 0 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }

    .carbs{
        background: #69d44b;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }

    .fats{
        background: #1867c0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }

    .calories{
        background: #333;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0 0 4px 4px;
        color: #fff;
    }

</style>