<template>
    <v-data-table
        :headers="headers"
        :items="desserts"
        sort-by="calories"
        class="elevation-1"
    >
        <template v-slot:top>
        <v-toolbar
            flat
        >
            <v-toolbar-title>Products</v-toolbar-title>
            <v-divider
            class="mx-4"
            inset
            vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-btn
            color="primary"
            dark
            class="mb-2"
            :loading="loader"
            @click="loadProduct"
            >
            Load {{where}}
            </v-btn>
            <v-dialog
            v-model="dialog"
            max-width="500px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                <v-container>
                    <v-row>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.name"
                        label="Dessert name"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.code"
                        label="Barcode"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.p"
                        label="Protein (g)"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.c"
                        label="Carbs (g)"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.s"
                        label="Sugar (g)"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.f"
                        label="Fat (g)"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.fi"
                        label="Fiber (g)"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-text-field
                        v-model="editedItem.na"
                        label="Sodium (g)"
                        ></v-text-field>
                    </v-col>
                    </v-row>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                    Save
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog v-model="dialogAccept" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to accept this item?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeAccept">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="acceptItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="acceptItem(item)"
        >
            mdi-check
        </v-icon>
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
            mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
            mdi-delete
        </v-icon>
        </template>
    </v-data-table>
</template>

<script>
    export default {
        data: () => ({
            dialog: false,
            loader: false,
            dialogDelete: false,
            dialogAccept: false,
            headers: [
                {
                text: 'Name',
                align: 'start',
                sortable: false,
                value: 'name',
                },
                { text: 'Barcode', value: 'code' },
                { text: 'Protein', value: 'p' },
                { text: 'Carbs', value: 'c' },
                { text: 'Sugar', value: 's' },
                { text: 'Fat', value: 'f' },
                { text: 'Fiber', value: 'fi' },
                { text: 'Sodium', value: 'na' },
                { text: '', value: 'actions', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                calories: 0,
                fat: 0,
                carbs: 0,
                protein: 0,
            },
            defaultItem: {
                name: '',
                calories: 0,
                fat: 0,
                carbs: 0,
                protein: 0,
            },
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
            dialogDelete (val) {
                val || this.closeDelete()
            },
        },

        methods: {
            acceptItem(item){
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogAccept = true
            },

            acceptItemConfirm () {
                let item = JSON.parse(JSON.stringify(this.desserts[this.editedIndex]))
                delete item.user_ID;
                delete item.checkMe;
                item.v = true;
                if(!item.p) delete item.p
                if(!item.c) delete item.c
                if(!item.s) delete item.s
                if(!item.f) delete item.f
                if(!item.fi) delete item.fi
                if(!item.na) delete item.na
                if(!item.code) delete item.code
                this.$http.post('requests/admin/update/' + this.where, {
                    array: [item]
                })
                .then(async (response) => {
                    await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                    this.desserts.splice(this.editedIndex, 1)
                    this.closeAccept()
                    this.loadProduct()
                })
                .catch(async (err) => {
                    await this.$catchThis(err)
                })
            },

            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteItemConfirm () {
                this.desserts.splice(this.editedIndex, 1)
                this.closeDelete()
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },

            closeAccept () {
                this.dialogAccept = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },

            save () {
                if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {
                this.desserts.push(this.editedItem)
                }
                this.close()
            },

            async loadProduct(){
                this.loader = true;
                this.$http.post('requests/admin/find/' + this.where, {
                    limit: 1
                })
                .then(async (response) => {
                    await this.$gotNewToken(response.data.tokenGenerated, response.data.tokenRefreshGenerated)
                    this.desserts = response.data.array
                })
                .catch(async (err) => {
                    await this.$catchThis(err)
                })
                .finally(() => this.loader = false)
            }
        },
        props: {
            where: String
        }
    }
</script>