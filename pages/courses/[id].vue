<template>
  <div class="courses-categories fadeIn">
    <ImageHeader
      bgColor="bg-[#bdfcd7]"
      :title="courseDetails?.subject_name?.subject_name"
    />

    <Loader1 v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <div class="courses-content py-10">
        <div class="container">
          <GlobalTabs :tabsContent="tabsContent" @getItems="getItems">
            <template #online_courses v-if="currentTab === 'online_courses'">
              <div class="fadeIn">
                <MessagesCourseEmpty
                  :imageSrc="image1"
                  :message="$t('TITLES.empty_courses')"
                  v-if="onlineCourses.length === 0"
                />

                <div
                  v-else
                  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
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
                    :link="{
                      path: `/subjects/${course.id}`,
                      query: { type: 'online' },
                    }"
                  />
                </div>

                <GlobalPagination
                  :last_page="last_page"
                  :current_page="current_page"
                  @paginationClick="pagenationClick"
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
import image1 from "/assets/media/empty_messages/empty_courses.png";
import { useAuthenticationStore } from "~/stores/authentication";

const axios = useNuxtApp().$axios;
const route = useRoute();
const authStore = useAuthenticationStore();

const courseDetails = ref(null);
const registeredCourses = ref([]);
const onlineCourses = ref([]);
const { t } = useI18n();
const { type } = storeToRefs(authStore);
const currentTab = ref("online_courses");
const last_page = ref(null);
const current_page = ref(1);

const tabsContent = ref([
  // { tab: t("TABS.registered_courses"), key_name: "registered_courses" },
  { tab: t("TABS.online_courses"), key_name: "online_courses" },
]);

let url = "";
if ((type.value = "student")) {
  url = `student/courses/${route.params.id}?page=${
    current_page.value
  }&subject_kind=${
    currentTab.value === "registered_courses" ? "record" : "online"
  }`;
} else if ((type.value = "parent")) {
  url = `parent/subjects/${route.params.id}/${route.query.sonId}?subject_kind=${
    currentTab.value === "registered_courses" ? "record" : "online"
  }`;
}

const { data, status, refresh } = await useLazyAsyncData("subjectNames", () =>
  axios
    .get(url)
    .then((res) => {
      courseDetails.value = res.data;
      last_page.value = res.data.meta?.last_page || null;
      if (currentTab.value === "registered_courses") {
        registeredCourses.value = res.data.data;
      } else {
        onlineCourses.value = res.data.data;
      }
    })
    .catch((error) => console.error("Error fetching courses:", error.response))
);

const getItems = (item) => {
  currentTab.value = item;
};

const pagenationClick = (pageNum) => {
  current_page.value = pageNum;
};
</script>

<style scoped></style>
