<template>
  <div class="add-bank-account-form-wrapper">
    <BaseModal
      :show="modalApperanceData"
      @controleModalApperance="controleModalApperance"
    >
      <template #modal>
        <div class="w-full">
          <VeeForm
            v-slot="{ values }"
            @submit="addAccountFormSubmit"
            :validation-schema="schema"
            class="space-y-6"
          >
            <div class="page-small-title">
              <h3>{{ $t("TITLES.choose_bank") }}</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputsText
                name="ownerName"
                :placeholder="$t('PLACEHOLDERS.owner_name')"
                class="w-full"
              />

              <InputsText
                name="bankName"
                :placeholder="$t('PLACEHOLDERS.bank_name')"
                class="w-full"
              />

              <InputsText
                type="number"
                name="accountNumber"
                :placeholder="$t('PLACEHOLDERS.account_number')"
                class="w-full"
              />

              <InputsText
                name="iban"
                :placeholder="$t('PLACEHOLDERS.iban')"
                class="w-full"
              />
            </div>

            <div class="add-btn">
              <InputsButton
                :loading="isWaitingRequest"
                type="submit"
                :name="t('BUTTONS.add')"
                class="w-[250px]"
              />
            </div>
          </VeeForm>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
<script setup>
import * as yup from "yup";

import { useToast } from "vue-toastification";
import BaseModal from "../global/BaseModal.vue";

const axios = useNuxtApp().$axios;
const { t } = useI18n();

const toast = useToast();
const props = defineProps({
  modalApperanceData: Boolean,
});
const emit = defineEmits(["controleModalApperance"]);
const isWaitingRequest = ref(false);

const addAccount = ref({
  ownerName: "",
  bankName: "",
  accountNumber: "",
  iban: "",
});

const controleModalApperance = () => {
  emit("controleModalApperance");
};
const schema = yup.object({
  ownerName: yup.string().required(t("VALIDATION.owner_name")),
  bankName: yup.string().required(t("VALIDATION.bank_name")),
  accountNumber: yup
    .string()
    .required(t("VALIDATION.account_number"))
    .matches(/^[0-9]+$/, t("VALIDATION.account_number")),
  iban: yup.string().required(t("VALIDATION.iban")),
});

const addAccountFormSubmit = async (values) => {
  console.log(values);
  const theData = new FormData();
  theData.append("account_name", values.ownerName);
  theData.append("bank_name", values.bankName);
  theData.append("account_number", values.accountNumber);
  theData.append("iban_number", values.iban);

  try {
    await axios.post("user/bank_account", theData);
    location.reload();
  } catch (err) {
    toast.error(err.response?.data.message);
  } finally {
    isWaitingRequest.value = false;
  }
};
</script>
<style scoped>
.add-bank-account-form-wrapper {
  .page-small-title {
    @apply text-center mb-11;
    h3 {
      @apply text-[2rem] text-themeText font-medium;
    }
  }

  .add-btn {
    @apply text-center mt-6;
  }
}
</style>
