<template>
  <div class="teacher_modal_wrapper">
    <BaseModal
      :show="modalApperanceData"
      @controleModalApperance="controleModalApperance"
    >
      <template #modal>
        <div class="teacher_modal_wrapper">
          <div class="instructor_info_wrapper">
            <div class="instructor_info">
              <div class="card_wrapper">
                <div class="image_wrapper">
                  <img
                    :src="teacherData.image"
                    alt="Instructor Image"
                    class="rounded-full"
                    width="80"
                    height="80"
                  />
                </div>

                <div class="name_and_count">
                  <h3 class="name">
                    {{ teacherData.fullname }}
                  </h3>
                </div>
              </div>

              <div class="card_wrapper">
                <NuxtLink
                  :to="localePath(`/chat?chatId=${teacherData.id}`)"
                  class="chat_route"
                >
                  <IconsChat class="size-7" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="about_instructor">
            <h3 class="about_instructor_title">
              {{ $t("TITLES.phone_teacher") }}
            </h3>
            <div class="text_wrapper">
              <a :href="'tel:' + teacherData.phone" target="_blank">
                {{ teacherData.phone }}
              </a>
            </div>
          </div>

          <div class="about_instructor">
            <h3 class="about_instructor_title">
              {{ $t("TITLES.about_teacher") }}
            </h3>
            <div class="text_wrapper">
              {{ teacherData.desc }}
            </div>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
const localePath = useLocalePath();

const props = defineProps({
  teacherData: Object,
  modalApperanceData: Boolean,
});
const emit = defineEmits(["controleModalApperance"]);

const controleModalApperance = () => {
  emit("controleModalApperance");
};
</script>

<style scoped>
.teacher_modal_wrapper {
  @apply w-full;
  .instructor_info_wrapper {
    @apply w-full my-2 p-2.5 border-2 border-secondaryTheme rounded-[10px];
    .instructor_info {
      @apply flex items-center justify-between;
      .card_wrapper {
        @apply flex items-center justify-center gap-2;
        .image_wrapper {
          img {
            @apply rounded-full object-cover;
          }
        }
        .name {
          @apply text-themeText text-[22px] md:text-[1.75rem] font-medium mb-1;
        }
        .chat_route {
          @apply size-11 flex items-center justify-center bg-secondaryTheme text-mainTheme rounded-[10px];
        }
      }
    }
  }
  .about_instructor {
    @apply w-full p-2.5  my-2 border-2 border-secondaryTheme rounded-[10px];
    .about_instructor_title {
      @apply mb-2.5 text-themeText text-3xl font-bold;
    }
    .text_wrapper {
      @apply break-words text-[22px] text-lightGray leading-[1.1];
      a {
        @apply text-themeText;
      }
    }
  }
}
</style>
