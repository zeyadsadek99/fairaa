<template>
  <button
    :type="type || 'button'"
    :disabled="loading"
    :aria-label="text"
  >
    {{ text }}
  </button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: null,
    required: true,
  },
  type: {
    type: String,
    default: "button",
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
