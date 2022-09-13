<template>
  <div
    class="h-screen w-screen flex flex-col dark:bg-[#181B34] dark:text-white !shadow-none"
  >
    <div
      class="h-14 w-full p-3 flex items-center border-b dark:border-b-[#2e3250]"
    >
      <button
        @click="$router.go(-1)"
        type="button"
        class="dark:!text-white dark:hover:!text-[#181B34] active:!text-[#181B34] monday-style-button monday-style-button--size-medium monday-style-button--kind-secondary monday-style-button--color-primary has-style-size"
        data-testid="button"
        aria-disabled="false"
      >
        <svg
          viewBox="0 0 20 20"
          width="20"
          height="20"
          aria-hidden="true"
          class="!fill-white mr-2"
        >
          <path
            d="M17.8921 10.071C17.8921 10.4853 17.5563 10.821 17.1421 10.821L4.81065 10.821L9.43897 15.4494C9.73186 15.7423 9.73186 16.2171 9.43897 16.51C9.14608 16.8029 8.6712 16.8029 8.37831 16.51L2.46966 10.6014C2.17677 10.3085 2.17677 9.83361 2.46966 9.54071L8.37831 3.63207C8.67121 3.33917 9.14608 3.33917 9.43897 3.63207C9.73187 3.92496 9.73187 4.39983 9.43897 4.69273L4.81065 9.32104L17.1421 9.32104C17.5563 9.32104 17.8921 9.65683 17.8921 10.071Z"
            class="fill-[#181B34] dark:fill-white"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path></svg
        ><span class="dark:text-white">Actions</span>
      </button>
    </div>
    <div class="h-full flex justify-center overflow-x-auto">
      <div class="h-full w-full min-w-max max-w-3xl py-5" v-if="action">
        <div class="flex justify-between items-center">
          <div class="text-2xl">{{ action.title }}</div>
          <div class="flex">
            <button
              type="button"
              @click="addAction"
              class="app-store-app-button monday-style-button monday-style-button--size-medium monday-style-button--kind-primary monday-style-button--color-primary has-style-size"
              data-testid="button"
              aria-disabled="false"
            >
              Add to my goals
            </button>
            <button
              type="button"
              class="ml-3 monday-style-button monday-style-button--size-medium monday-style-button--kind-secondary monday-style-button--color-primary has-style-size monday-style-button--no-side-padding"
              style="
                justify-content: center;
                align-items: center;
                padding: 0px;
                width: 40px;
                height: 40px;
              "
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="26"
                height="26"
              >
                <path
                  d="M6.5 3.75C6.4337 3.75 6.37011 3.77634 6.32322 3.82322C6.27634 3.87011 6.25 3.9337 6.25 4V16.5595L10.0699 13.8856C10.3281 13.7048 10.6719 13.7048 10.9301 13.8856L14.75 16.5595V4C14.75 3.9337 14.7237 3.87011 14.6768 3.82322C14.6299 3.77634 14.5663 3.75 14.5 3.75H6.5ZM14.2833 18.0638C14.4706 18.1949 14.6902 18.2721 14.9183 18.287C15.1464 18.3019 15.3742 18.254 15.577 18.1485C15.7798 18.043 15.9497 17.884 16.0684 17.6886C16.187 17.4932 16.2499 17.2691 16.25 17.0405V4C16.25 3.53587 16.0656 3.09075 15.7374 2.76256C15.4092 2.43437 14.9641 2.25 14.5 2.25H6.5C6.03587 2.25 5.59075 2.43437 5.26256 2.76256C4.93437 3.09075 4.75 3.53587 4.75 4V17.04C4.75015 17.2686 4.81297 17.4932 4.93163 17.6886C5.05029 17.8839 5.22025 18.043 5.42301 18.1485C5.62578 18.254 5.8536 18.3019 6.08168 18.287C6.30977 18.2721 6.52939 18.1949 6.71667 18.0638L10.5 15.4155L14.2833 18.0638Z"
                  class="fill-[#181B34] dark:fill-gray-500"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="h-80 w-full bg-gray-500 mt-3">
          <img
            :src="action.image_Url"
            :alt="action.title"
            class="w-full h-full border-0"
          />
        </div>
        <div class="w-full border-b dark:border-b-[#2e3250]">
          <ul class="w-full flex flex-row">
            <li
              class="p-2 flex justify-center items-center border-b-2 border-transparent px-5 cursor-pointer"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectTab(tab)"
              :class="{ '!border-blue-600': tab.selected }"
            >
              <div
                class="flex justify-center items-center hover:bg-gray-100 hover:dark:bg-[#12152e] p-1 px-2 rounded-lg"
              >
                <div>{{ tab.title }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="pt-2 max-w-3xl pb-7">
          <div
            v-if="selectedTab.title == 'Description'"
            v-html="action.description"
          >
            <!-- {{  }} -->
          </div>
          <div
            v-if="selectedTab.title == 'Tips'"
            v-html="structuredParagraph(action.tips)"
          >
            <!-- {{ action.tips }} -->
          </div>
          <div v-if="selectedTab.title == 'Resources'">
            <div
              v-html="resource"
              v-for="(resource, index) in getLinks(action.additional_resources)"
              :key="index"
            ></div>
            <!-- {{ action.additional_resources }} -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { supabase } from "../supabase";

import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

import LinkPreview from "@ashwamegh/vue-link-preview";

import { mapActions, mapGetters } from "vuex";
export default {
  name: "actions",
  components: {
    LinkPreview,
  },
  async created() {
    this.category = this.$route.params.category;
    let { data: action, error } = await supabase
      .from("actions")
      .select("*")
      .eq("id", this.$route.params.id)
      .single();
    this.action = action;
    monday
      .get("context")
      .then((res) => {
        this.$store.commit("setBoardId", res.data.boardId);
        var columnsQuery = `query{
                  boards(ids:[${res.data.boardId}]){
                    columns{
                      id,
                      title
                    }
                  }
                }`;
        monday
          .api(columnsQuery)
          .then((res) => {
            var columns = res.data.boards[0].columns;
            columns.forEach((column) => {
              if (column.title == "Impact") {
                this.impactColumnId = column.id;
              }
              if (column.title == "Category") {
                this.categoryColumnId = column.id;
              }
            });
          })
          .catch((err) => {
            this.err = err;
          });
      })
      .catch((err) => {});
  },
  data() {
    return {
      action: null,
      impactColumnId: null,
      categoryColumnId: null,
      category: null,
      tabs: [
        { title: "Description", selected: true },
        { title: "Tips", selected: false },
        { title: "Resources", selected: false },
      ],
    };
  },
  computed: {
    ...mapGetters(["boardId"]),
    selectedTab() {
      return this.tabs.filter((x) => x.selected == true)[0];
    },
  },
  methods: {
    ...mapActions(["getMyActions"]),
    selectTab(nav) {
      this.tabs.forEach((tab) => {
        tab.selected = false;
        if (tab.title == nav.title) {
          tab.selected = true;
        }
      });
    },
    back() {
      this.$router.push({ name: "actions" }).catch((err) => {});
    },
    addAction() {
      var createItemQuery = `mutation{
                    create_item(
                      item_name:"${this.action.title}",
                      board_id:${this.boardId},
                      column_values:"{\\"${this.impactColumnId}\\":\\"${this.action.impact}\\",\\"${this.categoryColumnId}\\":\\"${this.category}\\"}"
                    ) {
                      id,
                      name,
                      column_values{
                        title,
                        value
                      }
                    }
                  }`;
      monday
        .api(createItemQuery)
        .then((item) => {
          monday.execute("notice", {
            message: "New action have been successfully added",
            type: "success",
            timeout: 3000,
          });
          monday.execute("closeAppFeatureModal").then((res1) => {});
        })
        .catch((err) => {});
    },
    structuredParagraph(text) {
      if (text) {
        return text.replaceAll("• ", "<br/>• ");
      }
      return "";
    },
    getLinks(text) {
      if (text) {
        const result = text.split(/\r?\n/).filter((element) => element);
        return result;
      }
      return text;
    },
  },
};
</script>
