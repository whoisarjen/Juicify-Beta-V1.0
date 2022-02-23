<template>
    <v-dialog
        ref="dialog"
        v-model="dialog"
        :return-value.sync="picker"
        persistent
        width="290px"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn style="margin: auto" icon v-bind="attrs" v-on="on"><v-icon>fa-fw fas fa-calendar-alt</v-icon></v-btn>
        </template>
        <div v-if="limit">
            <v-date-picker
                :min="$dateMINlimit"
                :max="$dateMAXlimit"
                v-model="picker"
                scrollable
            >
                <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="dialog = false"
                >
                {{$t("universal.deny")}}
                </v-btn>
                <v-btn
                    text
                    @click="changeDate"
                >
                OK
                </v-btn>
            </v-date-picker>
        </div>
        <div v-else>
            <v-date-picker
                v-model="picker"
                scrollable
                :max="$dateMAXlimit"
            >
            <v-spacer></v-spacer>
                <v-btn
                    text
                    @click="dialog = false"
                >
                {{$t("universal.deny")}}
                </v-btn>
                <v-btn
                    text
                    @click="changeDate"
                >
                {{$t("universal.change")}}
                </v-btn>
            </v-date-picker>
        </div>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        picker: ''
    }),
    props: {
        whereToGo: String,
        limit: Boolean
    },
    methods: {
        changeDate: function(){
            this.dialog = false
            this.$router.push(this.whereToGo+this.picker)
        }
    },
    async mounted(){
        this.picker = await this.$shortDATE(await this.$getCorrectDate())
    }
}
</script>