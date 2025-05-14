<template>
  <VeeField type="file" :name="name" v-slot="{ meta, field }">
    <div
      class="input_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <label :for="id" class="label  font-bold text-3xl" v-if="label">
        {{ label }}
      </label>

      <div class="flex gap-2">
        <div class="flex gap-2.5 items-center">
          <div
            v-for="(file, index) in selectedFiles"
            :key="index"
            class="file-preview relative size-[95px] bg-themeInputs flex justify-center items-center flex-col rounded-2xl hover:relative group"
          >
            <IconsFile class="text-3xl text-midGray" />
            <h3 class="text-lg text-center text-midGray">{{ file.name }}</h3>

            <div
              v-if="file"
              class="custom-overlay"
              @click.stop="removeFile(index)"
            >
              <IconsTrash />
            </div>
          </div>
        </div>

        <div
          class="upload cursor-pointer bg-themeInputs hover:bg-[rgba(0,0,0,.5)] text-black size-[95px] flex items-center justify-center my-3 rounded-2xl"
          @click="triggerFileInput"
        >
          <input
            ref="refFile"
            type="file"
            :id="id"
            class="hidden"
            @change="uploadFiles($event.target.files)"
            :accept="accept"
            :multiple="true"
          />
          <input type="text" class="hidden" :name="name" v-bind="field" />

          <label
            :for="id"
            class="text-xl text-center rounded-lg flex flex-col justify-center items-center gap-3 cursor-pointer"
          >
            <div>
              <div class="w-40 h-40 flex justify-center items-center text-3xl">
                <IconsPlus class="size-10" />
              </div>
            </div>
          </label>
        </div>
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
import { toast } from "vue3-toastify";

const props = defineProps({
  accept: { required: false },
  no_preview: { required: false, default: false },
  itemValue: { required: true },
  image: { required: true },
  id: { required: true },
  name: { required: true },
  label: { required: false },
  modalName: { required: true },
  modalType: { required: true },
  multiple: { type: Boolean },
  returnFile: { required: false },
  baseUrl: { required: false },
  attachments: { required: false, default: "attachments" },
});

const emit = defineEmits(["update:itemValue", "update:image", "uploading"]);

const preview = ref(null);
const uploadPercentage = ref(0);
const refFile = ref(null);
const dragOver = ref(false);
const inputField = useField(props.name);
let request = null;

const selectedFiles = ref([]);

function isFileSelected(file) {
  return selectedFiles.value.some(
    (selectedFile) => selectedFile.name === file.name
  );
}

function uploadFiles(files) {
  console.log("zokss", files);

  Array.from(files).forEach((file) => {
    if (!isFileSelected(file)) {
      selectedFiles.value.push({
        file,
        name: file.name,
        path: URL.createObjectURL(file),
        type: file.type,
      });
    }
  });
  console.log("zeyad", selectedFiles.value);

  emit("update:itemValue", selectedFiles.value);
  emit("update:image", selectedFiles.value);
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1);
  emit("update:itemValue", selectedFiles.value);
  emit("update:image", selectedFiles.value);
}

function closeFilePreview() {
  selectedFiles.value = [];
}
</script>

<style scoped>
.upload {
  @apply cursor-pointer bg-themeInputs hover:bg-[rgba(0,0,0,.5)] text-black size-[95px] flex items-center justify-center my-3 rounded-2xl;
}

.upload i {
  @apply text-3xl text-midGray;
}

.selected-file-preview {
  @apply absolute top-[-100%] left-0 w-full p-2.5 bg-softMainTheme rounded-[35px] flex items-center justify-between;
}

.selected-file-preview p {
  @apply  text-[22px] truncate;
}

.close-file-preview {
  @apply flex items-center justify-between;
}

.close-file-preview svg,
.close-file-preview i {
  @apply text-2xl text-midRed;
}
.custom-overlay {
  @apply absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-2xl transition-all duration-[400ms] ease-in-out;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  opacity: 0;
  transform: scale(0);
  transform-origin: center;
}
.file-preview:hover .custom-overlay {
  @apply opacity-100 scale-100;
}
.custom-overlay svg {
  @apply text-midRed text-2xl cursor-pointer;
}
</style>
