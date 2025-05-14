<template>
  <div class="search_content_wrapper">
    <div class="search_overlay" @click="closeSearch"></div>

    <div class="container">
      <VeeForm
        v-slot="{ values }"
        @submit="validateSearchForm"
        :initial-values="searchData"
        class="space-y-6"
      >
        <div class="flex flex-row items-center justify-center gap-6 fadeIn">
          <div class="my-3 w-2/3 md:w-5/6">
            <InputsText
              :placeholder="t('PLACEHOLDERS.write_here')"
              v-model="searchData.text"
              id="text"
              name="text"
            />
          </div>

          <div class="w-1/3 my-3 md:w-1/6">
            <InputsDropDown
              v-model="searchData.type"
              name="type"
              :options="searchTypes"
              :placeholder="t('PLACEHOLDERS.search_type')"
              class=""
            />
          </div>
        </div>
      </VeeForm>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const emit = defineEmits(["closeSearch"]);

const searchTypes = ref([
  { name: t("PLACEHOLDERS.teacher"), id: "teacher" },
  { name: t("PLACEHOLDERS.subject"), id: "subject_name" },
]);

const searchData = ref({
  text: "",
  type: null,
});

const closeSearch = () => {
  emit("closeSearch");
};

const validateSearchForm = (values) => {
  if (!searchData.value.text) {
    toast.error(t("VALIDATION.textSearch"));
    return;
  }
  if (!searchData.value.type) {
    toast.error(t("VALIDATION.typeSearch"));
    return;
  }
  submitSearchForm();
};

const submitSearchForm = () => {
  const searchType = searchData.value.type.id;
  const searchText = searchData.value.text;

  router.push(`/search-result?type=${searchType}&name=${searchText}`);

  closeSearch();
};
</script>

<style scoped>
.search_content_wrapper {
  @apply relative;
  .search_overlay {
    @apply fixed inset-0;
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 21;
  }
  form {
    @apply w-[90%]  left-1/2 absolute top-0  -translate-x-1/2	 z-[22];
  }
}
</style>
