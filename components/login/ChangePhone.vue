<template>
  <div class="auth-wrapper flex flex-col items-center justify-center w-full">
    <div class="w-full lg:w-1/2 bg-white p-6 rounded-lg">
      <div
        class="form-title-wrapper h-[45vh] flex flex-col items-center justify-center gap-2"
      >
        <NuxtLink :to="localePath('/')" class="logo-wrapper">
          <img src="/logo.svg" alt="App Logo" class="w-[150px] h-[120px]" />
        </NuxtLink>

        <div v-if="verificationType.includes('resetPassword')">
          <h2 class="text-[32px] font-bold text-center text-themeText">
            {{ $t("TITLES.forget_password") }}
          </h2>
          <h3 class="text-[1.75rem] text-center text-themeText opacity-60">
            {{ $t("TITLES.enter_phone_number") }}
          </h3>
        </div>

        <div v-else>
          <h2 class="text-[32px] font-bold text-center text-themeText">
            {{ $t("TITLES.change_number") }}
          </h2>
          <h3 class="text-[1.75rem] text-center text-themeText opacity-60">
            {{ $t("TITLES.enter_new_phone_number") }}
          </h3>
        </div>
      </div>

      <div class="form-wrapper py-7">
        <VeeForm
          @submit="submitRegisterForm"
          class="space-y-6"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <div class="input-wrapper">
            <InputsPhone
              id="mobile"
              name="mobile"
              class="w-full"
              :placeholder="$t('PLACEHOLDERS.phone')"
            />
          </div>

          <div class="btn-wrapper flex place-content-center my-5">
            <InputsButton
              type="submit"
              class="w-full"
              :name="t('BUTTONS.confirm')"
              :disabled="isWaitingRequest"
            />
          </div>
        </VeeForm>

        <NuxtLink
          :to="localePath('/login')"
          class="register-route mt-5 text-[22px] block text-center"
        >
          <span class="text-[22px] text-lightGray">{{
            t("BUTTONS.have_account")
          }}</span>
          <span class="text-mainTheme font-semibold">{{
            t("BUTTONS.login")
          }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useApiStore } from "~/stores/apiStores";
const toast = useToast();
const axios = useNuxtApp().$axios;
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const apiStore = useApiStore();
const router = useRouter();
const verificationType = ref(route.path);
const type = ref(route.query.verification_type);

const isWaitingRequest = ref(false);
const selectedCountry = apiStore.countriesData.selectedCountry;

const submitRegisterForm = async (values) => {
  const dataToVerfiy = useCookie("dataToVerfiy").value;
  isWaitingRequest.value = true;

  const formData = new FormData();
  formData.append("phone", values.mobile);
  formData.append("country_id", values.phone_code);
  let url =
    type.value == "reset" || verificationType.value.includes("reset-password")
      ? "forgot_password"
      : `update_phone_after_register/${dataToVerfiy.id}`;

  axios
    .post(url, formData)
    .then((res) => {
      type.value == "reset" || verificationType.value.includes("reset-password")
        ? (useCookie("dataToVerfiy").value = {
            ...res.data.data,
            phone: values.mobile,
          })
        : (useCookie("dataToVerfiy").value = {
            ...res.data.data,
            country: dataToVerfiy.country,
          });
      toast.success(t("MESSAGES.edited_successfully"));
      verificationType.value.includes("reset-password") || type.value == "reset"
        ? router.push({
            path: "/register/otp",
            query: { verification_type: "reset-password" },
          })
        : router.push({
            path: "/register/otp",
            query: { verification_type: "activate-account" },
          });
      isWaitingRequest.value = false;
    })
    .catch((error) => {
      toast.error(error?.response?.data.message || t("MESSAGES.error"));
    })
    .finally(() => (isWaitingRequest.value = false));
};

onMounted(() => {
  apiStore.getCountries();
});
</script>

<style scoped></style>
