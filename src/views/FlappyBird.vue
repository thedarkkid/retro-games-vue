<template>
    <v-app>
        <v-container class="mr-16">
            <v-row>
                <v-col cols="1">

                </v-col>
                <v-col>
                    <div class="game-container" ref="gameContainer">
                        <div class="sky" ref="sky">
                            <div class="bird" ref="bird">

                            </div>
                        </div>
                        <div class="ground" ref="ground">
                        </div>
                    </div>
                </v-col>
                <v-col>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import ILooseObject from "@/interfaces/ILooseObject";

@Component
export default class FlappyBird extends Vue{
    timerId = 0;

    $refs!: {
        bird: HTMLElement;
        gameDisplay: HTMLDivElement;
        ground: HTMLDivElement;
    };

    gameDisplay_: ILooseObject = {};

    bird_: ILooseObject = {
        left: 220,
        bottom: 100,
        gravity: 2
    };

    ground_: ILooseObject = {};

    startGame(){
        this.bird_.bottom -= 2;
    }

    stopGame(timerId: number){
        clearInterval(timerId)
    }

    jump(){
        this.bird_.bottom += 50;
    }

    moveBird(){
        this.$refs.bird.style.bottom = this.bird_.bottom+'px';
        this.$refs.bird.style.left = this.bird_.left+'px';
    }


    @Watch('bird_', {deep: true})
    onBirdChanged(){
        this.moveBird();
    }

    mounted(){
        this.timerId = setInterval(this.startGame, 20);
        document.addEventListener('keyup', this.jump);
    }
}
</script>

<style scoped lang="scss">
    .game-container{
        width: 500px;
        height: 730px;
        position: absolute;
        .sky{
            background-color: lightblue;
            width: 500px;
            height: 580px;
            position: absolute;
            .bird{
                background-color: yellow;
                position: absolute;
                height: 45px;
                width: 60px;
            }
        }
        .ground{
            background-color: brown;
            width: 500px;
            height: 150px;
            position: absolute;
            bottom: 0;
        }
    }
</style>