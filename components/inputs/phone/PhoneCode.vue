<template>
  <VeeField
    name="phone_code"
    v-slot="{ field, meta }"
    v-if="allCountries && allCountries.length"
  >
    <div class="relative top-[0.5px] end-0">
      <Listbox
        v-slot="{ open }"
        v-model="selected"
        :disabled="countriesLoading || disabled"
      >
        <div :class="countriesLoading && 'opacity-60'">
          <ListboxButton
            class="relative h-[50px] w-20 overflow-hidden p-3 bg-themeInputs rounded-2xl"
          >
            <div class="flex items-center gap-2 text-xl text-themeText">
              <span
                class="block text-start text-xl"
                :class="selected ? 'text-text' : 'text-title'"
                :title="selected ? selected.key : ''"
                >{{
                  selected ? selected.key : $t("FORMS.Placeholders.phoneCode")
                }}
              </span>
              <img
                v-if="selected"
                :src="selected.flag"
                class="h-5 w-[30px] object-fill"
                :alt="`${selected.name}-image`"
                @error="handleImageError"
              />
            </div>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="absolute z-[1010] top-[110%] max-h-60 w-full overflow-auto rounded-2xl bg-themeInputs hover:bg-mainTheme"
              v-bind="field"
            >
              <ListboxOption
                as="template"
                v-slot="{ active, selected }"
                v-for="country in allCountries"
                :key="country.id"
                :value="country"
              >
                <li
                  class="cursor relative cursor-pointer select-none border-b border-border p-3 duration-300 last-of-type:border-none"
                  :class="{
                    'bg-teal-600 text-primary': active,
                    'text-text': !active,
                  }"
                >
                  <div class="flex items-center gap-2">
                    <span class="block text-themeText text-xl">{{
                      country.key
                    }}</span>
                    <img
                      :src="country.flag"
                      class="h-5 w-[30px] object-fill"
                      :alt="`${country.name}-image`"
                      @error="handleImageError"
                    />
                  </div>
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center"
                    :class="{ 'text-primary': active, 'text-text': !active }"
                  />
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </div>
  </VeeField>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
import { useField } from "vee-validate";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import axios from "axios";
const phoneCodeField = useField("phone_code");
const config = useRuntimeConfig();
/* Start of the function that get all countries */
const allCountries = ref([]);
const selected = ref(null);
const countriesLoading = ref(false);
async function getAllCountries() {
  countriesLoading.value = true;
  await axios
    .get(`${config.public.general}countries`)
    .then((res) => {
      allCountries.value = res.data.data;
      if (allCountries.value) {
        selected.value = res.data.data[0];

        phoneCodeField.setValue(selected.value.id);
      }
    })
    .catch((e) => console.error(e))

    .finally(() => (countriesLoading.value = false));
}
/* End of the function that get all countries */
onMounted(() => {
  getAllCountries();
});
</script>
