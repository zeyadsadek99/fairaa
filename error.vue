<template>
  <div class="flex min-h-[100vh] flex-col">
    <div class="container py-20">
      <not-found v-if="error?.statusCode == 404" />
      <back-error v-if="error?.statusCode == 500" />
    </div>
  </div>
</template>
<script setup>
const { t } = useI18n();

const error = useError();

useHead({
  titleTemplate: `%s - ${t("NAVBAR.ERROR")}`,
});
</script>
