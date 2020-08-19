/* eslint-disable @typescript-eslint/ban-ts-ignore,@typescript-eslint/no-empty-function */

import {Component, Vue, Watch} from "vue-property-decorator";
import ILooseObject from "@/interfaces/ILooseObject";
import Obstacle from "@/pages/flappybird/Obstacle.vue";

@Component({
    components: {Obstacle}
})

export default class FlappyBird extends Vue{
    $refs!: {
        [key: string]: HTMLDivElement;
    };

    birdDropTimerID = 0;
    obstacles: Map<number, Obstacle> = new Map<number, Obstacle>();

    startGameScreen = false;
    gameOverScreen = false;

    gamePausedScreen = false;
    resumeGameScreen = false;

    difficulty = 1.5;
    score = 0;

    defaultBird: ILooseObject = {
        visible: false,
        left: 220,
        bottom: 100,
        weight: 1
    };

    bird_: ILooseObject = Object.assign({}, this.defaultBird);

    /****** BIRD METHODS *******/
    drop(){
        if(this.bird_.bottom >= 0) this.bird_.bottom -= this.dropRate;
    }

    fly(){
        if(this.bird_.bottom < 495) this.bird_.bottom += 50;
    }

    /****** OBSTACLE METHODS *******/

    /****** GAME STATE METHODS *******/
    waiting(){
        this.startGameXCR(true);
        this.addStartGameEL();
    }

    startGame(){
        this.enableGravity();
        this.addFlightEL();
        this.removeStartGameEL();
        this.startGameXCR(false);
    }

    pauseGame(){

    }

    stopGame(){
        this.disableGravity();
        this.removeFlightEL();

    }

    restartGame(){
        this.resetParameters();
    }

    /****** WATCHERS *******/
    @Watch('bird_', {deep: true})
    onBirdChange(){
        // check if the
        if(this.bird_.bottom <= 0) this.stopGame();
        this.moveElement("bird");
    }

    /****** COMPUTED PROPERTIES *******/
    get dropRate(){
        return this.bird_.weight*this.difficulty;
    }

    /****** HELPERS *******/
    moveElement(prop: string){
        this.$refs[prop].style.bottom = this.$data[`${prop}_`].bottom +'px';
        this.$refs[prop].style.left = this.$data[`${prop}_`].left +'px';
        this.$refs[prop].style.top = this.$data[`${prop}_`].top +'px';
        this.$refs[prop].style.right = this.$data[`${prop}_`].right +'px';
        this.$refs[prop].style.height = this.$data[`${prop}_`].height +'px';
    }

    resetParameters(){
        this.bird_ = Object.assign({}, this.defaultBird);
        this.birdDropTimerID = 0;
        this.startGameScreen = false;
        this.gameOverScreen = false;
        this.score = 0;
    }

    gameOverlay(show: boolean){
        this.$refs.gameOverlay.style.display = (show)?"block":"none";
    }

    /****** TRIGGER METHODS *******/

    triggerFlight(e: KeyboardEvent){
        if(e.keyCode === 32){
            this.fly()
        }
    }


    /****** GAME SCREEN METHODS *******/
    pauseGameXCR(show: boolean){
        this.gamePausedScreen = show;
        this.resumeGameScreen = show;
        this.gameOverlay(show)
    }

    gameOverXCR(show: boolean){
        this.gameOverScreen = show;
        this.startGameScreen = show;
        this.gameOverlay(show)
    }

    startGameXCR(show: boolean){
        this.startGameScreen = show;
        this.gameOverlay(show);
    }

    /****** LISTENER METHODS *******/
    addFlightEL(){
        document.addEventListener('keyup', this.triggerFlight);
    }
    removeFlightEL(){
        document.removeEventListener('keyup', this.triggerFlight);
    }

    addStartGameEL(){
        document.addEventListener('keyup', this.startGame);
    }
    removeStartGameEL(){
        document.removeEventListener('keyup', this.startGame);
    }

    /****** INTERVAL METHODS *******/
    enableGravity(){
        this.birdDropTimerID = setInterval(this.drop, 20);
    }
    disableGravity(){
        clearInterval(this.birdDropTimerID)
    }

    /****** DEFAULT METHODS *******/
    mounted(){
        this.waiting();
    }


}