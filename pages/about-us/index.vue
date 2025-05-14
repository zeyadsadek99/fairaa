<template>
  <div>
    <Loader1 v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <div class="fadeIn">
        <GlobalBreadCrumbs>
          <template #page_title>
            {{ t("TITLES.about_us") }}
          </template>
          <template #breadcrumb_current_page>
            {{ t("TITLES.about_us") }}
          </template>
        </GlobalBreadCrumbs>

        <div class="space-y-20">
          <AboutUs
            :aboutUsData="homeData?.data?.about"
            :hideMoreButton="true"
          />

          <HomeContactUs :contactUsData="homeData?.data?.contacts" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const axios = useNuxtApp().$axios;

const userType = computed(() => useCookie("elmo3lm_elmosa3d_user_type").value);

const endpoint = computed(() => {
  if (userType.value === "teacher") return "teacher/home";
  if (userType.value === "student") return "student/home";
  if (userType.value === "parent") return "parent/home";
  return "visitor/home";
});
const {
  data: homeData,
  status,

  refresh,
} = await useLazyAsyncData("home", () =>
  axios
    .get(`${endpoint.value}`)
    .then((res) => res.data)
    .catch((err) => err.response)
);
</script>
