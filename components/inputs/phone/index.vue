<template>
  <VeeField as="div" :name="name" v-slot="{ field, meta }">
    <label
      v-if="label"
      :for="id"
      class="mb-2 block"
      :class="meta.touched && !meta.valid ? 'text-red-500' : 'text-text'"
      >{{ label }}</label
    >
    <div class="relative flex gap-4">
      <input
        v-bind="field"
        type="number"
        :disabled="disabled"
        :placeholder="placeholder"
        :autocomplete="name"
        class="block h-[54px] border-none text-themeText bg-themeInputs w-full rounded-2xl p-3 text-xl"
        :class="
          meta.touched && !meta.valid
            ? 'border-red-500 text-red-500 placeholder:text-red-200 bg-card_color'
            : 'bg-card_color placeholder:text-text_dark'
        "
      />
      <PhoneCode :disabled="disabled" />
    </div>
    <VeeErrorMessage
      v-if="meta.touched && !meta.valid"
      :name="name"
      as="p"
      class="mt-2 px-3 text-sm text-red-500"
    />
  </VeeField>
</template>
<script setup>
import PhoneCode from "./PhoneCode.vue";
defineProps({
  id: {
    type: String,
    required: true,
    default: null,
  },
  label: {
    type: String,
    required: false,
    default: null,
  },
  placeholder: {
    type: String,
    required: true,
    default: null,
  },
  name: {
    type: String,
    required: true,
    default: null,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
