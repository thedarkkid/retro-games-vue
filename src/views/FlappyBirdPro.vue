<template>
    <v-app>
        <v-container class="mr-16">
            <v-row>
                <v-col class="bod">
                    <div class="game-container" ref="gameContainer">
                        <div class="sky" ref="sky">
                            <div class="bird" ref="bird"></div>
                        </div>

                        <div class="ground" ref="ground">
                        </div>
                    </div>
                    <div class="game-overlay" ref="gameOverlay">
                        <div class="game-message">
                            <h1 v-if="gameOverScreen" class="mb-5 game-over text-uppercase">game over</h1>
                            <h1 v-if="gamePausedScreen" class="mb-5 game-over text-uppercase">game paused</h1>

                            <h1 v-if="startGameScreen" class="text-uppercase">press any key to start.</h1>
                            <h1 v-if="resumeGameScreen" class="text-uppercase">press any key to resume.</h1>
                        </div>
                    </div>
                </v-col>
                <v-col>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script type="text/tsx" src="../components/flappybird/script.tsx"></script>
<style type="text/css" src="../components/flappybird/style..scss" lang="scss"></style>