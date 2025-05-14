<template>
  <div>
    <Loader1 v-if="status == 'pending'" />

    <template v-else-if="status == 'success'">
      <GlobalBreadCrumbs>
        <template #page_title>{{ $t("TITLES.quiz_questions") }}</template>
        <template #breadcrumb_current_page>{{
          $t("TITLES.quiz_questions")
        }}</template>
      </GlobalBreadCrumbs>

      <div class="container md:flex items-center md:justify-center">
        <VeeForm
          v-slot="{ values }"
          @submit="submitQuiz"
          :initial-values="quiz"
          class="space-y-6"
        >
          <div class="mt-6">
            <h3
              class="text-[1.75rem] font-bold mb-6 leading-tight"
              v-if="!showUnavailableQuiz"
            >
              {{ $t("TITLES.communication_data") }}
            </h3>

            <div
              v-for="question in quiz"
              :key="question.id"
              class="grid grid-cols-6 items-center gap-4 mb-5"
            >
              <div
                class="bg-gray-100 block leading-6 text-xl col-span-3 p-3.5 rounded-2xl"
              >
                <p class="font-medium">{{ question.question }}</p>
              </div>

              <div class="col-span-6 grid grid-cols-4 items-center gap-3">
                <button
                  v-for="answer in question.answers"
                  :key="answer.id"
                  type="button"
                  class="bg-gray-200 h-[70%] py-4 md:py-0 px-4 text-center flex items-center justify-center text-themeText border-none rounded-2xl text-xl"
                  :class="{ 'bg-mainTheme text-white': answer.selected }"
                  @click="selectAnswer(question, answer)"
                >
                  {{ answer.answer }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-center my-16" v-if="!showUnavailableQuiz">
            <InputsButton
              type="submit"
              :name="t('BUTTONS.end_quiz')"
              class="w-[150px]"
            >
            </InputsButton>
          </div>
        </VeeForm>
      </div>

      <div
        v-if="showUnavailableQuiz"
        class="mt-10 flex flex-col items-center justify-center gap-4"
      >
        <img
          src="../assets/media/images/block.png"
          alt="Blocked"
          class="w-40 h-40"
        />
        <h3 class="text-midRed text-center text-xl">
          {{ $t("TITLES.unavailableQuiz") }}
        </h3>
        <NuxtLink
          :to="localePath(`/student/course-details/${courseType}/${courseId}`)"
          class="btn-primary"
        >
          {{ $t("BUTTONS.show_subject") }}
        </NuxtLink>
      </div>

      <ModalsSuccessModal
        v-if="successModalIsOpen"
        :modalApperanceData="successModalIsOpen"
        @controleModalApperance="toggleSuccessModal"
      >
        <template #title>{{ $t("TITLES.quiz_added") }}</template>
        <template #sub_title>
          {{ $t("TITLES.quiz_ending") }} ({{ quizResult.student_result }} -
          {{ quizResult.final_result }}) {{ $t("TITLES.quiz_degree") }}
        </template>
        <template #success_btn>
          <NuxtLink
            :to="
              localePath({
                path: `/subjects/${courseId}`,
                query: { type: 'online' },
              })
            "
            class="btn mt-8"
          >
            {{ $t("BUTTONS.show_subject") }}
          </NuxtLink>
        </template>
      </ModalsSuccessModal>
    </template>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const localePath = useLocalePath();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const axios = useNuxtApp().$axios;

const successModalIsOpen = ref(false);
const quiz = ref([]);
const quizResult = ref({});
const showUnavailableQuiz = ref(false);

const courseId = route.params.id;
const userType = useCookie("elmo3lm_elmosa3d_user_type");

const toggleSuccessModal = () =>
  (successModalIsOpen.value = !successModalIsOpen.value);

const { data, status, refresh } = await useLazyAsyncData("quiz", () =>
  axios
    .get(`student/subject/${courseId}/quiz`)
    .then((res) => {
      quiz.value = res.data.data.map((q) => ({
        ...q,
        selectedAnswer: null,
        answers: q.answers.map((a) => ({ ...a, selected: false })),
      }));
    })
    .catch((error) => {
      showUnavailableQuiz.value = error.response?.status === 401;

      console.error("Error} fetching quiz:", error);
    })
);

const selectAnswer = (question, answer) => {
  question.answers.forEach((ans) => (ans.selected = false));
  answer.selected = true;
  question.selectedAnswer = answer.id;
};
const submitQuiz = async () => {
  // return;
  if (userType.value === "student") {
    const formData = {
      answers_ids: [],
      questions_ids: [],
    };

    // Loop over quiz to collect selected answers and question IDs
    quiz.value.forEach((question) => {
      const selectedAnswer = question.answers.find((answer) => answer.selected);
      if (selectedAnswer) {
        formData.answers_ids.push({ id: selectedAnswer.id });
      }
      formData.questions_ids.push(question.id);
    });

    try {
      const res = await axios.post(
        `student/subject/${courseId}/quiz/result`,
        formData
      );

      // ✅ Success handling
      successModalIsOpen.value = true;
      quizResult.value = res.data.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "حدث خطأ ما", {
        timeout: 3000,
      });
    }
  } else {
    router.replace("/subjects");
  }
};
// const validateFormInputs = async () => {
//   const isValid = quiz.value.every((q) => q.selectedAnswer);
//   if (!isValid) {
//     alert(t("VALIDATION.quiz"));
//     return;
//   }

//   const answers = quiz.value.map((q) => ({
//     question_id: q.id,
//     answer_id: q.selectedAnswer,
//   }));

//   try {
//     const formData = new FormData();
//     formData.append("answers", JSON.stringify(answers));
//     const res = await axios.post(`student/subject/${courseId}/quiz`, formData);
//     quizResult.value = res.data.data;
//     toggleSuccessModal();
//   } catch (err) {
//     alert(err.response?.data?.message || "Something went wrong!");
//   }
// };
</script>

<style scoped></style>
