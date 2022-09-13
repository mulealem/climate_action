<template>
  <div class="h-full w-full flex flex-col dark:bg-[#181B34] dark:text-white">
    <div
      class="components-Heading-__stories__-Heading-stories-module__empty-state-container--c9plo h-full flex flex-col justify-center items-center"
      aria-labelledby="empty-state-id"
    >
      <img src="../assets/images/emptyState.svg" alt="" style="width: 290px" />
      <h2
        class="heading-component element-type-h2 size-large single-line-ellipsis"
        aria-label=""
        id="empty-state-id"
        style="--heading-clamp-lines: 1"
      >
        No Actions Found
      </h2>
      <span style="width: 50%; text-align: center"
        >The biggest impact we can have is taking small actions to make a change
        in the world.</span
      >
      <button
        type="button"
        @click="onClick"
        class="monday-style-button monday-style-button--size-medium monday-style-button--kind-primary monday-style-button--color-primary has-style-size mt-3"
        data-testid="button"
        aria-disabled="false"
      >
        Add Actions
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: ["onClick"],
  name: "empty-state",
};
</script>
