<template >
  <v-app id="home" :key="_appKey">
      <v-app-bar app class="d-block" color="primary" dark>
          <div class="d-flex align-center">
              <h1 class="text-uppercase">Retro Games</h1>
          </div>
          <v-spacer></v-spacer>
      </v-app-bar>
      <v-main id="main">
          <v-container fluid class="games">
              <v-row>
                  <v-col cols="2" col-xs="12">
                      <Sidebar />
                  </v-col>
                  <v-col cols="10">
                      <router-view></router-view>
                  </v-col>
              </v-row>
          </v-container>
      </v-main>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Sidebar from "@/components/widgets/Sidebar.vue";

@Component({
    components: {Sidebar}
})

export default class App extends Vue{
}
</script>

<style lang="scss">
@font-face {
    font-family: "BackTo1982";
    src: local("BackTo1982"),
    url("./assets/fonts/BACKTO1982.TTF") format("truetype");
}
#home{
    margin: 0;
    padding: 0;
    #main{
        max-height: 100vh !important;
        overflow: hidden;
        .games{
            max-height: inherit !important;
        }
    }
}
</style>