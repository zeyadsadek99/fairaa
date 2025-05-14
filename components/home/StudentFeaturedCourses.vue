<template>
  <div class="featured_courses_wrapper ">
    <div class="container">
      <GlobalHeader
        v-if="title"
        :title="$t('TITLES.recently_added')"
        :showLink="true"
        routePath="/courses"
        :linkText="$t('BUTTONS.show_all')"
      />
      <h2 v-else class="text-3xl text-themeText font-bold">
        {{ $t("TITLES.subjects") }}
      </h2>

      <div class="featured_courses_slider_wrapper mt-5 relative">
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
          <SwiperSlide v-for="course in Items" :key="course.id" class="">
            <NuxtLink :to="localePath('/courses/' + course.id)" class="block">
              <div
                class="bg-white p-1 border-2 border-secondaryTheme shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:-translate-y-2"
              >
                <div class="w-full relative h-[220px] overflow-hidden">
                  <img
                    :src="course.specialization_ar"
                    alt="Course Category Image"
                    class="w-full h-full object-fill object-center rounded-2xl"
                  />
                </div>

                <div class="p-2 flex justify-between">
                  <div class="flex flex-col">
                    <p class="text-xl font-semibold text-gray-800">
                      {{ course.subject_name }}
                    </p>
                    <p class="text-xl flex gap-1 font-semibold text-midGray">
                      <span>{{ course.num_of_courses }}</span>
                      <span class="text-gray-500">{{
                        $t("TITLES.course")
                      }}</span>
                    </p>
                  </div>

                  <div class="">
                    <p class="flex gap-1 text-xl font-semibold text-gray-800">
                      {{ course.num_of_teachers }}
                      <span class="text-midGray">{{
                        $t("TITLES.teacher")
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>

        <div
          class="swiper-pagination absolute bottom-0 left-1/2 transform -translate-x-1/2"
        ></div>
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
const localePath = useLocalePath();

const { t } = useI18n();

// Props
defineProps({
  Items: Array,
  title: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.swiper-pagination {
  @apply flex justify-center items-center mt-4;
}
</style>
