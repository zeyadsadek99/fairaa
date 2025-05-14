<template>
  <div class="auth-wrapper">
    <div class="first_step_form_wrapper">
      <div class="form-title-wrapper">
        <NuxtLink :to="localePath('/')" class="logo-wrapper">
          <img src="/logo.svg" alt="App Logo" class="w-36 h-28 mx-auto" />
        </NuxtLink>
        <h2 class="form-title">
          {{ t("TITLES.forget_password") }}
        </h2>
        <h3 class="form-subtitle">
          {{ t("TITLES.enter_new_password") }}
        </h3>
      </div>

      <div class="form-wrapper">
        <VeeForm
          v-slot="{ values }"
          @submit="submitRegisterForm"
          :initial-values="formData"
          :validation-schema="schema"
          class="space-y-6"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <div class="flex flex-col w-7/12 justify-center mx-auto gap-6">
            <InputsText
              id="password"
              name="password"
              type="password"
              :placeholder="t('PLACEHOLDERS.password')"
              class="w-full"
            />
            <InputsText
              id="confirm_password"
              name="confirm_password"
              type="password"
              :placeholder="t('PLACEHOLDERS.confirm_password')"
              class="w-full"
            />
          </div>

          <div class="flex items-center justify-center">
            <InputsButton
              :loading="loading"
              type="submit"
              :name="t('BUTTONS.confirm')"
              class="w-full lg:w-7/12"
            />
          </div>
        </VeeForm>
        <NuxtLink
          :to="localePath('/login')"
          class="register_route text-center block mt-4"
        >
          <span class="text-[22px] text-lightGray">{{
            $t("BUTTONS.have_account")
          }}</span>
          <span class="font-semibold text-[22px] text-mainTheme">
            {{ $t("BUTTONS.login") }}</span
          >
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { useRoute } from "vue-router";

import { useToast } from "vue-toastification";
import { useApiStore } from "~/stores/apiStores";
import { useAuthenticationStore } from "~/stores/authentication"; //
import { useI18n } from "vue-i18n";
const route = useRoute();
const localePath = useLocalePath();
const registerUserType = route.path.split("/").pop();

const apiStore = useApiStore();
const authStore = useAuthenticationStore();
const router = useRouter();
const axios = useNuxtApp().$axios;

const cities = apiStore.getCities(43);
const { t } = useI18n();
const toast = useToast();

const loading = ref(false);

const formData = reactive({
  password: "",
  confirm_password: "",
});

const schema = yup.object({
  password: yup
    .string()
    .min(6, t("VALIDATION.password_length"))
    .required(t("ERRORS.isRequired", { name: t("PLACEHOLDERS.password") })),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], t("ERRORS.notEqualPasswords"))
    .required(t("ERRORS.confirmPassword")),
});

const submitRegisterForm = async (values) => {
  const dataToVerfiy = useCookie("dataToVerfiy").value;
  // return;
  console.log("dataToVerfiy", dataToVerfiy);
  loading.value = true;
  const theData = new FormData();

  // .replace(/^[0.]+/, "")
  theData.append("code", dataToVerfiy.code);
  theData.append("phone", dataToVerfiy.phone);
  theData.append("country_id", dataToVerfiy.country.id);
  theData.append("password", values.password);

  try {
    const res = await axios.post(`reset_password`, theData);

    loading.value = false;

    toast.success(res.data.message);

    authStore.profile = res?.data?.data;

    useCookie("dataToVerfiy").value = null;

    router.push("/login");
  } catch (err) {
    loading.value = false;
    console.error(err);

    toast.error(err.response?.data?.message || t("VALIDATION.login_failed"));
  }
};
</script>

<style scoped>
.auth-wrapper {
  @apply flex flex-col items-center justify-center w-full;
  .first_step_form_wrapper {
    @apply px-5 w-full lg:w-1/2;
    .form-title-wrapper {
      @apply h-[33vh] md:h-[49vh] flex flex-col items-center justify-center gap-2;
      .form-title {
        @apply text-center text-themeText  text-2xl font-bold md:text-3xl;
      }
      .form-subtitle {
        @apply text-center text-themeText  opacity-60 text-2xl  md:text-3xl;
      }
    }
    .form-wrapper {
      @apply relative overflow-x-hidden overflow-y-auto md:overflow-y-visible py-8;
      &::-webkit-scrollbar {
        @apply w-0;
      }
    }
  }
}

@media (max-width: 767px) {
  .form-title-wrapper {
    @apply fixed top-0 left-0 w-full z-30 bg-white;
  }

  .form-wrapper {
    @apply h-[69vh] mt-[35vh] overflow-y-auto overscroll-contain;
  }

  .form-wrapper::-webkit-scrollbar {
    display: none;
  }
  .form-wrapper {
    scrollbar-width: none;
  }
}
</style>
