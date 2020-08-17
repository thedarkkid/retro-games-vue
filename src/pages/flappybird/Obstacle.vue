<template>
    <div v-if="obstacle_.visible" ref="obstacle" class="obstacle">

    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import ILooseObject from "@/interfaces/ILooseObject";

    @Component
    export default class Obstacle extends Vue {

        $refs!: {
            [key: string]: HTMLDivElement;
        };

        obstacleTimerId = 0;

        obstacle_: ILooseObject =  {
            visible: true,
            left: 0
        };

        moveElement(prop: string){
            this.$refs[prop].style.bottom = this.$data[`${prop}_`].bottom +'px';
            this.$refs[prop].style.left = this.$data[`${prop}_`].left +'px';
            this.$refs[prop].style.top = this.$data[`${prop}_`].top +'px';
            this.$refs[prop].style.right = this.$data[`${prop}_`].right +'px';
            this.$refs[prop].style.height = this.$data[`${prop}_`].height +'px';
        }

        @Watch('obstacle_', {deep: true})
        onObstacleChange(){
            this.moveElement("obstacle");
        }

        destroyObstacle (){
            this.obstacle_.visible = false;
            clearInterval(this.obstacleTimerId);
            this.$el.parentNode.removeChild(this.$el);
            this.$destroy();
        }

        createObstacle(){
            this.obstacle_.visible = true;
            this.obstacle_.left = 500;
            this.obstacle_.bottom = Math.random() * 60;

            const moveObstacle = () =>{
                // if(this.obstacle_.left >0)
                if(this.obstacle_.left === -50) this.destroyObstacle();
                this.obstacle_.left -= 2;
            };

            this.obstacleTimerId = setInterval(moveObstacle, 20)
        }

        mounted(){
            this.createObstacle();
        }
    }
</script>

<style scoped lang="scss">

</style>