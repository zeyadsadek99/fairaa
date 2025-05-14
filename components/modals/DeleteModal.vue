<template>
    <div class="delete-modal-wrapper">
      <BaseModal :show="modalApperanceData" @controleModalApperance="controleModalApperance">
        <template #modal>
          <div class="delete-card">
            <div class="icon">
              <IconsClose/>
            </div>
  
            <h2 class="modal-title">{{ $t("MESSAGES.delete_item") }}</h2>
  
            <div class="btns-wrapper">
              <button class="delete-btn" @click="deleteCourse">
                {{ $t("BUTTONS.delete") }}
              </button>
  
              <button class="close-btn" @click="controleModalApperance">
                {{ $t("BUTTONS.close") }}
              </button>
            </div>
          </div>
        </template>
      </BaseModal>
    </div>
  </template>
  
  <script setup>
  import { useRoute, useRouter } from "vue-router";
  import BaseModal from "../ui/BaseModal.vue";
  
  const props = defineProps({
    modalApperanceData: Boolean,
    targetElement: String,
    selectedLesson: Object,
  });
  
  const emit = defineEmits(["controleModalApperance", "getDetailsAfterDelete"]);
  
  const lessonId = ref(null);
  const route = useRoute();
  const router = useRouter();
  
  watch(
    () => props.modalApperanceData,
    (newVal) => {
      if (newVal) {
        lessonId.value = props.selectedLesson?.id || null;
      }
    }
  );
  
  const controleModalApperance = () => {
    emit("controleModalApperance");
  };
  
  const getDetailsAfterDelete = () => {
    emit("getDetailsAfterDelete");
  };
  
  const deleteCourse = async () => {
    const token = localStorage.getItem("elmo3lm_elmosa3d_user_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Accept-language": localStorage.getItem("elmo3lm_elmosa3d_app_lang"),
      "cache-control": "no-cache",
      Accept: "application/json",
    };
  
    try {
      if (props.targetElement === "lesson") {
        await $fetch(`teacher/subject/listen/${lessonId.value}`, {
          method: "DELETE",
          headers,
        });
      } else {
        await $fetch(`teacher/subject/delete/${route.params.id}`, {
          method: "DELETE",
          headers,
        });
        router.replace("/added-subjects");
      }
  
      controleModalApperance();
      getDetailsAfterDelete();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  </script>
  
  <style scoped>
  /* ✅ Modal Wrapper */
  .delete-modal-wrapper {
    @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-50;
  }
  
  /* ✅ Modal Card */
  .delete-card {
    @apply w-full max-w-lg bg-white p-6 rounded-lg shadow-lg text-center;
  }
  
  /* ✅ Icon */
  .icon {
    @apply w-24 h-24 flex items-center justify-center rounded-full bg-red-500 mx-auto mb-6;
  }
  
  .icon i {
    @apply text-white text-5xl;
  }
  
  /* ✅ Modal Title */
  .modal-title {
    @apply text-2xl font-bold text-themeText mb-4;
  }
  
  /* ✅ Buttons Wrapper */
  .btns-wrapper {
    @apply flex justify-between mt-6;
  }
  
  /* ✅ Delete Button */
  .delete-btn {
    @apply w-32 py-2 text-lg text-white bg-red-500 rounded-lg font-semibold transition-all hover:bg-red-600;
  }
  
  /* ✅ Close Button */
  .close-btn {
    @apply w-32 py-2 text-lg text-gray-700 bg-gray-200 rounded-lg font-semibold transition-all hover:bg-gray-300;
  }
  </style>
  