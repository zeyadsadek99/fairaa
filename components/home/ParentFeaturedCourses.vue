<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const localePath = useLocalePath();

defineProps({
  Items: Array,
});
</script>

<template>
  <div class="featured-courses-wrapper ">
    <div class="container mx-auto">
      <!-- ✅ Section Title -->
      <GlobalHeader
        :title="$t('TITLES.my_sons')"
        :showLink="true"
        routePath="/my-sons"
        :linkText="$t('BUTTONS.show_all')"
      />

      <!-- ✅ Featured Courses Slider -->
      <div class="featured-courses-slider-wrapper relative mt-5">
        <Swiper
          :modules="[Autoplay, Navigation, Pagination]"
          :slides-per-view="4"
          :space-between="15"
          :loop="false"
          :autoplay="{ delay: 6000 }"
          :pagination="{ clickable: true, el: '.swiper-pagination' }"
          :speed="2000"
          :breakpoints="{
            0: { slidesPerView: 1 },
            750: { slidesPerView: 2 },
            900: { slidesPerView: 4 },
          }"
          class="pb-12"
        >
          <SwiperSlide v-for="item in Items" :key="item.id" class="p-2">
            :to="`/my-sons/${item.user.id}`"
            <NuxtLink
              :to="localePath(`/my-sons/${item.user.id}`)"
              class="block"
            >
              <div
                class="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:-translate-y-2"
              >
                <div class="w-full h-48 overflow-hidden">
                  <img
                    :src="item.user.image"
                    alt="Course Category Image"
                    class="w-full h-full object-fill"
                  />
                </div>

                <div class="p-4 flex justify-between">
                  <div class="flex flex-col">
                    <p class="text-xl font-semibold text-gray-800">
                      {{ item.user.fullname }}
                    </p>
                    <p class="text-xl flex gap-1 font-semibold text-midGray">
                      <span>{{ item.user.academic_year.name }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
        <div
          class="swiper-pagination absolute bottom-0 text-mainTheme left-1/2 transform -translate-x-1/2"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swiper-pagination {
  @apply flex justify-center items-center mt-4;
}
</style>
