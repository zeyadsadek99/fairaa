<template>
  <div v-if="modalApperanceData" class="success-wrapper">
    <BaseModal
      :show="modalApperanceData"
      @controleModalApperance="controleModalApperance"
    >
      <template #modal>
        <div class="success-card">
          <div class="icon">
            <IconsCheck />
          </div>

          <h2 class="title">
            <slot name="title"></slot>
          </h2>

          <p class="subtitle">
            <slot name="sub_title"></slot>
          </p>

          <div class="success-btn">
            <slot name="success_btn"></slot>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
// import BaseModal from "../global/BaseModal.vue";

const props = defineProps({
  modalApperanceData: Boolean,
});

const emit = defineEmits(["controleModalApperance"]);

const controleModalApperance = () => {
  emit("controleModalApperance");
};
</script>

<style scoped>
.success-wrapper {
  @apply fixed inset-0 flex items-center justify-center bg-black/50 z-50;
  .success-card {
    @apply text-center;
    .icon {
      @apply size-[120px] mx-auto flex items-center justify-center  rounded-full !text-white bg-mainTheme;
      i,
      svg {
        @apply !text-white !text-[4rem];
      }
    }
    .title {
      @apply text-[2.8rem] font-bold text-themeText mb-2;
    }

    .subtitle {
      @apply text-[1.8rem] text-lightGray;
    }
  }
}
</style>
