<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const props = defineProps({
  modelValue: {
    required: false,
  },
  name: {
    type: String,
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
  icon: {
    type: Boolean,
    default: false,
  },
  showPlaceholderOption: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "option-selected"]);

// Internal value for handling selections
const internalValue = ref(props.modelValue);

// Watch modelValue to sync internally when parent updates
watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  },
  { immediate: true }
);

// Handle selection
const selectItem = (item) => {
  if (props.multiple) {
    const exists = internalValue.value.find((i) => i.id === item.id);
    if (exists) {
      internalValue.value = internalValue.value.filter((i) => i.id !== item.id);
    } else {
      internalValue.value = [...internalValue.value, item];
    }
  } else {
    internalValue.value = item;
  }
  emit("update:modelValue", internalValue.value);
  emit("option-selected", item.id);
};

// Remove item
const removeItem = (item) => {
  internalValue.value = internalValue.value.filter((i) => i.id !== item.id);
  emit("update:modelValue", internalValue.value);
};

// Classes for active/selected item
const getItemClass = (active, selected) => {
  if (selected) return "bg-[#ff6a6a] text-white";
  if (active) return "bg-mainTheme text-white";
  return "bg-themeInputs text-themeText";
};
</script>

<template>
  <div>
    <VeeField :name="name" v-slot="{ meta }">
      <div class="relative">
        <!-- Dropdown Trigger -->
        <Listbox v-model="internalValue" :multiple="multiple">
          <ListboxButton
            class="dropdown-trigger flex items-center justify-between px-3 relative"
            :class="{
              'border-red-500': !meta.valid && meta.touched,
              'py-2': multiple,
            }"
          >
            <!-- Selected Items inside -->
            <div class="flex flex-wrap gap-2 items-center flex-1 min-h-[30px]">
              <template v-if="multiple && internalValue.length">
                <span
                  v-for="item in internalValue"
                  :key="item.id"
                  class="bg-[#41b883] whitespace-nowrap text-white rounded-md px-2 pb-1 pt-2 text-xl leading-4 flex items-center gap-1"
                >
                  <button
                    type="button"
                    @click.stop="removeItem(item)"
                    class="hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                  <span class="mb-1.5">
                    {{ item.name }}
                  </span>
                </span>
              </template>
              <p
                v-if="!internalValue.length"
                class="truncate text-start text-gray-400"
              >
                {{ placeholder }}
              </p>
            </div>

            <!-- Icon -->
            <div v-if="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-5 text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </ListboxButton>

          <!-- Dropdown Options -->
          <transition
            enter="transition ease-out duration-200 transform"
            enter-from="opacity-0 scale-90 -translate-y-2"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150 transform"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-90 -translate-y-2"
          >
            <ListboxOptions class="dropdown-menu">
              <li
                v-if="showPlaceholderOption"
                class="dropdown-item1 text-gray-400 cursor-default"
                disabled
              >
                {{ placeholder }}
              </li>

              <li
                v-if="options.length === 0"
                class="dropdown-item text-gray-400 cursor-default"
              >
                List is Empty
              </li>

              <ListboxOption
                v-for="item in options"
                :key="item.id"
                v-slot="{ active, selected }"
                :value="item"
                as="template"
              >
                <li
                  @click="selectItem(item)"
                  class="dropdown-item"
                  :class="getItemClass(active, selected)"
                >
                  {{ item.name }}
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- VeeValidate Error -->
        <VeeErrorMessage
          v-if="!meta.valid && meta.touched"
          :name="name"
          as="div"
          class="text-red-500 text-sm mt-1"
        />
      </div>
    </VeeField>
  </div>
</template>

<style scoped>
/* Trigger */
.dropdown-trigger {
  @apply border-none min-h-[54px] text-themeText bg-themeInputs w-full rounded-2xl px-3 text-lg cursor-pointer flex-wrap gap-2;
}

/* Menu */
.dropdown-menu {
  @apply absolute w-full bg-white shadow-lg rounded-2xl mt-2 z-10 max-h-[250px] overflow-y-auto no-scrollbar;
}

/* Items */
.dropdown-item {
  @apply cursor-pointer text-lg p-3 transition-colors duration-300;
}
.dropdown-item1 {
  @apply text-lg py-1 px-3 bg-gray-300 text-white;
}

/* Scrollbar */
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
