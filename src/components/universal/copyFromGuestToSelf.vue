<template>
    <div class="copyFromGuestToSelf" v-show="SHOWcopyFromGuestToSelf">
        <div class="copyFromGuestToSelfButton" @click="dialogCONFIRME = true">
            <i class="fas fa-copy"></i>
        </div>
        <v-dialog
            v-model="dialogCONFIRME"
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline">
                {{$t("guest.copy")}}?
                </v-card-title>
                <v-card-text class="dialogCONFIRME">
                    {{$t("guest.copy_warning")}}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        @click="dialogCONFIRME = false"
                    >
                    {{$t("universal.deny")}}
                    </v-btn>
                    <v-btn
                        text
                        @click="CopyFromGuestToSelf()"
                    >
                    {{$t("universal.confirm")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data: () => ({
        dialogCONFIRME: false,
        SHOWcopyFromGuestToSelf: true
    }),
    props:{
        objectTOadd: Object
    },
    methods: {
        async CopyFromGuestToSelf(){
            try{
                await this.$insertThoseIDStoDB("workout_plan", [this.objectTOadd])
                this.$notification("success", this.$t('success_notify.basic'))
                this.SHOWcopyFromGuestToSelf = false
                this.dialogCONFIRME = false
            }catch{
                this.$notification("alert", this.$t('error_notify.basic'))
            }
        }
    }
}
</script>

<style scoped>

    .copyFromGuestToSelfButton{
        padding: 15px 20px;
        background: #e99123;
        color: #fff;
        position: fixed;
        border-radius: 50%;
        bottom: 100px;
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }

</style>