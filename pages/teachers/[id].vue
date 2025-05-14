<template>
  <div>
    <Loader1 v-if="status === 'pending'" />

    <template v-else-if="status === 'success'">
      <div class="teacher-profile fadeIn">
        <ImageHeader
          bgColor="bg-[#F5ECFF]"
          bgImage="/media/shapes/pi_sempole.svg"
          :customStyle="{ marginLeft: '-80px' }"
          :title="teacherDetails.fullname"
          :specializations="teacherDetails.specializations.slice(0, 2)"
        />

        <div class="courses-section">
          <div class="container">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8">
              <div>
                <h2 class="text-3xl font-arb font-bold">نبذة عنـي</h2>
                <p class="text-midGray text-xl mt-3">
                  {{ teacherDetails.desc }}
                </p>
              </div>

              <div>
                <video
                  ref="videoElement"
                  :src="teacherDetails.explanatory_video"
                  class="custom-video w-full h-96 rounded-xl shadow-md"
                  controls
                ></video>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-3xl font-bold flex items-center gap-3">
                <img
                  src="../../assets/media/shapes/title_icon.svg"
                  class="w-8"
                />
                {{ $t("TITLES.subjects") }}
              </h3>

              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
              >
                <div
                  v-for="specialization in teacherDetails.specializations"
                  :key="specialization.id"
                  class="subject-card"
                >
                  <img
                    :src="specialization.specialization_ar"
                    alt="subject"
                    class="w-28 h-32 object-contain rounded-lg"
                  />
                  <div class="ml-4">
                    <h2 class="text-[2rem] font-bold">
                      {{ specialization.name }}
                    </h2>
                  </div>
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
const axios = useNuxtApp().$axios;
const route = useRoute();
const teacherDetails = ref({});

const { data, status, refresh } = await useLazyAsyncData("teacherProfile", () =>
  axios
    .get(`/student/teacher_profile/${route.params.id}`)
    .then((res) => {
      teacherDetails.value = res.data.data;
    })
    .catch((error) => console.error("Error fetching courses:", error.response))
);
</script>

<style scoped>
.courses-section {
  @apply py-12;
  .subject-card {
    @apply flex items-center bg-white gap-5 border  border-gray-100 rounded-lg p-4 shadow-sm;
  }
  .custom-video {
    @apply w-full h-96 rounded-xl shadow-md;
  }
}
</style>
