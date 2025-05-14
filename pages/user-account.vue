<template>
  <div class="user-account-wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.my_account") }}</template>
      <template #breadcrumb_current_page>{{
        $t("TITLES.my_account")
      }}</template>
    </GlobalBreadCrumbs>

    <div class="routes-wrapper">
      <NuxtLink
        :to="localePath('/user-account')"
        class="edit-account-route"
        :class="{ 'active-route': $route.path === '/user-account' }"
      >
        {{ $t("TITLES.personal_info") }}
      </NuxtLink>

      <NuxtLink
        v-if="userType == 'teacher'"
        :to="localePath('/user-account/career')"
        class="edit-account-route"
        :class="{ 'active-route': $route.path === '/user-account/career' }"
      >
        {{ $t("TITLES.career_info") }}
      </NuxtLink>
    </div>

    <Transition name="fade-slide" mode="out-in">
      <NuxtPage />
    </Transition>
  </div>
</template>

<script setup>
import { useAuthenticationStore } from "@/stores/authentication";
const authStore = useAuthenticationStore();
const localePath = useLocalePath();

const { type } = storeToRefs(authStore);
const userType = ref(type.value);
</script>

<style scoped>
.routes-wrapper {
  @apply mt-9 flex items-center justify-center gap-10;
  .edit-account-route {
    @apply px-4 py-2 text-lightGray text-[1.5625rem] font-bold transition;
  }
  .active-route {
    @apply text-themeText bg-themeBg rounded-lg border-none;
    box-shadow: 0 0 10px 2px var(--simple_shadow_clr);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
