<template>
  <div class="edit-lesson-card">
    <VeeForm
      v-slot="{ values }"
      @submit="submitEditLessonForm"
      :initial-values="formData"
      :validation-schema="schema"
      class="space-y-6"
    >
      <VeeFieldArray name="days" v-slot="{ fields, push, remove }">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
          <div
            v-for="(field, idx) in editCourseData.days"
            :key="field.key"
            class="day_card"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-[1.8rem]  font-bold text-themeText">
                {{ $t("PLACEHOLDERS.day") }} #{{ idx + 1 }}
              </h3>
              <button
                v-if="idx !== 0"
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
              :id="`duration${idx}`"
              :name="`days[${idx}].duration`"
              type="number"
              :placeholder="$t('PLACEHOLDERS.course_time')"
              class="md:w-full"
            />
            <InputsText
              :id="`course_name${idx}`"
              :name="`days[${idx}].name`"
              :placeholder="$t('PLACEHOLDERS.course_name')"
              class="w-full"
            />
            <InputsText
              :id="`course_link${idx}`"
              :name="`days[${idx}].link`"
              :placeholder="$t('PLACEHOLDERS.course_link')"
              class="w-full"
            />
            <InputsBaseDate
              :min-date="new Date()"
              :id="`start_date_course${idx}`"
              :name="`days[${idx}].start_date`"
              :placeholder="$t('PLACEHOLDERS.start_date_course')"
            />
            <InputsBaseDate
              :id="`course_start_time${idx}`"
              :name="`days[${idx}].start_time`"
              :timePicker="true"
              :is24="true"
              :placeholder="$t('PLACEHOLDERS.course_start_time')"
            />
          </div>
        </div>

        <div class="flex justify-center mt-10">
          <InputsButton2
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
            class="relative text-2xl px-5 py-1 rounded-[10px] bg-none border-mainTheme !text-mainTheme border-1 !border-dashed w-[300px]"
          />
        </div>

        <div
          class="mt-3 flex flex-col md:flex-row justify-center items-center gap-4"
        >
          <InputsButton
            :loading="loading"
            type="button"
            :name="t('BUTTONS.previous')"
            @click="navigateTo('/add-subject')"
            class="w-[300px]"
          />
          <InputsButton
            :loading="loading"
            type="submit"
            :name="t('BUTTONS.add')"
            class="w-[300px]"
          />
        </div>
      </VeeFieldArray>
    </VeeForm>
  </div>
</template>

<script setup>
import { useCreateCourseStore } from "@/stores/createCourse";
const { t } = useI18n();
const createCourseStore = useCreateCourseStore();

const editCourseData = reactive({
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
const submitEditLessonForm = async (values) => {
  // return;
  createCourseStore.setCreateCourseStepTwoData(values);

  navigateTo("/add-subject/step-three");
};
</script>

<style scoped>
.edit-lesson-card {
  @apply text-center;
  .day_card {
    @apply rounded-xl bg-white py-5  flex flex-col gap-3 px-4 relative;
    box-shadow: 0 0 10px 2px var(--simple_shadow_clr);
  }
}
</style>
