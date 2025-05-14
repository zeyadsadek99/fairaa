export default defineNuxtRouteMiddleware((to, from) => {
    // ✅ Get the auth token from cookies
    const token = useCookie("elmo3lm_elmosa3d_user_token");
  
    // ✅ Redirect to login if token is missing
    if (!token.value) {
      return navigateTo("/login");
    }
  });
  