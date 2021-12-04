<template>
    <div class="productsBOX">
        <dialogDelete
            v-if="dialogDelete"
            @close="dialogDelete = false"
            @delete="deleteOWN()"
        />
        <v-lazy
            v-if="!exercise.deleted"
            v-model="isActive"
            :options="{
                threshold: .5
            }"
            min-height="96"
            transition="fade-transition"
        >
            <div class="BoxProductAdding" :style='[exercise.user_ID == this.$store.state.userToken._id ? { "border-left": "5px solid rgb(233, 145, 35)" } : {}]'>
                <div class="BoxProductAddingGrid">{{exercise.name}}</div>
                <div class="BoxProductAddingGrid" v-if="this.$store.state.userToken._id == exercise.user_ID && this.$store.state.online">
                    <v-btn @click="dialogDelete = true" icon>
                        <v-icon>fas fa-trash-alt</v-icon>
                    </v-btn>
                </div>
                <div class="BoxProductAddingGrid" v-else/>
                <div class="BoxProductAddingGrid">
                    <v-checkbox v-model="exercise.checked" @change="selectThoseExercise()"></v-checkbox>
                </div>
                <div class="BoxProductAddingGrid" v-if="exercise.second_language">{{exercise.second_language}}</div>
                <div class="BoxProductAddingGrid" v-else/>
            </div>
        </v-lazy>
    </div>
</template>

<script>
import dialogDelete from '@/components/universal/dialog/dialogDelete'
export default {
    name: 'productsBOX',
    data: () => {
        return {
            dialogDelete: false,
            isActive: false,
            deleteOWNloader: false
        }
    },
    props: {
        exercise: Object
    },
    methods: {
        async deleteOWN(){
            this.deleteOWNloader = true
            await this.$deleteThoseIDSfromDB("exercise", [this.exercise])
            .then(async () => {
                await this.$deleteIndexedDB("last_used_exercise", this.exercise._id)
            })
            .finally(() => {
                this.$emit('loadDefaultValues')
                this.dialogDelete = false
                this.deleteOWNloader = false
            })
        },
        async selectThoseExercise(){
            if(this.exercise.checked) this.exercise.checked = false
            else this.exercise.checked = true
            this.$emit('selectThisExercise', this.exercise._id)
        }
    },
    components: {
        dialogDelete
    }
}
</script>

<style scoped>

    .v-text-field.v-text-field--enclosed .v-text-field__details{
        display: none !important;
    }

    .productsBOX .add-product .d-flex{
        padding-bottom: 0;
    }

    .productsBOX .add-product .v-input{
        padding-top: 0;
    }

    .productsBOX .add-product .v-text-field__details{
        display: none;
    }

    .productsBOX .BoxProductAdding{
        width: 100%;
        padding: 10px 20px;
        border-radius: 4px;
        min-height: 1px;
        border: 1px solid #e4e4e4;
        display: grid;
        grid-template-columns: auto 44px 34px;
        margin-top: 10px;
        position: relative;
    }

    .productsBOX .BoxProductAddingGrid{
        margin: auto;
        width: 100%;
    }

    .productsBOX .BoxProductAddingGrid input{
        margin: auto;
        text-align: center;
        width: 100%;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(1){
        margin: auto auto 0 0;
        font-size: 1rem;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(2){
        border: none;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(3){
        grid-column: 3;
        grid-row: 1 /3;
        padding-left: 10px;
    }

    .productsBOX .BoxProductAddingGrid:nth-child(4){
        grid-column: 1 / 2;
        grid-row: 2;
        margin: 0 auto auto 0;
        font-size: 0.8rem;
        color: #a4a4a4;
    }

    .productsBOX .BoxProductAddingGrid .v-input__slot{
        margin-bottom: none;
        margin: 8px 0;
    }

    .productsBOX .BoxProductAdding .v-input--selection-controls__input{
        margin: auto !important;
    }

    .BoxProductAddingGrid .v-btn{
        margin: auto;
    }

    .BoxProductAddingGrid:nth-child(2){
        grid-column: 2;
        grid-row: 1 / 3;
    }

    .BoxProductAddingGrid:nth-child(2) i{
        color: #e4e4e4;
        font-size: 1rem;
    }

</style>