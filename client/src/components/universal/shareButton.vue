<template>
    <div style="margin: auto; display: grid;">
        <div v-if="show" style="margin: auto; display: grid;">
            <v-btn @click="share()" style="margin: auto" icon><v-icon>fas fa-share-alt</v-icon></v-btn>
        </div>
        <div v-else/>
    </div>
</template>

<script>
export default {
    data: () => ({
        show: false
    }),
    methods: {
        share(){
            navigator.share({
                url: location.href,
                title: 'Juicify.app'
            })
        }
    },
    mounted(){
        if(navigator.share){
            this.show = true
        }
    }
}
</script>