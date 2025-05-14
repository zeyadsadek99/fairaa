<template>
  <div>
    <VeeField v-model="value" :name="name" v-slot="{ field, meta }">
      <div class="relative">
        <!-- Dropdown Trigger -->
        <Listbox as="div" v-model="value">
          <ListboxButton
            class="dropdown-trigger flex items-center justify-between px-3"
            :class="{ 'border-red-500': !meta.valid && meta.touched }"
            :disabled="disabled"
          >
            <p
              class="w-full truncate text-start"
              :class="value ? 'text-themeText' : 'text-gray-400'"
            >
              {{ value?.name || placeholder }}
            </p>
            <!-- ✅ Down Arrow Icon -->
            <div v-if="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-6 text-end text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </ListboxButton>

          <!-- Dropdown Menu -->
          <transition
            enter="transition ease-out duration-200 transform"
            enter-from="opacity-0 scale-90 -translate-y-2"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150 transform"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-90 -translate-y-2"
          >
            <ListboxOptions class="dropdown-menu">
              <!-- Placeholder as Disabled Option -->
              <li
                v-if="showPlaceholderOption"
                class="dropdown-item1 text-gray-400 cursor-default"
                disabled
              >
                {{ placeholder }}
              </li>

              <!-- If options empty -->
              <li
                v-if="options.length === 0"
                class="dropdown-item text-gray-400 cursor-default"
              >
                List is Empty
              </li>

              <!-- Dynamic Options -->
              <ListboxOption
                v-for="(item, index) in options"
                :key="item.id"
                v-slot="{ active, selected }"
                :value="item"
                as="template"
              >
                <li
                  @mouseenter="hoveredItem = item.id"
                  @mouseleave="hoveredItem = null"
                  @click="selectItem(item)"
                  class="dropdown-item"
                  :class="getItemClass(item, index, active, selected)"
                >
                  {{ item.name }}
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <!-- VeeValidate Error Message -->
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
  useNameId: {
    type: Boolean,
    default: false,
  },
  showPlaceholderOption: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false, // Add a disabled prop to control the disabled state
  },
});

const emit = defineEmits(["update:modelValue", "option-selected"]);
const hoveredItem = ref(null);

const getItemClass = (item, index, active, selected) => {
  if (selected) return "bg-[#ff6a6a] text-white";
  if (active) return "bg-mainTheme text-white";

  if (!props.modelValue && index === 0 && hoveredItem.value === null && !active)
    return "bg-mainTheme text-white";

  return "bg-themeInputs text-themeText";
};

const selectItem = (item) => {
  const selectedValue = props.useNameId ? item.nameId : item.id;
  emit("update:modelValue", item);
  emit("option-selected", selectedValue);
};

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style scoped>
/* Dropdown Trigger */
.dropdown-trigger {
  @apply border-none h-[54px] text-themeText bg-themeInputs w-full rounded-2xl p-3 text-xl cursor-pointer;
}

/* Dropdown Menu */
.dropdown-menu {
  @apply absolute w-full bg-white shadow-lg rounded-2xl mt-2 z-10 max-h-[250px] overflow-y-auto no-scrollbar;
}

/* Dropdown Items */
.dropdown-item {
  @apply cursor-pointer text-xl px-3 border-none transition-colors duration-300;
}
.dropdown-item1 {
  @apply cursor-pointer text-xl py-1 px-3 bg-gray-300 text-white border-none transition-colors duration-300;
}

/* Hide Scrollbar */
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
