<template>
  <div>
    <GlobalBreadCrumbs>
      <template v-slot:page_title>
        {{ $t("TITLES.edit_course_info") }}
      </template>
      <template v-slot:breadcrumb_current_page>
        {{ $t("TITLES.edit_course_info") }}
      </template>
    </GlobalBreadCrumbs>
    <div v-if="status == 'pending'"><Loader1 /></div>

    <template v-else-if="status == 'success'">
      <div class="container my-6">
        <VeeForm
          v-slot="{ values }"
          @submit="stepOneValidate"
          :initial-values="editCourseData"
          class="space-y-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
            <div class="col-span-1 md:col-span-2 w-fit relative mx-auto">
              <InputsBaseFile
                v-model:image="editCourseData.image.file"
                v-model:itemValue="editCourseData.image.path"
                accept="image/png, image/webp, image/jpeg"
                :no_preview="true"
                modalType="image"
                :returnFile="true"
                modalName="users"
                id="image"
                name="image"
              />
            </div>
            <InputsDropDown
              v-model:modelValue="editCourseData.degrees"
              name="degrees"
              disabled
              :options="studyDegrees"
              :placeholder="$t('PLACEHOLDERS.study_degree')"
              showPlaceholderOption
              @option-selected="handleOptionSelected"
            />

            <InputsDropDown
              v-model:modelValue="editCourseData.subjectsNames"
              name="subjectsNames"
              :options="subjectsNames"
              showPlaceholderOption
              :placeholder="$t('PLACEHOLDERS.subject_name')"
              icon
            />
            <InputsDropDown
              v-model:modelValue="editCourseData.StudyYears"
              name="StudyYears"
              :options="studyYears"
              showPlaceholderOption
              :placeholder="$t('PLACEHOLDERS.study_year')"
              icon
            />

            <InputsDropDown
              v-model:modelValue="editCourseData.subjectCats"
              name="subjectCats"
              showPlaceholderOption
              :options="subjectCats"
              :placeholder="$t('PLACEHOLDERS.subject_cat')"
              icon
            />

            <InputsDropDown
              v-model:modelValue="editCourseData.Languages"
              name="Languages"
              :options="Languages"
              showPlaceholderOption
              :placeholder="$t('PLACEHOLDERS.used_language')"
              icon
            />


            <InputsBaseDate
              :min-date="new Date()"
              id="start_date"
              name="start_date"
              :placeholder="$t('PLACEHOLDERS.start_date')"
              type="text"
              v-model:itemValue="editCourseData.start_date"
            />

            <InputsText
              type="number"
              id="hours"
              name="hours"
              :placeholder="$t('PLACEHOLDERS.hour_count')"
              class="w-full"
              v-model.trim="editCourseData.hours"
            />


            <InputsBase
              id="desc_subject"
              name="desc_subject"
              type="textarea"
              :placeholder="$t('PLACEHOLDERS.desc_subject')"
              :rows="4"
            />
            <InputsBase
              id="goals_subject"
              name="goals_subject"
              type="textarea"
              :placeholder="$t('PLACEHOLDERS.goals_subject')"
              :rows="4"
            />
            <InputsBase
              id="course_enrichments"
              name="course_enrichments"
              type="textarea"
              :placeholder="$t('PLACEHOLDERS.course_enrichments')"
              :rows="4"
            />
            <div
              v-if="editCourseData.type_subject == 'online'"
              class="col-span-1 md:col-span-2 py-5 flex gap-4 items-center"
            >
              <Switch
                v-model="editCourseData.has_offer"
                :class="
                  editCourseData.has_offer ? 'bg-mainTheme' : 'bg-softMainTheme'
                "
                class="relative flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
              >
                <span
                  aria-hidden="true"
                  :class="
                    editCourseData.has_offer
                      ? 'translate-x-0'
                      : '-translate-x-5'
                  "
                  class="pointer-events-none inline-block h-5 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                />
              </Switch>
              <span class="text-themeText text-lg font-medium cursor-pointer">
                يوجد عروض علي المادة؟
              </span>
            </div>
            <InputsBase
              v-if="editCourseData.has_offer"
              v-model="editCourseData.offer_desc"
              id="offerdesc"
              name="offerdesc"
              type="textarea"
              :placeholder="$t('PLACEHOLDERS.offer_desc')"
              :rows="4"
            />
            <InputsText
              v-if="editCourseData.has_offer"
              type="number"
              id="offeramount"
              name="offeramount"
              :placeholder="$t('PLACEHOLDERS.offer_amount')"
              class="w-full"
              v-model.trim="editCourseData.offer_amount"
            />
          </div>

          <VeeFieldArray name="days" v-slot="{ fields, push, remove }">
            <div
              class="grid gap-10"
              :class="{
                'grid-cols-1': fields.length === 0,
                'grid-cols-1 md:grid-cols-2': fields.length > 0,
              }"
            >
              <div
                v-for="(field, idx) in editCourseData.days"
                :key="field.key"
                class="day-card"
              >
                <div class="flex justify-between">
                  <h3 class="text-[1.8rem]  font-bold text-themeText">
                    {{ $t("PLACEHOLDERS.day") }} #{{ idx + 1 }}
                  </h3>
                  <button
                    type="button"
                    class="border-none size-11 rounded-full bg-midRed text-white flex items-center justify-center"
                    @click="
                      editCourseData.days.length > 1
                        ? editCourseData.days.splice(idx, 1)
                        : null
                    "
                  >
                    <IconsTrash />
                  </button>
                </div>

                <InputsText
                  :id="`days[${idx}].duration`"
                  :name="`days[${idx}].duration`"
                  type="number"
                  :placeholder="$t('PLACEHOLDERS.course_time')"
                  class="w-full"
                  v-model="editCourseData.days[idx].duration"
                />
                <InputsText
                  :id="`days[${idx}].name`"
                  :name="`days[${idx}].name`"
                  :placeholder="$t('PLACEHOLDERS.course_name')"
                  class="w-full"
                  v-model="editCourseData.days[idx].name"
                />
                <InputsText
                  :id="`days[${idx}].link`"
                  type="url"
                  :name="`days[${idx}].link`"
                  :placeholder="$t('PLACEHOLDERS.course_link')"
                  class="w-full"
                  v-model="editCourseData.days[idx].link"
                />
                <InputsBaseDate
                  :min-date="new Date()"
                  v-model:itemValue="editCourseData.days[idx].start_date"
                  :id="`start_date_course${idx}`"
                  :name="`days[${idx}].start_date`"
                  :placeholder="$t('PLACEHOLDERS.start_date_course')"
                />
                <InputsBaseDate
                  :id="`course_start_time${idx}`"
                  v-model:itemValue="editCourseData.days[idx].start_time"
                  :name="`days[${idx}].start_time`"
                  :timePicker="true"
                  :is24="true"
                  :placeholder="$t('PLACEHOLDERS.course_start_time')"
                />

              </div>
            </div>

            <div class="flex justify-center mt-10">
              <InputsButton
                type="button"
                :name="t('BUTTONS.add_day')"
                @click="
                  editCourseData.days.push({
                    duration: null,
                    name: null,
                    link: null,
                    start_date: null,
                    start_time: null,
                  })
                "
                class="w-full lg:w-1/4"
              />
            </div>

          </VeeFieldArray>

          <div class="mt-3 flex justify-center gap-4">
            <InputsButton
              :loading="loading"
              type="submit"
              :name="t('BUTTONS.save')"
              class="w-full lg:w-1/4"
            >
            </InputsButton>
          </div>
        </VeeForm>
        <ModalsSuccessModal
          :modalApperanceData="successModalIsOpen"
          @controleModalApperance="toggleSuccessModal"
        >
          <template #title>{{ $t("TITLES.subject_added") }}</template>
          <template #sub_title>{{
            $t("TITLES.you_can_accept_requests")
          }}</template>
          <template #success_btn>
            <NuxtLink  :to="localePath('/subjects')" class="btn mt-8">{{
              $t("BUTTONS.added_subjects")
            }}</NuxtLink>
          </template>
        </ModalsSuccessModal>
      </div>
    </template>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { useToast } from "vue-toastification";
import { Switch } from "@headlessui/vue";
const localePath = useLocalePath();

const axios = useNuxtApp().$axios;
const successModalIsOpen = ref(false);
const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const studyDegrees = ref([]);
const subjectsNames = ref([]);
const studyYears = ref([]);
const subjectCats = ref([]);
const editCourseData = reactive({
  subjectsNames: null,
  StudyYears: null,
  subjectCats: null,
  degrees: null,
  Languages: "",
  hours: "",
  image: { path: "", file: "" },
  language: "",
  start_date: "",
  type_subject: "",
  price_subject: "",
  offer_desc: "",
  offer_amount: "",
  desc_subject: "",
  goals_subject: "",
  course_enrichments: "",
  attachmentsFiles: [],
  has_offer: false,
  days: [
    {
      duration: null,
      name: null,
      link: null,
      start_date: null,
      start_time: null,
    },
  ],
});

const toggleSuccessModal = () => {
  successModalIsOpen.value = !successModalIsOpen.value;
};

const Languages = [
  { id: "ar", name: t("PLACEHOLDERS.arabic") },
  { id: "en", name: t("PLACEHOLDERS.english") },
];


const fetchStudyDegrees = async () => {
  try {
    const res = await axios.get("teacher/all_degrees");

    if (res.data && res.data.data && res.data.data.length > 0) {
      studyDegrees.value = res.data.data.map((item) => ({
        id: item.id,
        name: item.degree.name,
        nameId: item.degree.id,
      }));
    }
  } catch (error) {
    console.error("Error fetching study degrees:", error);
  }
};
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

const fetchSubjectCategories = async () => {
  const res = await axios("teacher/categories");
  subjectCats.value = res.data.data || [];
};
const loading = ref(false);
const { data, status, refresh } = await useLazyAsyncData(
  "getCourseDetails",
  () =>
    axios
      .get(`teacher/subject/show/${route.params.id}`)
      .then((res) => {
        const data = res.data.data;
        editCourseData.image.path = data?.image;
        editCourseData.degrees = data?.degree?.degree;
        editCourseData.subjectsNames = data?.degree?.specializations[0] || "";
        editCourseData.StudyYears = data?.academic_year;
        editCourseData.subjectCats = data?.category;
        editCourseData.Languages = Languages.find(
          (item) => item.id === data?.lang
        );
        editCourseData.start_date = data?.start_date;
        editCourseData.hours = data?.num_of_hour;
        editCourseData.type_subject = data?.subject_kind;
        editCourseData.price_subject = data?.price;
        editCourseData.offer_desc = data?.offer_desc;
        editCourseData.offer_amount = data?.discount_percentage;
        editCourseData.desc_subject = data?.desc;
        editCourseData.goals_subject = data?.objectives;
        editCourseData.course_enrichments = data?.enriching;
        editCourseData.attachmentsFiles = data?.attachments;

        editCourseData.days = data?.listens.map((item) => ({
          duration: item?.duration,
          name: item?.name,
          link: item?.link,
          start_date: item?.start_date,
          start_time: item?.start_time,
        }));

        // ✅ Fetch related data
        handleOptionSelected(data.degree.degree.id);
      })
      .catch((error) => console.error("Error fetching course details:", error))
);

const stepOneValidate = (values) => {
  console.log("values", values);
  console.log(studyDegrees.value[0]);

  loading.value = true;

  try {
    const theData = new FormData();
    theData.append("subject_id", route.params.id);

    if (editCourseData.image.file) {
      theData.append("image", values.image?.file);
    }

    theData.append("teacher_degree_id", studyDegrees.value[0].id);
    theData.append("academic_year_id", values.StudyYears?.id);
    theData.append("category_id", values.subjectCats?.id);

    theData.append("lang", values.Languages?.id);

    theData.append("start_date", values.start_date);
    theData.append("num_of_hour", parseInt(values.hours));
    theData.append("subject_kind", values.type_subject);
    theData.append("desc", values.desc_subject);
    theData.append("objectives", values.goals_subject);
    theData.append("enriching", values.course_enrichments);

    // ✅ Attachments Files
    // const fileValues = editCourseData?.attachmentsFiles;
    // fileValues.forEach((item, index) => {
    //   if (item.file) {
    //     theData.append(`attachments[${index}]`, item.file);
    //   }
    // });

    editCourseData.days.forEach((element, index) => {
      theData.append(`listens[${index}][link]`, element.link);
      theData.append(`listens[${index}][name]`, element.name);
      theData.append(`listens[${index}][duration]`, parseInt(element.duration));

      if (editCourseData.type_subject === "online") {
        theData.append(`listens[${index}][start_date]`, element.start_date);
        theData.append(`listens[${index}][start_time]`, element.start_time);
      }
    });

    const res = axios.post(`teacher/subject/update`, theData);
    console.log(res);

    loading.value = false;

    toast.success(res?.data?.message);
  } catch (err) {
    loading.value = false;
    console.log(err);
    toast.error(err?.response?.data?.message || t("ERRORS.unexpected_error"));
  }

  loading.value = false;
};

onMounted(() => {
  fetchStudyDegrees();
  fetchSubjectCategories();
});
</script>

<style scoped>
.day-card {
  @apply rounded-xl bg-white py-5  flex flex-col gap-3 px-4 relative;
  box-shadow: 0 0 10px 2px var(--simple_shadow_clr);
}
</style>
