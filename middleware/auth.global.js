import { useAuthenticationStore } from "~/stores/authentication";
export default defineNuxtRouteMiddleware((to, from) => {

  
  const authStore = useAuthenticationStore();

  if (useCookie("elmo3lm_elmosa3d_user_token").value && !authStore.profile) {
    authStore.getProfile();
  }
  
});
