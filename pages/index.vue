<script setup>
import { useAuthenticationStore } from "@/stores/authentication";

const axios = useNuxtApp().$axios;
const authStore = useAuthenticationStore();
const { type } = storeToRefs(authStore);

const endpoint = computed(() => {
  if (type.value === "teacher") return "teacher/home";
  if (type.value === "student") return "student/home";
  if (type.value === "parent") return "parent/home";
  return "visitor/home";
});

const { data: homeData, status } = await useLazyAsyncData("home", () =>
  axios
    .get(`${endpoint.value}`)
    .then((res) => res.data)
    .catch((err) => err.response)
);
</script>

<template>
  <Loader1 v-if="status === 'pending'" />
  <template v-else-if="status === 'success'">
    <div class="home_wrapper space-y-20 fadeIn">
      <HomeTheSlider v-if="homeData" :sliderData="homeData?.data?.sliders" />
      <AboutUs
        v-if="homeData"
        :aboutUsData="homeData?.data?.about"
        :title="true"
      />
      <HomeCoursesCats
        v-if="(homeData && type === 'teacher') || type === 'student'"
        :courseCatsData="homeData?.data?.categories"
      />
      <HomeParentFeaturedCourses
        :Items="homeData?.data?.my_children"
        v-if="type === 'parent'"
      />
      <HomeStudentFeaturedTeachers
        :Items="homeData?.data?.teachers"
        v-if="type === 'student'"
      />
      <HomeStudentFeaturedCourses
        :Items="homeData?.data?.newer_subject_name"
        :title="true"
        v-if="type !== 'parent' && type !== 'teacher'"
      />
      <HomeTeacherFeaturedCourses
        :Items="homeData?.data?.my_subjects"
        v-if="type === 'teacher'"
      />
      <HomeContactUs
        :contactUsData="homeData?.data?.contacts"
        v-if="homeData"
      />
    </div>
  </template>
</template>
