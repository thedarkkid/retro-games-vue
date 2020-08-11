<template>
  <v-app>
      <v-app-bar app class="d-block mb-5" color="primary" dark>
          <div class="d-flex align-center">
              <h1>Retro Games</h1>
          </div>
          <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
          <v-container fluid>
              <v-row no-gutters justify="left">
                  <v-col cols="2">
                      <Sidebar />
                  </v-col>
                  <v-col cols="9">
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

</style>