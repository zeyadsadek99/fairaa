<template>
  <VeeField as="div" :name="name" v-slot="{ field, meta }">
    <label
      v-if="label"
      :for="id"
      class="mb-2 block"
      :class="meta.touched && !meta.valid ? 'text-red-500' : 'text-text'"
      >{{ label }}</label
    >
    <div class="relative flex items-center justify-between">
      <input
        :type="inputType"
        v-bind="field"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="name"
        class="block h-[54px] border-none text-themeText bg-themeInputs w-full rounded-2xl p-3 text-xl"
        :class="[
          meta.touched && !meta.valid
            ? 'border-red-500 text-red-500 placeholder:text-red-200 bg-card_color'
            : ' bg-card_color placeholder:text-text_dark',
          type === 'password' && '!pe-[50px]',
        ]"
      />

      <button
        v-if="type === 'password'"
        type="button"
        class="absolute end-[20px]"
        @click="inputType = inputType === 'text' ? 'password' : 'text'"
      >
        <div
          v-show="inputType === 'text'"
          class="btn-action"
          aria-label="Show password"
        >
          <IconsEyeSlash class="cursor-pointer size-7" />
        </div>
        <div
          v-show="inputType === 'password'"
          class="btn-action"
          aria-label="Hide password"
        >
          <IconsEye class="cursor-pointer size-7" />
        </div>
      </button>
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
const props = defineProps({
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
  type: {
    type: String,
    required: false,
    default: "text",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const isFav = ref(false);

// Function to toggle the state
const favClick = () => {
  isFav.value = !isFav.value;
};
const inputType = ref(props.type || "text");
const inputField = useField(props.name);
const currentType = ref(props.type);
const togglePasswordVisibility = () => {
  inputType.value = inputType.value === "text" ? "password" : "text";
};
watch(
  () => props.value,
  (val) => {
    if (val) {
      inputField.setValue(val);
    }
  },
  { deep: true, immediate: true }
);
const emits = defineEmits(["update:value"]);
</script>
