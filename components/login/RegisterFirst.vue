<template>
  <div class="auth-wrapper">
    <div class="first_step_form_wrapper">
      <div class="form-title-wrapper">
        <NuxtLink :to="localePath('/')" class="logo-wrapper">
          <img src="/logo.svg" alt="App Logo" class="w-36 h-28 mx-auto" />
        </NuxtLink>
        <h2 class="form-title">
          {{ t("TITLES.register") }}
        </h2>
        <h3 class="form-subtitle">
          {{ t("TITLES.register_welcome") }}
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
          <div class="flex flex-col md:grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputsText
              id="username"
              name="username"
              :placeholder="t('PLACEHOLDERS.user_name')"
              class="w-full"
              :class="
                registerUserType === 'register-parent' ? 'col-span-2' : ''
              "
            />
            <InputsDropDown
              v-if="registerUserType == 'register-student'"
              v-model:modelValue="formData.study_degree"
              name="study_degree"
              class="w-full"
              :options="apiStore.studyDegrees"
              :placeholder="$t('PLACEHOLDERS.study_degree')"
              @option-selected="handleOptionSelected"
            />
            <InputsDropDown
              v-if="registerUserType == 'register-student'"
              v-model:modelValue="formData.studyYears"
              name="studyYears"
              :options="apiStore.studyYears"
              :placeholder="$t('PLACEHOLDERS.study_year')"
            />

            <VeeFieldArray
              v-if="registerUserType == 'register-parent'"
              name="codes"
              v-slot="{ fields, push, remove }"
            >
              <div
                v-for="(field, idx) in fields"
                :key="field.key"
                class="w-full"
              >
                <div class="flex items-center gap-4">
                  <InputsText
                    type="number"
                    :id="`codes${idx}`"
                    :name="`codes.${idx}.code`"
                    :placeholder="$t('PLACEHOLDERS.student_code')"
                    class="w-full"
                  />
                  <button
                    v-if="idx == fields.length - 1"
                    type="button"
                    class="border-none h-[50px] text-[16px] sm:text-lg p-3 w-[30%] !text-lightGray bg-themeInputs rounded-2xl flex items-center justify-start gap-[5px]"
                    @click="push({ code: '' })"
                  >
                    <IconsPlus />
                    {{ $t("BUTTONS.add_another") }}
                  </button>

                  <button
                    v-if="idx != 0"
                    type="button"
                    class="delete_child border-none h-[55px] p-3 w-[30%] text-lg bg-themeInputs rounded-2xl flex items-center justify-center gap-[5px]"
                    @click="remove(idx)"
                  >
                    <IconsTrash />
                  </button>
                </div>
              </div>
            </VeeFieldArray>
            <InputsPhone
              id="mobile"
              name="mobile"
              :placeholder="t('PLACEHOLDERS.phone')"
              class="w-full"
            />
            <div class="col-span-2">
              <InputsDropDown
                v-model="formData.city"
                name="city"
                class="w-full col-span-2"
                :options="apiStore.cities"
                :placeholder="$t('PLACEHOLDERS.city')"
              />
            </div>

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
          <InputsRadioGroup
            v-model="formData.gender"
            name="gender"
            :options="[
              { label: t('PLACEHOLDERS.male'), value: 'male' },
              { label: t('PLACEHOLDERS.female'), value: 'female' },
            ]"
          />
          <div class="w-full lg:w-7/12 mx-auto">
            <p class="text-xl text-themeText text-center">
              بمجرد إنشاء الحساب هذا دليل على موافقتك على
              <button
                class="text-xl !text-mainTheme font-semibold"
                type="button"
                @click="toggleTermsModal"
              >
                {{ $t("BUTTONS.terms") }}
              </button>
              الخاصة بالتطبيق
            </p>
          </div>
          <div class="flex items-center justify-center">
            <InputsButton
              :loading="loading"
              type="submit"
              :name="t('BUTTONS.submit')"
              class="w-full lg:w-7/12"
            />
          </div>
        </VeeForm>
        <NuxtLink
          :to="localePath('/login')"
          class="register_route text-center block mt-0"
        >
          <span class="text-[22px] text-lightGray">{{
            $t("BUTTONS.have_account")
          }}</span>
          <span class="font-semibold text-[22px] text-mainTheme">
            {{ $t("BUTTONS.login") }}</span
          >
        </NuxtLink>
      </div>
      <ModalsTermsAndConditionsModal
        :modalApperanceData="termsModalIsOpen"
        @controleModalApperance="toggleTermsModal"
      />
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { useRoute } from "vue-router";

import { useToast } from "vue-toastification";
import { useApiStore } from "~/stores/apiStores";
import { useAuthenticationStore } from "~/stores/authentication";
import { useI18n } from "vue-i18n";
const route = useRoute();
const localePath = useLocalePath();
const registerUserType = route.path.split("/").pop();

const apiStore = useApiStore();
const authStore = useAuthenticationStore();
const router = useRouter();
const axios = useNuxtApp().$axios;
const handleOptionSelected = async (id) => {
  try {
    formData.studyYears = await apiStore.getStudyYears(id);
  } catch (error) {
    console.error("Error fetching studyYear:", error);
  }
};
const cities = apiStore.getCities(43);
const { t } = useI18n();
const toast = useToast();

const loading = ref(false);

const formData = reactive({
  username: "",
  mobile: "",
  phone_code: "",
  city: [],
  password: "",
  confirm_password: "",
  gender: "",
  studyYears: "",
  study_degree: [],
  specializations: [],
  experiences: "",

  codes: [
    {
      code: "",
    },
  ],
});
const termsModalIsOpen = ref(false);

const toggleTermsModal = () => {
  termsModalIsOpen.value = !termsModalIsOpen.value;
};
const schema = yup.object({
  username: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.name") })),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, t("ERRORS.invalidPhone"))
    .required(t("ERRORS.isRequired", { name: t("LABELS.phone") })),
  // city: yup
  //   .object()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.city") })),
  password: yup
    .string()
    .min(6, t("VALIDATION.password_length"))
    .required(t("ERRORS.isRequired", { name: t("PLACEHOLDERS.password") })),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], t("ERRORS.notEqualPasswords"))
    .required(t("ERRORS.confirmPassword")),
  gender: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.gender") })),
});

const submitRegisterForm = async (values) => {
  // return;
  loading.value = true;
  const theData = new FormData();
  theData.append("type", "ios");
  theData.append("device_token", "static_device_token");

  theData.append("fullname", values.username);
  theData.append("country_id", values.phone_code);
  theData.append("phone", values.mobile);
  theData.append("city_id", values.city.id);
  theData.append("password", values.password);
  theData.append("password_confirmation", values.confirm_password);
  if (registerUserType === "register-student") {
    theData.append("degree_id", values.study_degree?.id);
    theData.append("academic_year_id", values.studyYears?.id);
  }

  if (registerUserType === "register-parent") {
    values.codes.forEach((code, index) => {
      theData.append(`studentIds[${index}][student_id]`, code.code);
    });
  }

  try {
    const RegType = computed(() => {
      if (registerUserType === "register-parent") return "parent";
      if (registerUserType === "register-teacher") return "teacher";
      if (registerUserType === "register-student") return "student";
      return "";
    });
    const res = await axios.post(`${RegType.value}/register`, theData);

    loading.value = false;

    toast.success(res.data.message);

    authStore.profile = res?.data?.data;

    useCookie("dataToVerfiy", {
      maxAge: 60 * 30,
    }).value = res.data.data;
    useCookie("elmo3lm_elmosa3d_user_token").value =
      res.data.data?.token?.access_token;
    if (RegType.value === "teacher") {
      router.push("/register/register-teacher-sec");
    } else {
      router.push({
        path: "/register/otp",
        query: { verification_type: "activate-account" },
      });
    }
  } catch (err) {
    loading.value = false;
    console.error(err);

    toast.error(err.response?.data?.message || t("VALIDATION.login_failed"));
  }
};
onMounted(() => {
  apiStore.getStudyDegrees();
});
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
      .delete_child {
        @apply border-none h-[55px] p-3 w-[30%] text-lg bg-themeInputs rounded-2xl flex items-center justify-center gap-[5px];
        svg {
          @apply text-midRed text-xl;
        }
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
