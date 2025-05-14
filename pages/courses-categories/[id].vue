<template>
  <div>
    <Loader1 v-if="status === 'pending'" />

    <template v-else-if="status === 'success'">
      <div class="courses-section fadeIn">
        <ImageHeader :title="categoryData?.name" />

        <div class="section-content">
          <div class="container">
            <div
              class="section-top mb-8"
              v-if="$route.params.id !== 'distance-learning-lessons'"
            >
              <h2 class="section-title">{{ $t("TITLES.about_section") }}</h2>
              <p class="text-wrapper">{{ categoryData.desc }}</p>
            </div>

            <div class="subjects-wrapper">
              <h2 class="section-title">{{ $t("TITLES.subjects") }}</h2>
              <MessagesCourseEmpty
                v-if="subjects.length === 0"
                :imageSrc="image1"
                :message="$t('TITLES.empty_courses')"
              />

              <div
                v-else
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <NuxtLink
                  v-for="course in subjects"
                  :key="course.id"
                  :to="localePath(redirectRoute(course.id))"
                  class="block"
                >
                  <div
                    class="bg-white shadow-lg rounded-lg overflow-hidden p-3 transition-transform transform hover:-translate-y-2"
                  >
                    <div class="w-full h-48 rounded-lg overflow-hidden">
                      <img
                        :src="course.specialization_ar"
                        alt="Course Category Image"
                        class="w-full h-full object-fill"
                      />
                    </div>

                    <div class="p-4 flex justify-between">
                      <div class="flex flex-col">
                        <p class="text-xl font-semibold text-gray-800">
                          {{ course.subject_name }}
                        </p>
                        <p
                          class="text-xl flex gap-1 font-semibold text-midGray"
                        >
                          <span>{{ course.num_of_courses }}</span>
                          <span class="text-gray-500">{{
                            $t("TITLES.course")
                          }}</span>
                        </p>
                      </div>

                      <div>
                        <p
                          class="flex gap-1 text-xl font-semibold text-gray-800"
                        >
                          {{ course.num_of_teachers }}
                          <span class="text-gray-500">{{
                            $t("TITLES.teacher")
                          }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ✅ Pagination -->
    <GlobalPagination
      :last_page="lastPage"
      :current_page="currentPage"
      @paginationClick="paginationClick"
    />
  </div>
</template>

<script setup>
import image1 from "/assets/media/empty_messages/empty_courses.png";
import { useAuthenticationStore } from "@/stores/authentication";
const localePath = useLocalePath();

const axios = useNuxtApp().$axios;
const route = useRoute();
const subjects = ref([]);
const categoryData = ref({});
const authStore = useAuthenticationStore();

const { type } = storeToRefs(authStore);

const registeredUserType = ref(type.value);

const currentPage = ref(1);
const lastPage = ref(null);
let url = "";
if (route.params.id === "distance-learning-lessons") {
  url = "/student/all-subject-name";
} else if (registeredUserType.value === "teacher") {
  url = `/teacher/category/${route.params.id}`;
} else {
  url = `/student/category/courses/${route.params.id}?page=${currentPage.value}`;
}
const { data, status, refresh } = await useLazyAsyncData(
  "allSubjectNames",
  () =>
    axios
      .get(url)
      .then((res) => {
        if (route.params.id === "distance-learning-lessons") {
          subjects.value = res.data.data;
        } else {
          categoryData.value = res.data.category || res.data.data.category;
          subjects.value = res.data.data || res.data.subjects;
          lastPage.value = res.data.meta?.last_page || null;
        }
      })
      .catch((error) =>
        console.error("Error fetching courses:", error.response)
      )
);

const redirectRoute = (course_id) => {
  return registeredUserType.value == "teacher"
    ? `/subjects/${course_id}`
    : `/courses/${course_id}`;
};

const paginationClick = (pageNum) => {
  currentPage.value = pageNum;
};
</script>

<style scoped>
.courses-section {
  @apply relative;
}

.section-content {
  @apply py-10;
}

.section-title {
  @apply text-3xl font-bold text-themeText mb-2;
}

.text-wrapper {
  @apply text-[22px] break-words leading-[1.2]  text-lightGray;
}
</style>
