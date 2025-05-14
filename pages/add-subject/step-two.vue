<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <AddSubjectWrapper>
    <AddSubjectFormStep2 />
  </AddSubjectWrapper>
</template>
