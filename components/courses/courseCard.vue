<template>
  <NuxtLink :to="localePath(link)">
    <div class="course-card">
      <div class="!h-[170px] relative">
        <img
          :src="image"
          :alt="subjectName"
          class="w-full h-[170px] object-center rounded-2xl"
        />
      </div>
      <div class="text-wrapper">
        <div class="wrapper">
          <div class="teacher">
            <p class="name">
              {{ $t("TITLES.teacher") }} : {{ teacher.fullname }}
            </p>
            <div class="text">
              <p class="course-name">{{ experience }}</p>
              <div class="rate">
                <IconsStar />
                <span>{{ Rate }}</span>
              </div>
            </div>
          </div>
          <hr />
          <div class="course_data">
            <p class="course-name">{{ subjectName.subject_name }}</p>
            <p class="course-degree">({{ Year.name }} - {{ Degree }})</p>
          </div>
          <p class="start-date">
            <span class="text">تاريخ البدأ </span>
            <span class="date">{{ StartDate }}</span>
          </p>
        </div>
        <div class="wrapper">
          <p class="price">سعر الحصة : {{ price }} ج.م</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  image: String,
  subjectName: Object,
  numHours: Number,
  Rate: Number,
  teacher: Object,
  experience: String,
  Year: Object,
  StartDate: String,
  price: Number,
  Degree: String,
  link: Object,
});
const localePath = useLocalePath();
</script>

<style scoped>
.course-card {
  @apply p-2  border-2 border-secondaryTheme rounded-2xl  transition hover:shadow-xl overflow-hidden;
  .wrapper {
    @apply relative w-full block;
    .teacher {
      p {
        @apply text-xl font-semibold;
      }
      .text {
        @apply flex justify-between;
        .rate {
          @apply flex gap-1 items-center;
          svg {
            @apply text-gold text-[22px];
          }
          span {
            @apply text-2xl text-themeText font-bold;
          }
        }
      }
    }
    .course_data {
      @apply flex justify-between;

      .course-name {
        @apply text-xl text-themeText font-semibold;
      }
      .course-degree {
        @apply ms-1 font-semibold text-xl  text-themeText;
      }
    }
    .start-date {
      @apply mb-1 flex items-center gap-2;
      span {
        @apply text-themeText font-semibold text-lg;
      }
      .text {
        @apply text-lightGray;
      }
    }
    .price {
      @apply text-2xl font-semibold text-mainTheme;
    }
  }
}
</style>
