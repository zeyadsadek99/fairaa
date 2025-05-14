<script lang="ts" setup>
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n();
</script>

<template>
  <Html :lang="locale">
    <Head>
      <Title>{{ t("NAVBAR.companyName") }}</Title>
      <Meta name="description" content="Home page" />
      <Meta name="og:description" content="Home page" />
      <Meta name="title" content="Home" />
      <Meta name="og:title" content="Home" />
      <!-- <Meta name="image" content="/media/icons/logo.svg" /> -->
      <!-- <Meta name="og:image" content="/media/icons/logo.svg" /> -->
      <!-- <Link rel="icon" type="image/x-icon" href="/media/icons/logo.svg" /> -->
    </Head>

    <!-- <Head v-if="settings && status === 'success'">
      <Link
        v-if="settings.fav_icon"
        rel="icon"
        type="image/x-icon"
        :href="settings.fav_icon"
      />
      
      <template v-if="locale == 'ar'">
        <Title v-if="settings.website_title_ar">{{
          settings.website_title_ar
        }}</Title>
        <Meta
          v-if="settings.keywords_ar"
          name="keywords"
          :content="settings.keywords_ar"
        />
        <Meta
          v-if="settings.meta_desc_ar"
          name="description"
          :content="settings.meta_desc_ar"
        />
        <Meta
          v-if="settings.meta_desc_ar"
          name="og:description"
          :content="settings.meta_desc_ar"
        />

        <Meta
          v-if="settings.meta_title_ar"
          name="title"
          :content="settings.meta_title_ar"
        />
        <Meta
          v-if="settings.meta_title_ar"
          name="og:title"
          :content="settings.meta_title_ar"
        />
      </template>
      <template v-else>
        <Title v-if="settings.website_title_en">{{
          settings.website_title_en
        }}</Title>
        <Meta
          v-if="settings.keywords_en"
          name="keywords"
          :content="settings.keywords_en"
        />
        <Meta
          v-if="settings.meta_desc_en"
          name="description"
          :content="settings.meta_desc_en"
        />
        <Meta
          v-if="settings.meta_desc_en"
          name="og:description"
          :content="settings.meta_desc_en"
        />
        <Meta
          v-if="settings.meta_title_en"
          name="title"
          :content="settings.meta_title_en"
        />
        <Meta
          v-if="settings.meta_title_en"
          name="og:title"
          :content="settings.meta_title_en"
        />
      </template>
      <Meta name="image" content="~/assets/icons/logo.svg" />
      <Meta name="og:image" content="~/assets/icons/logo.svg" />
    </Head> -->
    <Body :dir="locale == 'ar' ? 'rtl' : 'ltr'">
      <div class="min-h-[100vh] block relative">
        <Header />
        <div class="app_wrapper min-h-[100vh] block" id="app_wrapper">
          <slot />
        </div>

        <Footer />
      </div>
    </Body>
  </Html>
</template>

<style lang="scss" scoped></style>
