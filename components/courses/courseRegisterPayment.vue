<template>
  <div class="course-register-payment-form-wrapper">
    <h3 class="form-title">{{ $t("TITLES.register_course") }}</h3>
    <h3 class="form-subtitle">
      {{ $t("TITLES.enter_data_to_register_course") }}
    </h3>

    <VeeForm
      @submit="validateFormInputs"
      :initial-values="courseRegisterData"
      class="space-y-6"
    >
      <div class="flex items-center justify-center gap-5">
        <label class="check-wrapper">
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

        <label class="check-wrapper">
          <input
            type="radio"
            value="wallet"
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
              <h4 class="text-xl font-semibold mb-1">
                رقم الحساب (مصرف ابوظبي الاسلامي)
              </h4>
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
      <div class="w-fit relative mx-auto">
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

      <div class="space-y-3">
        <InputsText
          v-model="courseRegisterData.bankAccount"
          type="number"
          id="bankAccount"
          name="bankAccount"
          :placeholder="t('PLACEHOLDERS.account_number')"
          class="w-full"
        />
        <div>
          <InputsDropDown2
            v-model="courseRegisterData.lessonsData"
            name="lessonsData"
            :options="listens?.listens"
            :placeholder="$t('PLACEHOLDERS.lessons')"
            :multiple="true"
          />

          <h4 class="text-2xl" v-if="totalPrice > 0">
            {{ $t("TITLES.total_price") }} {{ totalPrice }}
            {{ $t("TITLES.egp") }}
          </h4>
        </div>
      </div>

      <div>
        <h4 class="text-2xl">
          {{ $t("TITLES.course_register_question") }}
        </h4>

        <InputsRadioGroup
          v-model="courseRegisterData.registerQuestion"
          name="registerQuestion"
          class="!my-5"
          :options="[
            { label: t('PLACEHOLDERS.yes'), value: 'yes' },
            { label: t('PLACEHOLDERS.no'), value: 'no' },
          ]"
        />
      </div>

      <InputsButton
        type="submit"
        class="w-full font-semibold"
        :loading="isWaitingRequest"
        :name="t('BUTTONS.submit')"
      />
    </VeeForm>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
const toast = useToast();
const props = defineProps({
  listens: {
    type: Array,
    required: true,
  },
});
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const axios = useNuxtApp().$axios;
const isWaitingRequest = ref(false);
const wallets = ref([]);
const userType = ref(useCookie("elmo3lm_elmosa3d_user_type"));
const iframe_id = ref(null);
const token = ref(null);
const accountNumber = ref(null);

const copyToClipboard = () => {
  const text = accountNumber.value?.innerText;
  if (text) {
    if (!navigator.clipboard) {
      toast.error("ميزة النسخ غير مدعومة في هذا المتصفح");
      return;
    }
    // return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("تم نسخ رقم الحساب بنجاح!");
    });
  }
};

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

const totalPrice = computed(() =>
  courseRegisterData.value.lessonsData?.reduce(
    (sum, item) => sum + item.price,
    0
  )
);
const validateFormInputs = (values) => {
  // return;
  isWaitingRequest.value = true;

  if (!courseRegisterData.value.cardType) {
    toast.error("VALIDATION.cardType");
    return;
  }

  if (courseRegisterData.value.lessonsData.length === 0) {
    toast.error("VALIDATION.lessons");
    return;
  }
  if (courseRegisterData.value.cardType === "visa") {
    payMob();
  } else {
    submitForm();
  }
};

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
// ✅ Handle error toasts

const payMob = async () => {
  console.log("payMob", values);
  console.log(courseRegisterData.value);
  return;
  const theData = new FormData();
  theData.append("price", totalPrice.value);

  try {
    const res = await axios.post("website_paymob", theData);
    console.log(res);
    return;
    iframe_id.value = res.data.extra_data.online_iframe;
    token.value = res.data.data.token;
    modalApperanceData.value = true;
    window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${iframe_id.value}?payment_token=${token.value}`;
  } catch (error) {
    toast.error(error.response?.data?.message || "حدث خطأ ما");
  }
};

// ✅ Submit course registration form
const submitForm = async () => {
  const theData = new FormData();
  if (courseRegisterData.value.image.file)
    theData.append("transfer_image", courseRegisterData.value.image.file);
  theData.append("transfer_from_num", courseRegisterData.value.bankAccount);

  let lessons = courseRegisterData.value.lessonsData;
  lessons.forEach((lesson, index) => {
    theData.append(`lessons[${index}][id]`, lesson.id);
  });

  // theData.append(
  //   "attending_online_course_before",
  //   courseRegisterData.value.registerQuestion
  // );
  theData.append("subject_id", route.params.id);

  try {
    let url =
      userType.value === "teacher"
        ? "teacher/category/subject/payment"
        : "student/subject/pay_insta";

    const res = await axios.post(url, theData);
    // courseRegisterData.value.subject_subscription_id = res.data.data.id;
    // paymentMethods();
  } catch (err) {
    toast.error(err.response?.data?.message || "حدث خطأ ما");
  }
};
</script>

<style scoped>
.course-register-payment-form-wrapper {
  @apply pb-10;
  .form-title {
    @apply text-center text-themeText text-2xl font-medium;
  }

  .form-subtitle {
    @apply text-center font-medium text-lightGray text-[22px] mb-6;
  }
}
</style>
