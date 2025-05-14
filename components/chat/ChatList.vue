<template>
  <div
    class="chats-list-wrapper"
    :class="chatsListData?.length === 0 ? 'justify-center' : 'justify-start'"
  >
    <MessagesCourseEmpty
      v-if="chatsListData?.length === 0"
      :imageSrc="image1"
      :message="$t('TITLES.empty_chats')"
    />

    <template v-else>
      <div v-for="chat in chatsListData" :key="chat.id">
        <LoadersSkeleton v-if="isLoading" />
        <!-- {{ chat?.user_data?.id }} -->

        <button
          class="w-full chat-route"
          :class="
            activeChatId === chat?.user_data?.id ||
            activeChatId === route.query.chatId
              ? 'bg-secondaryTheme'
              : ''
          "
          @click="selectChat(chat?.user_data?.id)"
        >
          <div class="avatar-wrapper">
            <img :src="chat?.user_data?.image" class="avatar-img" />
          </div>

          <div class="message-details">
            <h3 class="name-and-date">
              <span class="name">{{ chat?.user_data?.fullname }}</span>
              <span class="date">{{ chat?.ago_time }}</span>
            </h3>

            <div class="last-message">{{ chat?.last_message }}</div>
          </div>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useChatStore } from "@/stores/chat";
import image1 from "/assets/media/empty_messages/select_message.png";
const route = useRoute();
const router = useRouter();
const activeChatId = ref(route.query.chatId || null);
const emits = defineEmits(["onSelectChat"]);
const isLoading = ref(true);
const chatsListData = computed(() => chatStore.getChatsListData);
const chatStore = useChatStore();
const selectChat = (chatId) => {
  router.push({ path: "", query: { chatId: chatId } });
  activeChatId.value = chatId;
  emits("onSelectChat", chatId);
};

watch(
  () => route.query.chatId,
  (newChatId) => {
    if (newChatId) {
      activeChatId.value = newChatId;
    } else {
      activeChatId.value = null;
    }
  }
);

onMounted(async () => {
  await chatStore.getChatsList();
  isLoading.value = false;
});
</script>

<style scoped>
.chats-list-wrapper {
  @apply min-h-[80vh]  max-h-[80vh] overflow-y-scroll mt-4 flex flex-col   px-4 border-e-1 border-secondaryTheme;
  &::-webkit-scrollbar {
    @apply w-0;
  }
  .chat-route {
    @apply flex items-center gap-3 p-3 my-3.5 rounded-2xl transition-all duration-[400ms];
    &:hover {
      @apply bg-secondaryTheme;
    }
    .avatar-wrapper {
      .avatar-img {
        @apply size-20 object-cover rounded-full;
      }
    }
    .message-details {
      @apply flex flex-col justify-center w-full whitespace-nowrap overflow-hidden text-ellipsis;
      .name-and-date {
        @apply flex items-center justify-between mb-1 gap-4 w-full  flex-wrap;
        .name {
          @apply text-themeText text-2xl font-semibold;
        }
        .date {
          @apply text-lightGray text-xl;
        }
      }
      .last-message {
        @apply text-lightGray  text-2xl whitespace-nowrap overflow-hidden text-ellipsis;
      }
    }
  }
}
</style>
