<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <AddSubjectWrapper>
    <AddSubjectForm />
  </AddSubjectWrapper>
</template>
