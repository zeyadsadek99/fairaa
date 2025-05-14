<template>
  <BaseModal
    :show="modalApperanceData"
    @controleModalApperance="controleModalApperance"
  >
    <template #modal>
      <div class="terms-modal-wrapper">
        <!-- ✅ Modal Title -->
        <h2 class="terms-modal-title">{{ $t("TITLES.terms") }}</h2>

        <!-- ✅ Terms Content -->
        <div class="container">
          <div class="modal-content" v-html="termsAndConditions"></div>
        </div>

        <!-- ✅ OK Button -->
        <InputsButton
          type="button"
          :name="$t('BUTTONS.ok')"
          class="w-[150px] mt-5"
          @click="controleModalApperance"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
const props = defineProps(["modalApperanceData"]);
const emit = defineEmits(["controleModalApperance"]);
const axios = useNuxtApp().$axios;
const termsAndConditions = ref(null);

const controleModalApperance = () => {
  emit("controleModalApperance");
};
const { data, status, refresh } = await useLazyAsyncData("terms", () =>
  axios
    .get("terms")
    .then((res) => {
      termsAndConditions.value = res.data.data.terms;
    })
    .catch((error) => console.error("Error fetching terms:", error))
);
</script>

<style scoped>
.terms-modal-wrapper {
  @apply text-center text-mainTheme font-medium;
  .terms-modal-title {
    @apply text-mainTheme font-medium text-[2rem];
  }
  .modal-content {
    @apply break-words tracking-wide text-[22px] text-lightGray leading-[1.6] ;
    h2 {
      @apply font-medium  text-[2rem];
    }
    p {
      @apply font-medium;
    }
  }
}
</style>
