<template>
  <div :id="type" class="utilities">
    <div v-if="!password">
      Loading...
    </div>
    <div v-else>
      <p class="title"> 
        <label class="unit">Used {{getUtilities(type).getUnit()}} Unit</label> | <label class="price">{{getUtilities(type).getMonthlyPrice()}} THB</label>
      </p>

      <input type="number" v-model="inputText" @keyup="v => (v.code === 'Enter') ? submit() : undefined">
      <button @click="submit">Submit</button>

      <ul :key="$route.fullPath">
        <li v-for="unit in getUtilities(type).list()">{{unit.number}} - {{new Date(unit.timestamp)}}</li>
      </ul>
    </div>

    <div :key="$route.fullPath">
      <chart v-if="getUtilities(type).list() > 0" :chartdata="datasets" :type="type"></chart>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import Chart from "@/components/Chart.vue";

import * as firebase from "firebase/app";
import { Unit, Utilities } from "../objects/abstacts";
const db = firebase.database();

export default Vue.extend({
  name: "app",
  components: {
    chart: Chart
  },
  created() {
    this.type = this.$route.query.type.toString();

    db.ref(this.type)
      .once("value")
      .then(snapshot => {
        if (!snapshot) return undefined;

        const units = snapshot.val();
        if (units && units.length > 0) {
          units.forEach((unit: { number: number; timestamp: number }) => {
            const method = `add${this.type.substr(0, 1).toUpperCase() +
              this.type.substring(1)}`;
            this.$store.dispatch(method, unit);
          });
        }
      });

    return Promise.all([
      db
        .ref("securities/password")
        .once("value")
        .then(snapshot => {
          const pass = snapshot.val() || "password";

          this.$store.commit("inputPassword", this.$route.query.password);
          this.$store.commit("setPassword", pass);

          if (this.$store.state.inputPassword !== this.$store.state.password) {
            console.log(
              `no matches (password) ?? ${
                this.$store.state.inputPassword
              } !== ${this.$store.state.password}`
            );

            this.$router.replace("/");
          }
        }),
      db
        .ref("constants")
        .once("value")
        .then(snapshot => {
          const prices = snapshot.val();
          if (prices) {
            this.$store.commit("setWaterRules", prices.water);
            this.$store.commit("setElectricityRules", prices.electricity);
          }
        })
    ]);
  },
  watch: {
    "$route.query.type"() {
      this.type = this.$route.query.type.toString();
    }
  },
  data() {
    return {
      inputText: "",
      type: "electricity"
    };
  },
  computed: {
    queries(): object {
      return this.$route.query;
    },
    datasets(): object {
      return {
        datasets: [
          {
            label: this.type,
            backgroundColor: "#f87979",
            data: this.getUtilities(this.type)
              .list()
              .forEach((d: Unit) => ({
                x: d.timestamp,
                y: d.number
              }))
          }
        ]
      };
    },
    ...mapState([
      // map this.count to store.state.count
      "password",
      "water",
      "electricity"
    ])
  } as { [key: string]: any },
  methods: {
    getUtilities(type: string) {
      return this[this.type] as Utilities;
    },
    submit() {
      const unit = {
        number: parseInt(this.inputText, 10),
        timestamp: +new Date()
      };

      const length = (this[this.type] as Utilities).length();
      const method = `add${this.type.substr(0, 1).toUpperCase() +
        this.type.substring(1)}`;

      this.$store.commit(method, unit);

      console.log(unit);
      db.ref(`${this.type}/${length}`).set(unit);
    }
  }
});
</script>

<style lang="scss">
.utilities {
  margin-top: 60px;
}
</style>
