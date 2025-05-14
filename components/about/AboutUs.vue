<template>
  <div class="about_us_section_wrapper py-5" v-if="aboutUsData">
    <div class="container">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3"
        :class="hideMoreButton ? 'items-start' : 'items-center'"
      >
        <div class="xl:col-span-2">
          <GlobalHeader v-if="title" :title="$t('TITLES.about_us')" />

          <div class="section_subtitle_wrapper">
            <h3 class="subtitle">
              {{ t("TITLES.futurezoon") }}
            </h3>
          </div>

          <div
            class="section_text"
            :class="{ 'max-h-36 ': !hideMoreButton }"
            v-html="aboutUsData"
          ></div>

          <div class="section_route mt-5" v-if="!hideMoreButton">
            <NuxtLink class="btn !w-32" :to="localePath('/about-us')">
              {{ t("BUTTONS.more") }}
            </NuxtLink>
          </div>
        </div>

        <div class="xl:col-span-1">
          <img
            src="~/assets/media/images/about_us.png"
            alt="about_us"
            width="420"
            height="420"
            class="object-contain ms-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const localePath = useLocalePath();
const { t } = useI18n();

defineProps({
  aboutUsData: null,
  hideMoreButton: Boolean,
  title: {
    type: Boolean,
    default: false,
  },
});
</script>
<style>
.about_us_section_wrapper {
  @apply  bg-veryLightTheme;
  .section_subtitle_wrapper {
    .subtitle {
      @apply my-[20px] text-3xl font-bold text-themeText;
    }
  }
  .section_text {
    @apply break-words overflow-hidden text-[22px] text-black leading-[1.4];
    p {
      @apply mb-[16px];
    }
  }
}
</style>
