<template>
  <div class="section-title-wrapper flex items-center justify-between">
    <!-- ✅ Section Title -->
    <h2 class="title flex items-center gap-3">
      <img :src="iconSrc" :alt="title" class="w-12" />
      <span class="text-[2.3rem] font-bold text-themeText">
        {{ title }}
      </span>
    </h2>

    <!-- ✅ Optional Route Link -->
    <div class="route-wrapper" v-if="showLink">
      <NuxtLink
        class="block text-[22px] font-semibold text-mainTheme w-max"
        :to="localePath(routePath)"
      >
        {{ linkText }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import image1 from "/assets/media/shapes/title_icon.svg";
const localePath = useLocalePath();
defineProps({
  title: {
    type: String,
    required: true,
  },
  iconSrc: {
    type: String,
    default: image1, // Default Icon
  },
  showLink: {
    type: Boolean,
    default: false,
  },
  routePath: {
    type: String,
    default: "#",
  },
  linkText: {
    type: String,
    default: "Show All",
  },
});
</script>

<style scoped>
/* ✅ Tailwind applied via @apply */
.section-title-wrapper {
  @apply flex items-center justify-between;
}
.title {
  @apply flex items-center gap-3;
}
.route-wrapper a {
  @apply text-[22px] font-semibold text-mainTheme;
}
</style>
