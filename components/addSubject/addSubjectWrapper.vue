<template>
  <div class="add-subject-wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.add_subject") }}</template>
      <template #breadcrumb_current_page>{{
        $t("TITLES.add_subject")
      }}</template>
    </GlobalBreadCrumbs>

    <div class="add-subject-card-wrapper">
      <div class="container">
        <div class="tabs-add-subject">
          <ul
            class="flex items-center justify-between w-full md:w-[30%] mx-auto relative"
          >
            <li class="flex flex-col items-center text-center justify-center">
              <NuxtLink
                :to="localePath('/add-subject')"
                class="tab-link"
                :class="isStepActive(1) ? 'bg-mainTheme text-white' : ''"
              >
                1
              </NuxtLink>
              <h4 class="tab-title">{{ $t("TITLES.subject_details") }}</h4>
            </li>

            <li class="flex flex-col items-center">
              <NuxtLink
                :to="localePath('/add-subject/step-two')"
                class="tab-link"
                :class="
                  isStepActive(2) ? 'bg-mainTheme text-white' : 'disabled'
                "
              >
                2
              </NuxtLink>
              <div
                class="absolute top-[24%] left-[26%] w-1/2 border-t-2 border-dashed border-gray-300 z-[1]"
              ></div>
              <h4 class="tab-title">{{ $t("TITLES.subject_lessons") }}</h4>
            </li>

            <li class="flex flex-col items-center">
              <NuxtLink
                :to="localePath('/add-subject/step-three')"
                class="tab-link"
                :class="
                  isStepActive(3) ? 'bg-mainTheme text-white' : 'disabled'
                "
              >
                3
              </NuxtLink>
              <h4 class="tab-title">{{ $t("TITLES.subject_quizez") }}</h4>
            </li>
          </ul>
        </div>

        <div class="tab-content-add-subject">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const localePath = useLocalePath();

const isStepActive = (step) => {
  const steps = {
    "/add-subject": 1,
    "/add-subject/step-two": 2,
    "/add-subject/step-three": 3,
  };
  const currentStep = steps[route.path] || 1;
  return step <= currentStep;
};
</script>

<style scoped>
.add-subject-wrapper {
  @apply w-full;
  .add-subject-card-wrapper {
    @apply py-9;
    .tab-link {
      @apply size-[50px] flex items-center justify-center  mt-0 rounded-[10px] text-lightGray font-bold text-[1.8rem] transition;
    }
    .disabled {
      @apply text-black/25 cursor-not-allowed pointer-events-none;
    }
    .tab-title {
      @apply text-[1.8rem] font-medium mt-2;
    }
    .tab-content-add-subject {
      @apply py-9;
    }
  }
}
</style>
