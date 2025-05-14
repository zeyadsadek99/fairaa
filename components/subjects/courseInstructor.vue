<template>
  <div class="instructor-info-wrapper">
    <h3 class="title">
      {{ $t("TITLES.instructor_info") }}
    </h3>

    <div class="instructor-info">
      <div class="card-wrapper">
        <div class="image-wrapper">
          <img
            :src="instructor.image"
            :alt="instructor.fullname"
            width="80"
            height="80"
            class="object-cover rounded-full"
          />
        </div>

        <div class="name-and-count">
          <h3 class="name">{{ instructor.fullname }}</h3>
          <h4 class="courses-count">
            {{ instructor.num_courses }} {{ $t("TITLES.course") }}
          </h4>
        </div>
      </div>

      <div class="card-wrapper">
        <NuxtLink
          :to="localePath(`/chat?chatId=${instructor.id}`)"
          class="chat-route"
        >
          <IconsChat class="size-7" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();
defineProps({
  instructor: Object,
});
</script>

<style scoped>
.instructor-info-wrapper {
  @apply p-3;
  .title {
    @apply mb-6 text-3xl font-bold text-themeText;
  }
  .instructor-info {
    @apply flex items-center justify-between;
    .card-wrapper {
      @apply flex items-center justify-center gap-3;
      .name-and-count {
        .name {
          @apply text-themeText font-medium mb-1 text-[1.75rem];
        }

        .courses-count {
          @apply text-lightGray text-2xl;
        }
      }
    }
    .chat-route {
      @apply size-11 flex items-center justify-center rounded-lg bg-secondaryTheme text-mainTheme;
    }
  }
}
</style>
