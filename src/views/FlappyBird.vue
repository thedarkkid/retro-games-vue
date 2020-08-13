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
                        <div ref="obstacle" v-if="obstacle_.visible" class="obstacle"></div>
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
import IBox from "@/interfaces/IBox";

@Component
export default class FlappyBird extends Vue{
    timerId = 0;

    $refs!: {
        [key: string]: HTMLDivElement;
    };

    gameDisplay_: ILooseObject = {};
    ground_: ILooseObject = {};

    bird_: ILooseObject = {
        visible: true,
        left: 220,
        bottom: 100,
        gravity: 2
    };

    obstacle_: IBox =  {
        visible: false,
        left: 0
    };

    startGame(){
        if(this.bird_.bottom > 0) this.bird_.bottom -= 2;
    }

    stopGame(timerId: number){
        clearInterval(timerId)
    }

    jump(){
        if(this.bird_.bottom < 495) this.bird_.bottom += 50;
    }

    moveBird(){
        this.$refs.bird.style.bottom = this.bird_.bottom+'px';
        this.$refs.bird.style.left = this.bird_.left+'px';
    }

    moveElement(prop: string){
        this.$refs[prop].style.bottom = this.$data[`${prop}_`].bottom +'px';
        this.$refs[prop].style.left = this.$data[`${prop}_`].left +'px';
        this.$refs[prop].style.top = this.$data[`${prop}_`].top +'px';
        this.$refs[prop].style.right = this.$data[`${prop}_`].right +'px';
    }

    generateObstacle(){
        this.obstacle_.visible = true;
        this.obstacle_.left = 500;
    }

    control(e: KeyboardEvent){
        if(e.keyCode === 32){
            this.jump()
        }
    }

    @Watch('bird_', {deep: true})
    onBirdChange(){
        this.moveElement("bird");
    }

    @Watch('obstacle_', {deep: true})
    onObstacleChange(){
        this.moveElement("obstacle");
    }

    mounted(){
        this.timerId = setInterval(this.startGame, 20);
        document.addEventListener('keyup', this.control);
        this.generateObstacle();
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
        .obstacle{
            background-color: darkslategrey;
            width: 60px;
            height: 300px;
            position: absolute;
        }
    }
</style>