<template>
  <div class="slider-wrapper container">

    <swiper
      :modules="[Autoplay, Pagination]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 6000 }"
      :speed="2000"
      :pagination="{ clickable: true }"
      :dir="appLocale === 'ar' ? 'rtl' : 'ltr'"
      class="relative"
    >
      <swiper-slide
        v-for="slide in sliderData"
        :key="slide.id"
        class="relative w-full rounded-2xl"
      >
        <img
          :src="slide.slider"
          alt="Slider Image"
          class="w-full h-[180px] md:h-[350px] lg:h-[450px] rounded-2xl object-fill"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const { locale } = useI18n();
const appLocale = computed(() => locale.value);

// ✅ Props
defineProps({
  sliderData: Array,
});
</script>

<style scoped>
.swiper-pagination {
  @apply mt-4 flex justify-center items-center;
}

:deep(.swiper-pagination-bullets) {
  @apply flex justify-center items-center gap-1 mt-4;
}

:deep(.swiper-pagination-bullet) {
  @apply size-[10px] rounded-full bg-mainTheme transition-all duration-300 ease-in-out opacity-30 scale-100;
}

:deep(.swiper-pagination-bullet-active) {
  @apply bg-mainTheme opacity-100 scale-125;
}
</style>
