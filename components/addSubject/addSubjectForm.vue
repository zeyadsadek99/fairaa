<template>
  <div class="add-subject-steps-wrapper">
    <div class="add-subject-steps-card-wrapper py-9">
      <div class="container mx-auto">
        <VeeForm
          v-slot="{ values }"
          @submit="stepOneValidate"
          :initial-values="formData"
          :validation-schema="schema"
          class="space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
            <div class="col-span-1 md:col-span-2 w-fit relative mx-auto">
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

            <div>
              <InputsDropDown
                v-model:modelValue="formData.degrees"
                name="degrees"
                :options="studyDegrees"
                :placeholder="$t('PLACEHOLDERS.study_degree')"
                icon
                showPlaceholderOption
                useNameId
                @option-selected="handleOptionSelected"
              />
            </div>

            <div>
              <InputsDropDown
                v-model:modelValue="formData.subjectsNames"
                name="subjectsNames"
                :options="subjectsNames"
                showPlaceholderOption
                :placeholder="$t('PLACEHOLDERS.subject_name')"
                icon
              />
            </div>
            <div>
              <InputsDropDown
                v-model:modelValue="formData.StudyYears"
                name="StudyYears"
                :options="studyYears"
                showPlaceholderOption
                :placeholder="$t('PLACEHOLDERS.study_year')"
                icon
              />
            </div>

            <div>
              <InputsDropDown
                v-model:modelValue="formData.subjectCats"
                name="subjectCats"
                showPlaceholderOption
                :options="subjectCats"
                :placeholder="$t('PLACEHOLDERS.subject_cat')"
                icon
              />
            </div>

            <InputsDropDown
              v-model:modelValue="formData.Languages"
              name="Languages"
              :options="Languages"
              showPlaceholderOption
              :placeholder="$t('PLACEHOLDERS.used_language')"
              icon
            />

            <InputsBaseDate
              v-model:itemValue="formData.start_date"
              :min-date="new Date()"
              id="start_date"
              name="start_date"
              :placeholder="$t('PLACEHOLDERS.start_date')"
              type="text"
            />
            <InputsText
              type="number"
              id="hours"
              name="hours"
              :placeholder="$t('PLACEHOLDERS.hour_count')"
              class="w-full"
              v-model.trim="formData.hours"
            />

            <InputsBase
              id="desc"
              name="desc"
              type="textarea"
              :placeholder="$t('PLACEHOLDERS.desc_subject')"
              :rows="4"
            />
            <InputsBase
              id="goals"
              name="goals"
              type="textarea"
              :placeholder="$t('PLACEHOLDERS.goals_subject')"
              :rows="4"
            />
            <InputsBase
              id="enrichments"
              name="enrichments"
              type="textarea"
              :placeholder="$t('PLACEHOLDERS.course_enrichments')"
              :rows="4"
            />
            <div class="w-fit relative">
              <InputsBaseFileAlt
                modalName="contents"
                modalType="file"
                id="attachmentsFiles"
                name="attachmentsFiles"
                :returnFile="true"
                v-model:itemValue="formData.attachmentsFiles"
                v-model:image="formData.attachmentsFiles"
                :label="$t('TITLES.attachments')"
                :multiple="true"
                accept=".txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
            </div>
          </div>
          <div class="w-full lg:w-[500px] flex justify-center mx-auto">
            <InputsButton
              :loading="isWaitingRequest"
              type="submit"
              :name="t('BUTTONS.next')"
              class="w-full lg:w-7/12"
            >
            </InputsButton>
          </div>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { useCreateCourseStore } from "@/stores/createCourse";
import { useToast } from "vue-toastification";

const axios = useNuxtApp().$axios;
const { t } = useI18n();
const toast = useToast();
const isWaitingRequest = ref(false);
const studyDegrees = ref([]);
const subjectsNames = ref([]);
const studyYears = ref([]);
const subjectCats = ref([]);
const createCourseStore = useCreateCourseStore();

const formData = reactive({
  image: { path: "", file: "" },
  attachmentsFiles: [],
  attachmentsFilesPreview: null,
  degrees: null,
  subjectsNames: null,
  StudyYears: null,
  SubjectKind: "online",
  subjectCats: null,
  Languages: null,
  start_date: null,
  hours: null,
  desc: null,
  goals: null,
  enrichments: null,
  activateStrengtheningRequests: false,
});
const Languages = [
  { id: "ar", name: t("PLACEHOLDERS.arabic") },
  { id: "en", name: t("PLACEHOLDERS.english") },
];
const SubjectTypes = [
  { id: "online", name: t("PLACEHOLDERS.online") },
  { id: "record", name: t("PLACEHOLDERS.record") },
];
const schema = yup.object({
  // degrees: yup.string().required(t("VALIDATION.study_degree")),
  // subjectsNames: yup.object().required(t("VALIDATION.subject_name")),
  // StudyYears: yup.object().required(t("VALIDATION.study_year")),
  // subjectCats: yup.object().required(t("VALIDATION.subject_cat")),
  // Languages: yup.object().required(t("VALIDATION.used_language")),
  start_date: yup.date().required(t("VALIDATION.start_date")),
  hours: yup.number().required(t("VALIDATION.hour_count")),
  desc: yup.string().required(t("VALIDATION.desc_subject")),
  goals: yup.string().required(t("VALIDATION.goals_subject")),
  enrichments: yup.string().required(t("VALIDATION.course_enrichments")),
});

const {
  data: allDegree,
  status: degreesStatus,
  refresh: degreesRefresh,
} = await useLazyAsyncData("all_degrees", () =>
  axios
    .get("teacher/all_degrees")
    .then((res) => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        studyDegrees.value = res.data.data.map((item) => ({
          id: item.id,
          name: item.degree.name,
          nameId: item.degree.id,
        }));
      }
    })
    .catch((error) =>
      console.error("Error fetching study degrees:", error.response)
    )
);
const { data, status, refresh } = await useLazyAsyncData("categories", () =>
  axios
    .get("teacher/categories")
    .then((res) => {
      subjectCats.value = res.data.data || [];
    })
    .catch((error) =>
      console.error("Error fetching study degrees:", error.response)
    )
);

const handleOptionSelected = async (id) => {
  try {
    const res = await axios(`teacher/all-subject-name/${id}`);
    const res1 = await axios(`teacher/academic_years/${id}`);
    subjectsNames.value = res.data.data.map((item) => ({
      id: item.id,
      name: item?.data?.name,
      nameId: item?.data?.id,
    }));
    studyYears.value = res1.data.data;
  } catch (error) {
    console.error("Error fetching subjectsNames:", error);
  }
};

const stepOneValidate = (values) => {
  console.log("values", values);
  createCourseStore.setCreateCourseStepOneData(values);
  isWaitingRequest.value = true;
  if (!formData.image.file) {
    toast.error("Please upload an image");
    isWaitingRequest.value = false;
    return;
  }
  isWaitingRequest.value = false;
  navigateTo("/add-subject/step-two");
};
</script>
