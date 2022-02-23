<template>
    <div class="search">
        <div class="contenerLOGGED">
            <div class="searchBOX">
                <v-text-field
                    :label='$t("universal.search")'
                    rows="1"
                    row-height="15"
                    v-model="search"
                    :loading="isLoading"
                ></v-text-field>
            </div>
            <div class="searchResultGrid">
                <searchResultBox
                v-for="(item, i) in usersFromDB"
                :key="item._id"
                :user="item"
                :index="i"
            />
            </div>
            <div class="endOfResults" v-if="endOfResults">
                Koniec wyników.
            </div>
            <div style="width: 100%; height: 43px;"/>
        </div>
    </div>
</template>

<script>
import searchResultBox from '@/components/search/searchResultBox'
export default {
    data: () => ({
        isLoading: false,
        search: null,
        timer: null,
        usersFromDB: [],
        endOfResults: false
    }),
    components : { searchResultBox },
    watch: {
        async search () {
            if(this.search.length && this.search.length > 2){
                this.isLoading = true
                this.endOfResults = false
                    if(this.timer){
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                    this.timer = setTimeout(async () => {
                        await this.$http.post('requests/find/user', {
                            key: this.search
                        })
                        .then(async (response) => {
                            await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                            this.usersFromDB = response.data.item
                            if(response.data.item.length == 10){
                                let last_searched_users = await this.$getAllIndexedDB('last_searched_users')
                                if(last_searched_users && last_searched_users.length > 0){
                                    for(let i=0; i<last_searched_users.length; i++){
                                        await this.$deleteIndexedDB('last_searched_users', last_searched_users[i]._id)
                                    }
                                }
                                await this.$addIndexedDB('last_searched_users', response.data.item)
                            }
                        })
                        .catch((err) => this.$catchThis(err))
                        this.isLoading = false
                        this.endOfResults = true
                    }, 1000);
            }else{
                this.usersFromDB = await this.$getAllIndexedDB('last_searched_users')
                this.endOfResults = false
            }
        }
    },
    async mounted(){
        let last_searched_users = await this.$getAllIndexedDB('last_searched_users')
        if(last_searched_users && last_searched_users.length > 0){
            this.usersFromDB = last_searched_users
        }else{
            // Placeholders for beginning values
            await this.$http.post('requests/find/user', {
                key: ''
            })
            .then(async (response) => {
                await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                this.usersFromDB = response.data.item
                await this.$addIndexedDB('last_searched_users', response.data.item)
            })
            .catch((err) => this.$catchThis(err))
        }
    }
}
</script>

<style>

    .searchResultGrid{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 12px;
        margin-bottom: 12px;
        position: relative;
    }

    .searchResultGrid .heightLikeWidthHolder{
        margin-top: 100%;
    }

    .searchResultGrid .searchResultElement{
        width: 100%;
        display: grid;
        position: relative;
        border-radius: 10px 10px 0 0;
        border-top: 1px solid #e4e4e4;
        border-left: 1px solid #e4e4e4;
        border-right: 1px solid #e4e4e4;
    }

    .searchResultGrid img{
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
        position: absolute;
    }

    .divWithImageCircular{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .searchResultsGridInfo{
        position: absolute;
        background: #333;
        color: #fff;
        bottom: 0;
        font-size: 0.875rem;
        width: 100%;
        padding: 5px 10px 5px 5px;
        border-radius: 0 9999px 0 0;
        z-index: 2;
    }

    .endOfResults{
        padding-top: 20px;
        text-align: center;
        font-size: 0.875rem;
    }

</style>