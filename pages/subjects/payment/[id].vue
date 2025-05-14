<template>
  <div>
    <Loader1 v-if="status == 'pending'" />
    <template v-else-if="status == 'success'">
      <div class="relative">
        <ImageHeader
          bgColor="bg-[#bdfcd7]"
          :title="courseDetails?.subject_name?.subject_name"
        />

        <div class="relative">
          <div class="container mx-auto">
            <div class="flex justify-center">
              <div class="w-full md:w-2/3 lg:w-1/2">
                <div
                  class="relative mt-[-12%] w-full p-6 rounded-2xl z-20 bg-secondaryTheme flex justify-between items-center shadow-md"
                >
                  <div
                    class="flex flex-col justify-center border-2 border-lighterGray bg-lighterGray rounded-[10px]"
                  >
                    <h3 class=" text-[40px] text-themeText">
                      {{ courseDetails?.subject_name?.subject_name }}
                    </h3>
                    <h3 >
                      <span
                        class="text-2xl me-1 text-lightGray"
                        v-if="courseDetails?.diff_of_time?.day"
                      >
                        {{ courseDetails?.diff_of_time?.day }}
                        {{ $t("TITLES.day") }}
                      </span>
                      <span
                        class="text-2xl me-1 text-lightGray"
                        v-if="courseDetails?.diff_of_time?.hour"
                      >
                        {{ courseDetails?.diff_of_time?.hour }}
                        {{ $t("TITLES.hour") }}
                      </span>
                      <span
                        class="text-2xl me-1 text-lightGray"
                        v-if="courseDetails?.diff_of_time?.minute"
                      >
                        {{ courseDetails?.diff_of_time?.minute }}
                        {{ $t("TITLES.minute") }}
                      </span>
                      <span
                        class="text-2xl me-1 text-lightGray"
                        v-if="courseDetails?.diff_of_time?.second"
                      >
                        {{ courseDetails?.diff_of_time?.second }}
                        {{ $t("TITLES.second") }}
                      </span>
                    </h3>
                  </div>

                  <div
                    class="flex flex-col justify-center border-2 border-lighterGray bg-lighterGray rounded-[10px]"
                  >
                    <h3 class=" text-2xl text-lightGray">
                      {{ $t("TITLES.course_price") }}
                    </h3>
                    <h3 class=" text-[40px] text-themeText">
                      {{ courseDetails?.price }} {{ courseDetails?.currency }}
                    </h3>
                  </div>
                </div>

                <div class="mt-10">
                  <CoursesCourseRegisterPayment :listens="courseDetails" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAuthenticationStore } from "@/stores/authentication";

const route = useRoute();
const authStore = useAuthenticationStore();

const axios = useNuxtApp().$axios;
const courseDetails = ref(null);
const { type } = storeToRefs(authStore);
const url =
  type.value === "teacher"
    ? `teacher/category/subject/${route.params.id}`
    : `student/course/${route.params.id}`;

const {
  data,
  status,

  refresh,
} = await useLazyAsyncData("payment", () =>
  axios
    .get(url)
    .then((res) => {
      courseDetails.value = res.data.data;
    })
    .catch((error) => console.error("Error fetching payment details:", error))
);
</script>

<style scoped></style>
