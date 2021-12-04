<template>
    <div class="Bars">
        <router-link :to="'/add-weight'">
            <div class="barsBOX">
                <div class="barBOXheader">{{ $t("universal.weight") }}</div>
                <div class="GRID">
                    <v-progress-circular
                        :rotate="-90"
                        :size="95"
                        :width="7"
                        :value="value"
                        :color="color"
                        >
                        <span>{{ weight }}</span>
                    </v-progress-circular>
                </div>
                <div class="barsBOXgridDOWN">
                    <div class="barsBOXgridDOWNauto">{{ today.substr(8, 2)+"."+today.substr(5, 2)+"."+today.substr(0, 4) }}</div>
                    <div class="barsBOXgridDOWNicon">
                        <div class="barsBOXgridDOWNiconCIRCLE">
                            <i class="fas fa-weight"></i>
                        </div>    
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>
<script>
export default {
    name: 'barsWEIGHT',
    props:{
        color: String
    },
    data: () => ({
        value: 0,
        weight: 0,
        today: ''
    }),
    methods: {
        async loadBarsWEIGHT(){
            this.today = await this.$getCorrectDate()
            let weight  = await this.$getIndexedDBbyID("daily_measurement", this.today)
            if(weight && weight.weight){
                this.weight = weight.weight
                this.weight > 0 ? this.value = 100 : this.value = 0
            }
        }
    },
    async mounted(){
        await this.loadBarsWEIGHT()
    },
    watch: {
        '$store.state.barsWeightFLAG': async function(){
            await this.loadBarsWEIGHT()
        },
        '$store.state.daily_measurementFLAG': async function() {
            await this.loadBarsWEIGHT();
        }
    }
}
</script>

<style scoped>

    .barBOXheader{
        font-weight: bold;
    }

    .barsBOX{
        min-height: 200px;
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
    }

    .GRID{
        display: grid;
        width: 100%;
        min-height: 1px;
    }

    .v-progress-circular{
        margin: 10px auto;
    }

    .barsBOXgridDOWN{
        width: 100%;
        padding: 0 10px;
        display: grid;
        grid-template-columns: auto 20px;
        min-height: 40px;
    }

    .barsBOXgridDOWNauto{
        margin: auto 0;
        font-size: 0.875rem;
        grid-column: 1;
        grid-row: 1 / 3;
    }

    .barsBOXgridDOWNicon{
        grid-column: 2;
        grid-row: 1 / 3;
        display: grid;
    }

    .barsBOXgridDOWNiconCIRCLE{
        margin: auto;
        margin-right: 0;
        width: 20px;
        height: 20px;
        display: grid;
    }

    .barsBOXgridDOWNiconCIRCLE i{
        margin: auto;
        margin-right: 0;
        font-size: 0.875rem;
    }

</style>