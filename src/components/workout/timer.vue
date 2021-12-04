<template>
    <div>
        <div style="height: 58px; width: 100%;"/>
        <div class="timer">
            <v-speed-dial
            v-model="fab"
            direction="top"
            transition="slide-y-reverse-transition"
            >
            <template v-slot:activator>
                <v-btn
                v-model="fab"
                color="#333"
                dark
                fab
                >
                <v-badge
                    v-if="fab"
                    :content="time"
                    :value="time"
                    color="primary"
                    overlap
                    bottom
                >
                    <v-icon>
                        fas fa-stopwatch
                    </v-icon>
                </v-badge>
                <v-badge
                    v-else
                    :content="time"
                    :value="time"
                    color="primary"
                    overlap
                    bottom
                >
                    <v-icon>
                        fas fa-stopwatch
                    </v-icon>
                </v-badge>
                </v-btn>
            </template>
            <v-btn
                v-if="!counting"
                fab
                dark
                small
                color="#333"
                @click.stop="remove()"
            >
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn
                v-if="!counting"
                fab
                dark
                small
                color="primary"
                @click.stop="add()"
            >
                <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
                v-if="!counting"
                fab
                dark
                small
                color="primary"
                @click="start()"
            >
                <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
                v-else
                fab
                dark
                small
                color="primary"
                @click="reset()"
            >
                <v-icon>mdi-stop</v-icon>
            </v-btn>
            <v-btn
                v-if="counting"
                fab
                dark
                small
                color="primary"
                @click="pause()"
            >
                <v-icon>mdi-pause</v-icon>
            </v-btn>
            </v-speed-dial>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        time: 0,
        time_basic: 0,
        fab: false,
        counting: false,
        tikTok: ''
    }),
    methods: {
        reset(){
            clearInterval(this.tikTok)
            this.time = this.time_basic
            this.counting = false
        },
        pause(){
            clearInterval(this.tikTok)
            this.counting = false
        },
        start(){
            if(this.time < 1){
                if(this.time_basic < 1) this.time = 0
                else this.time = this.time_basic
            }
            this.counting = true
            this.tikTok = setInterval(() => {
                if(this.time < 2){
                    clearInterval(this.tikTok)
                    this.counting = false
                }
                this.time--
            }, 1000)
            localStorage.setItem('workout_timer', JSON.stringify({
                "time_basic": this.time_basic,
                "last_count": new Date().getTime()
            }))
        },
        add(){ 
            this.time += 5
            this.time_basic++
            localStorage.setItem('workout_timer', JSON.stringify({
                "time_basic": this.time_basic,
                "last_count": 0
            }))
        },
        remove(){
            this.time--
            this.time_basic--
            localStorage.setItem('workout_timer', JSON.stringify({
                "time_basic": this.time_basic,
                "last_count": 0
            }))
        }
    },
    mounted(){
        const cachedObject = JSON.parse(localStorage.getItem('workout_timer'))
        const timeNOW = new Date().getTime()
        if(cachedObject){
            this.time_basic = cachedObject.time_basic
            if(cachedObject.last_count + cachedObject.time_basic * 1000 > timeNOW){
                this.counting = true
                this.time = (cachedObject.time_basic - (timeNOW - cachedObject.last_count) / 1000).toFixed()
                this.tikTok = setInterval(() => {
                    if(this.time < 2){
                        clearInterval(this.tikTok)
                        this.counting = false
                    }
                    this.time--
                }, 1000)
            }else{
                this.time = this.time_basic
                this.counting = false
            }
        }else{
            this.time = 60
            this.time_basic = 60
            this.counting = false
        }
    }
}
</script>

<style>

    .timer{
        position: fixed;
        bottom: calc( var(--padding-bottom-footer-menu) + 7px );
    }

    .timer .v-speed-dial--direction-top, .v-speed-dial__list{
        width: 56px !important;
    }

    .timer .v-badge__badge{
        border-radius: 50% !important;
    }

    .timer .v-speed-dial__list .v-btn{
        margin: 6px 8px;
    }

</style>