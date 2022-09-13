import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import MyActions from "../views/MyActions.vue";
import Actions from "../views/Actions.vue";
import ActionDetail from "../views/ActionDetail.vue";
import MyEmissions from "../views/MyEmissions.vue";
import PageNotFound from "../views/PageNotFound.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";
import TermsOfService from "../views/TermsOfService.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    redirect: { name: "myActions" },
    children: [
      {
        path: "",
        name: "myActions",
        component: MyActions,
      },
      {
        path: "/my-emissions",
        name: "myEmissions",
        component: MyEmissions,
      },
    ],
  },
  {
    path: "/actions",
    name: "actions",
    component: Actions,
  },
  {
    path: "/actions/:id",
    name: "actionDetail",
    component: ActionDetail,
  },
  {
    path: "/privacy-policy",
    name: "privacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/terms-of-service",
    name: "termsOfService",
    component: TermsOfService,
  },

  { path: "*", component: PageNotFound },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
