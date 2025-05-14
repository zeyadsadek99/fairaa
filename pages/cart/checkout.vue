<template>
  <div>
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.cart") }}</template>
      <template #breadcrumb_current_page>{{ $t("TITLES.cart") }}</template>
    </GlobalBreadCrumbs>

    <Loader1 v-if="isLoading" />

    <div v-else class="fadeIn py-9 container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="delivery_info_form_wrapper my-3 max-lg:order-2 lg:order-1">
          <h3 class="text-themeText text-3xl font-medium mb-10">
            {{ $t("TITLES.delivery_info") }}
          </h3>

          <VeeForm
            v-slot="{ values }"
            @submit="validateFormInputs"
            :validation-schema="schema"
            class="space-y-6"
          >
            <div class="flex items-center justify-center gap-5">
              <label class="check-wrapper cursor-pointer">
                <input
                  type="radio"
                  value="visa"
                  v-model="courseRegisterData.cardType"
                  class="hidden peer"
                />
                <div
                  class="peer-checked:bg-mainTheme px-8 py-4 bg-themeInputs rounded-2xl"
                >
                  <img
                    src="/assets/media/payment/visa.svg"
                    alt="Visa"
                    class="w-24 h-16 object-contain"
                  />
                </div>
              </label>

              <label class="check-wrapper cursor-pointer">
                <input
                  type="radio"
                  value="vodafone_cash"
                  v-model="courseRegisterData.cardType"
                  class="hidden peer"
                />
                <div
                  class="peer-checked:bg-mainTheme px-8 py-4 bg-themeInputs rounded-2xl"
                >
                  <img
                    src="/assets/media/payment/instapay.png"
                    alt="Wallet"
                    class="w-24 h-16 object-contain"
                  />
                </div>
              </label>
            </div>
            <div class="instapay">
              <h4 class="text-2xl mb-1">
                يمكنك الارسال عبر انستا باي عبر رقم الحساب التالي :
              </h4>
              <div class="insta_media flex items-center justify-between">
                <div class="insta_logo flex items-center">
                  <div class="image me-[10px]">
                    <img
                      src="/assets/media/payment/instapay.png"
                      alt="alt"
                      class="size-[65px]"
                    />
                  </div>
                  <div class="desc">
                    <h4 class="text-xl font-semibold mb-1">رقم الحساب</h4>
                    <span ref="accountNumber" class="text-xl">{{
                      wallets.insta_pay
                    }}</span>
                  </div>
                </div>
                <button
                  type="button"
                  @click="copyToClipboard"
                  class="!text-mainTheme !text-2xl hover:scale-110 transition"
                  title="نسخ الرقم"
                >
                  <IconsCopy />
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-3">
              <InputsDropDown
                v-model="deliveryInfo.city"
                name="city"
                class="w-full"
                :options="cities"
                :searchable="true"
                :placeholder="$t('PLACEHOLDERS.city')"
              />
              <InputsText
                v-model.trim="deliveryInfo.district"
                id="district"
                name="district"
                :placeholder="$t('PLACEHOLDERS.district')"
                class="w-full"
              />
              <InputsText
                v-model.trim="deliveryInfo.street"
                id="street"
                name="street"
                :placeholder="$t('PLACEHOLDERS.street')"
                class="w-full"
              />
              <InputsText
                v-model.trim="deliveryInfo.another_phone"
                id="another_phone"
                name="another_phone"
                type="number"
                :placeholder="$t('PLACEHOLDERS.another_phone')"
                class="w-full"
              />
              <div class="md:col-span-2">
                <InputsBase
                  id="additional_info"
                  name="additional_info"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.additional_info')"
                  :rows="3"
                />
              </div>
            </div>
            <div
              v-if="courseRegisterData.cardType == 'vodafone_cash'"
              class="w-fit relative mx-auto"
            >
              <InputsBaseFile
                v-model:itemValue="courseRegisterData.image.path"
                accept="image/png, image/webp, image/jpeg"
                :no_preview="true"
                modalType="image"
                :returnFile="true"
                modalName="users"
                id="image"
                name="image"
              />
            </div>
            <InputsText
              v-if="courseRegisterData.cardType == 'vodafone_cash'"
              v-model="courseRegisterData.bankAccount"
              type="number"
              id="bankAccount"
              name="bankAccount"
              :placeholder="t('PLACEHOLDERS.account_number')"
              class="w-full"
            />

            <InputsButton
              :loading="isLoading"
              type="submit"
              class="w-full"
              :name="t('BUTTONS.confirm_payment')"
            >
            </InputsButton>
          </VeeForm>
        </div>

        <div class="py-3 my-3 max-lg:order-1 lg:order-2">
          <div class="container">
            <div class="">
              <div
                v-for="item in cartItems?.data"
                :key="item.id"
                class="p-3 border border-secondaryTheme rounded-[10px] flex justify-between items-center"
              >
                <div class="flex gap-4 items-center">
                  <div class="w-[130px] h-[120px]">
                    <img
                      :src="item?.product?.product_image"
                      :alt="item?.product?.name"
                      class="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                  <div class="w-full block relative">
                    <div class="flex gap-7 items-center text-[1.6rem]">
                      <span class="font-medium text-themeText">
                        {{ item.product.name }}
                      </span>
                      <span class="text-mainTheme font-medium"
                        >{{ item.count }} X</span
                      >
                    </div>
                    <p class="text-mainTheme font-medium text-[1.75rem]">
                      {{ item.total }} {{ item.product.currency }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between items-center mt-8">
              <span
                class="relative text-themeText font-medium text-2xl after:absolute after:w-48 after:border-b after:border-dashed after:border-secondaryTheme after:bottom-1 after:right-full after:mr-4"
              >
                {{ $t("TITLES.total") }}
              </span>
              <span class="text-themeText font-bold text-4xl">
                {{ cartItems?.price?.total_with_vat }} {{ t("TITLES.egp") }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";

import { useStoreWishlist } from "@/stores/storeModule";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const iframeId = ref(null);
const token = ref(null);
const modalApperanceData = ref(false);
const store = useStoreWishlist();
const wallets = ref([]);
const cities = ref([]);
const isLoading = ref(true);
const toast = useToast();
const axios = useNuxtApp().$axios;
const cartItems = storeToRefs(store).shoppingCartItems;

const { getCart } = store;
const { shoppingCartItems } = storeToRefs(store);
const totalPrice = ref(shoppingCartItems.value?.price?.total_with_vat);
const courseRegisterData = ref({
  image: { path: "", file: "" },
  bankAccount: null,
  qualifications: "",
  careerStatus: "",
  registerQuestion: null,
  subject_subscription_id: null,
  cardType: null,
  lessonsData: [],
});
const deliveryInfo = ref({
  paymentType: null,
  city: null,
  district: null,
  street: null,
  another_phone: null,
  additional_info: null,
});

const getCites = async () => {
  try {
    const res = await axios.get("cities");
    cities.value = res.data.data;
  } catch (err) {
    toast.error("خطأ في جلب المدن");
  }
};
const validateFormInputs = (values) => {
  console.log("validateFormInputs", values);
  isLoading.value = true;

  if (!courseRegisterData.value.cardType) {
    toast.error("VALIDATION.cardType");
    return;
  } else if (courseRegisterData.value.cardType === "visa") {
    payMob(values);
  } else {
    submitForm(values);
  }
};
const schema = yup.object({
  another_phone: yup
    .string()
    .required("VALIDATION.phone_number")
    .matches(/^[0-9]+$/, "VALIDATION.phone_number"),
  city: yup.object().required("VALIDATION.city"),
  district: yup.string().required("VALIDATION.district"),
  street: yup.string().required("VALIDATION.street"),
});
const { data, status, refresh } = await useLazyAsyncData("insta_vodafone", () =>
  axios
    .get("insta_vodafone")
    .then((res) => {
      wallets.value = res.data.data;
    })
    .catch((error) =>
      console.error("Error fetching course details:", error.response)
    )
);

const payMob = async () => {
  const theData = new FormData();
  theData.append("price", totalPrice.value);

  try {
    const response = await axios.post("website_paymob", theData);

    iframeId.value = response.data.extra_data.online_iframe;
    token.value = response.data.data.token;

    modalApperanceData.value = true;
    toast.success("تم التوجيه للدفع");

    window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${iframeId.value}?payment_token=${token.value}`;
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "An error occurred while processing the payment"
    );
  }
};
const submitForm = async (values) => {
  const theData = new FormData();
  theData.append("pay_type", courseRegisterData.value.cardType);
  theData.append("city_id", values.city.id);
  theData.append("neighborhood", values.district);
  theData.append("street", values.street);
  theData.append("phone", values.another_phone);
  theData.append("addition_data", values.additional_info);

  try {
    const res = await axios.post("user/order", theData);
    navigateTo("/orders");
  } catch (err) {
    errorToast(err.response?.data?.message || "حدث خطأ ما");
  }
};
onMounted(async () => {
  await getCart();
  await getCites();

  isLoading.value = false;
});
</script>

<style scoped></style>
