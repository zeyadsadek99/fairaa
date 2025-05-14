<template>
  <div
    class="contact_us_section_wrapper  bg-veryLightTheme"
    id="contact"
    v-if="contactUsData"
  >
    <div class="container">
      <div class="section_title_wrapper pt-12 mb-5">
        <h2 class="title flex items-center justify-center gap-3">
          <img
            src="../../assets/media/shapes/title_icon.svg"
            alt="Title Icon"
            class="w-16"
          />

          <span class="text-[2.3rem] font-bold text-themeText">
            {{ t("TITLES.contact_us") }}
          </span>
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-5">
        <div
          v-if="true"
          class="lg:col-span-5 order-2 lg:order-1 my-3 space-y-5"
        >
          <h3 class="form_title text-[1.75rem] text-themeText font-semibold">
            {{ t("TITLES.send_us") }}
          </h3>
          <VeeForm
            class="space-y-5 flex flex-col"
            @submit="onSubmit"
            :validation-schema="schema"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputsText
                id="full_name"
                name="full_name"
                :placeholder="t('PLACEHOLDERS.name')"
                class="w-full"
              />
              <InputsText
                id="title"
                name="title"
                :placeholder="t('PLACEHOLDERS.suggestion_title')"
                class="w-full"
              />
            </div>
            <InputsText
              type="number"
              id="phone"
              name="phone"
              :placeholder="t('PLACEHOLDERS.phone_number')"
              class="w-full"
            />

            <InputsBase
              rows="3"
              type="textarea"
              id="subject"
              name="subject"
              :placeholder="t('PLACEHOLDERS.complaint_details')"
            />

            <div class="mx-auto">
              <InputsButton
                :loading="isWaitingRequest"
                type="submit"
                :name="t('BUTTONS.send')"
                class="w-[150px]"
              >
              </InputsButton>
            </div>
          </VeeForm>
        </div>

        <div class="lg:col-span-7 order-1 order-lg-2">
          <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div class="col-span-6 my-3 order-2 order-lg-1">
              <h3
                class="contact_info_title text-3xl text-themeText font-semibold mb-3"
              >
                {{ t("TITLES.contact_info") }}
              </h3>
              <div class="info_wrapper flex flex-col justify-center gap-4">
                <p
                  v-for="(item, index) in contactDetails"
                  :key="index"
                  class="flex items-center gap-6 my-3"
                >
                  <component
                    class="text-[22px] text-mainTheme"
                    :is="item?.icon"
                  />

                  <a
                    v-if="item.link"
                    :href="item.link"
                    dir="ltr"
                    class="text-[22px] text-themeText hover:underline"
                  >
                    {{ item.value }}
                  </a>

                  <span v-else class="text-[22px] text-themeText" dir="ltr">{{
                    item.value
                  }}</span>
                </p>
              </div>
              <div
                class="social_media_links_wrapper justify-between md:justify-start mt-8 flex items-center gap-4"
              >
                <template v-for="(link, key) in socialMediaLinks" :key="key">
                  <NuxtLink
                    target="_blank"
                    :to="localePath(link.url)"
                    class="social-btn"
                  >
                    <component :is="link?.icon" />
                  </NuxtLink>
                </template>
              </div>
            </div>

            <div class="col-span-6 my-3 order-1 order-lg-2">
              <div class="map_wrapper rounded-2xl overflow-hidden">
                <GMapMap
                  :center="{
                    lat: parseFloat(contactUsData?.location?.lat),
                    lng: parseFloat(contactUsData?.location?.lng),
                  }"
                  :zoom="12"
                  map-type-id="terrain"
                  style="width: 100%; height: 400px"
                >
                  <GMapMarker
                    :position="{
                      lat: parseFloat(contactUsData?.location?.lat),
                      lng: parseFloat(contactUsData?.location?.lng),
                    }"
                  />
                </GMapMap>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import IconsPhone from "~/components/Icons/phone.vue";
import IconsMessage from "~/components/Icons/message.vue";
import IconsFax from "~/components/Icons/fax.vue";
import IconsMapPin from "~/components/Icons/mapPin.vue";
import whatsapp from "~/components/Icons/whatsapp.vue";
import facebook from "~/components/Icons/facebook.vue";
import instagram from "~/components/Icons/instagram.vue";
import twitter from "~/components/Icons/twitter.vue";
import youtube from "~/components/Icons/youtube.vue";

const localePath = useLocalePath();
const axios = useNuxtApp().$axios;
const { t } = useI18n();
const toast = useToast();

const props = defineProps({
  contactUsData: {
    type: Object,
    required: true,
  },
});

const isWaitingRequest = ref(false);

const schema = yup.object({
  full_name: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.name") })),
  title: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.name") })),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, t("ERRORS.invalidPhone"))
    .required(t("VALIDATION.phone_number")),
  subject: yup.string().required(t("VALIDATION.complaint_details")),
});
const onSubmit = async (values, actions) => {
  isWaitingRequest.value = true;
  const frmdata = new FormData();
  frmdata.append("fullname", values.full_name);
  frmdata.append("content", values.subject);
  frmdata.append("title", values.title);
  frmdata.append("phone", values.phone);
  try {
    const res = await axios.post("contact", frmdata);
    isWaitingRequest.value = false;
    toast.success(res.data.message);

    actions.resetForm();
  } catch (err) {
    toast.error("error");
  }
};

const contactDetails = computed(() => {
  if (!props?.contactUsData) return [];

  return [
    {
      icon: IconsPhone,
      value: props?.contactUsData?.phone,
      link: `tel:${props?.contactUsData?.phone}`,
    },
    {
      icon: IconsMessage,
      value: props?.contactUsData?.email,
      link: `mailto:${props?.contactUsData?.email}`,
    },
    { icon: IconsFax, value: props?.contactUsData?.lan_number },
    {
      icon: IconsMapPin,
      value: props?.contactUsData?.location?.desc,
    },
  ];
});
const socialMediaLinks = computed(() => {
  if (!props?.contactUsData || !props?.contactUsData?.social) return [];

  return [
    {
      icon: whatsapp,
      url: `https://wa.me/${props?.contactUsData?.whatsapp}`,
    },
    {
      icon: youtube,
      url: props?.contactUsData?.social?.youtube,
    },
    {
      icon: instagram,
      url: props?.contactUsData?.social?.instagram,
    },
    {
      icon: twitter,
      url: props?.contactUsData?.social?.twitter,
    },
    {
      icon: facebook,
      url: props?.contactUsData?.social?.facebook,
    },
  ].filter((link) => link.url);
});
</script>

<style>
.social-btn {
  @apply inline-flex size-10 items-center justify-center rounded-full
          
         transition-all duration-[600ms] ease-in-out;
  background-image: linear-gradient(
    45deg,
    transparent 50%,
    var(--main_theme_clr) 50%
  );
  background-position: 100%;
  background-size: 400%;
  svg {
    @apply text-[23px] text-white transition-all duration-[600ms] ease-in-out;
  }
  &:hover {
    @apply bg-[0px];
    svg {
      @apply text-mainTheme;
    }
  }
}
</style>
