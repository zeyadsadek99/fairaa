<script setup>
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const axios = useNuxtApp().$axios;
const { t } = useI18n();
const route = useRoute();

const isWaitingRequest = ref(false);
const rateData = reactive({
  stars: 0,
  comment: "",
});

// ✅ Validate & Submit Rating
const validateRateCourse = () => {
  if (!rateData.stars) {
    alert(t("VALIDATION.starts"));
    return;
  }
  if (!rateData.comment) {
    alert(t("VALIDATION.commentRate"));
    return;
  }
  rateCourse();
};

// ✅ Submit Rating
const rateCourse = async () => {
  try {
    // return;
    isWaitingRequest.value = true;
    const theData = new FormData();
    theData.append("sub_id", route.params.id);
    theData.append("rate", rateData.stars);
    theData.append("content", rateData.comment);

    await axios.post("user/rate", theData);
    isWaitingRequest.value = false;
    location.reload();
  } catch (err) {
    isWaitingRequest.value = false;
    alert(err.response?.data?.message || "Something went wrong!");
  }
};
</script>

<template>
  <VeeForm
    @submit="rateCourse"
    v-slot="{ values, errors }"
    class="set-rating-form"
  >
    <h3 class="title">{{ $t("TITLES.add_rate") }}</h3>

    <div class="star-wrapper">
      <GlobalRatings v-model="rateData.stars" />
    </div>

    <!-- ✅ COMMENT INPUT -->
    <div class="col-span-2 my-3">
      <div class="input-wrapper">
        <InputsBase
          id="comment"
          name="comment"
          type="textarea"
          v-model.trim="rateData.comment"
          :placeholder="$t('PLACEHOLDERS.write_here')"
          :rows="3"
        />
      </div>
    </div>

    <!-- ✅ SUBMIT BUTTON -->
    <div class="flex justify-center items-center mx-auto">
      <InputsButton
        :loading="isWaitingRequest"
        type="button"
        @click="validateRateCourse"
        :name="t('BUTTONS.send')"
        class="w-full lg:w-[250px]"
      >
      </InputsButton>
    </div>
  </VeeForm>
</template>

<style scoped>
.set-rating-form {
  @apply my-5 p-2.5 border-2 !border-secondaryTheme rounded-2xl;
  .title {
    @apply text-themeText text-3xl !leading-8 font-bold  mb-2;
  }

  .star-wrapper {
    @apply flex items-center justify-center mb-5;
  }
}

</style>
