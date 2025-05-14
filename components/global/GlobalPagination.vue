<template>
  <div v-if="totalPages > 1" class="pagination">
    <v-pagination
      v-model="currentPage"
      :pages="totalPages"
      :range-size="1"
      active-color="mainTheme"
      class="custom-pagination"
      @update:modelValue="paginationClick"
    />
    <!-- <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="4"
      :hide-prev-next="true"
      color="mainTheme"
      active-color="mainTheme"
      class="custom-pagination"
      @update:model-value="paginationClick"
    /> -->
  </div>
</template>

<script setup>
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

// ✅ Props
const props = defineProps({
  last_page: { type: Number, required: true },
  current_page: { type: Number, required: true },
});

// ✅ Emits
const emit = defineEmits(["paginationClick"]);

// ✅ Reactive Current Page
const currentPage = ref(props.current_page);

// ✅ Compute Total Pages
const totalPages = computed(() => props.last_page || 1);

watch(
  () => props.current_page,
  (newPage) => {
    currentPage.value = newPage;
  }
);

const paginationClick = (pageNum) => {
  emit("paginationClick", pageNum);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<style scoped>
.pagination {
  @apply w-full flex justify-center py-6;
}

/* ✅ Custom Pagination Styling */
:deep(.Page) {
  @apply size-9 border rounded-md text-mainTheme  text-xl
         transition hover:!bg-themeInputs hover:!text-mainTheme;
}

/* ✅ Active Page Styling */
:deep(.Page-active) {
  @apply bg-mainTheme text-white !important;
}
:deep(.PaginationControl) {
  @apply rotate-180;
}

/* ✅ Centering Pagination
:deep(.v-pagination) {
  @apply flex justify-center;
}
:deep(.v-pagination .v-pagination__prev) {
  @apply hidden;
}
:deep(.v-pagination .v-pagination__next) {
  @apply hidden;
} */
</style>
