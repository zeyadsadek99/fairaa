<template>
  <VeeField type="file" :name="name" v-slot="{ meta, field }">
    <div
      class="input_wrapper text-center"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <label :for="id" class="label text-center text-2xl" v-if="label">
        {{ label }}
      </label>

      <!-- Clickable Upload Area -->
      <div
        class="upload cursor-pointer bg-[rgba(0,0,0,.1)] hover:bg-[rgba(0,0,0,.5)] text-white size-[160px] flex items-center justify-center my-3 rounded-2xl"
        @click="triggerFileInput"
        @dragover.prevent="dragOver = true"
        @dragleave="dragOver = false"
      >
        <!-- Hidden File Input -->
        <input
          ref="refFile"
          type="file"
          :id="id"
          class="hidden"
          @change="uploadFile($event.target.files[0])"
          :accept="accept"
          :multiple="multiple ? true : false"
        />
        <input type="text" class="hidden" :name="name" v-bind="field" />

        <!-- Image Preview or Placeholder -->
        <label
          :for="id"
          class="text-xl text-center rounded-lg flex flex-col justify-center items-center gap-3 cursor-pointer"
        >
          <img
            v-if="preview"
            class="mx-auto w-[160px] h-[160px] object-cover"
            :src="accept === 'application/pdf' ? image1 : preview"
            alt="Uploaded Image"
          />
          <template v-else>
            <div
              v-if="
                accept ===
                '.txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              "
              class="w-40 h-40 flex justify-center items-center text-[45px]"
            >
              <IconsPlus />
            </div>
            <div
              v-else-if="accept === 'application/pdf'"
              class="w-40 h-40 flex justify-center items-center text-[45px]"
            >
              <IconsFile class="size-14" />
            </div>

            <div class="" v-else-if="accept.includes('image')">
              <img
                class="w-40 h-40 object-cover rounded-lg opacity-50 hover:opacity-75"
                src="/assets/media/images/upload_image.png"
                alt="Upload Placeholder"
              />
              <!-- <i class="fa-solid fa-camera"></i> -->
            </div>
            <div
              class="w-40 h-40 flex justify-center items-center text-[45px]"
              v-else
            >
              <IconsVideo class="size-14" />
            </div>
          </template>
        </label>
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
import axios from "axios";
import { useField } from "vee-validate";
import { toast } from "vue3-toastify";
import image1 from "@/assets/media/pdf.png";
const props = defineProps({
  accept: { required: false },
  no_preview: { required: false, default: false },
  itemValue: { required: false },
  image: { required: true },
  id: { required: true },
  name: { required: true },
  label: { required: false },
  modalName: { required: true },
  modalType: { required: true },
  multiple: { type: Boolean },
  returnFile: { required: false },
  baseUrl: { required: false },
  attachment: { required: false, default: "attachments" },
});

const emit = defineEmits(["update:itemValue", "update:image", "uploading"]);

const preview = ref(null);
const uploadPercentage = ref(0);
const refFile = ref(null);
const dragOver = ref(false);
const inputField = useField(props.name);
let request = null;

// Upload File
function uploadFile(file) {
  uploadPercentage.value = 0;

  // If returnFile is true, just store it locally
  if (props.returnFile) {
    preview.value = URL.createObjectURL(file);
    uploadPercentage.value = 100;
    emit("update:itemValue", preview.value);
    emit("update:image", file);
    inputField.setValue(file);
  } else {
    request = axios.CancelToken.source();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", props.modalName.trim());
    formData.append("attachment_type", props.modalType);
    emit("uploading", true);

    axios({
      url: props.attachment,
      method: "POST",
      data: formData,
      baseURL: props.baseUrl
        ? props.baseUrl
        : import.meta.env.VITE_GENERAL_URL + "/general",
      onUploadProgress: (event) => {
        uploadPercentage.value = Math.round((event.loaded / event.total) * 100);
      },
      cancelToken: request.token,
    }).then((res) => {
      preview.value = URL.createObjectURL(file);
      emit("update:itemValue", preview.value);
      emit("update:image", res.data.data);
      emit("uploading", false);
      inputField.setValue(res.data.data);
    });
    // .catch((err) => {
    //   emit("uploading", false);
    //   toast.error(err.response?.data.message || "Upload Failed");
    //   cancelUpload();
    // });
  }
}

// Cancel Upload
function cancelUpload() {
  if (request) request.cancel();
  uploadPercentage.value = 0;
  preview.value = null;
  emit("update:itemValue", "");
  emit("update:image", "");
  refFile.value.value = null;
  inputField.setValue("");
}

// Watch for updates
watch(
  () => props.itemValue,
  (newVal) => {
    if (newVal) {
      preview.value = props.itemValue;
    }
  },
  { deep: true }
);

// Set initial value
onMounted(() => {
  if (props.itemValue) {
    preview.value = props.itemValue;
  }
});
</script>

<style lang="scss">
.input_wrapper {
  &.upload_image {
    margin-bottom: 1.5rem;
    input {
      display: none;
    }
    label {
      cursor: pointer;
      max-width: 300px;
      margin-inline: auto;
      img {
        height: 200px;
        object-fit: cover;
        width: 100%;
        border-radius: 1rem;
      }
    }
  }
  .upload {
    > div {
      @apply hidden;
    }
    &.uploading {
      input {
        @apply hidden;
      }
      > div {
        @apply flex;
      }
    }
  }
}
</style>
