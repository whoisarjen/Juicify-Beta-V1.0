<template>
    <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
            <v-card-title class="headline">{{$t("universal.remove")}}</v-card-title>
            <v-card-text class="dialogCONFIRME">{{$t("universal.remove_warning")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialog()">{{$t("universal.deny")}}</v-btn>
                <v-btn text :loading="loader" @click="deleteConfirmation()">{{$t("universal.confirm")}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'dialog_delete',
    data: () => ({
        loader: false,
        dialog: true
    }),
    methods: {
        closeDialog(){
            this.$emit("close");
        },
        deleteConfirmation(){
            this.loader = true;
            this.$emit("delete");
        }
    }
}
</script>