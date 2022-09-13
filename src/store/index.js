import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export default new Vuex.Store({
  state: {
    boardId: null,
    myActions: [],
  },
  getters: {
    boardId: (state) => {
      return state.boardId;
    },
    myActions: (state) => {
      return state.myActions;
    },
  },
  mutations: {
    setBoardId(state, payload) {
      state.boardId = payload;
    },
    setMyActions(state, payload) {
      state.myActions = payload;
    },
    addToMyActions(state, payload) {
      state.myActions.push(payload);
    },
  },
  actions: {
    getMyActions({ commit, dispatch }) {
      monday
        .get("context")
        .then((res) => {
          dispatch("getMyActions1", res);
        })
        .catch((err) => {});
    },
    getMyActions1({ commit, dispatch }, res) {
      var itemsQuery = `query{
        boards(ids:[${res.data.boardId}]){
          items{
            id,
            name,
            column_values{
              title,
              value
            }
          }
        }
      }`;
      monday
        .api(itemsQuery)
        .then((res) => {
          var tempActions = [];
          commit("setMyActions", tempActions);
          if (res.data.boards[0].items) {
            res.data.boards[0].items.forEach((item) => {
              var act = {};
              act.title = item.name;
              act.itemId = JSON.parse(item.id);
              if (item.column_values) {
                item.column_values.forEach((column_value) => {
                  if (column_value.title == "Impact") {
                    act.impact = JSON.parse(column_value.value);
                  }
                  if (column_value.title == "Category") {
                    act.category = JSON.parse(column_value.value);
                  }
                });
              }
              tempActions.push(act);
            });
          }
          commit("setMyActions", tempActions);
        })
        .catch((err) => {});
    },
  },
  modules: {},
});
