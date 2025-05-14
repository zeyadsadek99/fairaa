<template>
  <div class="featured-courses-wrapper ">
    <div class="container mx-auto">
      <GlobalHeader
        :title="$t('TITLES.added_by_you')"
        :showLink="true"
        routePath="/subjects"
        :linkText="$t('BUTTONS.show_all')"
      />

      <div class="featured-courses-slider-wrapper relative mt-8">
        <Swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :space-between="15"
          :loop="false"
          :autoplay="{ delay: 6000 }"
          :speed="2000"
          :pagination="{ clickable: true, el: '.swiper-pagination' }"
          :breakpoints="{
            0: { slidesPerView: 1 },
            400: { slidesPerView: 2 },
            815: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }"
          class="pb-12"
        >
          <SwiperSlide v-for="course in Items" :key="course.id">
            <SolidCard
              class="p-5 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <NuxtLink
                :to="
                  localePath({
                    path: `/subjects/${course.id}`,
                    query: { type: 'online' },
                  })
                "
                class="flex flex-col gap-4"
              >
                <div class="h-[170px] relative">
                  <img
                    :src="course.image"
                    alt="Course Category Image"
                    class="w-full h-full object-center rounded-md"
                  />
                </div>

                <div class="flex flex-col">
                  <p class="text-xl font-semibold text-themeText">
                    {{ course.subject_name.subject_name }}
                  </p>
                  <p class="text-xl font-semibold text-themeText">
                    {{ course.academic_year.name }}
                  </p>
                  <p class="text-xl font-semibold text-themeText">
                    {{ course.number_of_subscription }}
                    طالب مسجل
                  </p>

                  <div class="flex flex-col">
                    <p class="text-2xl text-mainTheme font-semibold">
                      {{ course.price }}
                      {{ course.currency }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </SolidCard>
          </SwiperSlide>
        </Swiper>

        <div class="swiper-pagination mt-4 flex justify-center"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SolidCard from "@/components/global/SolidCard.vue";

const localePath = useLocalePath();
const { t } = useI18n();

defineProps({
  Items: Array,
});
</script>

<style scoped>
/* ✅ Swiper Pagination */
.swiper-pagination {
  @apply flex justify-center items-center mt-4;
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
