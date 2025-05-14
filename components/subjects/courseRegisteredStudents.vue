<template>
  <div class="registered-students-wrapper">
    <h3 class="title">
      <p class="">
        {{ $t("TITLES.registered_students") }}
        <span>
          ({{ courseRegisteredStudents.length }} {{ $t("TITLES.student") }})
        </span>
      </p>

      <button
        v-if="courseRegisteredStudents.length > 3"
        @click="toggleStudentsModal"
      >
        {{ $t("BUTTONS.show_all") }}
      </button>
    </h3>

    <div class="students-cards-wrapper">
      <div
        v-for="student in slicedStudentsArray"
        :key="student.id"
        class="student-card"
      >
        <div class="image-wrapper">
          <img
            :src="student.user.image"
            :alt="student.user.fullname"
            class="w-full h-full object-cover"
          />
        </div>

        <h3 class="name">
          {{ student.user.fullname }}
        </h3>
        <div class="options">
          <NuxtLink
            :to="localePath(`/reports/${student.user.id}`)"
            class="chat-route"
          >
            <IconsAddressCard />
          </NuxtLink>

          <NuxtLink
            :to="localePath(`/chat?chatId=${student.user.id}`)"
            class="chat-route"
          >
            <IconsChat class="size-7" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <ModalsRegisteredStudentsModal
      :students="courseRegisteredStudents"
      :modalApperanceData="studentsModalIsOpen"
      @controleModalApperance="toggleStudentsModal"
    />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const localePath = useLocalePath();

const props = defineProps({
  courseRegisteredStudents: Array,
});

const studentsModalIsOpen = ref(false);
const route = useRoute();
const courseId = ref(route.params.id);

const slicedStudentsArray = computed(() =>
  props.courseRegisteredStudents.slice(0, 3)
);

const toggleStudentsModal = () => {
  studentsModalIsOpen.value = !studentsModalIsOpen.value;
};
</script>

<style scoped>
.registered-students-wrapper {
  @apply p-4 w-full;
  .title {
    @apply mb-6 flex items-center justify-between;
    p {
      @apply text-themeText text-3xl font-bold;
      span {
        @apply text-lightGray text-2xl font-medium;
      }
    }
    button.all-registered-students-btn {
      @apply text-mainTheme text-lg;
    }
  }
  .students-cards-wrapper {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
    .student-card {
      @apply p-4 border-2 border-secondaryTheme rounded-xl flex flex-col items-center gap-3;
      .image-wrapper {
        @apply size-16 rounded-lg overflow-hidden;
        img {
          @apply rounded-lg object-cover;
        }
      }
      .name {
        @apply text-themeText text-xl font-bold;
      }

      .options {
        @apply flex flex-wrap items-center gap-4;
        .chat-route {
          @apply relative flex items-center justify-center size-11 text-center 
            text-white rounded-[10px]  py-1  
            transition-all !duration-[600ms] ease-in-out;
          background-image: linear-gradient(
            45deg,
            transparent 50%,
            var(--main_theme_clr) 50%
          );
          background-position: 100%;
          background-size: 400%;
          border: 1px solid var(--main_theme_clr);
          &:hover {
            @apply bg-[0px] text-mainTheme;
          }
        }
      }
    }
  }
}
</style>
