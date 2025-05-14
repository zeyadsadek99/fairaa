<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="w-full lg:w-1/3 p-6 bg-white">
      <div class="h-[45vh] flex flex-col items-center justify-center gap-2">
        <NuxtLink :to="localePath('/')" class="flex justify-center mb-4">
          <img src="/logo.svg" alt="App Logo" class="w-[150px] h-[120px]" />
        </NuxtLink>

        <h2 class="text-[32px] font-bold text-center text-themeText">
          {{
            verificationType === "activate-account"
              ? t("TITLES.activate_account")
              : t("TITLES.forget_password")
          }}
        </h2>
        <h3 class="text-[1.75rem] text-center text-themeText opacity-60">
          {{ t("TITLES.enter_sent_code") }}
        </h3>

        <h4 class="text-center text-2xl opacity-100 text-mainTheme font-medium">
          <span dir="ltr">{{ phoneNumberAndKey }}</span>
          <NuxtLink
            :to="
              localePath({
                path: '/register/change-phone-number',
                query: {
                  verification_type:
                    verificationType === 'activate-account'
                      ? 'activate'
                      : 'reset',
                },
              })
            "
            class="ms-4 font-medium"
          >
            {{ t("TITLES.edit_number") }}
          </NuxtLink>
        </h4>
      </div>

      <VeeForm
        @submit="submitRegisterForm"
        class="space-y-6"
        v-slot="{ values, errors }"
      >
        <div class="py-7">
          <Vue3OtpInput
            ref="otpInput"
            class="flex items-center justify-around gap-4 py-7"
            input-classes="w-[75px] h-[60px] text-center text-2xl font-semibold p-3 rounded-2xl bg-themeInputs text-themeText "
            separator=""
            :num-inputs="4"
            :should-auto-focus="true"
            v-model="otpCode"
            input-type="numeric"
            @on-change="handleOnChange"
            dir="ltr"
          />
        </div>

        <div class="flex items-center justify-center">
          <InputsButton
            class="w-full lg:w-7/12"
            :name="t('BUTTONS.confirm')"
            type="submit"
            :loading="isWaitingRequest"
          />
        </div>

        <div class="text-center mt-6">
          <h3 dir="ltr" class="text-[1.75rem] text-black/80 font-medium">
            {{ "0 : " + timerCount }}
          </h3>
          <div class="mt-4">
            <button
              type="button"
              class="!text-mainTheme font-semibold text-xl underline transition-all duration-[400ms] ease-in-out"
              @click="resendVerificationCode"
              :class="{ 'text-gray-400 cursor-not-allowed': timerCount > 0 }"
            >
              {{ t("BUTTONS.resend_code") }}
            </button>
          </div>
        </div>
      </VeeForm>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});
import Vue3OtpInput from "vue3-otp-input";
import { useToast } from "vue-toastification";

import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const localePath = useLocalePath();
const axios = useNuxtApp().$axios;
const route = useRoute();
const router = useRouter();
const toast = useToast();

const { t } = useI18n();
const otpInput = ref(null);
const isWaitingRequest = ref(false);
const timerCount = ref(60);
const otpCode = ref("");

const verificationType = ref(route.query.verification_type);
const dataToVerfiy = useCookie("dataToVerfiy").value;
const phoneNumber = dataToVerfiy.phone;
const selectedCountry = dataToVerfiy.country.id;
const phoneNumberAndKey = dataToVerfiy.country.key + dataToVerfiy.phone;

function handleOnChange(event) {
  otpCode.value = event;
}
onMounted(() => countDown());

const countDown = () => {
  if (timerCount.value > 0) {
    setTimeout(() => {
      timerCount.value -= 1;
      countDown();
    }, 1000);
  }
};

const submitRegisterForm = async (values) => {
  isWaitingRequest.value = true;

  const formData = new FormData();
  formData.append("type", "ios");
  formData.append("device_token", "static_device_token");
  formData.append("phone", phoneNumber);
  formData.append("country_id", selectedCountry);
  formData.append("code", otpCode.value);

  let url =
    verificationType.value === "reset-password" ? "check_reset_code" : "verify";

  try {
    const res = await axios.post(url, formData);

    isWaitingRequest.value = false;

    if (verificationType.value === "activate-account") {
      router.push("/login");
    } else {
      router.push("/register/change-password");
    }
  } catch (error) {
    isWaitingRequest.value = false;
    toast.error(t("VALIDATION.verification_failed"));
  }
};

const resendVerificationCode = async () => {
  const formData = new FormData();
  formData.append("phone", phoneNumber);
  formData.append("country_id", selectedCountry);

  try {
    const res = await axios.post("send_code", formData);

    toast.success(t("VALIDATION.verification_success"));
    // useCookie("elmo3lm_elmosa3d_verification_code").value = res.data.data.code;
    timerCount.value = 60;
    countDown();
  } catch (error) {
    toast.error(t("VALIDATION.verification_failed"));
  }
};
</script>

<style scoped>
.otp-input {
  @apply w-16 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg outline-none focus:border-mainTheme transition-all duration-200;
}
</style>
