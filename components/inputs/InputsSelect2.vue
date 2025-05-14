<template>
    <div>
      <VeeField v-slot="{ field, meta }" :name="name">
        <div class="relative">
          <select
            v-bind="field"
            :id="id"
            :disabled="disabled"
            :class="[
              'w-full p-3 rounded-[10px] bg-themeInputs text-themeText text-xl focus:outline-none',
              { 'border-red-500': !meta.valid && meta.touched },
            ]"
          >
            <!-- Placeholder Option -->
            <option disabled value="">{{ placeholder }}</option>
  
            <!-- Dynamic Options -->
            <option v-for="(option, index) in options" :key="index" :value="option.value">
              {{ option.label }}
            </option>
          </select>
  
          <!-- VeeValidate Error -->
          <VeeErrorMessage
            :name="name"
            as="div"
            class="text-red-500 text-sm mt-1"
          />
        </div>
      </VeeField>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    name: { type: String, required: true },
    id: { type: String, default: "" },
    options: { type: Array, required: true }, // [{ value: '1', label: 'Choice 1' }]
    placeholder: { type: String, default: "Select Option" },
    disabled: { type: Boolean, default: false },
  });
  </script>
  