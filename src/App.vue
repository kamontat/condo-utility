<template>
  <div id="app">
    <input id="username" class="username" :value="inputPassword" @input="updatePassword">
    <div id="nav">
      <router-link :to="`/${passwordParam}`">Home</router-link> |
      <router-link :to="`/utilities${passwordParam}&type=water`">Water</router-link> |
      <router-link :to="`/utilities${passwordParam}&type=electricity`">Electricity</router-link> | 
      <router-link :to="`/graph${passwordParam}`">Graph</router-link>
    </div>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  mounted() {
    this.$store.commit("inputPassword", this.$route.query.password);
  },
  computed: {
    passwordParam(): string {
      return `?password=${this.$store.state.inputPassword}`;
    },
    ...mapState(["inputPassword"])
  },
  methods: {
    updatePassword(e: { [key: string]: any }) {
      this.$store.commit("inputPassword", e.target.value);
    }
  }
});
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
