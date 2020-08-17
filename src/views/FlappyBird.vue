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
<!--                        <template v-for="(obstacle, index) in obstacles">-->
<!--                            <component :is="obstacle" :key="index"></component>-->
<!--                        </template>-->
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
import Obstacle from "@/pages/flappybird/Obstacle.vue";
@Component({
    components: {Obstacle}
})
export default class FlappyBird extends Vue{
    obstacles: Obstacle[] = [];
    gameTimerId = 0;
    isGameOver = false;

    $refs!: {
        [key: string]: HTMLDivElement;
    };


    gameContainer_: ILooseObject = {};
    ground_: ILooseObject = {};

    bird_: ILooseObject = {
        visible: false,
        left: 220,
        bottom: 100,
        gravity: 2
    };


    startGame(){
        if(this.bird_.bottom > 0) this.bird_.bottom -= 2;
    }

    stopGame(timerId: number){
        clearInterval(timerId)
    }

    generateObstacles(){
        const ComponentClass = Vue.extend(Obstacle);
        const instance = new ComponentClass();
        instance.$mount();
        this.$refs.gameContainer.appendChild(instance.$el);
        if(this.bird_.bottom === 0){
            this.stopGame(this.gameTimerId);
        }
        setTimeout(this.generateObstacles, 3000);
    }

    jump(){
        if(this.bird_.bottom < 495) this.bird_.bottom += 50;
    }

    moveElement(prop: string){
        this.$refs[prop].style.bottom = this.$data[`${prop}_`].bottom +'px';
        this.$refs[prop].style.left = this.$data[`${prop}_`].left +'px';
        this.$refs[prop].style.top = this.$data[`${prop}_`].top +'px';
        this.$refs[prop].style.right = this.$data[`${prop}_`].right +'px';
        this.$refs[prop].style.height = this.$data[`${prop}_`].height +'px';
    }

    control(e: KeyboardEvent){
        if(e.keyCode === 32){
            this.jump()
        }
    }

    @Watch('bird_', {deep: true})
    onBirdChange(){
        this.moveElement("bird");
        // if(this.obstacle_.left === 0)
    }


    mounted(){
        this.gameTimerId = setInterval(this.startGame, 20);
        document.addEventListener('keyup', this.control);
        this.generateObstacles();
    }
}
</script>

<style lang="scss">
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
            position: absolute;
            background-color: darkslategrey;
            width: 60px;
            height: 300px;
        }

    }
</style>