<template>
  <div id="app">
    <div v-if="!password">
      Loading...
    </div>
    <div v-else>
      <input type="number" v-model="inputText" @keyup="v => (v.code === 'Enter') ? submit() : undefined">
      <button @click="submit">Submit</button>

      <ul>
        <li v-for="unit in water.list()">{{unit.number}} - {{new Date(unit.timestamp)}}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

import * as firebase from "firebase/app";
const db = firebase.database();

export default Vue.extend({
  name: "app",
  created() {
    db.ref("water")
      .once("value")
      .then(snapshot => {
        if (!snapshot) return undefined;

        const units = snapshot.val();
        if (units && units.length > 0) {
          units.forEach((unit: { number: number; timestamp: number }) => {
            this.$store.dispatch("addWater", unit);
          });
        }
      });

    return Promise.all([
      db
        .ref("securities/password")
        .once("value")
        .then(snapshot => {
          const pass = snapshot.val() || "password";
          // console.log(pass);
          return this.$store.dispatch("setPassword", pass);
        }),
      db
        .ref("constants")
        .once("value")
        .then(snapshot => {
          const prices = snapshot.val();
          if (prices) {
            return this.$store.dispatch("setWaterRules", prices.water);
            return this.$store.dispatch(
              "setElectricityRules",
              prices.electricity
            );
          }
        })
    ]);
  },
  data() {
    return {
      inputText: ""
    };
  },
  computed: mapState([
    // map this.count to store.state.count
    "password",
    "water",
    "electricity"
  ]),
  methods: {
    submit() {
      const unit = {
        number: parseInt(this.inputText, 10),
        timestamp: +new Date()
      };

      // TODO: do not fix to water utilities
      const length = this.water.length();
      this.$store.commit("addWater", unit);

      console.log(unit);
      db.ref(`water/${length}`).set(unit);
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
