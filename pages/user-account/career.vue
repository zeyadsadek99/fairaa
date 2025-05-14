<template>
  <div
    class="auth-wrapper flex flex-col items-center justify-center w-full"
    v-if="!loading && profile"
  >
    <Loader1 v-if="isLoading" />

    <div class="first_step_form_wrapper px-5 w-full lg:w-1/2">
      <div class="form-wrapper h-auto overflow-visible overflow-x-hidden py-1">
        <VeeForm
          v-slot="{ values }"
          @submit="submitRegisterForm"
          :initial-values="formData"
          :validation-schema="schema"
          class="space-y-6"
        >
          <div class="flex flex-col md:grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="col-span-2 w-fit relative mx-auto">
              <InputsBaseFile
                :no_preview="true"
                modalName="users"
                modalType="image"
                id="video"
                name="video"
                :returnFile="true"
                v-model:image="formData.video.file"
                accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/webm,video/mkv"
              />
            </div>
            <div class="col-span-2">
              <InputsText
                id="faculty"
                name="faculty"
                :placeholder="$t('PLACEHOLDERS.faculty')"
                class="w-full"
                :class="registerUserType === 'parent' ? 'col-span-2' : ''"
              />
            </div>
            <div class="flex flex-wrap col-span-2">
              <div class="w-fit relative mx-auto">
                <InputsBaseFile
                  modalName="contents"
                  modalType="file"
                  :returnFile="true"
                  v-model:itemValue="formData.pdf"
                  v-model:image="formData.pdf"
                  accept="application/pdf"
                  id="pdf"
                  name="pdf"
                  label="السيرة الذاتية"
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

            <div class="py-5 flex gap-4 items-center">
              <Switch
                v-model="formData.activateStrengtheningRequests"
                :class="
                  formData.activateStrengtheningRequests
                    ? 'bg-mainTheme'
                    : 'bg-softMainTheme'
                "
                class="relative flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              >
                <span
                  aria-hidden="true"
                  :class="
                    formData.activateStrengtheningRequests
                      ? 'translate-x-0'
                      : '-translate-x-5'
                  "
                  class="pointer-events-none inline-block h-5 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>

              <span class="text-themeText text-lg font-medium cursor-pointer">{{
                $t("PLACEHOLDERS.activate_strengthening_requests")
              }}</span>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <InputsButton
              :loading="loading"
              type="submit"
              :name="t('BUTTONS.edit_info')"
              class="w-full lg:w-7/12"
            />
          </div>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";

import { useToast } from "vue-toastification";
import { useAuthenticationStore } from "~/stores/authentication";
import { useI18n } from "vue-i18n";
import { Switch } from "@headlessui/vue";

const authStore = useAuthenticationStore();
const { type, profile } = storeToRefs(authStore);
const registerUserType = ref(type.value).value;

const axios = useNuxtApp().$axios;

const { t } = useI18n();
const toast = useToast();

const loading = ref(true);

const formData = reactive({
  activateStrengtheningRequests: 0,
  faculty: "",
  pdf: "",
  pdf1: "",
  video: { path: "", file: "" },
});

const isLoading = ref(false);

const schema = yup.object({
  faculty: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.faculty") })),
  pdf: yup.string().required(t("ERRORS.isRequired", { name: t("LABELS.pdf") })),
  pdf1: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.pdf") })),
});
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

  theData.append("university", values.faculty);
  // theData.append("country_id", values.phone_code);
  theData.append(
    "special_course_request",
    +formData.activateStrengtheningRequests
  );
  if (values.video.file) {
    theData.append("explanatory_video", values.video.file);
  }
  // if (values.pdf) {
  //   theData.append("cv", values.pdf);
  // }
  // if (values.pdf1) {
  //   theData.append("graduation_certificate", values.pdf1);
  // }

  try {
    // ✅ Send Login Request
    const res = await axios.post("teacher/update_profile", theData);

    loading.value = false;

    toast.success(res.data.message);

    authStore.profile = res?.data?.data;
  } catch (err) {
    loading.value = false;
    console.error(err);

    toast.error(err.response?.data?.message || t("VALIDATION.login_failed"));
  }
};

watch(
  () => profile.value,
  (val) => {
    if (val) {
      formData.faculty = val?.university;
      formData.note = val?.desc;
      formData.activateStrengtheningRequests = val?.special_course_request;
      formData.video.path = val?.explanatory_video;
      formData.pdf = val?.cv;
      formData.pdf1 = val?.graduation_certificate;

      loading.value = false;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.form-wrapper {
  @apply relative overflow-x-hidden overflow-y-auto md:overflow-y-visible
      py-4;
  &::-webkit-scrollbar {
    @apply w-0;
  }
}
</style>
