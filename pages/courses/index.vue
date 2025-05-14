<template>
  <div>
    <Loader1 v-if="status === 'pending'" />

    <template v-else-if="status === 'success'">
      <div class="relative fadeIn">
        <ImageHeader :title="$t('TITLES.all_courses')" />

        <div class="container">
          <h2 class="text-3xl text-themeText font-bold py-7">
            {{ $t("TITLES.subjects") }}
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <NuxtLink
              v-for="course in subjects"
              :key="course.id"
              :to="localePath('/courses/' + course.id)"
              class="block"
            >
              <div
                class="bg-white p-1 border-2 border-secondaryTheme shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:-translate-y-2"
              >
                <div class="w-full relative h-[170px] overflow-hidden">
                  <img
                    :src="course.specialization_ar"
                    alt="Course Category Image"
                    class="w-full h-full object-fill object-center rounded-2xl"
                  />
                </div>

                <div class="p-3 flex justify-between">
                  <div
                    class="flex flex-col text-xl font-semibold text-themeText"
                  >
                    <p>
                      {{ course.subject_name }}
                    </p>
                    <p class="flex gap-1">
                      <span>{{ course.num_of_courses }}</span>
                      <span class="">{{ $t("TITLES.course") }}</span>
                    </p>
                  </div>

                  <div class="">
                    <p class="flex gap-1 text-xl font-semibold text-themeText">
                      {{ course.num_of_teachers }}
                      <span>{{ $t("TITLES.teacher") }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <GlobalPagination
          :last_page="lastPage"
          :current_page="currentPage"
          @paginationClick="paginationClick"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
const axios = useNuxtApp().$axios;
const subjects = ref([]);
const localePath = useLocalePath();

const lastPage = ref(1);
const currentPage = ref(1);

const { data, status, refresh } = await useLazyAsyncData("subjectNames", () =>
  axios
    .get("student/all-subject-name")
    .then((res) => {
      subjects.value = res.data.data || [];
    })
    .catch((error) => console.error("Error fetching courses:", error.response))
);

const paginationClick = (pageNum) => {
  currentPage.value = pageNum;
  // refresh;
};
</script>

<style scoped></style>
