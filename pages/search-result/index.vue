<template>
  <div>
    <Loader1 v-if="isLoading" />

    <div class="strengthening_requests_courses_wrapper fadeIn" v-else>
      <ImageHeader
        :bgColor="type === 'teacher' ? 'bg-[#F5ECFF]' : 'bg-[#fff0e1]'"
        :title="
          type === 'subject_name'
            ? $t('TITLES.searchSubject')
            : $t('TITLES.searchTeacher')
        "
      />

      <div class="courses_wrapper py-5 fadeIn">
        <div class="container">
          <MessagesCourseEmpty
            v-if="subjects?.length === 0"
            :imageSrc="image1"
            :message="$t('TITLES.empty_search')"
          />

          <div v-else class="course_section_subjects_wrapper">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="course in subjects" :key="course.id">
                <div v-if="type === 'subject_name'">
                  <NuxtLink
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
                          <p>{{ course.subject_name }}</p>
                          <p class="flex gap-1">
                            <span>{{ course.num_of_courses }}</span>
                            <span>{{ $t("TITLES.course") }}</span>
                          </p>
                        </div>

                        <div>
                          <p
                            class="flex gap-1 text-xl font-semibold text-themeText"
                          >
                            {{ course.num_of_teachers }}
                            <span>{{ $t("TITLES.teacher") }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </NuxtLink>
                </div>

                <div
                  v-else-if="type === 'teacher'"
                  @click="toggleTeacherModal(course)"
                  class="bg-white p-1 border-2 border-secondaryTheme shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:-translate-y-2 cursor-pointer"
                >
                  <div class="w-full relative h-[170px] overflow-hidden">
                    <img
                      :src="course.image"
                      alt="Teacher Image"
                      class="w-full h-full object-fill object-center rounded-2xl"
                    />
                  </div>

                  <div class="relative w-full p-2 flex items-center gap-2">
                    <div class="flex items-center size-12 gap-2.5">
                      <img
                        :src="course.image"
                        alt="Teacher Image"
                        class="w-full h-full object-fill object-center rounded-full"
                      />
                    </div>
                    <div class="text">
                      <p class="name text-themeText text-lg font-semibold">
                        {{ course?.fullname }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalsTeacherModal
        :modalApperanceData="teacherModalIsOpen"
        :teacherData="selectedTeacher"
        @controleModalApperance="toggleTeacherModal"
      />
    </div>
  </div>
</template>

<script setup>
import image1 from "/assets/media/empty_messages/search_message.png";
const axios = useNuxtApp().$axios;
const isLoading = ref(true);
const subjects = ref([]);
const localePath = useLocalePath();

const teacherModalIsOpen = ref(false);
const selectedTeacher = ref(null);
const route = useRoute();
const type = ref(route.query.type);
const name = ref(route.query.name);

const getSearchResult = async () => {
  isLoading.value = true;
  const theData = new FormData();
  theData.append("name", name.value);
  theData.append("type", type.value);
  try {
    const response = await axios.post("search", theData);
    subjects.value = response.data.data;
  } catch (err) {
  } finally {
    isLoading.value = false;
  }
};

const toggleTeacherModal = (instructor) => {
  teacherModalIsOpen.value = !teacherModalIsOpen.value;
  selectedTeacher.value = instructor;
};

onMounted(() => {
  getSearchResult();
});
</script>

<style scoped></style>
