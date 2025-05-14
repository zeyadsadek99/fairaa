<template>
  <div class="auth-wrapper">
    <div class="px-5 w-full xl:w-1/2">
      <div class="form-title-wrapper">
        <NuxtLink :to="localePath('/')" class="logo-wrapper">
          <img src="/logo.svg" alt="App Logo" class="w-36 h-28 mx-auto" />
        </NuxtLink>

        <h2 class="form-title">
          {{ t("TITLES.login") }}
        </h2>
        <h3 class="form-subtitle">
          {{ t("TITLES.welcome_back") }}
        </h3>
      </div>

      <div class="form-wrapper">
        <VeeForm
          @submit="submitLoginForm"
          :validation-schema="schema"
          class="space-y-6"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <div class="relative">
            <div class="input-wrapper flex justify-between">
              <InputsPhone
                id="mobile"
                name="mobile"
                :placeholder="t('PLACEHOLDERS.phone')"
                class="w-full"
              />
            </div>
          </div>
          <div class="relative">
            <div class="input-wrapper">
              <InputsText
                id="password"
                name="password"
                type="password"
                :placeholder="t('PLACEHOLDERS.password')"
                class="w-full"
              />
            </div>
          </div>

          <NuxtLink
            :to="localePath('/register/reset-password')"
            class="forget-pass-route"
          >
            {{ t("BUTTONS.forget_password") }}
          </NuxtLink>

          <div>
            <InputsButton
              :loading="loading"
              type="submit"
              :name="t('BUTTONS.login')"
              class="w-full"
            />
          </div>
        </VeeForm>

        <p class="register-route">
          <span>
            {{ t("BUTTONS.dont_have_account") }}
          </span>
          <NuxtLink
            :to="localePath('/register')"
            class="text-mainTheme font-semibold hover:underline"
          >
            {{ t("BUTTONS.register") }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useAuthenticationStore } from "~/stores/authentication";

const { t } = useI18n();

const loading = ref(false);
const localePath = useLocalePath();

const axios = useNuxtApp().$axios;
const router = useRouter();
const toast = useToast();
const authStore = useAuthenticationStore();
const schema = yup.object({
  mobile: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Phone") }))
    .matches(/^[0-9]{10}$/, t("ERRORS.invalidPhone")),
  password: yup
    .string()
    .min(6, t("VALIDATION.password_length"))
    .required(t("ERRORS.isRequired", { name: t("PLACEHOLDERS.password") })),
});

const submitLoginForm = async (values) => {
  loading.value = true;

  const theData = new FormData();

  theData.append("type", "ios");
  theData.append("device_token", "static_device_token");
  theData.append("country_id", values.phone_code);
  theData.append("identifier", values.mobile);
  theData.append("password", values.password);

  try {
    const res = await axios.post("login", theData);

    loading.value = false;

    toast.success(t("VALIDATION.login_success"));

    authStore.profile = res?.data?.data;
    useCookie("dataToVerfiy").value = res.data.data;
    useCookie("elmo3lm_elmosa3d_user_token").value =
      res.data.data?.token?.access_token;
    useCookie("elmo3lm_elmosa3d_user_type").value = res.data.data.user_type;
    useCookie("elmo3lm_elmosa3d_user_avatar").value =
      res.data.data.profile_image;

    router.push("/");
  } catch (err) {
    loading.value = false;
    console.error(err);

    toast.error(err.response?.data?.message || t("VALIDATION.login_failed"));
  }
};
onMounted(() => {
  // useCookie("dataToVerfiy").value = null;
  useCookie("elmo3lm_elmosa3d_user_token").value = null;
  useCookie("elmo3lm_elmosa3d_user_type").value = null;
  useCookie("elmo3lm_elmosa3d_user_avatar").value = null;
});
</script>

<style scoped>
.auth-wrapper {
  @apply flex flex-col items-center justify-center w-full;
  .form-title-wrapper {
    @apply h-[34vh] md:h-[45vh] flex flex-col items-center justify-center gap-2;
    .form-title {
      @apply text-2xl font-bold md:text-3xl text-center text-themeText;
    }
    .form-subtitle {
      @apply text-2xl md:text-3xl opacity-60 text-center text-themeText;
    }
  }
  .form-wrapper {
    @apply max-md:h-[66vh] w-[60%] mx-auto bg-white overflow-x-hidden py-8 rounded-lg lg:p-6;
    &::-webkit-scrollbar {
      @apply w-0;
    }
    .forget-pass-route {
      @apply block text-center text-[22px] font-semibold text-midRed;
    }
    .register-route {
      @apply mt-5 text-[22px] block text-center;
      span {
        @apply text-[22px] text-lightGray;
      }
    }
  }
}
</style>
