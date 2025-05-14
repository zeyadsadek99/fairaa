<template>
  <div class="skeleton-loader-card-wrapper">
    <div class="skeleton-box chat-card-loader">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-4">
          <div class="skeleton-unit avatar"></div>
        </div>
        <div class="col-span-8">
          <div class="grid grid-cols-12 mt-4 gap-4">
            <div class="col-span-8">
              <div class="skeleton-unit details-skeleton-row"></div>
            </div>
            <div class="col-span-4">
              <div class="skeleton-unit details-skeleton-row"></div>
            </div>
            <div class="col-span-12">
              <div class="skeleton-unit details-skeleton-row"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.skeleton-box {
  @apply w-full bg-white overflow-hidden;
}

.skeleton-unit {
  @apply relative flex bg-skeletonLoader overflow-hidden;
}

.skeleton-unit::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(148, 148, 148, 0) 0,
    rgba(148, 148, 148, 0.2) 20%,
    rgba(148, 148, 148, 0.5) 50%,
    rgba(148, 148, 148, 0)
  );
  animation: shimmer 2s infinite;
}
/* Slider Loader */
.skeleton-box.slider-loader .skeleton-unit {
  @apply w-full h-[400px];
}

/* Course Card Loader */
.skeleton-box.course-card-loader,
.skeleton-box.product-card-loader,
.skeleton-box.strengthening-requests-card-loader {
  @apply p-1 border-2 border-secondaryTheme rounded-2xl;
}

.skeleton-box.course-card-loader .skeleton-unit.img-skeleton,
.skeleton-box.product-card-loader .skeleton-unit.img-skeleton {
  @apply mb-2 h-[140px] rounded-2xl;
}

.skeleton-box.course-card-loader .skeleton-unit.details-skeleton-row,
.skeleton-box.product-card-loader .skeleton-unit.details-skeleton-row {
  @apply mb-2 h-5 rounded-[10px];
}

.skeleton-box.strengthening-requests-card-loader .skeleton-unit.avatar {
  @apply size-[120px] rounded-2xl;
}

.skeleton-box.strengthening-requests-card-loader
  .skeleton-unit.details-skeleton-row {
  @apply mb-2 h-5 rounded-[10px];
}

.skeleton-box.chat-card-loader {
  @apply my-4 py-3;
}

.skeleton-unit.avatar {
  @apply size-20 rounded-full;
}

.skeleton-unit.details-skeleton-row {
  @apply mb-2 h-5 rounded-lg;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 767px) {
  .skeleton-box.slider-loader .skeleton-unit {
    @apply h-44;
  }
}
</style>
