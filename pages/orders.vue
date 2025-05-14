<template>
  <div class="my-orders-page-wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.my_orders") }}</template>
      <template #breadcrumb_current_page>{{ $t("TITLES.my_orders") }}</template>
    </GlobalBreadCrumbs>

    <div class="page-content-wrapper">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
