<template>
  <div :id="type" class="utilities">
    <div v-if="!password">
      Loading...
    </div>
    <div v-else>
      <p class="title">
        <label class="unit">Used {{ formatNumber(getUtilities(type).getUnit()) }} Unit</label> |
        <label class="price">~{{ formatNumber(getUtilities(type).getMonthlyPrice()) }} THB</label>
      </p>

      <div class="inputbar">
        <b-field grouped position="is-centered">
          <b-field>
            <b-numberinput
              v-model="inputText"
              @keyup="v => (v.code === 'Enter' ? submit() : undefined)"
              type="is-info"
              icon-pack="fas"
              :min="getUtilities(type).getLast().number"
            />
          </b-field>
          <b-field>
            <p class="control">
              <button class="button is-info" @click="submit">Submit</button>
            </p>
          </b-field>
        </b-field>
      </div>
    </div>

    <div class="chart" :key="$route.fullPath">
      <chart :chart-data="datasets"></chart>
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
            const method = `add${this.type.substr(0, 1).toUpperCase() + this.type.substring(1)}`;
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
              `no matches (password) ?? ${this.$store.state.inputPassword} !== ${this.$store.state.password}`
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
      const data = this.getUtilities(this.type)
        .list()
        .map((d: Unit) => ({
          t: d.timestamp,
          y: d.number
        }));
      return {
        datasets: [
          {
            label: this.type,
            backgroundColor: this.randomColor(),
            data
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
    randomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    getUtilities(type: string) {
      return this[this.type] as Utilities;
    },
    formatNumber(input: string | number): string {
      if (typeof input !== "string" && typeof input !== "number") return "";
      if (!input || input === "") return "";

      if (typeof input === "string") input = parseFloat(input);
      return input.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    },
    submit() {
      const unit = {
        number: parseInt(this.inputText, 10),
        timestamp: +new Date()
      };

      const length = (this[this.type] as Utilities).length();
      const method = `add${this.type.substr(0, 1).toUpperCase() + this.type.substring(1)}`;

      this.$store.commit(method, unit);
      db.ref(`${this.type}/${length}`).set(unit);
    }
  }
});
</script>

<style lang="scss">
.utilities {
  margin-right: 30px;
  margin-left: 30px;
}

.title {
}

.inputbar {
  margin-top: 24px;
  margin-bottom: 30px;
}

.chart {
}
</style>
