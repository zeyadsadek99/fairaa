<template>
  <div class="rating flex flex-row-reverse">
    <span
      v-for="index in 5"
      :key="index"
      class="cursor-pointer"
      @mouseover="hoveredStar = index"
      @mouseleave="hoveredStar = null"
      @click="setRating(index)"
    >
      <svg
        v-if="index <= Math.floor(rate) || index <= hoveredStar"
        xmlns="http://www.w3.org/2000/svg"
        width="45"
        height="45"
        fill="currentColor"
        class="filled-star"
        viewBox="0 0 16 16"
      >
        <path
          d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
        />
      </svg>

      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="45"
        height="45"
        fill="#e4e5e9"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="empty-star"
        viewBox="0 0 24 24"
      >
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        ></polygon>
      </svg>
    </span>
  </div>
</template>

<script setup>

const emit = defineEmits(["update:modelValue"]);

const rate = ref(0);
const hoveredStar = ref(null);

// Emit rating value
const setRating = (star) => {
  rate.value = star;
  emit("update:modelValue", rate.value);
};
</script>

<style scoped>
.rating {
  @apply flex space-x-2;
  direction: rtl; 
}

.filled-star {
  @apply text-[#ffc107];
}

.empty-star {
  @apply text-[#e4e5e9];
}

.cursor-pointer {
  cursor: pointer;
}
</style>
