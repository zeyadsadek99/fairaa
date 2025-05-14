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
  <div class="">
    <div class="container mx-auto">
      <GlobalHeader
        :title="$t('TITLES.teachers')"
        :showLink="true"
        routePath="/teachers"
        :linkText="$t('BUTTONS.show_all')"
      />

      <div class="relative mt-8">
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
          <SwiperSlide v-for="teacher in Items" :key="teacher.id">
            <NuxtLink
              :to="localePath(`/teachers/${teacher.id}`)"
              class="flex items-center gap-4 p-5 bg-lightTheme rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <div class="size-20 flex-shrink-0">
                <img
                  :src="teacher.profile_image"
                  :alt="teacher.user_type"
                  class="w-full h-full object-fill rounded-md"
                />
              </div>

              <div class="flex flex-col">
                <h2 class="text-2xl font-bold text-darkGray">
                  {{ teacher.fullname }}
                </h2>

                <div class="flex items-center text-midGray text-xl">
                  <span
                    v-for="(
                      specialization, index
                    ) in teacher.specializations.slice(0, 2)"
                    :key="specialization.id"
                  >
                    {{ specialization.name }}
                    <span v-if="index < teacher.specializations.length - 1">
                      /
                    </span>
                  </span>
                  <span v-if="teacher.specializations.length > 2">...</span>
                </div>
              </div>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>

        <div
          class="swiper-pagination mt-4 flex justify-center items-center"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
