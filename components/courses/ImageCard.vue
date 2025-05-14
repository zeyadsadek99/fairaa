<template>
  <NuxtLink
    :to="localePath(link)"
    class="p-2 border-2 flex flex-col border-secondaryTheme rounded-2xl transition hover:shadow-xl overflow-hidden"
  >
    <div class="course-card">
      <div class="relative w-full !h-[170px]">
        <img
          :src="image"
          :alt="subjectName?.subject_name"
          class="w-full h-[170px] rounded-2xl object-fill object-center"
        />

        <div class="absolute inset-0 bg-[rgba(0,0,0,.4)] rounded-2xl">
          <div class="absolute bottom-2 right-2 flex items-center gap-3">
            <img
              :src="teacher?.image"
              :alt="teacher?.fullname"
              class="size-[50px] object-cover rounded-full"
            />
            <div>
              <p class="text-white text-lg font-semibold">
                {{ teacher?.fullname }}
              </p>
              <div class="flex items-center gap-1">
                <span class="text-gold text-lg font-semibold">
                  <IconsStar />
                </span>
                <span class="text-gold text-lg font-semibold mb-1">{{
                  Rate
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="py-2 px-5 flex justify-between flex-wrap">
        <div class="relative block w-full">
          <p class="text-themeText text-xl font-semibold">
            {{ subjectName?.subject_name }}
          </p>

          <p class="mb-1 font-semibold text-lg flex items-center gap-2">
            <span class="text-lightGray">تاريخ البدأ :</span>
            <span class="text-themeText">{{ StartDate }}</span>
          </p>
        </div>

        <!-- Price -->
        <p class="text-mainTheme text-2xl font-semibold">
          {{ price }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  image: String,
  subjectName: Object,
  Rate: Number,
  teacher: Object,
  StartDate: String,
  price: Number,
  link: Object,
});
const localePath = useLocalePath();
</script>

<style scoped></style>
