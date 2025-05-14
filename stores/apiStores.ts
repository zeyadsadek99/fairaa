import { defineStore } from "pinia";

export const useApiStore = defineStore("apiStore", () => {
  const axios = useNuxtApp().$axios;

  // // ✅ Use Cookies Instead of Local Storage
  // const userToken = useCookie("elmo3lm_elmosa3d_user_token");
  // const appLang = useCookie("elmo3lm_elmosa3d_app_lang", {
  //   default: () => "ar",
  // });

  const countries = ref(null);
  const sons = ref(null);
  const selectedCountryKey = ref(null);
  const cities = ref([]);
  const studyDegrees = ref([]);
  const studyYears = ref([]);
  const specializations = ref([]);
  const experiences = ref([]);

  async function getCountries() {
    try {
      const res = await axios.get("countries");
      countries.value = res.data.data;
      selectedCountryKey.value = res.data.data[0]; 
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  async function getSons() {
    try {
      const res = await axios.get("parent/my-children");
      sons.value = res.data.data;
    } catch (error) {
      console.error("Error fetching sons:", error);
    }
  }

  async function getCities(countryId: any) {
    try {
      const res = await axios.get(`cities/${countryId}`);
      cities.value = res.data.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

  function changeSelectedPhoneCode(phoneCode: any) {
    selectedCountryKey.value = phoneCode;
  }

  async function getStudyDegrees() {
    try {
      const res = await axios.get("degrees");
      studyDegrees.value = res.data.data;
    } catch (error) {
      console.error("Error fetching study degrees:", error);
    }
  }

  async function getStudyYears(degreeId: any) {
    try {
      const res = await axios.get(`academic-years/${degreeId}`);
      studyYears.value = res.data.data;
    } catch (error) {
      console.error("Error fetching study years:", error);
    }
  }

  async function getSpecializations(degreeId: any) {
    try {
      const res = await axios.get(`specializations/${degreeId}`);
      specializations.value = res.data.data;
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  }

  async function getExperiences() {
    try {
      const res = await axios.get("experiences");
      experiences.value = res.data.data;
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  }

  // ✅ Getters
  const countriesData = computed(() => ({
    allCountries: countries.value,
    selectedCountry: selectedCountryKey.value,
  }));
  //  getCountries();

  // console.log("countriesData", countriesData);

  return {
    countries,
    sons,
    selectedCountryKey,
    cities,
    studyDegrees,
    studyYears,
    specializations,
    experiences,

    getCountries,
    getSons,
    getCities,
    changeSelectedPhoneCode,
    getStudyDegrees,
    getStudyYears,
    getSpecializations,
    getExperiences,

    countriesData,
  };
});
