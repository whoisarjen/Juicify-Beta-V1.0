<template>
    <div>
        <v-tooltip v-model="netAlert" bottom v-if="show">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                icon
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                >
                <v-icon @click="netAlert = !netAlert" color="red">fas fa-exclamation-circle</v-icon>
                </v-btn>
            </template>
            <span>{{$t("universal.problem_with_internet")}} {{$howManyValuesToLoad}} {{$t("universal.days_small")}} {{$t("universal.problem_with_internet_2")}}</span>
        </v-tooltip>
    </div>
</template>

<script>
export default {
    data: () => ({
        show: false,
        netAlert: false,
        showAlert: ''
    }),
    mounted(){
        this.showAlert = setTimeout(() => {
            this.show = true
            this.$socket.connect()
        }, 2000)
    },
    beforeDestroy(){
        clearTimeout(this.showAlert)
    }
}
</script>