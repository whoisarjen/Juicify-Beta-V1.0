<template>
    <div class="searchBOX">
        <v-autocomplete
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            chips
            clearable
            hide-details
            hide-selected
            item-text="name"
            item-value="symbol"
            label="Wyszukaj..."
            solo
            prepend-icon="fas fa-search"
        >
            <template v-slot:no-data>
                <v-list-item>
                <v-list-item-title>
                    Kogo szukamy?
                </v-list-item-title>
                </v-list-item>
            </template>
            <template v-slot:selection="{ attr, on, item, selected }">
                <v-chip
                v-bind="attr"
                :input-value="selected"
                color="blue-grey"
                class="white--text"
                v-on="on"
                >
                <v-icon left>
                    fas fa-user
                </v-icon>
                <span v-text="item.login"></span>
                </v-chip>
            </template>
            <template v-slot:item="{ item }">
                <v-list-item-avatar
                    color="#333"
                    class="headline font-weight-light white--text"
                >
                {{ item.login.charAt(0) }}
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title v-text="item.login"></v-list-item-title>
                    <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-icon>fas fa-user</v-icon>
                </v-list-item-action>
            </template>
        </v-autocomplete>
    </div>
</template>

<script>
export default {
    data: () => ({
        isLoading: false,
        items: [],
        model: null,
        search: null,
        tab: null,
    }),
    watch: {
        model (val) {
            if (val != null) this.tab = 0
            else this.tab = null
        },
        async search (val) {
            // Items have already been loaded
            if (this.items.length > 0) return

            this.isLoading = true

            console.log(val)

            // Lazily load input items
            // fetch('https://api.coingecko.com/api/v3/coins/list')
                await this.$http.post('mongoDB/select',{
                    where: 'user'
                })
                .then(res => {
                    console.log(res)
                    this.items = res.data.item
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.isLoading = false))
        },
    },
}
</script>

<style>

    .searchBOX{
        width: 100%;
        max-width: 755px;
        margin: 0 auto;
    }

    .searchBOX .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)>.v-input__control>.v-input__slot{
        box-shadow: none !important;
    }

</style>