<template>
  <footer class="bg-mainTheme mt-6">
    <div class="container">
      <div class="footer_content py-6">
        <div class="flex flex-col md:flex-row justify-between gap-6">
          <div class="w-full lg:w-1/4 my-3">
            <div class="pt-7">
              <NuxtLink :to="localePath('/')">
                <img
                  src="../assets/media/logo/logo.svg"
                  alt="Al-Moalem Al-Mosaed App Logo"
                  width="160"
                  height="145"
                  class="brightness-0 invert"
                />
              </NuxtLink>
            </div>
          </div>

          <div class="w-full lg:w-5/12 my-3">
            <div class="links_wrapper flex gap-10">
              <div class="wrapper1 px-4">
                <h4 class="text-white text-[27px] font-arb font-semibold">
                  {{ t("TITLES.futurezoon") }}
                </h4>
                <ul class="footer_links_wrapper list-none">
                  <li class="footer_link">
                    <NuxtLink class="sub-links" :to="localePath('/')">
                      {{ t("FOOTER.home") }}
                    </NuxtLink>
                  </li>

                  <li class="footer_link">
                    <NuxtLink class="sub-links" :to="localePath('/about-us')">
                      {{ t("FOOTER.about_us") }}
                    </NuxtLink>
                  </li>

                  <li class="footer_link" v-if="type === 'student'">
                    <NuxtLink class="sub-links" :to="localePath('/store')">
                      {{ t("FOOTER.store") }}
                    </NuxtLink>
                  </li>

                  <li class="footer_link" v-if="type === 'student'">
                    <NuxtLink class="sub-links" :to="localePath('/courses')">
                      {{ t("FOOTER.subjects") }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <div class="wrapper1 px-4">
                <h4 class="text-white text-[27px] font-arb font-semibold">
                  {{ t("TITLES.help") }}
                </h4>
                <ul class="footer_links_wrapper list-none">
                  <li class="footer_link">
                    <NuxtLink class="sub-links" :to="localePath('/privacy')">
                      {{ t("FOOTER.privacy") }}
                    </NuxtLink>
                  </li>

                  <li class="footer_link">
                    <NuxtLink class="sub-links" :to="localePath('/terms')">
                      {{ t("FOOTER.terms") }}
                    </NuxtLink>
                  </li>
                  <li class="footer_link">
                    <a class="sub-links cursor-pointer" @click="goToContact">
                      {{ t("FOOTER.contact_us") }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/4 my-3">
            <div class="app_platforms flex flex-col gap-3">
              <div
                class="social_media_links_wrapper mt-7 flex items-center justify-around"
              >
                <NuxtLink
                  v-for="(link, index) in socialLinks"
                  :key="index"
                  :to="localePath(link?.href)"
                  target="_blank"
                  class="social-link"
                >
                  <component :is="link?.icon" />
                </NuxtLink>
              </div>

              <h4 class="my-5 text-white text-[27px] !font-arb font-semibold">
                {{ t("TITLES.find_out_app") }}
              </h4>

              <div class="download_platforms flex justify-between">
                <NuxtLink
                  :to="localePath(homeData?.contacts?.link_ios)"
                  target="_blank"
                >
                  <img
                    src="../assets/media/stores_logos/apple-store.svg"
                    alt="Play Store"
                    width="125"
                    height="90"
                  />
                </NuxtLink>

                <NuxtLink
                  :to="localePath(homeData?.contacts?.link_android)"
                  target="_blank"
                >
                  <img
                    src="../assets/media/stores_logos/google-play.svg"
                    alt="Google Play"
                    width="125"
                    height="90"
                  />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="copy_rights_wrapper !border-t border-[#54c180] py-3 text-center"
    >
      <p class="text-[26px] text-white font-arb">
        {{ t("FOOTER.allRightsReserved") }}
        {{ t("TITLES.futurezoon") }} &copy;{{ currentYear }}
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from "vue-router";
import snapchat from "~/components/Icons/snapchat.vue";
import facebook from "~/components/Icons/facebook.vue";
import instagram from "~/components/Icons/instagram.vue";
import twitter from "~/components/Icons/twitter.vue";
import youtube from "~/components/Icons/youtube.vue";
import { useAuthenticationStore } from "@/stores/authentication";
const { t } = useI18n();
const localePath = useLocalePath();

const authStore = useAuthenticationStore();
const router = useRouter();
const { type } = storeToRefs(authStore);
const userType = ref(type).value;
const axios = useNuxtApp().$axios;

const currentYear = ref(new Date().getFullYear());
const endpoint = computed(() => {
  if (userType === "teacher") return "teacher/home";
  if (userType === "student") return "student/home";
  if (userType === "parent") return "parent/home";
  return "visitor/home";
});

const { data: homeData, status } = await useLazyAsyncData("home", () =>
  axios
    .get(`${endpoint.value}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => err.response)
);

const socialLinks = computed(() => [
  {
    href: homeData.value?.contacts?.social?.instagram || "",
    icon: instagram,
  },
  {
    href: homeData?.value?.contacts?.social?.twitter || "",
    icon: twitter,
  },
  {
    href: homeData?.value?.contacts?.social?.facebook || "",
    icon: facebook,
  },
  {
    href: homeData?.value?.contacts?.social?.snapchat || "",
    icon: snapchat,
  },
  {
    href: homeData?.value?.contacts?.social?.youtube || "",
    icon: youtube,
  },
]);

const goToContact = () => {
  router.push({ path: "/", hash: "#contact" });
};
</script>

<style>
.wrapper1 {
  .footer_links_wrapper {
    .footer_link {
      &:not(:last-of-type) {
        @apply mb-2;
      }
      .sub-links {
        @apply text-white font-arb text-xl opacity-80;
      }
    }
  }
}

.social-link {
  @apply inline-flex size-11 border-2 border-white 
           rounded-full items-center justify-center 
           transition-all duration-[600ms] ease-in-out;

  background-image: linear-gradient(45deg, transparent 50%, white 50%);
  background-position: 100%;
  background-size: 400%;

  svg {
    @apply text-2xl text-mainTheme transition-all duration-[600ms] ease-in-out;
  }

  &:hover {
    @apply bg-[0px];
    svg {
      @apply text-white;
    }
  }
}
</style>
