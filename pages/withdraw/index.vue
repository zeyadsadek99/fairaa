<template>
  <div class="withdraw_wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.withdraw") }}</template>
      <template #breadcrumb_current_page>{{ $t("TITLES.withdraw") }}</template>
    </GlobalBreadCrumbs>
    <Loader1 v-if="status === 'pending'" />
    <template v-else-if="status === 'success'">
      <div class="withdraw_card_wrapper fadeIn">
        <div class="container">
          <VeeForm
            @submit="selectBankValidate"
            :validation-schema="schema"
            class="space-y-6"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <div class="relative">
              <div class="w-1/2 mx-auto">
                <InputsText
                  type="number"
                  id="value-rent"
                  name="value-rent"
                  :placeholder="t('PLACEHOLDERS.amount_value')"
                />
              </div>
            </div>
            <div class="page_small_title">
              <h3>{{ $t("TITLES.choose_bank") }}</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              <div v-for="item in myAccounts" :key="item.id">
                <div class="form-check">
                  <label class="form-check-label">
                    <div class="text-check">
                      <input
                        type="radio"
                        name="bank"
                        :value="item.id"
                        v-model="withDrow.bank"
                        class="hidden"
                      />
                      <span
                        class="size-5 rounded-full flex items-center justify-center me-4 transition-all"
                        :class="
                          withDrow.bank === item.id
                            ? 'border-mainTheme bg-mainTheme'
                            : 'bg-white !border-[#BCBCBE] border-1'
                        "
                      ></span>
                      {{ $t("PLACEHOLDERS.iban") }}
                    </div>
                    <div class="flex-check">
                      <span>{{ item.iban_number }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="withdraw_btns">
              <InputsButton
                :loading="loading"
                type="submit"
                :name="t('BUTTONS.confirm')"
                class="w-[250px]"
              />
              <InputsButton2
                type="button"
                @click="toggleAddBankAccountModal"
                :name="t('BUTTONS.add_account')"
                class="btn2 btn1"
              />
            </div>
          </VeeForm>
        </div>
      </div>
    </template>

    <ModalsAddBankAccount
      :modalApperanceData="addBankAccountModalIsOpen"
      @controleModalApperance="toggleAddBankAccountModal"
    />

    <ModalsSuccessModal
      :modalApperanceData="confirmBankAccountModalIsOpen"
      @controleModalApperance="toggleConfirmBankAccountModal"
    >
      <template #title>{{ $t("TITLES.done_withdraw") }}</template>
      <template #sub_title>{{ $t("TITLES.review_bank") }}</template>
      <template #success_btn>
        <NuxtLink :to="localePath('/')"  class="btn mt-8">{{ $t("TITLES.home") }}</NuxtLink>
      </template>
    </ModalsSuccessModal>
  </div>
</template>
<script setup>
import * as yup from "yup";
import { useToast } from "vue-toastification";
const isWaitingRequest = ref(false);
const localePath = useLocalePath();

const axios = useNuxtApp().$axios;
const { t } = useI18n();
const myAccounts = ref([]);
const toast = useToast();
const withDrow = ref({ bank: null });

const addBankAccountModalIsOpen = ref(false);
const confirmBankAccountModalIsOpen = ref(false);

const { data, status, refresh } = await useLazyAsyncData("bankAccounts", () =>
  axios
    .get("user/bank_account")
    .then((res) => {
      myAccounts.value = res?.data?.data;
    })
    .catch((error) => console.error("Error fetching bank accounts:", error))
);

const toggleAddBankAccountModal = () => {
  addBankAccountModalIsOpen.value = !addBankAccountModalIsOpen.value;
};

const toggleConfirmBankAccountModal = () => {
  confirmBankAccountModalIsOpen.value = !confirmBankAccountModalIsOpen.value;
};

const selectBankValidate = (values) => {
  console.log(values);
  console.log(withDrow.value);
  isWaitingRequest.value = true;
  if (!withDrow.value.bank) {
    isWaitingRequest.value = false;

    toast.error($t("VALIDATION.select_account"));
    return;
  }
  selectBankForm(values);
};

// Submit bank form
const selectBankForm = async (values) => {
  try {
    isWaitingRequest.value = true;
    const theData = new FormData();
    theData.append("value", values.valueRent);
    theData.append("bank_account_id", withDrow.value.bank);

    await axios.post("user/wallet/withdrawals", theData);
    isWaitingRequest.value = false;
    toggleConfirmBankAccountModal();
  } catch (error) {
    toast.error(error.response.data.message);
    isWaitingRequest.value = false;
  }
};
</script>
<style scoped>
.withdraw_wrapper {
  @apply w-full;
  .withdraw_card_wrapper {
    @apply py-9;
    .page_small_title {
      @apply text-center;
      h3 {
        @apply text-themeText text-[2rem] font-medium;
      }
    }
    .form-check {
      @apply flex items-center justify-between border-[1px] border-secondaryTheme p-3 text-themeText rounded-2xl text-2xl cursor-pointer;
      input[type="radio"] {
        @apply hidden;
      }
      .form-check-label {
        @apply flex items-center justify-between border-[1px] border-secondaryTheme p-3 text-themeText rounded-2xl text-2xl cursor-pointer;
        .text-check {
          @apply flex items-center justify-between text-[#BCBCBE];
        }
        .flex-check {
          @apply font-medium;
        }
      }
    }
    .withdraw_btns {
      @apply text-center flex gap-5 justify-center !mt-10;
      .btn1 {
        @apply w-[250px];

        border: 1px dashed var(--main_theme_clr) !important;
      }
    }
  }
}
</style>
