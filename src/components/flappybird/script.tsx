/* eslint-disable @typescript-eslint/ban-ts-ignore,@typescript-eslint/no-empty-function */

import {Component, Vue, Watch} from "vue-property-decorator";
import ILooseObject from "@/interfaces/ILooseObject";
import Obstacle from "@/pages/flappybird/Obstacle.vue";
import XObstacle from "@/interfaces/XObstacle";

@Component({
    components: {Obstacle}
})

export default class FlappyBird extends Vue{
    info = "Press enter to pause";
    $refs!: {
        [key: string]: HTMLDivElement;
    };

    birdDropTimerID = 0;
    gameTimerId = 0;
    obstacles: XObstacle[] = [];

    startGameScreen = false;
    gameOverScreen = false;

    gamePausedScreen = false;
    resumeGameScreen = false;

    difficulty = 1.5;
    score = 0;
    jumps = 0;

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
        if(this.bird_.bottom < 495){
            this.bird_.bottom += 50;
            this.increaseScore();
            this.increaseJumps();
        }
    }

    /****** GAME POINTS METHODS *******/
    increaseScore(){
        const calcScore = this.difficulty+(+1*(Math.random()*2));
        this.score += (calcScore >= 1) ? Math.floor(calcScore) : Math.ceil(calcScore);
    }

    increaseJumps(){
        this.jumps++;
    }

    /****** OBSTACLE METHODS *******/
    controlObstacles(){

        const generateObstacle = (top?: boolean) => {
            top = (top)? top : false;
            const obs = this.createObstacle(top);
            obs.$mount();
            const obsTimerID = setInterval( ()=>{this.moveObstacle(obs)}, 20);
            this.addObstacle({timerId:obsTimerID, obstacle:obs});
        }

    }

    manageObstacles(){
        // check obstacle array and delete useless ones
    }

    createObstacle(top?: boolean): Obstacle{
        top = (top)? top : false;

        // create Obstacle component
        const ComponentClass = Vue.extend(Obstacle);
        const instance = new ComponentClass();

        // modify properties
        instance.$data.top = top;

        // return obstacle
        return instance;
    }

    addObstacle(xObs: XObstacle){
        this.obstacles.push(xObs);
        this.$refs.gameContainer.appendChild(xObs.obstacle.$el);
    }

    stopObstacle(xObs: XObstacle){

    }

    moveObstacle(obstacle: Obstacle){
        obstacle.$data.obstacle_.left -= this.speed;
    }

    deleteObstacle(obstacle: Vue){

    }

    /****** GAME STATE METHODS *******/
    waiting(){
        this.startGameXCR(true);
        this.addStartGameEL();
    }

    startGame(){
        // remove overlay screen
        if(this.startGameScreen)this.startGameXCR(false);
        if(this.gameOverScreen)this.gameOverXCR(false);

        this.resetParameters();
        this.enableGravity();
        this.manageObstacles();

        // modify EL
        this.removeStartGameEL();
        this.addFlightEL();
        this.addPauseGameEL();
    }

    pauseGame(){
        // disable "gravity" and show game screen
        this.disableGravity();
        this.pauseGameXCR(true);

        // Modify EL
        this.removePauseGameEL();
        this.addResumeGameEL();
        this.removeFlightEL();
    }

    stopGame(){
        // Stops Game
        this.disableGravity();
        this.gameOverXCR(true);

        // Modify EL
        this.removeFlightEL();
        this.addStartGameEL();
    }

    resumeGame(){
        // enable game resumption
        this.pauseGameXCR(false);
        this.enableGravity();

        // Modify EL
        this.removeResumeGameEL();
        this.addPauseGameEL();
        this.addFlightEL();
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

    get speed(){
        return 2;
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
        this.obstacles = [];

        this.bird_ = Object.assign({}, this.defaultBird);
        this.birdDropTimerID = 0;
        this.gameTimerId = 0;

        this.startGameScreen = false;
        this.gameOverScreen = false;
        this.gamePausedScreen = false;
        this.resumeGameScreen = false;

        this.difficulty = 1.5;
        this.score = 0;
        this.jumps = 0;
    }

    gameOverlay(show: boolean){
        this.$refs.gameOverlay.style.display = (show)?"block":"none";
    }

    /****** TRIGGER METHODS *******/

    triggerFlight(e: KeyboardEvent){
        if(e.key === " "){
            this.fly()
        }
    }

    triggerGamePause(e: KeyboardEvent){
        if(e.key === "Enter"){
            this.pauseGame();
        }
    }

    /****** GAME RULES METHODS *******/



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

    addPauseGameEL(){
        document.addEventListener('keyup', this.triggerGamePause);
    }
    removePauseGameEL(){
        document.removeEventListener('keyup', this.triggerGamePause);
    }

    addResumeGameEL(){
        document.addEventListener('keyup', this.resumeGame);
    }
    removeResumeGameEL(){
        document.removeEventListener('keyup', this.resumeGame);
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