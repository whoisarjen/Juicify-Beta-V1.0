<template>
    <div class="countFromZeroCheck">
        <h1>{{$t("coach.countFromZeroCheck.title")}}</h1>
        <table>
            <tr>
                <td>{{this.$t("universal.height")}}</td>
                <td>{{ this.$store.state.userToken.height }}cm</td>
            </tr>
            <tr>
                <td>{{this.$t("universal.birth_date")}}</td>
                <td>{{ this.$store.state.userToken.birth.substr(8, 2)+"."+this.$store.state.userToken.birth.substr(5, 2)+"."+this.$store.state.userToken.birth.substr(0, 4)}}</td>
            </tr>
            <tr>
                <td>{{$t("coach.countFromZeroCheck.last_saved_weight")}}</td>
                <td>{{ theNEWESTweight }}kg</td>
            </tr>
        </table>
        <div>
            {{this.$t("coach.countFromZeroCheck.information")}} <i class="fas fa-cog"></i>.
        </div>
        <v-btn
            v-if="theNEWESTweight > 0"
            class="rounded-pill"
            color="primary"
            @click="changeStep('countFromZeroCounting')"
        >
        {{$t("universal.correct")}}
        </v-btn>
        <div v-else style="color: red">
            {{$t("coach.step10.last_weight_can_not_be_0")}}
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        theNEWESTweight: 0
    }),
    methods: {
        changeStep(goToStep){
            this.$emit("changeStep", goToStep)
        }
    },
    async mounted(){
        let daily = await this.$getAllIndexedDB("daily_measurement")
        daily = daily.sort((a, b) => {
            if(a.whenAdded < b.whenAdded) return 1;
            if(b.whenAdded < a.whenAdded) return -1;
            return 0;
        })
        if(daily.length > 0){
            for(let i=0; i<daily.length; i++){
                if(daily[i].weight){
                    this.theNEWESTweight = daily[i].weight
                    break;
                }
            }
        }
    }
}
</script>

<style scoped>

    table{
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }

    tr,
    td{
        border: 1px solid #e4e4e4;
    }

    .countFromZeroCheck{
        min-height: calc( 100vh - 92px );
        padding: 12px 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto auto 36px;
    }

    .countFromZeroCheck div{
        margin: auto;
        text-align: center;
    }

</style>