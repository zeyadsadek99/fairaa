<template>
  <div>
    <Loader1 v-if="status == 'pending'" />

    <template v-else-if="status == 'success'">
      <div class="relative fadeIn">
        <GlobalBreadCrumbs>
          <template v-slot:page_title>
            <span>{{ $t("TITLES.son_courses") }} </span>
          </template>
          <template v-slot:breadcrumb_current_page>
            <span>
              {{ $t("TITLES.son_courses") }}
            </span>
          </template>
        </GlobalBreadCrumbs>

        <div class="courses-content">
          <div class="container">

            <Loader1
              v-if="
                status == 'pending' &&
                currentTab === 'registered_courses' &&
                current_page === 1
              "
            />

            <div v-else class="fadeIn">
              <MessagesCourseEmpty
                :imageSrc="image1"
                :message="$t('TITLES.empty_courses')"
                v-if="registeredCourses?.length == 0"
              />

              <div
                v-else
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                <CoursesCourseCard
                  v-for="course in onlineCourses"
                  :key="course?.id"
                  :image="course?.image"
                  :subjectName="course?.subject_name"
                  :numHours="course?.num_of_hour"
                  :Rate="course?.avg_rate"
                  :experience="course?.experience"
                  :Year="course?.academic_year"
                  :Degree="course?.degree_name"
                  :StartDate="course?.start_date"
                  :price="course?.lesson_price"
                  :teacher="course?.teacher"
                  :link="
                    type === 'student'
                      ? `/student/course-details/record/${course.id}`
                      : `/parent/course-details/record/${course.id}`
                  "
                />
              </div>

              <GlobalPagination
                :last_page="last_page"
                :current_page="current_page"
                @pagenationClick="pagenationClick"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useAuthenticationStore } from "@/stores/authentication";

import image1 from "/assets/media/empty_messages/empty_courses.png";
const authStore = useAuthenticationStore();
const { t } = useI18n();

const route = useRoute();
const axios = useNuxtApp().$axios;
const isLoading = ref(true);
const subjects = ref([]);
const current_page = ref(1);
const registeredCourses = ref([]);
const onlineCourses = ref([]);
const { type } = storeToRefs(authStore);

const currentTab = ref("registered_courses");

const lastPage = ref(0);
const currentPage = ref(1);
const tabsContent = ref([
  { tab: t("TABS.registered_courses"), key_name: "registered_courses" },
  { tab: t("TABS.online_courses"), key_name: "online_courses" },
]);

const getCoursesData = async () => {
  isLoading.value = true;
  try {
    let response;

    response = await axios.get(
      `parent/subjectName?page=${currentPage.value}&student_id=${route.params.id}`,
      {}
    );

    subjects.value = response.data.data;
    lastPage.value = response.data.meta.last_page;
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    isLoading.value = false;
  }
};
const { data, status, refresh } = await useLazyAsyncData(
  "getCourseData",
  getCoursesData
);
const redirectRoute = (course_id) => {
  if (type.value === "teacher") {
    return `/teacher/course-details/online/${course_id}`;
  } else {
    return `/courses-categories/${course_id}`;
    // return `/courses/${course_id}`;
  }
};

const pagenationClick = (pageNum) => {
  currentPage.value = pageNum;
  getCoursesData();
};
</script>


