<template>
  <div
    class="h-screen w-screen flex flex-col dark:bg-[#181B34] dark:text-white"
  >
    <div
      class="h-14 w-full p-3 flex items-center border-b dark:border-b-[#2e3250]"
    >
      <div class="w-64">Climate Actions</div>
    </div>
    <div class="h-full w-full pt-2 pl-5 flex overflow-hidden">
      <div class="h-full w-64 flex flex-col">
        <div class="w-full text-lg p-2">Browse by Category</div>
        <div class="h-full w-full">
          <div
            @click="selectCategory(category)"
            class="p-2 rounded-lg hover:bg-blue-300 hover:bg-opacity-60 cursor-pointer"
            :class="{
              'bg-blue-300 bg-opacity-60 ': category.selected,
            }"
            v-for="(category, index) in categories"
            :key="index"
          >
            {{ category.title }}
          </div>
        </div>
      </div>
      <div
        class="h-full w-full flex flex-col pl-16 overflow-hidden overflow-y-scroll"
      >
        <div class="text-xl font-bold py-3" v-if="selectedCategory">
          {{ selectedCategory.title }}
        </div>
        <div
          class="h-full w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-2 pr-5"
        >
          <div
            class="w-full bg-white dark:bg-[#181B34] dark:border-[#2e3250] rounded-lg border hover:shadow-xl cursor-pointer"
            v-for="(action, index) in actionsList"
            :key="index"
            @click="showDetail(action)"
          >
            <div
              class="flex justify-between items-center text-sm p-2 border-b dark:border-[#2e3250]"
            >
              <div class="flex items-center">
                <span class="pr-2">Impact</span>
                <impact :impact="action.impact" />
              </div>
            </div>
            <div class="w-full overflow-hidden p-2">
              <img
                :src="action.image_Url"
                alt="family"
                class="h-48 w-full object-cover rounded-md"
              />
            </div>
            <div class="p-2 py-3 pt-0">{{ action.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { supabase } from "../supabase";
import Impact from "@/components/impact.vue";

export default {
  name: "actions",
  async created() {
    await this.getCategories();
    if (this.categories && this.categories.length > 0) {
      await this.selectCategory(this.categories[0]);
    }
  },
  components: {
    Impact,
  },
  data() {
    return {
      categories: [],
      actionsList: [],
      selectedCategory: null,
      isActionsListLoading: false,
    };
  },
  methods: {
    async getCategories() {
      let { data: categories, error } = await supabase
        .from("categories")
        .select("*");
      categories.forEach((category) => {
        category.selected = false;
      });
      this.categories = categories;
    },
    async getActionByCategorys(category) {
      this.isActionsListLoading = true;
      this.actionsList = [];
      let { data: actions, error } = await supabase
        .from("actions")
        .select("*")
        .contains("categories", [category]);
      this.actionsList = actions;
      this.isActionsListLoading = false;
    },
    async selectCategory(cat) {
      this.selectedCategory = cat;
      this.categories.forEach(async (category) => {
        category.selected = false;
        if (category.id == cat.id) {
          category.selected = true;
          await this.getActionByCategorys(category.title);
        }
      });
    },
    showDetail(action) {
      this.$router.push({
        name: "actionDetail",
        params: { id: action.id, category: this.selectedCategory.title },
      });
    },
  },
};
</script>
