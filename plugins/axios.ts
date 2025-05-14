import axios from "axios";
import { useAuthenticationStore } from "~/stores/authentication";
export default defineNuxtPlugin(async ({ $i18n, $config }) => {
  const i18n: any = $i18n;
  const authStore = useAuthenticationStore();
  const sessionToken = computed(() => authStore.token);
  const router = useRouter();
  const localePath = useLocalePath();
  let api = axios.create({
    baseURL: $config.public.baseURL,
    headers: {
      common: {
        "Accept-Language": i18n.locale.value,
      },
    },
  });
  api.interceptors.request.use(
    function (config) {
      if (sessionToken.value)
        config.headers.Authorization = `Bearer ${sessionToken.value}`;
      if (!sessionToken.value) {
        config.params = {
          ...config.params,
        };
      }
      return config;
    },
    function (error) {
      if (error.response.status == "401") {
        // config.headers.Authorization = null;
        authStore.token = null;
        useCookie("elmo3lm_elmosa3d_user_token").value = null;
        router.push(localePath("/login"));
      }
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status == "401") {
        authStore.profile = null;
        authStore.token = null;
        useCookie("elmo3lm_elmosa3d_user_token").value = null;
        router.push(localePath("/login"));
      }
      return Promise.reject(error);
    }
  );
  return {
    provide: {
      axios: api,
      axiosToken: axios,
    },
  };
});
