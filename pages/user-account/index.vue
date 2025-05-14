<template>
  <div class="auth-wrapper" v-if="!loading && profile">
    <div class="first_step_form_wrapper">
      <div class="form-title-wrapper">
        <div class="student-info text-center">
          <div
            v-if="registerUserType == 'teacher'"
            class="flex flex-col items-center"
          >
            <h4 class="text-center text-2xl text-themeText">:QR Code</h4>
            <img
              :src="formData.qrImageLink"
              alt="QR Code"
              class="w-[220px] h-auto"
            />
          </div>

          <h3 v-if="registerUserType == 'student'" class="student-code-wrapper">
            <span class="title"> {{ $t("TITLES.student_code") }}: </span>
            <!-- <span class="code"> #{{ editAccountData.studentCode }} </span> -->
            <span class="code"> # {{ formData.code }} </span>
          </h3>
        </div>
      </div>

      <div class="form-wrapper">
        <VeeForm
          v-slot="{ values }"
          @submit="submitRegisterForm"
          :initial-values="formData"
          class="space-y-6"
        >
          <div class="flex flex-col md:grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="col-span-2 w-fit relative mx-auto">
              <InputsBaseFile
                v-model:itemValue="formData.image.path"
                v-model:image="formData.image.file"
                accept="image/png, image/webp, image/jpeg"
                :no_preview="true"
                modalType="image"
                :returnFile="true"
                modalName="users"
                id="image"
                name="image"
              />
            </div>
            <InputsText
              id="username"
              name="username"
              :placeholder="t('PLACEHOLDERS.user_name')"
              class="w-full"
              :class="registerUserType === 'parent' ? 'col-span-2' : ''"
            />
            <InputsDropDown
              v-if="registerUserType == 'student'"
              v-model="formData.studyDegree"
              name="studyDegree"
              class="w-full"
              :options="apiStore.studyDegrees"
              :placeholder="$t('PLACEHOLDERS.study_degree')"
              @option-selected="handleOptionSelected"
            />
            <InputsDropDown
              v-if="registerUserType == 'student'"
              v-model="formData.studyYear"
              name="studyYear"
              :options="apiStore.studyYears"
              :placeholder="$t('PLACEHOLDERS.study_year')"
            />
            <VeeFieldArray
              v-if="registerUserType == 'parent'"
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
                    :name="`codes[${idx}].code`"
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
                    class="delete_child"
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
            <div
              :class="
                registerUserType !== 'parent' ? 'col-span-2' : 'col-span-1'
              "
            >
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
import { useApiStore } from "~/stores/apiStores";
import { useAuthenticationStore } from "~/stores/authentication";
import { useI18n } from "vue-i18n";
const authStore = useAuthenticationStore();

const { type, profile } = storeToRefs(authStore);

const registerUserType = ref(type.value).value;

const apiStore = useApiStore();

const axios = useNuxtApp().$axios;

const cities = computed(() => apiStore.getCities(43));
const { t } = useI18n();
const toast = useToast();

const loading = ref(false);

const formData = reactive({
  username: "",
  mobile: "",
  qrImageLink: "",
  city: {},
  image: { path: "", file: "" },
  studyDegree: null,
  studyYear: null,
  studentCode: "",
  qrImageLink: "",
  code: "",
  codes: [
    {
      code: "",
    },
  ],
});
const handleOptionSelected = async (id) => {
  try {
    formData.studyYear = await apiStore.getStudyYears(id);
  } catch (error) {
    console.error("Error fetching studyYear:", error);
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
  loading.value = true;
  const theData = new FormData();

  if (formData.image.file) theData.append("image", formData.image.file);
  theData.append("fullname", values.username);
  theData.append("country_id", values.phone_code);
  theData.append("phone", values.mobile.replace(/^[0.]+/, ""));
  theData.append("city_id", values.city.id);
  if (formData.password) theData.append("password", values.password);
  if (formData.confirm_password)
    theData.append("password_confirmation", values.confirm_password);

  if (registerUserType === "student") {
    theData.append("degree_id", values.studyDegree?.id);
    theData.append("academic_year_id", values.studyYear?.id);
  }

  if (registerUserType === "parent") {
    let childrenCodes = values.codes;
    childrenCodes.forEach((code, index) => {
      theData.append(`studentIds[${index}][student_id]`, code.code);
    });
  }

  try {
    const res = await axios.post(`${registerUserType}/update_profile`, theData);

    loading.value = false;

    toast.success(res.data.message);

    authStore.profile = res?.data?.data;
  } catch (err) {
    loading.value = false;
    console.error(err);

    toast.error(err.response?.data?.message || t("VALIDATION.login_failed"));
  }
};
onMounted(() => {
  apiStore.getStudyDegrees();
  apiStore.getCities(formData?.country?.id);
});

watch(
  () => profile.value,
  (val) => {
    if (val) {
      formData.username = val?.fullname;
      formData.mobile = val?.phone;
      formData.city = val?.city;
      formData.country = val?.country;
      formData.studyDegree = val?.degree;
      formData.codes = val?.children?.map((ele) => {
        return {
          code: ele.id,
        };
      });
      formData.studyYear = val?.academic_year;
      formData.studentCode = val?.student_code;
      formData.qrImageLink = val?.qr_image_link;
      formData.image.path = val?.profile_image;
      formData.code = val?.student_code;

      loading.value = false;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.auth-wrapper {
  @apply flex flex-col items-center justify-center w-full;
  .first_step_form_wrapper {
    @apply px-5 w-full lg:w-1/2 my-6;
    .form-title-wrapper {
      @apply flex flex-col items-center justify-center gap-2;
      .student-code-wrapper {
        span {
          @apply text-[22px] font-medium text-themeText;
        }
        .title {
          @apply text-lightGray;
        }
      }
    }
    .form-wrapper {
      @apply relative overflow-x-hidden overflow-y-auto md:overflow-y-visible  h-auto overflow-visible py-4;
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
</style>
