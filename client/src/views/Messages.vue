<template>
    <div class="messages">
        <v-list three-line>
            <template v-for="item in arrayWithMessages">
                <v-list-item
                    :key="item._id"
                >
                    <v-list-item-avatar>
                    <v-img src="/img/logo.png"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.whenAdded.substr(8, 2) + "." + item.whenAdded.substr(5, 2) + "." + item.whenAdded.substr(0, 4) }}</v-list-item-title>
                        <v-list-item-subtitle v-html="item.content"></v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>
    </div>
</template>

<script>
export default {
    data: () => ({
        arrayWithMessages: []
    }),
    methods: {
        async loadMESSAGES(){
            let arrayWithMessages = await this.$getAllIndexedDB('message')
            let doWeNeedToUpdateMessages = true

            if(arrayWithMessages && arrayWithMessages.length > 0){
                for(let i=0; i < arrayWithMessages.length; i++){
                    if(new Date(arrayWithMessages[i].whenAdded).getTime() > this.$store.state.last_message_time){
                        doWeNeedToUpdateMessages = false
                        break;
                    }
                }
            }

            if(doWeNeedToUpdateMessages) arrayWithMessages = await this.selectFROM(true, 'message', await this.$getCorrectDate(), null, 10, null, true, true, this.$route.params.login) // Donwload extra value
            this.arrayWithMessages = arrayWithMessages
            
            if(this.$store.state.online && parseInt(this.$store.state.number_of_messages) > 0){
                this.$socket.emit('tellAboutSeeingMessages', {
                    token: this.$store.state.userToken._id
                })
                this.$store.state.number_of_messages = 0
            }
        }
    },
    mounted(){
        this.loadMESSAGES()
    },
    watch:{
        '$store.state.last_message_time': function(){
            this.loadMESSAGES()
        },
        '$store.state.number_of_messages': function(){
            this.loadMESSAGES()
        }
    }
}
</script>