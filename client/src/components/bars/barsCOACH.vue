<template>
    <div class="Bars">
        <router-link :to="'/coach'">
            <div class="barsBOX">
                <div class="barBOXheader">{{ $t("universal.coach") }}</div>
                <div class="GRID">
                    <v-progress-circular
                        :rotate="-90"
                        :size="95"
                        :width="7"
                        :value="value"
                        :color="color"
                        >
                        <span v-if="daysOfBreak - daysSINCE >= 0">{{ daysOfBreak - daysSINCE }}</span>
                        <span v-else><i class="fas fa-diagnoses"></i></span>
                    </v-progress-circular>
                </div>
                <div class="barsBOXgridDOWN">
                    <div v-if="daysOfBreak - daysSINCE >= 0" class="barsBOXgridDOWNauto">{{ this.nextCoach.substr(8, 2)+"."+this.nextCoach.substr(5, 2)+"."+this.nextCoach.substr(0, 4) }}</div>
                    <div v-else class="barsBOXgridDOWNauto">{{ $t("coach.inactive") }}</div>
                    <div class="barsBOXgridDOWNicon">
                        <div class="barsBOXgridDOWNiconCIRCLE">
                            <i class="fas fa-diagnoses"></i>
                        </div>    
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>
<script>
export default {
    name: 'barsCOACH',
    props:{
        color: String
    },
    data: () => ({
        days: 0,
        value: 0,
        daysSINCE: 7,
        nextCoach: '',
        daysOfBreak: 7
    }),
    async mounted(){
        this.$store.state.userToken.coach_analyze ? this.daysOfBreak = 7 : this.daysOfBreak = 14
        this.nextCoach = this.$store.state.userToken.coach
        this.daysSINCE = ( (new Date(this.$store.state.userToken.coach)).getTime() - (new Date(await this.$getCorrectDate())).getTime() ) / (1000 * 60 * 60 * 24)
        this.value = (this.daysOfBreak - this.daysSINCE) / this.daysOfBreak * 100
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