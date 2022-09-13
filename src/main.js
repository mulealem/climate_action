import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./index.css";
import zircle from "zircle";
import "zircle/dist/zircle.css";
import "monday-ui-react-core/dist/main.css";
import VueApexCharts from "vue-apexcharts";
import axios from "axios";
import VueAxios from "vue-axios";
import VueTour from "vue-tour";
import "vue-tour/dist/vue-tour.css";
import VueNumber from "vue-number-animation";

Vue.use(VueNumber);
Vue.use(VueTour);

Vue.use(VueAxios, axios);
Vue.use(zircle);
Vue.use(VueApexCharts);

Vue.component("apexchart", VueApexCharts);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
