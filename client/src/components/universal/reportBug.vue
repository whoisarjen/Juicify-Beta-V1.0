<template>
        <v-btn class="rounded-pill" @click="dialog = true;" icon>
            <span>{{this.$t("universal.report")}}</span>
            <v-icon>fas fa-bug</v-icon>
            <v-dialog
                v-model="dialog"
                persistent
                max-width="500px"
                >
                <v-card>
                    <v-card-title>
                    <span class="headline">{{$t("universal.report")}}</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                        <v-form ref="form">
                        <v-row>
                            <v-col
                                cols="12"
                            >
                            <v-textarea
                                :rules="inputTEXTpassword"
                                :label='$t("universal.message")'
                                v-model="message"
                                auto-grow
                                hide-details
                                dense
                                outlined
                            ></v-textarea>
                            </v-col>
                        </v-row>
                        </v-form>
                    </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        @click="dialog = false"
                    >
                        {{$t("universal.deny")}}
                    </v-btn>
                    <v-btn
                        text
                        :loading="reportBugLoader"
                        @click="reportBug()"
                    >
                        {{$t("universal.confirm")}}
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        message: '',
        reportBugLoader: false
    }),
    methods: {
        async reportBug(){
            if( this.$refs.form.validate() ){
                this.reportBugLoader = true;
                if(this.how_many <= 0) this.how_many = 1
                await this.$http.post('requests/emailHandler/', {
                    array: [{
                        "login": this.$store.state.userToken.login,
                        "email": this.$store.state.userToken.email,
                        "message": this.message,
                        "title": "Report => " + this.where + " => " + this._id
                    }]
                })
                .then(() => {
                    this.$notification("success", this.$t('success_notify.basic'))
                    this.message = ''
                })
                .catch(() => {
                    this.$notification("alert", this.$t('error_notify.basic'))
                })
                this.dialog = false;
                this.reportBugLoader = false;
            }
        }
    },
    props: {
        _id: [String, Number],
        where: String
    }
}
</script>