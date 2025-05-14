<template>
  <div class="relative">
    <select v-model="modelValue" @change="handleChange" class="dropdown-select">
      <option disabled value="null">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>
    <IconsArrowDown
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </div>
</template>

<script setup>

// Props
const props = defineProps({
  modelValue: {
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
});

// Emit update for v-model
const emit = defineEmits(["update:modelValue"]);

// Internal value for v-model binding
const modelValue = ref(props.modelValue);

// Emit value change to the parent
const handleChange = () => {
  emit("update:modelValue", modelValue.value);
};
</script>

<style scoped>
/* Tailwind styles for dropdown */
.dropdown-select {
  @apply w-full py-2 ps-10 pl-3 border border-gray-300 rounded-lg;
}

.dropdown-icon {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none;
}
</style>
