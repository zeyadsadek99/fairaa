<template>
  <div class="courses_categories_wrapper">
    <div class="container">
      <GlobalHeader :title="$t('TITLES.courses_cats')" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div v-for="category in courseCatsData" :key="category?.id">
          <NuxtLink
            :to="localePath(`/courses-categories/${category?.id}`)"
            class="card_content_wrapper"
          >
            <h3>{{ category?.name }}</h3>
            <img
              :src="category?.category_image"
              :alt="category?.name"
              class="w-[145px] h-[160px]"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const localePath = useLocalePath();
defineProps({
  courseCatsData: Array,
});
</script>
<style scoped>
.courses_categories_wrapper {
  .card_content_wrapper {
    @apply flex items-center justify-between gap-3 p-5 bg-lightTheme rounded-lg shadow-md transition-all duration-300 hover:shadow-lg pb-0 overflow-hidden relative;
    img {
      @apply object-contain relative bottom-[-5px];
    }
    h3 {
      @apply text-4xl font-semibold text-themeText;
    }
  }
}
</style>
