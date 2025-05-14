<template>
    <div class="solid_card_wrapper  px-4 pt-5">
      <slot></slot>
    </div>
  </template>
  <script></script>
  
  <style scoped>
  /* ✅ Solid Card Wrapper */
  .solid_card_wrapper {
    @apply bg-lightTheme rounded-[20px] shadow-md transition-all duration-300 hover:shadow-lg;
  }
  </style>
  