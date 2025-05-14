<template>
  <div class="relative z-[1]">
    <div
      class="p-4 border border-secondaryTheme rounded-xl flex flex-wrap justify-between items-center gap-4"
    >
      <!-- REQUEST DETAILS -->
      <div class="flex gap-4 items-center">
        <img
          :src="
            userType === 'teacher'
              ? requestData.student.image
              : requestData.teacher.image
          "
          :alt="
            userType === 'teacher'
              ? requestData.student.fullname
              : requestData.teacher.fullname
          "
          class="w-[110px] h-[100px] rounded-xl object-cover"
        />

        <div>
          <div class="flex gap-4 items-center mb-1">
            <span class="text-themeText font-semibold">{{
              userType === "teacher"
                ? requestData.student.fullname
                : requestData.teacher.fullname
            }}</span>
            <span class="text-lightGray text-sm">{{
              requestData.created_at
            }}</span>
          </div>
          <p class="text-lightGray text-sm">{{ requestData.subjectName }}</p>
          <p class="text-lightGray text-sm" v-if="userType === 'parent'">
            {{ requestData.student.fullname }}
          </p>
          <p class="text-lightGray text-sm">
            {{ requestData.student.academic_year.name }}
          </p>
        </div>
      </div>

      <!-- REQUEST STATUS & ACTIONS -->
      <div class="flex flex-col gap-3 w-full md:w-[30%]">
        <!-- STATUS -->
        <div
          :class="[
            'flex gap-2 items-center justify-end text-lg font-medium',
            {
              'text-gold': requestData.status === 'waitting',
              'text-green-500': requestData.status === 'accepted',
              'text-red-500': requestData.status === 'rejected',
            },
          ]"
        >
          <i
            v-if="requestData.status === 'waitting'"
            class="fad fa-spinner-third"
          ></i>
          <i
            v-else-if="requestData.status === 'accepted'"
            class="far fa-check-circle"
          ></i>
          <i v-else class="far fa-times-circle"></i>
          <span>
            {{
              requestData.status === "waitting"
                ? $t("STATUS.new_request")
                : requestData.status === "accepted"
                ? $t("STATUS.accepted")
                : $t("STATUS.canceled")
            }}
          </span>
        </div>

        <!-- CONTACT OPTIONS -->
        <div v-if="requestData.status === 'accepted'">
          <button class="btn-secondary w-full" @click="toggleContactOptions">
            {{
              getAuthenticatedUserData.type === "parent"
                ? $t("BUTTONS.contact_teacher")
                : $t("BUTTONS.contact_parent")
            }}
          </button>

          <div
            v-if="contactOptionsIsOpen"
            class="flex justify-around items-center mt-3 gap-3"
          >
            <router-link
              :to="
                getAuthenticatedUserData.type === 'teacher'
                  ? `/chat/${requestData.parent.id}`
                  : `/chat/${requestData.teacher.id}`
              "
              class="icon-btn"
            >
              <i class="fal fa-comment-lines"></i>
            </router-link>

            <a
              :href="
                getAuthenticatedUserData.type === 'teacher'
                  ? `tel:${requestData.parent.phone}`
                  : `tel:${requestData.teacher.phone}`
              "
              class="icon-btn"
            >
              <i class="fal fa-mobile-android"></i>
            </a>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div
          v-if="
            getAuthenticatedUserData.type === 'teacher' &&
            requestData.status === 'waitting'
          "
          class="flex flex-col gap-2"
        >
          <button
            class="btn-main"
            @click="
              changeStrengtheningRequestsStatus({
                id: requestData.id,
                newStatus: 'accepted',
              })
            "
          >
            {{ $t("BUTTONS.accept") }}
            <span v-if="isWaitingRequest" class="loader-btn"></span>
          </button>

          <button
            class="btn-danger"
            @click="
              changeStrengtheningRequestsStatus({
                id: requestData.id,
                newStatus: 'rejected',
              })
            "
          >
            {{ $t("BUTTONS.reject") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <ModalsSuccessModal
      :modalApperanceData="successModalIsOpen"
      @controleModalApperance="toggleSuccessModal"
    >
      <template #title>{{ $t("TITLES.request_accepted") }}</template>
      <template #sub_title>{{ $t("TITLES.you_can_chat_the_parent") }}</template>
      <template #success_btn
        ><button @click="toggleSuccessModal">
          {{ $t("BUTTONS.ok") }}
        </button></template
      >
    </ModalsSuccessModal>

    <!-- Cancel Modal -->
    <ModalsCancelModal
      :modalApperanceData="cancelModalIsOpen"
      @controleModalApperance="toggleCancelModal"
    >
      <template #title>{{ $t("TITLES.request_canceled") }}</template>
      <template #cancel_btn
        ><button @click="toggleCancelModal">
          {{ $t("BUTTONS.ok") }}
        </button></template
      >
    </ModalsCancelModal>
  </div>
</template>

<script setup>
const props = defineProps(["requestData"]);

const isWaitingRequest = ref(false);
const successModalIsOpen = ref(false);
const cancelModalIsOpen = ref(false);
const contactOptionsIsOpen = ref(false);

const userType = useCookie("elmo3lm_elmosa3d_user_type");
const getAuthenticatedUserData = computed(
  () => store.getters["AuthenticationModule/getAuthenticatedUserData"]
);

const toggleContactOptions = () =>
  (contactOptionsIsOpen.value = !contactOptionsIsOpen.value);
const toggleSuccessModal = () =>
  (successModalIsOpen.value = !successModalIsOpen.value);
const toggleCancelModal = () =>
  (cancelModalIsOpen.value = !cancelModalIsOpen.value);

const changeStrengtheningRequestsStatus = (payload) => {
  isWaitingRequest.value = true;
  store
    .dispatch(
      "StrengtheningRequestsModule/changeStrengtheningRequestsStatus",
      payload
    )
    .finally(() => (isWaitingRequest.value = false));
};
</script>

<style scoped>
/* Base Buttons */
.btn-main {
  @apply w-full bg-mainTheme text-white py-2 rounded-xl text-lg font-semibold transition-all duration-300;
}
.btn-secondary {
  @apply w-full bg-mainTheme text-white py-2 rounded-xl text-lg font-semibold transition-all duration-300;
}
.btn-danger {
  @apply w-full bg-red-600 text-white py-2 rounded-xl text-lg font-semibold transition-all duration-300;
}
.icon-btn {
  @apply size-10 bg-softMainTheme text-mainTheme flex items-center justify-center rounded-lg;
}
</style>
