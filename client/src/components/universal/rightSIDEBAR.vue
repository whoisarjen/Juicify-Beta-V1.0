<template>
    <div class="rightSIDEBAR">
        <barsWEIGHT :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
        <barsCALORIES :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
        <barsWORKOUT :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
        <barsCOACH :color="this.$vuetify.theme.dark ? '#fff' : '#333'"/>
    </div>
</template>
<script>
import barsCOACH from '@/components/bars/barsCOACH'
import barsWEIGHT from '@/components/bars/barsWEIGHT'
import barsWORKOUT from '@/components/bars/barsWORKOUT'
import barsCALORIES from '@/components/bars/barsCALORIES'
export default {
    name: 'rightSIDEBAR',
    components: {
        barsCOACH,
        barsWEIGHT,
        barsWORKOUT,
        barsCALORIES
    }
}
</script>

<style>

    @media(max-width: 1280px){
        .rightSIDEBAR{
            display: none;
        }
    }

    .rightSIDEBAR{
        width: 100%;
        max-width: 260px;
        min-height: 1px;
        float: left;
    }

    .rightSIDEBAR .Bars{
        border-bottom: 1px solid #e4e4e4;
    }

    .rightSIDEBAR .Bars:last-child{
        border-bottom: none
    }

</style>