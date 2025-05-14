<template>
  <div class="breadcrumb-wrapper">
    <h2 class="page-title">
      <slot name="page_title"></slot>
    </h2>

    <h4 class="breadcrumb-routes">
      <NuxtLink :to="localePath('/')" class="breadcrumb-link">{{
        t("TITLES.home")
      }}</NuxtLink>

      <span class="breadcrumb-separator"> > </span>

      <p class="breadcrumb-current">
        <slot name="breadcrumb_current_page"></slot>
      </p>
    </h4>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const localePath = useLocalePath();
const { t } = useI18n();
</script>

<style scoped>
/* ✅ Breadcrumb Wrapper */
.breadcrumb-wrapper {
  @apply relative h-[200px] z-20 bg-mainTheme flex flex-col items-center justify-center overflow-hidden isolate;
}

.breadcrumb-wrapper::before {
  content: "";
  @apply absolute w-[540px] h-[380px] bg-contain bg-no-repeat bottom-[-70%] left-[-10px] z-[-1];
  background-image: url("/assets/media/shapes/light_green_book_bg_shape_left.svg");
}

.breadcrumb-wrapper::after {
  content: "";
  @apply absolute w-[540px] h-[380px] bg-contain bg-no-repeat bottom-[-70%] right-[-10px] z-[-1];
  background-image: url("/assets/media/shapes/light_green_book_bg_shape_right.svg");
}

.page-title {
  @apply text-white text-[3.5rem] font-bold text-center;
}

/* ✅ Breadcrumb Links */
.breadcrumb-routes {
  @apply flex items-center justify-center gap-2 text-[2.2rem];
}

.breadcrumb-link {
  @apply text-white;
}

.breadcrumb-separator {
  @apply text-white text-[40px] opacity-70 flex items-center justify-center;
}

.breadcrumb-current {
  @apply text-white  opacity-70;
}

/* ✅ Responsive Design */
@media (max-width: 1024px) {
  .page-title {
    @apply text-5xl;
  }
  .breadcrumb-routes {
    @apply text-[1.8rem];
  }
}

@media (max-width: 767px) {
  .breadcrumb-wrapper {
    @apply h-[110px];
  }

  .breadcrumb-wrapper::before,
  .breadcrumb-wrapper::after {
    @apply hidden;
  }

  .page-title {
    @apply text-[2.5rem];
  }

  .breadcrumb-routes {
    @apply text-[1.6rem];
  }
}
</style>
