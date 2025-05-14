import { defineStore } from "pinia";
import axios from "axios";
export const useAuthenticationStore = defineStore("authentication", () => {
  const dataToVerfiy = useCookie("dataToVerfiy");
  const type = useCookie("elmo3lm_elmosa3d_user_type");
  const token = useCookie("elmo3lm_elmosa3d_user_token");
  const avatar = useCookie("elmo3lm_elmosa3d_user_avatar");
  const config = useRuntimeConfig();
  const getAuthenticatedUserData = () => ({
    dataToVerfiy: dataToVerfiy?.value,
    type: type.value || "",
    token: token.value ? `Bearer ${token.value}` : "",
    avatar: avatar.value || "",
  });

  const setAuthenticatedUserData = (payload: {
    type: string;
    token: string;
    avatar: string;
  }) => {
    type.value = payload.type;
    token.value = payload.token;
    avatar.value = payload.avatar;
  };

  const profile = ref(null);

  const getProfile = async () => {
    axios(`${config.public.baseURL}${type.value}/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": useNuxtApp().$i18n.locale.value,
        Authorization: `Bearer ${
          token.value || useCookie("elmo3lm_elmosa3d_user_token").value
        }`,
      },
    })
      .then((res) => {
        profile.value = res?.data?.data;
        // getAllNotifications();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    dataToVerfiy.value = null;
    // useCookie("elmo3lm_elmosa3d_user_token").value = null;
    // useCookie("elmo3lm_elmosa3d_user_avatar").value = null;
    // useCookie("elmo3lm_elmosa3d_user_type").value = null;
    type.value = null;
    token.value = null;
    profile.value = null;
    avatar.value = null;
    // window.location.reload();
    navigateTo("/");
  };

  return {
    dataToVerfiy,
    type,
    token,
    avatar,
    getAuthenticatedUserData,
    setAuthenticatedUserData,
    profile,
    getProfile,
    logout,
  };
});
