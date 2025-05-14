import VueGoogleMaps from "@fawmi/vue-google-maps";
import IsEqual from "fast-deep-equal";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyDRymdCLWxCwLHFnwv36iieKAMjiwk8sdc",
      libraries: ["places"],
    },
    autobindAllEvents: true,
  });
});
