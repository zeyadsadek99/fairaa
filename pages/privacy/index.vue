<template>
  <div class="w-full">
    <Loader1 v-if="status == 'pending'" />
    <template v-else-if="status == 'success'">
      <div class="privacy_policy_page_wrapper fadeIn">
        <GlobalBreadCrumbs>
          <template #page_title>
            {{ $t("TITLES.privacy_policy") }}
          </template>
          <template #breadcrumb_current_page>
            {{ $t("TITLES.privacy_policy") }}
          </template>
        </GlobalBreadCrumbs>

        <div class="container mx-auto mt-6">
          <div
            class="page_content py-9 space-y-4 text-[28px] text-themeText font-arb"
            v-html="privacyPolicy"
          ></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const axios = useNuxtApp().$axios;

const {
  data: privacyPolicy,
  status,

  refresh,
} = await useLazyAsyncData("policy", () =>
  axios
    .get(`policy`)
    .then((res) => res.data.data.policy)
    .catch((err) => err.response)
);
</script>

<style scoped>
.page_content p {
  @apply !mb-4;
}
</style>
