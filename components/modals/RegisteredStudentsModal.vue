<template>
  <div class="all-registered-students-wrapper">
    <BaseModal
      :show="modalApperanceData"
      @controleModalApperance="controleModalApperance"
    >
      <template #modal>
        <div class="registered-students-wrapper">
          <h3 class="title">
            <p>
              {{ $t("TITLES.registered_students") }}
              <span class="students-count">
                ({{ students.length }} {{ $t("TITLES.student") }})
              </span>
            </p>
          </h3>

          <div class="students-cards-wrapper">
            <div class="container mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="student in students"
                  :key="student.id"
                  class="student-card my-3 flex items-center p-4 bg-white rounded-lg shadow-md"
                >
                  <div class="image-wrapper mr-4">
                    <img
                      :src="student.user.image"
                      :alt="student.user.fullname"
                      class="size-16 rounded-full"
                    />
                  </div>

                  <h3 class="name text-lg font-semibold">
                    {{ student.user.fullname }}
                  </h3>

                  <NuxtLink
                    :to="localePath(`/chat?chatId=${student.user.id}`)"
                    class="chat-route ml-auto text-blue-500 hover:text-blue-700"
                  >
                    <IconsChat />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
const localePath = useLocalePath();

defineProps({
  modalApperanceData: Boolean,
  students: Array,
});

defineEmits(["controleModalApperance"]);

const controleModalApperance = () => {
  emit("controleModalApperance");
};
</script>

<style scoped>
.all-registered-students-wrapper {
  @apply bg-gray-50;
  .registered-students-wrapper {
    @apply p-4;
    .title {
      @apply text-2xl font-semibold mb-2 text-darkGray;
      .students-count {
        @apply text-sm text-midGray;
      }
    }
    .students-cards-wrapper {
      @apply mt-4;
      .student-card {
        @apply flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg;
        .image-wrapper {
          @apply mr-4;
        }
        h3 {
          @apply text-lg font-semibold;
        }
        .chat-route {
          @apply ml-auto text-midBlue hover:text-blue-700;
        }
      }
    }
  }
}
</style>
