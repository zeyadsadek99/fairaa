<script setup>
import { useRoute } from "vue-router";
import { useAuthenticationStore } from "@/stores/authentication";
const axios = useNuxtApp().$axios;

const route = useRoute();
const authStore = useAuthenticationStore();

const { type } = storeToRefs(authStore);
const courseDetails = ref(null);
const courseRates = ref(null);
const courseType = route.query.type;

const routeName = ref(route.name);
const registeredUserType = ref(type.value);
let endpoint = "";
if (registeredUserType.value === "teacher") {
  endpoint = `teacher/subject/show/${route.params.id}`;
} else if (registeredUserType.value === "student") {
  endpoint = `student/course/${route.params.id}`;
} else if (registeredUserType.value === "parent") {
  endpoint = `parent/subject/${route.params.id}`;
}
const { data, status, refresh } = await useLazyAsyncData(
  "getCourseDetails",
  () =>
    axios
      .get(endpoint)
      .then((res) => {
        courseDetails.value = res.data.data;
      })
      .catch((error) => console.error("Error fetching course:", error))
);

const { data: rates } = await useLazyAsyncData("courseRates", () =>
  axios
    .get(`user/rate/${route.params.id}`)
    .then((res) => {
      courseRates.value = res.data.data || [];
    })
    .catch((error) => console.error("Error fetching rates:", error.response))
);
</script>

<template>
  <div>
    <Loader1 v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <div class="course-details-wrapper fadeIn">
        <ImageHeader
          bgColor="bg-[#bdfcd7]"
          :title="courseDetails.subject_name.subject_name"
        />

        <div class="course-details-content">
          <div
            class="container my-3 flex flex-col md:flex-row gap-6 py-9"
          >
            <SubjectsCourseAttactments
              class="max-md:order-2 w-full md:w-1/2"
              :description="courseDetails.desc"
              :goals="courseDetails.objectives"
              :enrichments="courseDetails.enriching"
              :attachments="courseDetails.attachments"
            />

            <div class="max-md:order-1 w-full md:w-1/2 space-y-6">
              <SubjectsCourseDetails
                :courseId="courseDetails.id"
                :subjectName="courseDetails?.subject_name?.subject_name"
                :subjectDescription="courseDetails.desc"
                :academicYear="courseDetails.academic_year"
                :duration="courseDetails.diff_of_time"
                :courseType="courseType"
                :routeName="routeName"
                :startDate="courseDetails.start_date"
                :courseRate="courseDetails.avg_rate"
                :coursePrice="courseDetails.price"
                :coursePriceAfterDiscount="courseDetails.price_after_discount"
                :courseCurrency="courseDetails.currency"
                :courseIsFavorite="courseDetails.is_fav"
                :courseIsSubscribed="courseDetails.is_subscribe"
                :lessons="courseDetails"
              />

              <SubjectsCourseLessons
                :courseType="courseType"
                :routeName="routeName"
                :lessonsList="courseDetails"
                @getDetailsAfterEdit="refresh"
              />

              <SubjectsCourseInstructor
                v-if="
                  registeredUserType == 'student' ||
                  registeredUserType == 'parent'
                "
                :instructor="courseDetails?.teacher"
              />

              <SubjectsCourseRegisteredStudents
                v-if="registeredUserType == 'teacher'"
                :courseRegisteredStudents="courseDetails?.subscription_data"
              />
            </div>
          </div>

          <div class="container my-3">
            <SubjectsCourseRatings :courseRates="courseRates" />
          </div>
          <div class="container my-3">
            <SubjectsSetCourseRate v-if="registeredUserType == 'student'" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
