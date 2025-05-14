<template>
  <div class="edit-lesson-modal-wrapper">
    <BaseModal
      :show="modalApperanceData"
      @controleModalApperance="controleModalApperance"
    >
      <template #modal>
        <div class="w-full text-center">
          <h3 class="text-[2.8rem] font-bold text-themeText mb-4">
            {{ $t("TITLES.edit") }}
          </h3>


          <VeeForm
            v-slot="{ values }"
            @submit="submitEditLessonForm"
            :initial-values="lessonData"
            class="space-y-6"
          >
            <div class="cards-wrapper my-5">
              <div class="day-card flex flex-col gap-3 mb-3">
                <InputsText
                  id="duration"
                  type="number"
                  name="duration"
                  :placeholder="$t('PLACEHOLDERS.course_time')"
                  class="w-full"
                />


                <InputsText
                  id="name"
                  name="name"
                  :placeholder="$t('PLACEHOLDERS.course_name')"
                  class="w-full"
                />


                <InputsText
                  id="link"
                  name="link"
                  :placeholder="$t('PLACEHOLDERS.course_link')"
                  class="w-full"
                />



                <InputsBaseDate
                  :min-date="new Date()"
                  id="start_date"
                  name="start_date"
                  :placeholder="$t('PLACEHOLDERS.start_date_course')"
                  type="text"
                  v-model:itemValue="lessonData.start_date"
                />

                <InputsBaseDate
                  id="start_time"
                  name="start_time"
                  v-model:itemValue="lessonData.start_time"
                  :timePicker="true"
                  :placeholder="$t('PLACEHOLDERS.course_start_time')"
                />
              </div>

              <InputsButton
                :loading="isWaitingRequest"
                type="submit"
                :name="t('BUTTONS.edit')"
                class="w-[150px]"
              />
            </div>
          </VeeForm>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";

const { t } = useI18n();
const axios = useNuxtApp().$axios;
const toast = useToast();
const props = defineProps({
  courseType: String,
  selectedLesson: Object,
  modalApperanceData: Boolean,
});

const emit = defineEmits(["controleModalApperance", "getDetailsAfterEdit"]);

const isWaitingRequest = ref(false);

const lessonData = ref([
  {
    name: null,
    link: null,
    duration: null,
    start_date: null,
    start_time: null,
  },
]);

watch(
  () => props.modalApperanceData,
  (newVal) => {
    if (newVal) {
      lessonData.value = { ...props.selectedLesson };
    }
    console.log("lessonData.value", lessonData.value);
  }
);

const controleModalApperance = () => {
  emit("controleModalApperance");
};

const getDetailsAfterEdit = () => {
  emit("getDetailsAfterEdit");
};

const submitEditLessonForm = async (values) => {
  isWaitingRequest.value = true;
  const theData = new FormData();

  theData.append("name", values.name);
  theData.append("link", values.link);
  theData.append("duration", values.duration);

  if (props.courseType === "online") {
    theData.append("start_date", values.start_date);
    theData.append("start_time", values.start_time);
  }

  try {
    await axios.post(
      `teacher/subject/listen/${props.selectedLesson.id}`,
      theData
    );

    isWaitingRequest.value = false;
    toast.success(t("MESSAGES.edited_successfully"));
    controleModalApperance();
    getDetailsAfterEdit();
  } catch (err) {
    isWaitingRequest.value = false;
    console.error(err);
  }
};
</script>

<style scoped></style>
