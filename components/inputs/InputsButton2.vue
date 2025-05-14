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
  <button @click="emit('click')" :type="type" :disabled="disabled || loading">
    <span class="btn-loader" v-if="loading"></span>

    {{ name }}
  </button>
</template>

<style lang="scss" scoped>
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
