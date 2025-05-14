<script lang="ts" setup>
type Props = {
  loading?: boolean;
  name: string;
  disabled?: boolean;
  type: "submit" | "button";
};

const emit = defineEmits<{
  (event: "click"): void;
}>();
defineProps<Props>();
</script>

<template>
  <button
    class="btn3"
    @click="emit('click')"
    :type="type"
    :disabled="disabled || loading"
  >
    <span class="btn-loader" v-if="loading"></span>

    {{ name }}
  </button>
</template>

<style lang="scss" scoped>
.btn3 {
  @apply relative   inline-block  text-center text-2xl text-white 
          rounded-[10px] px-5 py-2 mt-0 
          
         transition-all !duration-[600ms] ease-linear;
  background-image: linear-gradient(
    45deg,
    transparent 50%,
    var(--main_theme_clr) 50%
  );
  background-position: 100%;
  background-size: 400%;
  border: 1px solid var(--main_theme_clr);
}

/* ✅ Hover Effects */
.btn3:hover {
  @apply bg-[0px] text-mainTheme;
}

/* ✅ Disabled Button */
.btn3:disabled {
  @apply opacity-50 cursor-not-allowed;
}
.btn-loader {
  @apply absolute left-4 top-1/3 size-5 p-0.5 
         border-[3px] border-dotted border-mainTheme 
            
         rounded-full inline-block animate-spin transition-all duration-[400ms] ease-in-out;
  border-left: dotted;
  border-bottom: dotted;
}
// .btn:hover .btn-loader {
//   @apply border-mainTheme;
// }
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
