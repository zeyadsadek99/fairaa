<template>
  <div class="course-ratings-column">
    <h3 class="title">
      {{ $t("TITLES.ratings") }}
    </h3>

    <MessagesCourseEmpty
      class="!h-[40vh] gap-4"
      :imageSrc="image1"
      :message="$t('MESSAGES.empty_rates')"
      v-if="courseRates?.length === 0"
    />

    <template v-else>
      <div v-for="comment in courseRates" :key="comment.id" class="rating-card">
        <div class="image-wrapper">
          <img
            :src="comment.user_Data.image"
            alt="Image"
            width="80"
            height="80"
            class="user-image"
          />
        </div>

        <div class="wrapper">
          <h5 class="name-and-rate">
            <span class="name">{{ comment.user_Data.fullname }}</span>
            <span class="rate">
              <SubjectsRatingStars dir="ltr" :rate="comment.rate" />
            </span>
          </h5>

          <h5 class="position">
            <span v-if="comment.user_Data.user_type === 'teacher'">{{
              $t("TITLES.teacher")
            }}</span>
            <span v-if="comment.user_Data.user_type === 'student'">{{
              $t("TITLES.student")
            }}</span>
            <span v-if="comment.user_Data.user_type === 'parent'">
              {{ $t("TITLES.parent") }}</span
            >
          </h5>

          <h5 class="comment">
            {{ comment.content }}
          </h5>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const { t } = useI18n();
import image1 from "/assets/media/empty_messages/empty _rate.png";

defineProps({
  courseRates: Array,
});
</script>

<style scoped>
.course-ratings-column {
  @apply p-2.5 border-2 border-secondaryTheme rounded-2xl;
  .title {
    @apply text-themeText text-3xl font-bold;
  }
  .image-wrapper {
    img {
      @apply object-cover rounded-full;
    }
  }
  .wrapper {
    @apply w-full;
    .name-and-rate {
      @apply flex items-center text-xl justify-between;
      .name {
        @apply font-medium;
      }
    }
    .position {
      @apply my-0.5 text-xl text-lightGray;
    }

    .comment {
      @apply  text-xl font-medium;
    }
  }
}
</style>
