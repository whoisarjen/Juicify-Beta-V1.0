<template>
    <div class="add-weight">
        <v-col
            class="d-flex"
            cols="12"
        >
            <v-select
                v-model="selectedOption"
                hide-details
                :items="[{
                    value: 'weight7',
                    text: $t('universal.weight') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'weight14',
                    text: $t('universal.weight') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'weight28',
                    text: $t('universal.weight') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'neck7',
                    text: $t('universal.neck') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'neck14',
                    text: $t('universal.neck') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'neck28',
                    text: $t('universal.neck') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'shoulders7',
                    text: $t('universal.shoulders') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'shoulders14',
                    text: $t('universal.shoulders') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'shoulders28',
                    text: $t('universal.shoulders') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'chest7',
                    text: $t('universal.chest') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'chest14',
                    text: $t('universal.chest') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'chest28',
                    text: $t('universal.chest') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'biceps7',
                    text: $t('universal.biceps') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'biceps14',
                    text: $t('universal.biceps') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'biceps28',
                    text: $t('universal.biceps') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'waist7',
                    text: $t('universal.waist') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'waist14',
                    text: $t('universal.waist') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'waist28',
                    text: $t('universal.waist') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'hips7',
                    text: $t('universal.hips') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'hips14',
                    text: $t('universal.hips') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'hips28',
                    text: $t('universal.hips') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'thigh7',
                    text: $t('universal.thigh') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'thigh14',
                    text: $t('universal.thigh') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'thigh28',
                    text: $t('universal.thigh') + ', ' + $t('universal.last_28_days')
                },{
                    value: 'calf7',
                    text: $t('universal.calf') + ', ' + $t('universal.last_7_days')
                },{
                    value: 'calf14',
                    text: $t('universal.calf') + ', ' + $t('universal.last_14_days')
                },{
                    value: 'calf28',
                    text: $t('universal.calf') + ', ' + $t('universal.last_28_days')
                }]"
                :label="$t('add_weight.diagram_for')"
            ></v-select>
        </v-col>
        <v-card-text>
            <v-sheet color="#333">
                <v-sparkline
                    :key="diagramKey"
                    :value="computedDiagram"
                    color="rgba(255, 255, 255, .7)"
                    height="140"
                    padding="24"
                    stroke-linecap="round"
                    smooth
                >
                <template v-slot:label="item" v-if="selectedOption == 'weight7' || selectedOption == 'weight14' || selectedOption == 'weight28'">
                {{ item.value }}kg
                </template>
                <template v-else v-slot:label="item">
                {{ item.value }}cm
                </template>
            </v-sparkline>
            </v-sheet>
        </v-card-text>
        <div class="contenerLOGGED">
            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                    <div class="mainButtonContener">
                        <v-btn class="mx-2" fab dark v-bind="attrs" v-on="on" color="primary">
                            <v-icon @click="$data._id = 0; date = today; dialogWeight = lastWeight;" dark>
                            mdi-plus
                            </v-icon>
                        </v-btn>
                    </div>
                </template>
                <v-form ref="form">
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{$t("add_weight.title")}}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="date" :label='$t("add_weight.when_was_check")' readonly v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker :readonly="$data._id > 0" v-model="date" :min="$dateMINlimit" :max="today" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="primary" @click="modal = false">
                                            {{$t("universal.deny")}}
                                            </v-btn>
                                            <v-btn text color="primary" @click="$refs.dialog.save(date)">
                                            {{$t("universal.confirm")}}
                                            </v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                    <v-text-field v-model="dialogWeight" :rules="basicNumberSecurityOver0" type="number" :label='$t("add_weight.whats_your_weight")'></v-text-field>
                                    <v-expansion-panels accordion>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>Dodatkowe pomiary</v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-text-field v-model="dialogNeck" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_neck")'></v-text-field>
                                            <v-text-field v-model="dialogShoulders" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_shoulders")'></v-text-field>
                                            <v-text-field v-model="dialogChest" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_chest")'></v-text-field>
                                            <v-text-field v-model="dialogBiceps" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_biceps")'></v-text-field>
                                            <v-text-field v-model="dialogWaist" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_waist")'></v-text-field>
                                            <v-text-field v-model="dialogHips" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_hips")'></v-text-field>
                                            <v-text-field v-model="dialogThigh" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_thigh")'></v-text-field>
                                            <v-text-field v-model="dialogCalf" :rules="basicNumberSecurity" type="number" :label='$t("add_weight.whats_your_calf")'></v-text-field>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                    </v-expansion-panels>
                                    <v-textarea counter v-model="dialogFeeling" :rules="inputTEXToptional" :label='$t("add_weight.feeling")'></v-textarea>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text @click="dialog = false">
                            {{$t("universal.deny")}}
                            </v-btn>
                            <v-btn :loading="addWeightLoader" text @click="submit()">
                            {{$t("universal.save")}}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
                </v-dialog>
            </v-row>
                <weightBOX
                    v-for="item in weight" :key="item._id"
                    v-bind:data="item"
                    @changeWeight="changeWeight(item)"
                />
        </div>
    </div>
</template>
<script>
import weightBOX from '@/components/weight/weightBOX'
export default {
  name: 'add-weight',
    data: () => ({
        _id: 0,
        date: "",
        modal: false,
        dialog: false,
        weight: [],
        dialogFeeling: "",
        dialogWeight: 0,
        lastWeight: 0,
        dialogNeck: 0,
        dialogShoulders: 0,
        dialogChest: 0,
        dialogBiceps: 0,
        dialogWaist: 0,
        dialogHips: 0,
        dialogThigh: 0,
        dialogCalf: 0,
        value: [],
        today: '',
        addWeightLoader: false,
        selectedOption: 'weight14',
        weight7: [],
        weight14: [],
        weight28: [],
        neck7: [],
        neck14: [],
        neck28: [],
        shoulders7: [],
        shoulders14: [],
        shoulders28: [],
        chest7: [],
        biceps7: [],
        waist7: [],
        hips7: [],
        thigh7: [],
        calf7: [],
        chest14: [],
        biceps14: [],
        waist14: [],
        hips14: [],
        thigh14: [],
        calf14: [],
        chest28: [],
        biceps28: [],
        waist28: [],
        hips28: [],
        thigh28: [],
        calf28: [],
        diagramKey: 0,
        firstLoad: false
    }),
    components: {
        weightBOX
    },
    methods: {
        async submit(){
            this.addWeightLoader = true
            if( this.$refs.form.validate() ){
                let arrayToSend = [{
                    "weight": this.dialogWeight,
                    "whenAdded": this.date
                }]
                if(this.dialogFeeling) arrayToSend[0].weight_description = this.dialogFeeling
                if(this.dialogNeck) arrayToSend[0].neck = this.dialogNeck
                if(this.dialogShoulders) arrayToSend[0].shoulders = this.dialogShoulders
                if(this.dialogChest) arrayToSend[0].chest = this.dialogChest
                if(this.dialogBiceps) arrayToSend[0].biceps = this.dialogBiceps
                if(this.dialogWaist) arrayToSend[0].waist = this.dialogWaist
                if(this.dialogHips) arrayToSend[0].hips = this.dialogHips
                if(this.dialogThigh) arrayToSend[0].thigh = this.dialogThigh
                if(this.dialogCalf) arrayToSend[0].calf = this.dialogCalf
                await this.$daily_measurement(arrayToSend,
                    "weight",
                    "add"
                )
                await this.loadWEIGHTS();
                this.dialog = false
                this.$store.state.barsWeightFLAG = await this.$currentTime()
            }
            this.addWeightLoader = false
        },
        changeWeight(data){
            this._id = data._id
            data.weight_description ? this.dialogFeeling = data.weight_description : this.dialogFeeling = ''
            this.date = data.whenAdded
            this.dialogWeight = data.weight
            if(data.neck) this.dialogNeck = data.neck
            if(data.shoulders) this.dialogShoulders = data.shoulders
            if(data.chest) this.dialogChest = data.chest
            if(data.biceps) this.dialogBiceps = data.biceps
            if(data.waist) this.dialogWaist = data.waist
            if(data.hips) this.dialogHips = data.hips
            if(data.thigh) this.dialogThigh = data.thigh
            if(data.calf) this.dialogCalf = data.calf
            this.dialog = true
        },
        async loadWEIGHTS(){
            this.selectedOption = 'weight14'
            this.weight7 = []
            this.weight14 = []
            this.weight28 = []
            this.today = await this.$shortDATE( await this.$getCorrectDate() )
            this.date = this.today
            let weight = await this.$getAllIndexedDB("daily_measurement")
            function compare(a, b) {
                a.whenAdded = a.whenAdded.substr(0, 10)
                b.whenAdded = b.whenAdded.substr(0, 10)
                if(a.whenAdded < b.whenAdded) return 1;
                if(b.whenAdded < a.whenAdded) return -1;
                return 0;
            }
            weight.sort(compare)
            let a = 0, b = 0;
            for(let i=0; i<28; i++){
                let day = await this.$getIndexedDBbyID('daily_measurement', await this.$addDAYStoISO(this.today, -i))
                if(!day) day = {
                    weight: 0,
                    neck: 0,
                    shoulders: 0,
                    chest: 0,
                    biceps: 0,
                    waist: 0,
                    hips: 0,
                    thigh: 0,
                    calf: 0
                }
                if(!day.weight) day.weight = 0
                if(!day.neck) day.neck = 0
                if(!day.shoulders) day.shoulders = 0
                if(!day.chest) day.chest = 0
                if(!day.biceps) day.biceps = 0
                if(!day.waist) day.waist = 0
                if(!day.hips) day.hips = 0
                if(!day.thigh) day.thigh = 0
                if(!day.calf) day.calf = 0
                if(this.dialogWeight == 0){
                    this.dialogWeight = day.weight
                    this.lastWeight = day.weight
                }
                if(i < 7){
                    this.weight7[i] = parseFloat(day.weight)
                    this.neck7[i] = parseFloat(day.neck)
                    this.shoulders7[i] = parseFloat(day.shoulders)
                    this.chest7[i] = parseFloat(day.chest)
                    this.biceps7[i] = parseFloat(day.biceps)
                    this.waist7[i] = parseFloat(day.waist)
                    this.hips7[i] = parseFloat(day.hips)
                    this.thigh7[i] = parseFloat(day.thigh)
                    this.calf7[i] = parseFloat(day.calf)
                }
                if(i < 14 && i % 2 === 0){
                    this.weight14[a] = parseFloat(day.weight)
                    this.neck14[a] = parseFloat(day.neck)
                    this.shoulders14[a] = parseFloat(day.shoulders)
                    this.chest14[a] = parseFloat(day.chest)
                    this.biceps14[a] = parseFloat(day.biceps)
                    this.waist14[a] = parseFloat(day.waist)
                    this.hips14[a] = parseFloat(day.hips)
                    this.thigh14[a] = parseFloat(day.thigh)
                    this.calf14[a] = parseFloat(day.calf)
                    a++
                }
                if(i < 28 && i % 4 === 0){
                    this.weight28[b] = parseFloat(day.weight)
                    this.neck28[b] = parseFloat(day.neck)
                    this.shoulders28[b] = parseFloat(day.shoulders)
                    this.chest28[b] = parseFloat(day.chest)
                    this.biceps28[b] = parseFloat(day.biceps)
                    this.waist28[b] = parseFloat(day.waist)
                    this.hips28[b] = parseFloat(day.hips)
                    this.thigh28[b] = parseFloat(day.thigh)
                    this.calf28[b] = parseFloat(day.calf)
                    b++
                }
            }
            this.weight = weight.filter(x => x.weight >= 0)
            this.loadDiagramValue()
            this.selectedOption = 'weight7'
        },
        loadDiagramValue(){
            this.value = this[this.selectedOption]
            this.diagramKey += 1
        }
    },
    async mounted(){
        await this.loadWEIGHTS()
    },
    computed:{
        computedDiagram(){
            let value = JSON.parse(JSON.stringify(this[this.selectedOption]))
            return value.reverse()
        }
    },
    watch:{
        '$store.state.weightFLAG': async function(){
            await this.loadWEIGHTS()
        },
        '$store.state.daily_measurementFLAG': async function() {
            await this.loadWEIGHTS();
        }
    }
}
</script>

<style>

    .add-weight .v-card__text{
        padding: 0;
    }

    .add-weight .v-card__text svg{
        width: 100%;
        padding: 20px 0;
    }

    .add-weight .loadMore{
        padding-top: 10px;
        text-align: center;
        width: 100%;
    }

    .add-weight .dialogErrorCSS{
        width: 100%;
        color: red;
    }

    .add-weight .mainButtonContener{
        display: grid;
        width: 100%;
        padding: 0 0 20px;
    }

    .add-weight .mainButtonContener .v-btn{
        margin: auto !important;
    }

    .add-weight .v-timeline-item__opposite{
        text-align: center !important;
    }

    .add-weight .v-timeline-item .py-4{
        font-size: 0.875rem;
        text-align: center;
        word-wrap: break-word;
    }

    .add-weight .v-timeline-item .py-4 span{
        font-size: 1rem;
    }

    .add-weight .v-text-field{
        padding-top: 0;
    }

    .v-expansion-panel-header{
        padding: 16px 0 !important;
    }

    .v-expansion-panel:before{
        box-shadow: none !important;
    }

    .v-expansion-panels{
        border-radius: 0;
        border-bottom: 1px solid rgba(0,0,0,.42);
    }

</style>