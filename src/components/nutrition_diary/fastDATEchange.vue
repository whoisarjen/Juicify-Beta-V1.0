<template>
    <div class="fastDATEchange">
        <div class="bannerOfSiteTOP">
            <router-link :to="'/'+whereToGo+'/'+countDate(-2)"><div class="bannerOfSiteTOPElements">{{ countDate(-2).substr(8, 2) }}</div></router-link>
            <router-link :to="'/'+whereToGo+'/'+countDate(-1)"><div class="bannerOfSiteTOPElements">{{ countDate(-1).substr(8, 2) }}</div></router-link>
            <div class="bannerOfSiteTOPElements">{{ today.substr(8, 2)+"."+today.substr(5, 2)+"."+today.substr(0, 4) }}</div>
            <router-link :to="'/'+whereToGo+'/'+countDate(1)"><div class="bannerOfSiteTOPElements">{{ countDate(1).substr(8, 2) }}</div></router-link>
            <router-link :to="'/'+whereToGo+'/'+countDate(2)"><div class="bannerOfSiteTOPElements">{{ countDate(2).substr(8, 2) }}</div></router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: 'fastDATEchange',
    props: {
        today: String,
        whereToGo: String
    },
    methods: {
        countDate(value){
            var result = new Date(this.today)
            result.setDate(result.getDate() + value)
            return result.getFullYear()+"-"+("0"+(result.getMonth()+1)).slice(-2)+"-"+("0"+result.getDate()).slice(-2)
        }
    }
}
</script>

<style scoped>
    .bannerOfSiteTOPElements{
        width: 100%;
        background: #f0f1f6;
        margin: auto;
        text-align: center;
        border-radius: 4px;
        padding: 11.75px 8px;
    }
    .bannerOfSiteTOP a{
        display: grid;
        text-decoration: none;
        color: #202020;
    }
    .bannerOfSiteTOPElements:nth-child(3){
        background: #333;
        color: #fff;
        padding: 20px 8px;
    }

    .bannerOfSiteTOP{
        width: 100%;
        display: grid;
        grid-template-columns: auto auto auto auto auto;
        grid-gap: 12px;
        margin: 12px 0;
    }

    @media( min-width: 360px ){
        .bannerOfSiteTOP{
            grid-template-columns: 47.5px 47.5px auto 47.5px 47.5px;
        }
    }
</style>