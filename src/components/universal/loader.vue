<template>
    <div v-if="loaderValue > 0 && loaderValue < 100" class="loader" :style="{'width': loaderValue + '%'}"/>
</template>

<script>
export default {
    props: {
        loaderValue: Number
    }
}
</script>

<style scoped>

    .loader{
        height: 5px;
        background: #e99123;
        position: fixed;
        bottom: 43px;
        left: 0;
        z-index: 9999;
        border-radius: 0 9999px 9999px 0;
    }

</style>