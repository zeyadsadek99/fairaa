<template>
  <div class="not_found_page_wrapper">
    <div class="illustration_wrapper">
      <img
        class="star"
        src="/assets/media/illustrations/polygon_large.svg"
        alt="star"
      />
      <img
        class="star"
        src="/assets/media/illustrations/polygon_small.svg"
        alt="star"
      />
      <img
        class="star"
        src="/assets/media/illustrations/polygon_small.svg"
        alt="star"
      />
      <img
        class="star"
        src="/assets/media/illustrations/polygon_large.svg"
        alt="star"
      />

      <img
        class="illustration"
        src="/assets/media/illustrations/4.svg"
        width="100"
        height="100"
        alt="first_4"
      />

      <img
        class="illustration rotate_animation"
        src="/assets/media/illustrations/Planet.svg"
        width="100"
        height="100"
        alt="0"
      />

      <img
        class="illustration"
        src="/assets/media/illustrations/4.svg"
        width="100"
        height="100"
        alt="last_4"
      />
    </div>

    <div class="subtitle1">Ooops !</div>

    <div class="not_found_text">Page Not Found</div>

    <div class="go_back_route">
      <span> Do You Want To Go </span>
      <button @click="goBack">Back</button>
      <span> ? </span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// Go back method
const goBack = () => {
  router.back();
};
</script>

<style>
.not_found_page_wrapper {
  @apply flex items-center justify-center flex-col  bg-themeBg;
  direction: ltr !important;
  row-gap: 3vh;
}

.illustration_wrapper {
  @apply relative flex items-center justify-center w-[60%];
  column-gap: 1.5vw;
}

/* .star */
.star {
  @apply absolute;
}

.star:first-of-type {
  @apply top-0 left-[100px] size-[50px];
}

.star:nth-of-type(2) {
  @apply top-[25px] right-[255px] size-[35px];
}

.star:nth-of-type(3) {
  @apply bottom-[-25px] left-[290px] size-[35px];
}

.star:nth-of-type(4) {
  @apply bottom-[-15px] right-[220px] size-[50px];
}

/* .illustration */
.illustration {
  @apply inline-block w-[25%] h-auto;
}

.illustration.rotate_animation {
  animation: spin 15s linear infinite;
}

.illustration[alt="first_4"],
.illustration[alt="last_4"] {
  @apply w-[16%];
}

/* .subtitle1 */
.subtitle1 {
  @apply text-mainTheme font-bold text-[3.5rem];
}

/* .not_found_text */
.not_found_text {
  @apply text-themeText text-[2.3rem];
}

/* .go_back_route */
.go_back_route span {
  @apply text-themeText font-medium text-[1.7rem];
}

.go_back_route button {
  @apply text-mainTheme font-medium text-[1.7rem];
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .illustration_wrapper {
    @apply w-full;
  }

  .star {
    @apply absolute;
  }

  .star:first-of-type {
    @apply top-[-30px] left-[35px] size-[40px];
  }

  .star:nth-of-type(2) {
    @apply top-[-10px] right-[115px] size-[25px];
  }

  .star:nth-of-type(3) {
    @apply bottom-[-25px] left-[140px] size-[25px];
  }

  .star:nth-of-type(4) {
    @apply bottom-[-42px] right-[75px] size-[40px];
  }

  .illustration[alt="first_4"],
  .illustration[alt="last_4"] {
    @apply w-[28%];
  }

  .not_found_text {
    @apply text-[1.8rem];
  }
}

/* Keyframes for spin animation */
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
