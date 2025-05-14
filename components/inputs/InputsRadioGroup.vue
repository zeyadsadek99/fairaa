<template>
    <div class="flex items-center  gap-8">
      <!-- Loop Through Options -->
      <label
        v-for="option in options"
        :key="option.value"
        class="flex items-center space-x-2 cursor-pointer"
      >
        <VeeField
          type="radio"
          :name="name"
          :value="option.value"
          v-model="selectedValue"
          class="hidden"
        />
        <span
          class="size-6 rounded-full flex items-center justify-center transition-all"
          :class="selectedValue === option.value ? 'border-mainTheme bg-mainTheme' : 'bg-themeInputs'"
        ></span>
        <span class="text-2xl">{{ option.label }}</span>
      </label>
      <VeeErrorMessage :name="name" class="text-red-500 text-sm mt-1" />
    </div>
  </template>
  
  <script setup>

  // Props
  const props = defineProps({
    modelValue: String, // The selected value
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true, // Expect an array of objects { label: 'Male', value: 'male' }
    },
  });
  
  // Emits
  const emit = defineEmits(["update:modelValue"]);
  
  // Reactive value
  const selectedValue = ref(props.modelValue);
  
  // Watch for changes and update parent
  watch(selectedValue, (newValue) => {
    emit("update:modelValue", newValue);
  });
  </script>
  