<template>
    <v-app>
        <v-container class="mr-16">
            <v-row>
                <v-col cols="1">

                </v-col>
                <v-col class="bod">
                    <div class="border-left"></div>
                    <div class="game-container" ref="gameContainer">
                        <div class="border-top"></div>
                        <div class="sky" ref="sky">
                            <div class="bird" ref="bird">

                            </div>
                        </div>

                        <div class="ground" ref="ground">
                        </div>
                    </div>
                    <div class="border-right"></div>
                </v-col>
                <v-col>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import {Component, Vue, Watch} from "vue-property-decorator";
import ILooseObject from "@/interfaces/ILooseObject";
import Obstacle from "@/pages/flappybird/Obstacle.vue";

@Component({
    components: {Obstacle}
})

export default class FlappyBird extends Vue{
    gameTimerId = 0;
    isGameOver = false;

    $refs!: {
        [key: string]: HTMLDivElement;
    };

    bird_: ILooseObject = {
        visible: false,
        left: 220,
        bottom: 100,
        gravity: 2
    };

    generateObstacles(){
        const ComponentClass = Vue.extend(Obstacle);
        const instance = new ComponentClass();
        const topInstance = new ComponentClass();

        if(!this.isGameOver){
            instance.$mount();

            topInstance.$data.top = true;
            topInstance.$mount();

            this.$refs.gameContainer.appendChild(instance.$el);
            this.$refs.gameContainer.appendChild(topInstance.$el);

            const moveObstacle = () =>{
                if(instance.$data.obstacle_.left < -10 || topInstance.$data.obstacle_.left < 5){
                    // @ts-ignore
                    instance.destroyObstacle();
                    // @ts-ignore
                    topInstance.destroyObstacle();
                }

                instance.$data.obstacle_.left -= 2;
                topInstance.$data.obstacle_.left -= 2;

                const obsLeft = instance.$data.obstacle_.left;
                const topObsLeft = topInstance.$data.obstacle_.left;

                const noXCrossRule = () => { return !(obsLeft > 200 && obsLeft < 280 && this.bird_.left === 220) };
                const noTopXCrossRule = () => { return !(topObsLeft > 200 && topObsLeft < 280 && this.bird_.left === 220) };
                const noBirdBottomRule = () => { return !(this.bird_.bottom === 0) };
                const noBirdObsX = () => {return !(this.bird_.bottom < instance.$data.obstacle_.bottom + 150)};
                const noBirdTObsX = () => { return !(this.bird_.bottom > topInstance.$data.obstacle_.bottom - 200)};

                if( !noXCrossRule() && !noTopXCrossRule()  && (!noBirdObsX() || !noBirdTObsX()) || !noBirdBottomRule() ){
                    this.stopGame();
                    clearInterval(instance.$data.obstacleTimerId);
                    clearInterval(topInstance.$data.obstacleTimerId);
                }
            };

            instance.$data.obstacleTimerId = setInterval(moveObstacle, 20);
            topInstance.$data.obstacleTimerId = setInterval(moveObstacle, 20);
            setTimeout(this.generateObstacles, 3000);
        }

    }


    jump(){
        // console.log("jump");
        if(this.bird_.bottom < 495) this.bird_.bottom += 50;
    }

    control(e: KeyboardEvent){
        if(e.keyCode === 32){
            this.jump()
        }
    }

    startGame(){
        if(this.bird_.bottom > 0) this.bird_.bottom -= 2;
    }

    stopGame(){
        this.isGameOver = true;
        clearInterval(this.gameTimerId);
        document.removeEventListener('keyup', this.control);
    }

    moveElement(prop: string){
        this.$refs[prop].style.bottom = this.$data[`${prop}_`].bottom +'px';
        this.$refs[prop].style.left = this.$data[`${prop}_`].left +'px';
        this.$refs[prop].style.top = this.$data[`${prop}_`].top +'px';
        this.$refs[prop].style.right = this.$data[`${prop}_`].right +'px';
        this.$refs[prop].style.height = this.$data[`${prop}_`].height +'px';
    }



    @Watch('bird_', {deep: true})
    onBirdChange(){
        if(this.bird_.bottom === 0 && !this.isGameOver) this.stopGame();
        if(!this.isGameOver) this.moveElement("bird");
    }


    mounted(){
        this.gameTimerId = setInterval(this.startGame, 20);
        document.addEventListener('keyup', this.control);
        this.generateObstacles();
    }
}
</script>

<style lang="scss">
    .bod{
        display: flex;
        .border-left {
            position: absolute;
            width: 80px;
            height: 1000px;
            top: -200px;
            background-color: white;
            z-index: +2;
        }
        .border-right {
            position: absolute;
            width: 80px;
            height: 800px;
            top: -50px;
            left: 746px;
            background-color: white;
            z-index: +2;
        }

        .game-container{
            width: 500px;
            height: 730px;
            position: absolute;
            .border-top{
                position: absolute;
                bottom: 730px;
                left: 80px;
                width: 420px;
                height: 100px;
                background-color: white;
                z-index: 2;
            }
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
                z-index: +1;
            }
            .obstacle{
                position: absolute;
                /*background-color: darkslategrey;*/
                background-image: url("../assets/pipe.png") ;
                background-size: 60px 300px;
                width: 60px;
                height: 300px;
            }
            .top-obstacle{
                transform: rotate(180deg);
            }

        }
    }
</style>