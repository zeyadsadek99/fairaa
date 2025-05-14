<template>
  <div class="auth-wrapper">
    <div class="first_step_form_wrapper">
      <!-- ✅ FORM TITLE -->
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

      <!-- ✅ FORM -->
      <div class="form-wrapper">
        <VeeForm
          @submit="submitRegisterForm"
          class="space-y-6"
          v-slot="{ values, errors }"
        >
          <InputsText
            id="faculty"
            name="faculty"
            :placeholder="$t('PLACEHOLDERS.faculty')"
            class="w-full"
          />

          <InputsDropDown
            v-model="formData.experiences"
            name="experiences"
            :options="apiStore.experiences"
            :placeholder="$t('PLACEHOLDERS.experiences')"
          />

          <div class="grid grid-cols-2 gap-6">
            <InputsDropDown
              v-model="formData.studyDegrees"
              name="study_degree"
              :options="apiStore.studyDegrees"
              :placeholder="$t('PLACEHOLDERS.study_degree')"
              @option-selected="handleOptionSelected"
            />

            <InputsDropDown
              v-model="formData.specializations"
              name="specializations"
              :options="apiStore.specializations"
              :placeholder="$t('PLACEHOLDERS.teacher_specialty')"
            />
          </div>
          <InputsBase
            id="about"
            name="about"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.note')"
            :rows="3"
          />

          <div class="grid grid-cols-2 items-center gap-6">
            <div class="w-fit relative mx-auto">
              <InputsBaseFile
                modalName="contents"
                modalType="file"
                id="pdf"
                name="pdf"
                :returnFile="true"
                v-model:itemValue="formData.pdf"
                v-model:image="formData.pdf"
                label="السيرة الذاتية"
                accept="application/pdf"
              />
            </div>

            <div class="w-fit relative mx-auto">
              <InputsBaseFile
                modalName="contents"
                modalType="file"
                :returnFile="true"
                v-model:itemValue="formData.pdf1"
                v-model:image="formData.pdf1"
                accept="application/pdf"
                id="pdf1"
                name="pdf1"
                label="شهادة التخرج"
              />
            </div>
          </div>

          <div class="flex items-center justify-center my-3">
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
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { useApiStore } from "~/stores/apiStores";
import { useAuthenticationStore } from "~/stores/authentication";
import { useI18n } from "vue-i18n";
const localePath = useLocalePath();

const apiStore = useApiStore();
const authStore = useAuthenticationStore();
const router = useRouter();
const axios = useNuxtApp().$axios;

const { t } = useI18n();
const toast = useToast();

const loading = ref(false);

const formData = ref({
  faculty: "",
  experiences: "",
  studyDegrees: null,
  specializations: [],
  password: "",
  about: "",
  pdf: null,
  pdfPreview: null,
  pdf1: null,
});
const handleOptionSelected = async (id) => {
  try {
    formData.value.specializations = await apiStore.getSpecializations(id);
  } catch (error) {
    console.error("Error fetching specializations:", error);
  }
};

// const schema = yup.object({
//   username: yup
//     .string()
//     .required(t("ERRORS.isRequired", { name: t("LABELS.username") })),
//   mobile: yup
//     .string()
//     .matches(/^[0-9]{10}$/, t("ERRORS.invalidPhone"))
//     .required(t("ERRORS.isRequired", { name: t("LABELS.phone") })),
//   city: yup
//     .object()
//     .nullable()
//     .required(t("ERRORS.isRequired", { name: t("LABELS.city") })),
//   password: yup
//     .string()
//     .min(6, t("VALIDATION.password_length"))
//     .required(t("ERRORS.isRequired", { name: t("LABELS.password") })),
//   confirm_password: yup
//     .string()
//     .oneOf([yup.ref("password"), null], t("ERRORS.passwords_must_match"))
//     .required(t("ERRORS.isRequired", { name: t("LABELS.confirm_password") })),
//   gender: yup
//     .string()
//     .required(t("ERRORS.isRequired", { name: t("LABELS.gender") })),
// });

const submitRegisterForm = async (values) => {
  // return;
  loading.value = true;
  const theData = new FormData();
  theData.append("type", "ios");
  theData.append("device_token", "static_device_token");

  theData.append("university", values.faculty);
  theData.append("experience_id", values.experiences?.id);
  theData.append("desc", values.about);
  theData.append("degreeIds[0][degree_id]", values.study_degree?.id);

  theData.append(`specializationIds[0][degree_id]`, values.study_degree?.id);

  theData.append(
    `specializationIds[0][specialization_id]`,
    values.specializations.id
  );

  if (formData.value.pdf) {
    theData.append("cv", formData.value.pdf);
  }
  if (values.pdf1) {
    theData.append("certificate", values.pdf1);
  }
  try {
    const res = await axios.post("teacher/complate_register", theData);

    loading.value = false;

    toast.success(res.data.message);

    authStore.profile = res?.data?.data;
    useCookie("dataToVerfiy", {
      maxAge: 60 * 30,
    }).value = res.data.data;

    router.push({
      path: "/register/otp",
      query: { verification_type: "activate-account" },
    });
  } catch (err) {
    loading.value = false;
    console.error(err);

    toast.error(err.response?.data?.message || t("VALIDATION.login_failed"));
  }
};
onMounted(() => {
  apiStore.getExperiences();
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
        @apply text-center text-themeText text-2xl font-bold md:text-[32px];
      }
      .form-subtitle {
        @apply text-center text-themeText text-2xl opacity-60  md:text-3xl;
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
