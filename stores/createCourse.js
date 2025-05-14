import { defineStore } from 'pinia'

// ✅ Modern, Const-based, Well-structured
export const useCreateCourseStore = defineStore('createCourse', () => {
  // ===== STATE ===== //
  const createCourseStepOne = ref(null)
  const createCourseStepTwo = ref(null)

  // ===== GETTERS ===== //
  const getCourseStepOne = computed(() => createCourseStepOne.value)
  const getCourseStepTwo = computed(() => createCourseStepTwo.value)

  // ===== ACTIONS ===== //
  const setCreateCourseStepOneData = (payload) => {
    createCourseStepOne.value = payload
  }

  const setCreateCourseStepTwoData = (payload) => {
    createCourseStepTwo.value = payload
  }

  return {
    // State
    createCourseStepOne,
    createCourseStepTwo,

    // Getters
    getCourseStepOne,
    getCourseStepTwo,

    // Actions
    setCreateCourseStepOneData,
    setCreateCourseStepTwoData,
  }
})
