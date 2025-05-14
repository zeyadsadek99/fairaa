<template>
  <div class="all_registered_students_wrapper">
    <BaseModal
      :show="modalApperanceData"
      @controleModalApperance="controleModalApperance"
    >
      <template #modal>
        <div class="cancel_card">
          <!-- Icon -->
          <div
            class="icon bg-lightRed rounded-full flex items-center justify-center w-24 h-24 mb-8"
          >
            <IconsClock class="text-white text-4xl" />
          </div>

          <!-- Title -->
          <h2 class="text-3xl font-bold text-themeText mb-2">
            <slot name="title"> </slot>
          </h2>

          <!-- Subtitle -->
          <p class="text-xl text-lightGray">
            <slot name="sub_title"> </slot>
          </p>

          <!-- Cancel Button -->
          <div class="cancel_btn text-center mt-6">
            <slot name="cancel_btn"></slot>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<style>
/* Apply for Cancel Modal Layout */
.cancel_wrapper .main_body {
  @apply py-9;
}

.cancel_wrapper .main_body .cancel_card {
  @apply text-center;
}

.cancel_wrapper .main_body .cancel_card .icon {
  @apply bg-lightRed rounded-full flex items-center justify-center w-24 h-24 mb-8;
}

.cancel_wrapper .main_body .cancel_card .icon i {
  @apply text-white text-4xl;
}

.cancel_wrapper .main_body .cancel_card h2 {
  @apply text-3xl font-bold text-themeText mb-2;
}

.cancel_wrapper .main_body .cancel_card p {
  @apply text-xl text-lightGray;
}

.cancel_wrapper .main_body .cancel_card .cancel_btn {
  @apply text-center mt-6;
}

/* Button Styles */
.cancel_wrapper .main_body .cancel_card .cancel_btn button,
.cancel_wrapper .main_body .cancel_card .cancel_btn a {
  @apply text-white bg-gradient-to-r from-transparent to-lightRed rounded-lg text-center py-2 px-5 text-xl transition-all duration-300 ease-in-out;
  background-image: linear-gradient(
    45deg,
    transparent 50%,
    var(--light_red_clr) 50%
  );
  border: 1px solid var(--light_red_clr);
}

.cancel_wrapper .main_body .cancel_card .cancel_btn button:hover,
.cancel_wrapper .main_body .cancel_card .cancel_btn a:hover {
  @apply text-mainTheme bg-[0%] bg-gradient-to-l;
}

/* Disabled Button */
.cancel_wrapper .main_body .cancel_card .cancel_btn button:disabled,
.cancel_wrapper .main_body .cancel_card .cancel_btn a:disabled {
  @apply opacity-50;
}

@keyframes rotation {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
