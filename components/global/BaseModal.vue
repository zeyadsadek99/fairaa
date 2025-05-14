<template>
  <transition name="fadeInUp" mode="out-in">
    <div v-if="show" class="model-container " >
      <div class="modal-overlay" @click="closeModal"></div>

      <div class="main-body" @click.stop>
        <slot name="modal"></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["controleModalApperance"]);

const closeModal = () => {
  emit("controleModalApperance");
};

</script>

<style scoped>
.model-container {
  @apply fixed left-0 top-0  z-50 w-full h-full flex items-center justify-center;
}
.main-body::-webkit-scrollbar {
  @apply w-1;
}

.main-body::-webkit-scrollbar-track {
  @apply bg-secondaryTheme rounded-xl;
}

.main-body::-webkit-scrollbar-thumb {
  @apply bg-mainTheme border-2 border-secondary rounded-xl;
}
.modal-overlay {
  @apply absolute inset-0 backdrop-blur-sm bg-[rgba(225,225,225,0.25)] bg-opacity-50;
}

.main-body {
  @apply relative w-[40%] max-h-[85vh] bg-themeBg px-[18px] py-5 rounded-2xl flex justify-center  overflow-y-auto;
}

@media (max-width: 767px) {
  .main-body {
    @apply w-[90%];
  }
}

.fadeInUp-enter-active,
.fadeInUp-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fadeInUp-enter-from,
.fadeInUp-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
