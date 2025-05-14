import { createVuetify } from "vuetify";
// import * as components from "vuetify/components";
// import * as directives from "vuetify/directives";
import { VTabs, VTab, VWindow, VWindowItem } from 'vuetify/components'; // Import only the necessary components
import "vuetify/styles";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    // components,
    // directives,
    components: {
      VTabs,
      VTab,
      VWindow,
      VWindowItem, 
    },
    directives: {}, 
  });

  nuxtApp.vueApp.use(vuetify);
});
