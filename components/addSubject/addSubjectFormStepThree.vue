<template>
  <div class="edit-lesson-card">
    <VeeForm
      v-slot="{ values }"
      @submit="submitForm"
      :initial-values="formData"
      class="space-y-6"
    >
      <VeeFieldArray name="questions" v-slot="{ fields, push, remove }">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
          <div
            v-for="(field, idx) in formData.questions"
            :key="field.key"
            class="day-card"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-[1.8rem] font-bold text-themeText">
                {{ $t("PLACEHOLDERS.question") }} #{{ idx + 1 }}
              </h3>
              <button
                v-if="idx !== 0"
                type="button"
                class="size-[35px] rounded-full bg-midRed text-white flex items-center justify-center"
                @click="
                  formData.questions.length > 1
                    ? formData.questions.splice(idx, 1)
                    : null
                "
              >
                <IconsTrash class="size-4" />
              </button>
            </div>

            <InputsText
              :id="`questions[${idx}].question`"
              :name="`questions[${idx}].question`"
              :placeholder="$t('PLACEHOLDERS.question')"
              class="w-full"
            />

            <div v-for="answerIdx in 4" :key="answerIdx">
              <InputsText
                :id="`questions[${idx}].answers[${answerIdx - 1}]`"
                :name="`questions[${idx}].answers[${answerIdx - 1}]`"
                :placeholder="`${$t('PLACEHOLDERS.choice')} #${answerIdx}`"
                class="w-full"
              />
            </div>

            <InputsSelect2
              :id="`questions[${idx}].correct_answer`"
              :name="`questions[${idx}].correct_answer`"
              :options="
                values.questions[idx].answers.map((a, i) => ({
                  value: i,
                  label: a || $t('PLACEHOLDERS.correct_answer'),
                }))
              "
              :placeholder="$t('PLACEHOLDERS.correct_answer')"
            />
          </div>
        </div>

        <div class="flex justify-center mt-10">
          <InputsButton2
            type="button"
            :name="t('BUTTONS.add_question')"
            @click="
              formData.questions.push({
                question: '',
                answers: ['', '', '', ''],
                correct_answer: '',
              })
            "
            class="relative text-2xl px-5 py-1 rounded-[10px] bg-none border-mainTheme !text-mainTheme border-1 !border-dashed w-[300px]"
          />
        </div>

        <div class="mt-3 flex justify-center gap-4">
          <InputsButton
            :disabled="loading"
            type="button"
            :name="t('BUTTONS.previous')"
            @click="navigateTo('/add-subject/step-two')"
            class="w-[300px]"
          />
          <InputsButton
            :disabled="loading"
            type="submit"
            :name="t('BUTTONS.add')"
            class="w-[300px]"
          />
        </div>
      </VeeFieldArray>
    </VeeForm>

    <ModalsSuccessModal
      :modalApperanceData="successModalIsOpen"
      @controleModalApperance="toggleSuccessModal"
    >
      <template #title>{{ $t("TITLES.subject_added") }}</template>
      <template #sub_title>{{ $t("TITLES.you_can_accept_requests") }}</template>
      <template #success_btn>
        <NuxtLink :to="localePath('/subjects')" class="btn mt-8">{{
          $t("BUTTONS.added_subjects")
        }}</NuxtLink>
      </template>
    </ModalsSuccessModal>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
import { useCreateCourseStore } from "@/stores/createCourse";
const { t } = useI18n();
const localePath = useLocalePath();

const axios = useNuxtApp().$axios;
const createCourseStore = useCreateCourseStore();
const { createCourseStepOne, createCourseStepTwo } =
  storeToRefs(createCourseStore);
const successModalIsOpen = ref(false);
const toast = useToast();
const emit = defineEmits(["controleModalApperance", "getDetailsAfterEdit"]);

const isWaitingRequest = ref(false);
const formData = ref({
  questions: [
    {
      question: "",
      answers: ["", "", "", ""],
      correct_answer: "",
    },
  ],
});

const toggleSuccessModal = () => {
  successModalIsOpen.value = !successModalIsOpen.value;
};

const submitForm = async (values) => {
  const stepOne = createCourseStepOne.value;
  const stepTwo = createCourseStepTwo.value;
  console.log("Step One", stepOne);
  console.log("Step Two", stepTwo);

  isWaitingRequest.value = true;

  try {
    const theData = new FormData();

    if (stepOne.image) {
      theData.append("image", stepOne.image);
    }
    theData.append("teacher_degree_id", stepOne?.degrees?.id);
    theData.append("teacher_specialization_id", stepOne?.subjectsNames?.id);
    theData.append("academic_year_id", stepOne?.StudyYears?.id);
    theData.append("category_id", stepOne?.subjectCats?.id);
    theData.append("lang", stepOne?.Languages?.id);
    theData.append("start_date", stepOne?.start_date);
    theData.append("num_of_hour", parseInt(stepOne?.hours));
    theData.append("subject_kind", stepOne?.SubjectKind);
    theData.append("desc", stepOne?.desc);
    theData.append("objectives", stepOne?.goals);
    theData.append("enriching", stepOne?.enrichments);

    // Optional Offer
    if (stepOne.has_offer && stepOne.type_subject === "online") {
      theData.append("offer_desc", stepOne.offer_desc);
      theData.append("discount_percentage", stepOne.offer_amount);
    }

    // Attachments
    // stepOne.attachmentsFiles.forEach((item, index) => {
    //   theData.append(`attachments[${index}]`, item.file);
    // });

    // Questions & Answers
    values.questions.forEach((question, qIndex) => {
      theData.append(`questions[${qIndex}]`, question.question);
      question.answers.forEach((answer, aIndex) => {
        theData.append(`answers[${qIndex}][${aIndex}]`, answer);
      });
      theData.append(`correct_answer[${qIndex}]`, question.correct_answer);
    });

    // Course Lessons (Step Two)
    stepTwo.days.forEach((lesson, lIndex) => {
      theData.append(`listens[${lIndex}][link]`, lesson.link);
      theData.append(`listens[${lIndex}][name]`, lesson.name);
      theData.append(`listens[${lIndex}][duration]`, lesson.duration);
      if (stepOne.SubjectKind === "online") {
        theData.append(`listens[${lIndex}][start_date]`, lesson.start_date);
        theData.append(`listens[${lIndex}][start_time]`, lesson.start_time);
      }
    });

    await axios.post("teacher/subject/create", theData);

    isWaitingRequest.value = false;
    toggleSuccessModal();
    toast.success(t("TITLES.subject_added"));
  } catch (error) {
    console.error(error);
    isWaitingRequest.value = false;
    toast.error(error.response?.data?.message || t("ERRORS.default"));
  }
};
</script>

<style scoped>
.edit-lesson-card {
  @apply w-full text-center;
  .day-card {
    @apply rounded-xl bg-white py-5  flex flex-col gap-3 px-4 relative;
    box-shadow: 0 0 10px 2px var(--simple_shadow_clr);
  }
}
</style>
