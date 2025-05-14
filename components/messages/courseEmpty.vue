<template>
  <div class="empty-message">
    <div v-if="imageSrc" class="image-wrapper">
      <img :src="imageSrc" :alt="imageAlt" />
    </div>

    <div v-if="message" class="text-wrapper">
      <h2 class="message-title">{{ message }}</h2>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    default: "Empty Message Image",
  },
  message: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.empty-message {
  @apply flex flex-col items-center justify-center h-[70vh] gap-4;
  .image-wrapper img {
    @apply object-contain w-[250px] h-[130px];
  }
  .message-title {
    @apply text-mainTheme font-medium text-[2rem] text-center;
  }
}
</style>
