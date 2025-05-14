<template>
  <div>
    <Loader1 v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <div class="teachers-wrapper fadeIn">
        <ImageHeader
          bgColor="bg-[#F5ECFF]"
          bgImage="/media/shapes/pi_sempole.svg"
          :customStyle="{ marginLeft: '-80px' }"
          :title="$t('TITLES.teachers')"
          imageSrc="/media/images/pi.png"
        />

        <div class="container flex py-10 flex-col items-center">
          <div class="relative w-full max-w-3xl">
            <input
              type="text"
              v-model="searchKeyword"
              @keydown.enter="searchTeachers"
              :placeholder="$t('PLACEHOLDERS.search_for_teacher')"
              class="w-full py-3 pe-12 ps-14 text-lg bg-lightTheme border rounded-lg"
            />
            <IconsSearch
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
            />

            <img
              src="@/assets/media/icons/filter.png"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              @click="toggleDropdown"
              alt="Filter Icon"
            />

            <div
              v-if="showDropdown"
              class="absolute end-0 mt-2 top-12 w-48 md:w-56 bg-white shadow-md rounded-lg p-4 z-10"
            >
              <div class="space-y-3">
                <InputsSelectDropDown2
                  v-model="selectedSubjectId"
                  :options="subjects"
                  :placeholder="$t('PLACEHOLDERS.subject_name')"
                />

                <InputsSelectDropDown2
                  v-model="selectedCityId"
                  :options="cities"
                  :placeholder="$t('PLACEHOLDERS.city')"
                />

                <InputsSelectDropDown2
                  v-model="selectedDegreeId"
                  :options="degrees"
                  :placeholder="$t('PLACEHOLDERS.study_degree')"
                />

                <InputsSelectDropDown2
                  v-model="selectedSpecializationId"
                  :options="specializations"
                  :placeholder="$t('PLACEHOLDERS.teacher_specialty')"
                />

                <InputsSelectDropDown2
                  v-model="selectedRate"
                  name="rate"
                  :options="rateOptions"
                  :placeholder="$t('PLACEHOLDERS.rate')"
                />

                <div class="flex justify-between gap-6 mt-3">
                  <button class="btn" @click="filterTeachers">
                    {{ $t("BUTTONS.filter") }}
                  </button>
                  <button class="btn-clear text-lg pe-3" @click="resetFilters">
                    <IconsTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="container my-8">
          <div
            v-if="teachers.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
          >
            <TeacherCard
              v-for="teacher in paginatedTeachers"
              :key="teacher.id"
              :teacher="teacher"
            />
          </div>

          <div v-else class="text-center mt-6">
            <h4 class="text-midRed text-lg">{{ $t("TITLES.noTeachers") }}</h4>
          </div>

          <GlobalPagination
            v-if="totalPages > 1"
            :last_page="totalPages"
            :current_page="currentPage"
            @paginationClick="pagenationClick"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const axios = useNuxtApp().$axios;

const isLoading = ref(true);
const showDropdown = ref(false);
const teachers = ref([]);
const searchKeyword = ref("");
const selectedCityId = ref(null);
const selectedSubjectId = ref(null);
const selectedDegreeId = ref(null);
const selectedSpecializationId = ref(null);
const selectedRate = ref(null);
const currentPage = ref(1);

const itemsPerPage = 6;
const subjects = ref([]);
const cities = ref([]);
const degrees = ref([]);
const specializations = ref([]);
const { data, status, refresh } = await useLazyAsyncData("allTeachers", () =>
  axios
    .get("/student/all_teachers")
    .then((res) => {
      teachers.value = res.data.data;
    })
    .catch((error) => console.error("Error fetching courses:", error.response))
);

const getCities = async () => {
  try {
    const response = await axios.get("/cities", {});
    cities.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getDegrees = async () => {
  try {
    const response = await axios.get("/degrees");
    degrees.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getSubjects = async () => {
  try {
    const response = await axios.get("/student/all-subject-name");
    // subjects.value = response.data.data;

    subjects.value = response.data.data.map((item) => ({
      id: item.id,
      name: item.subject_name,
    }));
  } catch (error) {
    console.error(error);
  }
};
const rateOptions = ref([
  { id: 1, name: "1 star" },
  { id: 2, name: "2 stars" },
  { id: 3, name: "3 stars" },
  { id: 4, name: "4 stars" },
  { id: 5, name: "5 stars" },
]);
const searchTeachers = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get("/student/all_teachers", {
      params: {
        keyword: searchKeyword.value,
        city_id: selectedCityId.value,
        avg_rate: selectedRate.value,
        subject_id: selectedSubjectId.value,
        degree_id: selectedDegreeId.value,
        specialization_id: selectedSpecializationId.value,
      },
    });
    teachers.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const filterTeachers = () => {
  showDropdown.value = false;
  searchTeachers();
};

const resetFilters = () => {
  isLoading.value = false;

  selectedCityId.value = null;
  selectedRate.value = null;
  selectedSubjectId.value = null;
  selectedDegreeId.value = null;
  selectedSpecializationId.value = null;
  // getTeachers();
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const paginatedTeachers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return teachers.value.slice(start, start + itemsPerPage);
});

const pagenationClick = (pageNum) => {
  currentPage.value = pageNum;
};
const totalPages = computed(() => {
  return teachers.value.length > 0
    ? Math.ceil(teachers.value.length / itemsPerPage)
    : 1;
});

definePageMeta({
  middleware: "auth",
});

onMounted(() => {
  getCities();
  getDegrees();
  getSubjects();
});
</script>

<style scoped></style>
