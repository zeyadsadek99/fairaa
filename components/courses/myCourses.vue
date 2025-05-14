<template>
  <div class="my_courses_wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.my_courses") }}</template>
      <template #breadcrumb_current_page>{{
        $t("TITLES.my_courses")
      }}</template>
    </GlobalBreadCrumbs>

    <Loader1 v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <div class="courses_cats_content_wrapper py-10" v-if="userType === 'student'">
        <div class="container">
          <GlobalTabs :tabsContent="tabsContent" @getItems="handleTabChange">
            <template #registered_courses>
              <Loader1
                v-if="
                  isLoading &&
                  currentTab === 'registered_courses' &&
                  current_page === 1
                "
              />
              <MessagesCourseEmpty
                :imageSrc="image1"
                :message="$t('TITLES.empty_courses')"
                v-else-if="registeredCourses.length === 0"
              />
              <div v-else>
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  <CoursesImageCard
                    v-for="course in registeredCourses"
                    :key="course.id"
                    :image="course.image"
                    :subjectName="course?.subject_name"
                    :price="course?.price"
                    :StartDate="course?.start_date"
                    :Rate="course?.avg_rate"
                    :teacher="course?.teacher"
                    :link="{
                      path: `/subjects/${course.id}`,
                      query: { type: 'record' },
                    }"
                  />
                </div>
                <GlobalPagination
                  :last_page="last_page"
                  :current_page="current_page"
                  @paginationClick="handlePagination"
                />
              </div>
            </template>

            <template #online_courses>
              <Loader1
                v-if="
                  isLoading &&
                  currentTab === 'online_courses' &&
                  current_page === 1
                "
              />
              <MessagesCourseEmpty
                :imageSrc="image1"
                :message="$t('TITLES.empty_courses')"
                v-else-if="onlineCourses.length === 0"
              />
              <div v-else>
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
                >
                  <CoursesImageCard
                    v-for="course in onlineCourses"
                    :key="course.id"
                    :image="course.image"
                    :subjectName="course?.subject_name"
                    :price="course?.price"
                    :StartDate="course?.start_date"
                    :Rate="course?.avg_rate"
                    :teacher="course?.teacher"
                    :link="{
                      path: `/subjects/${course.id}`,
                      query: { type: 'online' },
                    }"
                  />
                </div>
                <GlobalPagination
                  :last_page="last_page"
                  :current_page="current_page"
                  @paginationClick="handlePagination"
                />
              </div>
            </template>
          </GlobalTabs>
        </div>
      </div>
    </template>

 
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useStoreWishlist } from "@/stores/storeModule";
import image1 from "/assets/media/empty_messages/empty_courses.png";

const { t } = useI18n();
const store = useStoreWishlist();
const userType = useCookie("elmo3lm_elmosa3d_user_type").value;
const axios = useNuxtApp().$axios;
const isLoading = ref(false);
const currentTab = ref("registered_courses");
const registeredCourses = ref([]);
const onlineCourses = ref([]);
const teacherSubjects = ref([]);
const current_page = ref(1);
const last_page = ref(1);

const tabsContent = [
  { tab: t("TABS.registered_courses"), key_name: "registered_courses" },
  { tab: t("TABS.online_courses"), key_name: "online_courses" },
];

// Fetch courses
const fetchCourses = async () => {
  const endpoint =
    userType === "teacher"
      ? `user/subscription?page=${current_page.value}`
      : currentTab.value === "registered_courses"
      ? `student/my-courses?subject_kind=record&page=${current_page.value}`
      : `student/my-courses?subject_kind=online&page=${current_page.value}`;

  try {
    const res = await axios.get(endpoint);

    if (userType === "teacher") {
      teacherSubjects.value = res.data.data;
    } else if (currentTab.value === "registered_courses") {
      registeredCourses.value = res.data.data;
    } else {
      onlineCourses.value = res.data.data;
    }

    last_page.value = res.data.meta.last_page;
  } catch (error) {
    console.error("Error fetching courses:", error.response);
  }
};

const { data, status, refresh } = await useLazyAsyncData(
  "myCourses",
  fetchCourses
);

const handleTabChange = (tab) => {
  currentTab.value = tab;
  current_page.value = 1; 
  fetchCourses();
};

const handlePagination = (pageNum) => {
  current_page.value = pageNum;
  // fetchCourses();
};

// onMounted(fetchCourses);
</script>

<style scoped>



</style>
