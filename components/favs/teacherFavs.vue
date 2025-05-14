<template>
  <div class="teacher-favs-wrapper py-9">
    <div class="container mx-auto px-4">
      <!-- START:: MAIN LOADER -->
      <Loader1 v-if="status == 'pending'" />
      <!-- END:: MAIN LOADER -->
      <template v-else-if="status == 'success'">
        <MessagesCourseEmpty
          :imageSrc="image1"
          :message="$t('TITLES.empty_courses')"
          v-if="favItems.length === 0"
        />
        <!-- START:: FAVORITES LIST -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <CoursesImageCard
            v-for="course in favItems"
            :key="course?.id"
            :image="course.dashboard_subject.image"
            :subjectName="course?.dashboard_subject.subject_name.subject_name"
            :price="course?.dashboard_subject.price"
            :Rate="course?.dashboard_subject.avg_rate"
            :link="{
              path: `/subjects/${course.dashboard_subject.id}`,
              query: { type: 'online' },
            }"
          />
        </div>
      </template>

      <!-- END:: FAVORITES LIST -->
    </div>
  </div>
</template>

<script setup>
const axios = useNuxtApp().$axios;
import image1 from "/assets/media/empty_messages/empty_courses.png";

// ✅ State
const favItems = ref([]);

// ✅ Fetch Favorite Items
const { data, status, refresh } = await useLazyAsyncData("favs", () =>
  axios
    .get("user/favourite")
    .then((res) => {
      favItems.value = res.data.data;
    })
    .catch((error) => console.error("Error fetching favorites:", error))
);
</script>

<style scoped>

</style>
