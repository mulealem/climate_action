<template>
  <div class="w-screen h-screen" :class="{ dark: darkMode }">
    <router-view />
  </div>
</template>
<script>
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
import { mapMutations } from "vuex";
export default {
  beforeCreate() {
    // if (this.$route.query.router == "actions" && this.$route.query.id) {
    //   this.$router
    //     .push({
    //       name: "actionDetail",
    //       params: { id: this.$route.query.id },
    //     })
    //     .catch((err) => {});
    // } else if (this.$route.query.router == "actions") {
    //   this.$router.push({ name: "actions" }).catch((err) => {});
    // } else if (this.$route.query.router == "languageSetting") {
    //   this.$router.push({ name: "languageSetting" }).catch((err) => {});
    // } else if (this.$route.query.router == "calculateEmission") {
    //   this.$router.push({ name: "calculateEmission" }).catch((err) => {});
    // } else if (this.$route.name) {
    //   this.$router.push({ name: this.$route.name }).catch((err) => {});
    // } else {
    //   this.$router.push({ name: "dashboard" }).catch((err) => {});
    // }
  },
  beforeMount() {
    monday
      .get("context")
      .then((res) => {
        this.context = res;
        if (this.context && this.context.data && this.context.data.theme) {
          this.darkMode = this.context.data.theme == "dark";
        }
      })
      .catch((err) => {
        this.err = err;
      });
  },
  data() {
    return {
      categories: [
        { name: "Family & Community", selected: true },
        { name: "Advocacy & Choice", selected: false },
        { name: "Outside", selected: false },
        { name: "Food", selected: false },
        { name: "Stuff", selected: false },
        { name: "Resilience", selected: false },
        { name: "Home & Work", selected: false },
        { name: "Energy", selected: false },
        { name: "Travel & Transport", selected: false },
      ],
      actionsList: [],
      steps: [
        {
          target: "#v-step-0", // We're using document.querySelector() under the hood
          content: `Discover <strong>Vue Tour</strong>!`,
        },
        {
          target: ".v-step-1",
          content: "An awesome plugin made with Vue.js!",
        },
        {
          target: '[data-v-step="2"]',
          content:
            "<div class='text-green-800'> Try it </div>, you'll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.",
          params: {
            placement: "top",
          },
        },
      ],
      darkMode: false,
      context: null,
    };
  },
  methods: {
    ...mapMutations(["setBoardId"]),
  },
};
</script>
