<template>
    <div>
        <div style="height: 58px; width: 100%;"/>
        <div class="waterAdder">
            <v-speed-dial
            v-model="fab"
            direction="top"
            transition="slide-y-reverse-transition"
            >
            <!-- blue darken-2 -->
            <template v-slot:activator>
                <v-btn
                v-model="fab"
                color="#333"
                dark
                fab
                >
                <v-icon v-if="fab">
                    mdi-close
                </v-icon>
                <v-badge
                    v-else
                    :content="water"
                    :value="water"
                    color="primary"
                    overlap
                    bottom
                >
                    <v-icon>
                        fas fa-glass-whiskey
                    </v-icon>
                </v-badge>
                </v-btn>
            </template>
            <v-btn
                fab
                dark
                small
                color="#333"
                @click="removeOneWater()"
            >
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn
                fab
                dark
                small
                color="primary"
                @click="addOneWater()"
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            </v-speed-dial>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        fab: false,
        water: 0
    }),
    methods: {
        async addOneWater(){
            // this.water++
            this.putValueToDB(1)
        },
        async removeOneWater(){
            if(this.water > 0){
                // this.water--
                this.putValueToDB(-1)
            }
        },
        async putValueToDB(value){
            await this.$daily_measurement([{
                "water": this.water + value,
                "whenAdded": this.$route.params.date
            }],
                "water",
                "add"
            )
        }
    },
    async mounted(){
        const daily_measurement = await this.$getIndexedDBbyID("daily_measurement", await this.$dateTOiso(this.$route.params.date))
        if(daily_measurement && daily_measurement.water) this.water = daily_measurement.water
    }
}
</script>

<style>

    .waterAdder{
        position: fixed;
        bottom: calc( var(--padding-bottom-footer-menu) + 7px );
    }

    .waterAdder .v-speed-dial--direction-top, .v-speed-dial__list{
        width: 56px !important;
    }

    .waterAdder .v-badge__badge{
        border-radius: 50% !important;
    }

    .waterAdder .v-speed-dial__list .v-btn{
        margin: 6px 8px;
    }

</style>