<template>
    <section>
        <v-card elevation="12" class="ml-lg-16 mt-lg-16" width="256">
            <v-navigation-drawer floating permanent>
                <v-list dense shaped outlined>
                    <v-list-item v-for="item in navigation" :key="item.title" link>
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                <router-link :to="item.link" class="text-uppercase sidebar-list">{{ item.title }}</router-link>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </v-card>
    </section>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {State} from "vuex-class";

@Component
export default class Sidebar extends Vue {
    @State navigation!: object[];

}
</script>

<style scoped lang="scss">
    .sidebar-list{
        text-decoration: none;
    }
</style>