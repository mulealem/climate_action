<template>
  <div class="flex items-center">
    <!-- <span>Impact:</span> 50 -->
    <div
      v-for="i in 10"
      :key="i"
      :class="{ '!bg-green-500': isBarSelected(i) }"
      class="h-3 w-[2px] ml-[2px] bg-green-200"
    ></div>
  </div>
</template>
<script>
export default {
  props: ["impact"],
  name: "impact",
  methods: {
    isBarSelected(i) {
      var score = Math.ceil(this.impact / 10);
      if (i <= score) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
