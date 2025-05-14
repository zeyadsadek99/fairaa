// stores/strengtheningRequests.js

import { defineStore } from "pinia";

export const useStrengtheningRequestsStore = defineStore(
  "strengtheningRequests",
  () => {
    // ✅ Reactive State
    const strengtheningRequestsData = ref([]);
    const last_page = ref(1);

    // ✅ Nuxt Axios
    const axios = useNuxtApp().$axios;

    // ✅ Cookies (instead of localStorage)
    const userToken = useCookie("elmo3lm_elmosa3d_user_token");
    const userType = useCookie("elmo3lm_elmosa3d_user_type");
    const appLang = useCookie("elmo3lm_elmosa3d_app_lang");

    // ✅ Get Strengthening Requests
    const fetchStrengtheningRequests = async (page = 1) => {
      try {
        let url =
          userType.value === "teacher"
            ? `teacher/relay_request?page=${page}`
            : `parent/relay_request?page=${page}`;

        const res = await axios.get(url);

        strengtheningRequestsData.value = res.data.data;
        last_page.value = res.data.meta.last_page;
      } catch (error) {
        console.error("Error fetching strengthening requests:", error);
      }
    };

    // ✅ Change Request Status
    const changeRequestStatus = async ({ id, newStatus }) => {
      try {
        const formData = new FormData();
        formData.append("relay_request_id", id);
        formData.append("status", newStatus);

        await axios.post("teacher/relay_request/change_status", formData);

        // Refresh data after change
        await fetchStrengtheningRequests(1); // or maintain current page if needed
      } catch (error) {
        console.error("Error changing request status:", error);
      }
    };

    // ✅ Return state and methods
    return {
      strengtheningRequestsData,
      last_page,
      fetchStrengtheningRequests,
      changeRequestStatus,
    };
  }
);
