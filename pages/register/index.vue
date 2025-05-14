<template>
  <div class="select_registeration_type_wrapper">
    <div class="form_title_wrapper">
      <div class="flex justify-center">
        <NuxtLink :to="localePath('/')" class="logo_wrapper">
          <img src="/logo.svg" alt="App Logo" class="w-[150px] h-[120px]" />
        </NuxtLink>
      </div>

      <h2 class="form_title">
        {{ t("TITLES.select_user_type") }}
      </h2>
    </div>

    <div class="routes_wrapper">
      <div class="container px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="register_type_wrapper">
            <NuxtLink
              :to="localePath('/register/register-teacher')"
              class="register_type_route"
            >
              <h3 class="font-semibold mb-4">
                {{ t("TITLES.teacher") }}
              </h3>
              <img
                src="/assets/media/persons_vectors/teacher.png"
                alt="Teacher Illustration"
                class="w-[200px] h-[180px] mx-auto"
              />
            </NuxtLink>
          </div>

          <div class="register_type_wrapper">
            <NuxtLink
              :to="localePath('/register/register-student')"
              class="register_type_route"
            >
              <h3 class="text-xl font-semibold mb-4">
                {{ t("TITLES.student") }}
              </h3>
              <img
                src="/assets/media/persons_vectors/student.png"
                alt="Student Illustration"
                class="w-[160px] h-[180px] mx-auto"
              />
            </NuxtLink>
          </div>
          <div class="register_type_wrapper">
            <NuxtLink
              :to="localePath('/register/register-parent')"
              class="register_type_route"
            >
              <h3 class="text-xl font-semibold mb-4">
                {{ t("TITLES.parent") }}
              </h3>
              <img
                src="/assets/media/persons_vectors/parent.png"
                alt="Parent Illustration"
                class="w-[160px] h-[180px] mx-auto"
              />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const localePath = useLocalePath();

definePageMeta({
  layout: "auth",
});
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped>
.select_registeration_type_wrapper {
  @apply w-full flex flex-col items-center justify-center py-10;
  .form_title_wrapper {
    @apply h-[30vh] lg:h-[40vh] flex flex-col items-center justify-center gap-2;
    .form_title {
      @apply text-2xl md:text-3xl text-center text-themeText font-bold;
    }
  }
  .routes_wrapper {
    @apply w-full  mt-10 mx-auto;
    .register_type_route {
      @apply relative flex items-center justify-between px-6 h-[160px] bg-softMainTheme rounded-2xl;
      img {
        @apply absolute left-0 bottom-0 transition-all duration-300 ease-in-out;
      }
      h3 {
        @apply text-[2.5rem] font-semibold text-mainTheme;
      }
    }
  }
}
</style>
