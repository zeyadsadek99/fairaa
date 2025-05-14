<template>
  <NuxtLink :to="localePath(`/teachers/${teacher.id}`)" class="teacher-card">
    <div class="teacher-header">
      <img
        :src="teacher.profile_image"
        :alt="teacher.fullname"
        class="teacher-image"
      />
      <div class="teacher-details">
        <h2 class="teacher-name">{{ teacher.fullname }}</h2>
        <p class="teacher-specialization">
          {{
            teacher.specializations
              .map((s) => s.name)
              .slice(0, 2)
              .join(" / ")
          }}
          <span v-if="teacher.specializations.length > 2">...</span>
        </p>
      </div>
    </div>

    <p class="teacher-desc">{{ teacher.desc }}</p>
  </NuxtLink>
</template>

<script setup>
const localePath = useLocalePath();

const props = defineProps({
  teacher: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.teacher-card {
  @apply flex flex-col gap-4 p-6 bg-lightTheme rounded-[20px] shadow-md transition-all duration-300 hover:shadow-lg;
  .teacher-header {
    @apply flex items-center gap-6;
    .teacher-image {
      @apply size-32 rounded-xl object-cover;
    }
    .teacher-details {
      @apply flex flex-col;
      .teacher-name {
        @apply text-[2rem] font-bold text-themeText;
      }
      .teacher-specialization {
        @apply text-2xl text-secondary;
      }
    }
  }
  .teacher-desc {
    @apply text-2xl text-secondary mt-4;
  }
}
</style>
