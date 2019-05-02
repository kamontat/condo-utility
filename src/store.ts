import Vue from 'vue';
import Vuex from 'vuex';

import { Unit } from './objects/abstacts';
import { Water } from './objects/water';
import { Electricity } from './objects/electricity';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    password: '',
    water: new Water(),
    electricity: new Electricity(),
  },
  mutations: {
    setPassword(state, password) {
      state.password = password;
    },
    addWater(state, unit: Unit) {
      state.water.addCollection(unit);
    },
    setWaterRules(state, rule: object) {
      state.water.saveRule(rule);
    },
    addElectricity(state, unit: Unit) {
      state.electricity.addCollection(unit);
    },
    setElectricityRules(state, rule: object) {
      state.electricity.saveRule(rule);
    },
  },
  actions: {
    setPassword(context, password) {
      context.commit('setPassword', password);
    },
    setWaterRules(context, rule) {
      context.commit('setWaterRules', rule);
    },
    setElectricityRules(context, rule) {
      context.commit('setElectricityRules', rule);
    },
    addWater(context, unit) {
      context.commit('addWater', unit);
    },
    addElectricity(context, unit) {
      context.commit('addElectricity', unit);
    },
  },
});
