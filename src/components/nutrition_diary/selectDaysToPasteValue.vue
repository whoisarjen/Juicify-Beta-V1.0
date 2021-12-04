<template>
    <div style="margin: auto; display: grid;">
        <v-dialog
            v-model="confirmedDialog"
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline">
                {{$t("universal.sure")}}?
                </v-card-title>
                <v-card-text>
                {{$t("add_product.copy_to_other_days_warning")}}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        @click="confirmedDialog = false"
                    >
                    {{$t("universal.deny")}}
                    </v-btn>
                    <v-btn
                        text
                        :loading="confirmedDialogLoading"
                        @click="copyToOtherDays()"
                    >
                    {{$t("universal.confirm")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            ref="dialog"
            v-model="dialog"
            :return-value.sync="picker"
            persistent
            width="290px"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn style="margin: auto" icon v-bind="attrs" v-on="on"><v-icon>fas fa-copy</v-icon></v-btn>
            </template>
            <div style="padding: 12px; text-align: center; font-size: 0.85rem; color: #333">{{this.$t("add_product.copy_to_other_days_info")}}</div>
            <v-date-picker
                v-model="picker"
                scrollable
                multiple
                :min="$dateMINlimit"
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
                    @click="confirmed"
                >
                {{$t("universal.copy")}}
                </v-btn>
            </v-date-picker>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        confirmedDialog: false,
        confirmedDialogLoading: false,
        picker: [],
        date: '2021-04-23',
    }),
    props: {
        foodInThisDay: Array
    },
    methods: {
        async confirmed(){
            this.confirmedDialog = true
        },
        async copyToOtherDays(){
            this.confirmedDialogLoading = true
            if(this.picker.length > 0){
                let time = await this.$currentTime()
                const foodToAdd = this.foodInThisDay.map((x) => {
                    if(x._id) delete x._id
                    if(!this.$store.state.online) x._id = "XD" + time
                    time++
                    return x
                })
                let existing = []
                let NOTexisting = []
                for(let i=0; i<this.picker.length; i++){
                    const indexed = await this.$getIndexedDBbyID('daily_measurement', await this.$dateTOiso(this.picker[i]))
                    if(indexed){
                        existing.push(indexed)
                    }else{
                        NOTexisting.push({
                            "user_ID": this.$store.state.userToken._id,
                            "whenAdded": await this.$dateTOiso(this.picker[i]),
                            "nutrition_diary": foodToAdd
                        })
                    }
                }
                if(existing.length > 0){
                    if(NOTexisting.length>0){
                        existing.map((x) => {
                            x.nutrition_diary = foodToAdd
                            return x
                        })
                    }else{
                        existing.map((x) => {
                            x.nutrition_diary = x.nutrition_diary.concat(foodToAdd)
                            return x
                        })
                    }
                }
                let arrayToSend = NOTexisting.concat(existing)
                if(NOTexisting.length > 0) await this.$insertThoseIDStoDB('daily_measurement', arrayToSend, false, false, 'whenAdded')
                else await this.$overwriteThoseIDSinDB('daily_measurement', arrayToSend, false, 'whenAdded')
                this.$emit("refresh")
                this.confirmedDialog = false
                this.confirmedDialogLoading = false
                this.dialog = false
                this.picker = []
                this.$notification("success", this.$t('success_notify.basic'))
            }else{
                this.confirmedDialog = false
                this.confirmedDialogLoading = false
                this.$notification("alert", this.$t('error_notify.you_did_not_choose_date'))
            }
        }
    },
}
</script>