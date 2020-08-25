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
    _appKey = 1;

    birdDropTimerID = 0;
    gameTimerId = 0;

    obstacles: XObstacle[] = [];
    ctrlObs = false;

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
        if(!this.game || this.ctrlObs) return;
        this.ctrlObs = true;

        this.manageObstacles();

        const generateObstacle = (top?: boolean) => {
            top = (top)? top : false;
            const obs = this.createObstacle(top);
            obs.$mount();

            const xObs = {timerId:0, obstacle:obs};

            this.addObstacle(xObs);
            this.enableObstacle(xObs);
        };
        generateObstacle(true);
        generateObstacle();

        this.enableObsCTRL();
        this.ctrlObs = false;
    }

    manageObstacles(){
        // check obstacle array and delete useless ones
        const popObs = () => {
            if(this.obstacles.length <= 3) return;
            const currXObs: XObstacle = this.obstacles[0];
            const currObs: Vue = currXObs.obstacle;
            if (currObs.$data.obstacle_.left <= -50){
                this.deleteObstacle(currXObs);
                this.obstacles.shift();
            }
        };

        if(this.obstacles.length > 3) {
            for(let i=0; i<this.obstacles.length; i++) popObs();
        }
    }

    freezeObstacles(){
        const xObstacles: XObstacle[] = this.obstacles;
        for(let i =0; i<xObstacles.length; i++){
            this.disableObstacle(xObstacles[i]);
        }
    }

    unfreezeObstacles(){
        const xObstacles: XObstacle[] = this.obstacles;
        for(let i =0; i<xObstacles.length; i++){
            this.enableObstacle(xObstacles[i]);
        }
    }

    deleteObstacles(){
        for(let i = 0; i<this.obstacles.length; i++){
            this.deleteObstacle(this.obstacles[i]);
        }
    }

    createObstacle(top?: boolean): Vue{
        top = (top)? top : false;

        // create NObstacle component
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

    moveObstacle(obstacle: Vue){
        obstacle.$data.obstacle_.left -= this.speed;
    }

    deleteObstacle(xObs: XObstacle){
        clearInterval(xObs.timerId);
        xObs.obstacle.$destroy();
        // @ts-ignore
        xObs.obstacle.destroyObstacle();
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
        this.controlObstacles();

        // modify EL
        this.removeStartGameEL();
        this.addFlightEL();
        this.addPauseGameEL();
    }

    pauseGame(){
        // disable "gravity" and show game screen
        this.disableGravity();
        this.pauseGameXCR(true);
        this.freezeObstacles();
        this.disableObsCTRL();

        // Modify EL
        this.removePauseGameEL();
        this.addResumeGameEL();
        this.removeFlightEL();
    }

    stopGame(){
        // Stops Game
        this.disableGravity();
        this.gameOverXCR(true);
        setTimeout(this.freezeObstacles, 800);

        // Modify EL
        this.removeFlightEL();
        this.addStartGameEL();
    }

    resumeGame(){
        // enable game resumption
        this.pauseGameXCR(false);
        this.enableGravity();
        this.unfreezeObstacles();

        // Modify EL
        this.removeResumeGameEL();
        this.addPauseGameEL();
        this.addFlightEL();
    }


    /****** WATCHERS *******/
    @Watch('bird_', {deep: true})
    onBirdChange(){
        // check if the game is over.
        if(this.collision(this.bird_, this.obstacles)) this.stopGame();
        this.moveElement("bird");
    }

    /****** COMPUTED PROPERTIES *******/
    get dropRate(){
        return this.bird_.weight*this.difficulty;
    }

    get speed(){
        return 2;
    }

    get game(){
        return !(this.gameOverScreen || this.gamePausedScreen);
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
        this.deleteObstacles();
        this.obstacles = [];
        this.bird_ = Object.assign({}, this.defaultBird);
        this.birdDropTimerID = 0;
        this.gameTimerId = 0;

        this.ctrlObs = false;
        this.startGameScreen = false;
        this.gameOverScreen = false;
        this.gamePausedScreen = false;
        this.resumeGameScreen = false;

        this.difficulty = 1.5;
        this.score = 0;
        this.jumps = 0;

        this._appKey = 2;

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
    noXCrossRule = (obs: Vue) => { return !(obs.$data.obstacle_.left > 200 && obs.$data.obstacle_.left < 280 && this.bird_.left === 220)};
    noBirdBottomRule = (bird: ILooseObject) => { return !(bird.bottom < 0) };
    noBirdObsX = (obs: Vue) => {return !(this.bird_.bottom < obs.$data.obstacle_.bottom + 150)};
    noBirdTObsX = (obs: Vue) => { return !(this.bird_.bottom > obs.$data.obstacle_.bottom - 200)};

    collision = (bird: ILooseObject, obstacles: XObstacle[]): boolean => {
        if(obstacles.length < 2) return !this.noBirdBottomRule(bird);

        const bottomIdx =  obstacles.length-1;
        const topIdx = bottomIdx-1;

        const top: Vue = obstacles[topIdx].obstacle;
        const bottom: Vue = obstacles[bottomIdx].obstacle;

        return ( !this.noXCrossRule(bottom) && !this.noXCrossRule(top)  && (!this.noBirdObsX(bottom) || !this.noBirdTObsX(top)) || !this.noBirdBottomRule(bird) )
    };



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

    enableObstacle(xObs: XObstacle){
         xObs.timerId = setInterval( ()=>{this.moveObstacle(xObs.obstacle)}, 20);
    }
    disableObstacle(xObs: XObstacle){
        clearInterval(xObs.timerId);
        xObs.timerId = 0;
    }

    enableObsCTRL(){
       this.gameTimerId = setTimeout(this.controlObstacles, 3200);
    }
    disableObsCTRL(){
        this.gameTimerId = 0;
    }


    /****** DEFAULT METHODS *******/
    mounted(){
        this.waiting();
    }


}