<template>
  <div class="h-full w-full overflow-hidden">
    <empty-state :onClick="openActions" v-if="!myActions" />
    <div class="h-full w-full flex flex-col pl-4 overflow-y-auto" v-else>
      <div class="flex justify-between items-center">
        <div class="text-xl">Actions</div>
        <div class="flex justify-end items-center m-3">
          <div>
            <button
              type="button"
              @click="openActions"
              class="monday-style-button monday-style-button--size-medium monday-style-button--kind-primary monday-style-button--color-primary has-style-size"
              data-testid="button"
              aria-disabled="false"
            >
              Add Action
            </button>
          </div>
        </div>
      </div>
      <div class="h-full w-full dark:text-white">
        <div
          class="py-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-3"
        >
          <div
            class="w-full bg-white dark:bg-[#181B34] dark:border-[#2e3250] rounded-lg border"
            v-for="(action, index) in myActions"
            :key="index"
          >
            <div
              class="flex justify-between items-center text-sm p-2 border-b dark:border-[#2e3250]"
            >
              <div class="flex justify-start items-center">
                <div class="mr-2 cursor-pointer" @click="showItemModal(action)">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M12.5148 2.49976C12.1212 2.49976 11.8022 2.82125 11.8022 3.21784 11.8022 3.61443 12.1212 3.93593 12.5148 3.93593H14.6466L10.7369 8.15315C10.4682 8.44295 10.4836 8.89735 10.7711 9.16809 11.0587 9.43883 11.5096 9.42339 11.7783 9.1336L15.5746 5.03862V7.28699C15.5746 7.68358 15.8936 8.00507 16.2872 8.00507 16.6807 8.00507 16.9997 7.68358 16.9997 7.28699V3.23812C17.0052 3.03946 16.9293 2.83946 16.7739 2.69313 16.6366 2.56389 16.4621 2.49986 16.288 2.49976L12.5148 2.49976zM9.26311 11.8464C9.53177 11.5566 9.51644 11.1022 9.22888 10.8314 8.94131 10.5607 8.4904 10.5761 8.22174 10.8659L4.42513 14.9612V12.7124C4.42513 12.3158 4.1061 11.9943 3.71256 11.9943 3.31903 11.9943 3 12.3158 3 12.7124V16.7815C3 16.8649 3.01412 16.945 3.04007 17.0195 3.07689 17.1255 3.13902 17.2244 3.22611 17.3064 3.36743 17.4394 3.54818 17.5034 3.72738 17.4996H7.48496C7.8785 17.4996 8.19752 17.1781 8.19752 16.7815 8.19752 16.3849 7.8785 16.0634 7.48496 16.0634H5.35358L9.26311 11.8464z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div class="bg-blue-500 bg-opacity-5 p-1 px-2 rounded-lg">
                  {{ action.category }}
                </div>
              </div>
              <div class="flex items-center">
                <impact :impact="action.impact" />
                <div class="w-6 h-6 p-1 cursor-pointer">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M6.53033 4.46967C6.23744 4.17678 5.76256 4.17678 5.46967 4.46967C5.17678 4.76256 5.17678 5.23744 5.46967 5.53033L9.46967 9.53033C9.76256 9.82322 10.2374 9.82322 10.5303 9.53033L14.5303 5.53033C14.8232 5.23744 14.8232 4.76256 14.5303 4.46967C14.2374 4.17678 13.7626 4.17678 13.4697 4.46967L10 7.93934L6.53033 4.46967ZM6.53033 10.4697C6.23744 10.1768 5.76256 10.1768 5.46967 10.4697C5.17678 10.7626 5.17678 11.2374 5.46967 11.5303L9.46967 15.5303C9.76256 15.8232 10.2374 15.8232 10.5303 15.5303L14.5303 11.5303C14.8232 11.2374 14.8232 10.7626 14.5303 10.4697C14.2374 10.1768 13.7626 10.1768 13.4697 10.4697L10 13.9393L6.53033 10.4697Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-2 py-3">{{ action.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import actions from "../assets/resources/actions-en.json";
import EmptyState from "@/components/emptyState.vue";
import Impact from "@/components/impact.vue";

import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
import { mapActions, mapGetters } from "vuex";

export default {
  name: "my-actions",
  components: {
    EmptyState,
    Impact,
  },
  created() {
    const callback = (res) => {
      this.getMyActions();
    };
    const unsubscribe = monday.listen("events", callback);

    this.getMyActions();
  },
  data() {
    return {
      tabs: [
        { title: "Actions", selected: true },
        { title: "Habits", selected: false },
      ],
      actionsList: [],
    };
  },
  computed: {
    ...mapGetters(["boardId", "myActions"]),
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
    showItemModal(action) {
      monday.execute("openItemCard", { itemId: action.itemId });
    },
    openActions() {
      var urlPath = "/actions";
      var urlParams = "";
      var height = "95vh";
      var width = "95vw";
      monday
        .execute("openAppFeatureModal", { urlPath, urlParams, height, width })
        .then((res) => {
          //  {"close": true}
          // The above is a callback to see if a user closed the modal from the inside. This is useful should you want to run some logic within the app window.
        });
    },
  },
};
</script>
