<template>
  <div class="favorites_wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.favorites") }}</template>
      <template #breadcrumb_current_page>{{ $t("TITLES.favorites") }}</template>
    </GlobalBreadCrumbs>

    <FavsStudentFavs v-if="type === 'student'" />

    <FavsTeacherFavs v-if="type === 'teacher'" />
  </div>
</template>

<script setup>
import { useAuthenticationStore } from "@/stores/authentication";
const store = useAuthenticationStore();
const { type } = storeToRefs(store);
definePageMeta({
  middleware: "auth",
});
</script>
