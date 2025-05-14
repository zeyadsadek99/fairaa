<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <AddSubjectWrapper>
    <AddSubjectFormStepThree />
  </AddSubjectWrapper>
</template>
