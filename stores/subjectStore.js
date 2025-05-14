import { defineStore } from "pinia";
import { ref } from "vue";

export const useSubjectStore = defineStore("subject", () => {
  const activeStep = ref(1); // Controls active step
  const subjectData = ref({
    name: "",
    duration: "",
    link: "",
    startDate: "",
    startTime: "",
  });

  const nextStep = () => {
    if (activeStep.value < 3) activeStep.value++;
  };

  const prevStep = () => {
    if (activeStep.value > 1) activeStep.value--;
  };

  return {
    activeStep,
    subjectData,
    nextStep,
    prevStep,
  };
});
