<template>
  <VeeField :name="name" v-slot="{ field, meta }" class="font-arb">
    <div
      class="block h-[54px] border-none text-themeText bg-themeInputs w-full rounded-2xl p-3 !text-xl"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <label :for="id" class="label" v-if="label">{{ label }}</label>

      <div :class="icon ? 'with_icon' : ''">
        <VueDatePicker
          class="custom-datepicker"
          :disabled="disabled"
          v-model="date"
          :enable-time-picker="timePicker"
          :max-date="maxDates"
          :min-date="minDates"
          :max-time="maxTime"
          :min-time="minTime"
          no-today
          position="right"
          :time-picker="timePicker"
          :model-type="timePicker ? 'hh:mm' : 'yyyy-MM-dd'"
          :date-select="dateSelect"
          :id="id"
          :placeholder="placeholder"
          auto-apply
          :month-picker="monthPicker"
          v-bind="field"
          :teleport="true"
          @clear="
            date = '';
            updateValue();
          "
          :is-24="is24"
        >
          <template #input-icon>
            <div
              class="z-30 icon !text-sm !relative !translate-y-0 icon text-sub"
            >
              <IconsClock v-show="timePicker" />
              <IconsCalendar v-show="!timePicker" />
              <!-- <i class="fa-regular fa-clock"></i>
              <i class="fa-regular fa-calendar"></i> -->
            </div>
            <!-- <svg-icon
              classes="z-30 icon !relative !translate-y-0 icon text-sub"
              v-if="icon"
            /> -->
          </template>
        </VueDatePicker>
      </div>

      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-error"
      />
    </div>
  </VeeField>
</template>

<script setup>
import { useField } from "vee-validate";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const props = defineProps({
  id: {
    required: true,
  },
  name: {
    required: true,
  },
  dateSelect: {
    required: false,
  },
  disabled: {
    required: false,
    default: false,
  },

  label: {
    required: false,
  },
  placeholder: {
    required: true,
  },
  is24: {
    required: false,
  },
  itemValue: {
    required: true,
  },
  icon: {
    required: false,
    type: Boolean,
  },
  timePicker: {
    required: false,
    default: false,
  },
  maxDate: {
    required: false,
  },
  minDate: {
    required: false,
  },
  maxTime: {
    required: false,
  },
  minTime: {
    required: false,
  },
  monthPicker: {
    required: false,
  },
});

const fieldValue = useField(props.name);

const date = ref("");
onMounted(() => {
  if (props.itemValue) {
    if (props.timePicker) {
      date.value = props.itemValue; // Normal date

      // date.value = parseTimeString(props.itemValue);
    } else {
      date.value = props.itemValue; // Normal date
    }
  }
});
const parseTimeString = (timeString) => {
  if (!timeString) return null;

  const [hours, minutes] = timeString.split(":").map(Number);
  const dateObj = new Date();

  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj;
};

const minDates = ref(null);
const maxDates = ref(null);

const emit = defineEmits(["update:itemValue", "change"]);

const updateValue = (event) => {
  fieldValue.setValue(date.value);

  emit("update:itemValue", date.value ?? "");

  emit("change", date.value ?? "");
};

watch(
  () => date.value,
  (value) => {
    if (!value) return;

    if (typeof value === "string") {
      const [hours, minutes] = value.split(":").map(Number);
      value = new Date();
      value.setHours(hours, minutes, 0, 0);
    }

    if (props.timePicker && value instanceof Date) {
      const hours = String(value.getHours()).padStart(2, "0");
      const minutes = String(value.getMinutes()).padStart(2, "0");

      updateValue(`${hours}:${minutes}`);
    } else {
      let formattedDate = "";
      const dateObj = new Date(value);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      formattedDate = `${year}-${month}-${day}`;
      updateValue(formattedDate);
    }
  }
);

watch(
  () => props.minDate,
  (value) => {
    if (value) {
      minDates.value = value;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => props.maxDate,
  (value) => {
    if (value) {
      maxDates.value = value;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
<style>
.dp__input_reg {
  @apply bg-transparent border-none;
}
.dp__input_wrap {
  @apply ps-0 flex;
}
.dp__input_icon {
  @apply pb-2;
}
.dp__input {
  @apply text-xl font-arb ps-0 transition-all duration-300;
  --dp-direction: rtl; /* or ltr */
}
.dp--clear-btn {
  @apply opacity-0 hover:opacity-100;
}
.dp__input_icons {
  @apply !p-0;
}
.dp__flex_row {
  direction: ltr;
}

/* .dp__main {
  direction: ltr !important;
}
 .dp__flex_row{
  direction: ltr !important;
 } */
</style>
