<template>
    <div style="width: 100%">
        <div style="margin: 0 12px">
            <v-switch
                v-model="useProteinsG"
                inset
                @change="change()"
                :label="$t('coach.macroSliders.would_u_grams_per_100kg')"
            ></v-switch>
        </div>

        <!-- PROTEINS -->

        <v-card
            flat
            color="transparent"
            v-if="useProteinsG"
        >
            <v-subheader>{{this.$t("coach.macroSliders.grams_per_100kg")}}</v-subheader>
            <v-card-text>
                <div style="text-align: center">{{this.$t("coach.macroSliders.handle_macro")}}</div>
                <div v-if="fats < carbs" style="text-align: center; font-weight: bold;">{{this.$t("universal.fats")}} <i class="fas fa-long-arrow-alt-right"></i> {{this.$t("universal.proteins")}} <i class="fas fa-long-arrow-alt-right"></i> {{this.$t("universal.carbs")}}</div>
                <div v-else style="text-align: center; font-weight: bold;">{{this.$t("universal.carbs")}} <i class="fas fa-long-arrow-alt-right"></i> {{this.$t("universal.proteins")}} <i class="fas fa-long-arrow-alt-right"></i> {{this.$t("universal.fats")}}</div>
            <v-row>
                <v-col class="pr-4">
                <v-slider
                    v-model="proteinsG"
                    class="align-center"
                    max="500"
                    min="0"
                    hide-details
                    @input="change()"
                >
                    <template v-slot:append>
                    <v-text-field
                        v-model="proteinsG"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                    ></v-text-field>
                    <div class="procent">g</div>
                    </template>
                </v-slider>
                </v-col>
            </v-row>
            </v-card-text>
        </v-card>

        <!-- PROTEINS -->

        <v-card
            flat
            color="transparent"
        >
            <v-subheader>Proteins</v-subheader>
            <v-card-text>
            <v-row>
                <v-col class="pr-4">
                <v-slider
                    :disabled="useProteinsG"
                    :rules="[ v => v + carbs + fats <= 100 || 'Too much!' ]"
                    v-model="proteins"
                    class="align-center"
                    max="100"
                    min="0"
                    hide-details
                    @input="countMacro('proteins')"
                >
                    <template v-slot:append>
                    <v-text-field
                        v-model="proteins"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="countMacro('proteins')"
                    ></v-text-field>
                    <div class="procent">%</div>
                    </template>
                </v-slider>
                </v-col>
            </v-row>
            </v-card-text>
        </v-card>

        <!-- CARBS -->

        <v-card
            flat
            color="transparent"
        >
            <v-subheader>Carbs</v-subheader>
            <v-card-text>
            <v-row>
                <v-col class="pr-4">
                <v-slider
                    :rules="[ v => v + proteins + fats <= 100 || 'Too much!' ]"
                    v-model="carbs"
                    class="align-center"
                    max="100"
                    min="0"
                    hide-details
                    @input="countMacro('carbs')"
                >
                    <template v-slot:append>
                    <v-text-field
                        v-model="carbs"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="countMacro('carbs')"
                    ></v-text-field>
                    <div class="procent">%</div>
                    </template>
                </v-slider>
                </v-col>
            </v-row>
            </v-card-text>
        </v-card>

        <!-- FATS -->

        <v-card
            flat
            color="transparent"
        >
            <v-subheader>Fats</v-subheader>
            <v-card-text>
            <v-row>
                <v-col class="pr-4">
                <v-slider
                    :rules="[ v => v + carbs + proteins <= 100 || 'Too much!' ]"
                    v-model="fats"
                    class="align-center"
                    max="100"
                    min="0"
                    hide-details
                    @input="countMacro('fats')"
                >
                    <template v-slot:append>
                    <v-text-field
                        v-model="fats"
                        class="mt-0 pt-0"
                        hide-details
                        single-line
                        type="number"
                        style="width: 60px"
                        @input="countMacro('fats')"
                    ></v-text-field>
                    <div class="procent">%</div>
                    </template>
                </v-slider>
                </v-col>
            </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    export default {
        data: () => ({
            useProteinsG: false,
            proteinsG: 100,
            proteins: 25,
            carbs: 50,
            fats: 25,
            lastChanged: 'fats'
        }),
        methods: {
            countMacro(nowChanging){
                let whatToChange = ''
                let secondToChange = ''
                if(this.proteins > 100) this.proteins = 100
                if(this.carbs > 100) this.carbs = 100
                if(this.fats > 100) this.fats = 100
                if(nowChanging == 'proteins'){
                    whatToChange = 'carbs'
                    secondToChange = 'fats'
                }
                if(nowChanging == 'carbs'){
                    whatToChange = 'fats'
                    secondToChange = 'proteins'
                }
                if(nowChanging == 'fats'){
                    whatToChange = 'proteins'
                    secondToChange = 'carbs'
                }
                this[whatToChange] = 100 - this[nowChanging] - this[secondToChange]
                this.change()
            },
            change(){
                this.$emit("macroSliders", {
                    "useProteinsG": this.useProteinsG,
                    "proteinsG": this.proteinsG,
                    "proteins": this.proteins,
                    "carbs": this.carbs,
                    "fats": this.fats
                })
            }
        },
        mounted(){
            if(this.$store.state.userToken.useProteinsG || this.$store.state.userToken.useProteinsG === 0) this.useProteinsG = this.$store.state.userToken.useProteinsG
            if(this.$store.state.userToken.proteinsG || this.$store.state.userToken.proteinsG === 0) this.proteinsG = this.$store.state.userToken.proteinsG
            if(this.$store.state.userToken.proteins || this.$store.state.userToken.proteins === 0) this.proteins = this.$store.state.userToken.proteins
            if(this.$store.state.userToken.carbs || this.$store.state.userToken.carbs === 0) this.carbs = this.$store.state.userToken.carbs
            if(this.$store.state.userToken.fats || this.$store.state.userToken.fats === 0) this.fats = this.$store.state.userToken.fats
            this.change()
        }
    }
</script>

<style scoped>

    .v-input__append-outer{
        display: grid;
    }

    .v-input__append-outer .procent{
        margin: auto;
    }

    .v-subheader,
    .v-card__subtitle, .v-card__text, .v-card__title{
        padding: 0;
    }

</style>