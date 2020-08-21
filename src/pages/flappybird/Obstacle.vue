<template>
    <div v-if="obstacle_.visible" ref="obstacle" class="obstacle" :class="{ 'top-obstacle': top}">

    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-ignore */

    import {Component, Vue, Watch} from 'vue-property-decorator';
    import ILooseObject from "@/interfaces/ILooseObject";

    @Component
    export default class Obstacle extends Vue {
        top = false;
        $refs!: {
            [key: string]: HTMLDivElement;
        };

        obstacleTimerId = 0;

        obstacle_: ILooseObject =  {
            visible: true,
            gap: 430,
            left: 1
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

            // @ts-ignore
            this.$el.parentNode.removeChild(this.$el);
            this.$destroy();
        }

        createObstacle(){
            this.obstacle_.visible = true;
            this.obstacle_.left = 500;
            if(!this.top){
                this.obstacle_.bottom = Math.random() * 60;
            }else{
                this.obstacle_.bottom = (Math.random() * 60) + this.obstacle_.gap;
                this.obstacle_.left -= (Math.random() * 100);

            }
        }

        mounted(){
            this.createObstacle();
        }
    }
</script>

<style scoped lang="scss">

</style>