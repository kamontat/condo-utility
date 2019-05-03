<template>
  <div id="app">
    <div class="nav">
      <div class="inputbar">
        <section>
          <b-field position="is-centered" type="is-dark">
            <b-input
              placeholder="Enter your code"
              type="username"
              :value="inputPassword"
              @input="updatePassword"
              icon-pack="fas"
            />
          </b-field>
        </section>
      </div>

      <div class="tabs is-centered">
        <ul>
          <li :class="$route.name === 'home' ? 'is-active' : ''">
            <router-link :to="`/${passwordParam}`">Home</router-link>
          </li>
          <li :class="$route.query && $route.query.type === 'water' ? 'is-active' : ''">
            <router-link :to="`/utilities${passwordParam}&type=water`">Water</router-link>
          </li>
          <li :class="$route.query && $route.query.type === 'electricity' ? 'is-active' : ''">
            <router-link :to="`/utilities${passwordParam}&type=electricity`">Electricity</router-link>
          </li>
        </ul>
      </div>
    </div>
    <router-view class="view" :key="$route.fullPath" />
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
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;

  font-family: "Avenir", Helvetica, Arial, sans-serif;

  text-align: center;
}

.nav {
  margin-top: 60px;
  margin-right: 24px;
  margin-left: 24px;
}

.view {
  margin-top: 45px;
}
</style>
