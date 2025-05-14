<template>
  <div class="w-full">
    <Loader1 v-if="status == 'pending'" />
    <template v-else-if="status == 'success'">
      <div class="terms_page_wrapper fadeIn">
        <GlobalBreadCrumbs>
          <template #page_title>
            {{ $t("TITLES.terms") }}
          </template>
          <template #breadcrumb_current_page>
            {{ $t("TITLES.terms") }}
          </template>
        </GlobalBreadCrumbs>

        <div class="container mx-auto mt-6">
          <div
            v-html="termsAndConditions"
            class="content py-9 space-y-4 text-[28px] text-themeText font-arb"
          ></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const axios = useNuxtApp().$axios;

const {
  data: termsAndConditions,
  status,

  refresh,
} = await useLazyAsyncData("terms", () =>
  axios
    .get(`terms`)
    .then((res) => res.data.data.terms)
    .catch((err) => err.response)
);
</script>

<style scoped>
.content h2 p {
  @apply mb-4;
}
</style>
