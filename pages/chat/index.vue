<template :key="$route.path">
  <div class="chats-wrapper">
    <GlobalBreadCrumbs>
      <template v-slot:page_title> {{ $t("TITLES.messages") }} </template>
      <template v-slot:breadcrumb_current_page>
        {{ $t("TITLES.messages") }}
      </template>
    </GlobalBreadCrumbs>

    <div class="chats-content-wrapper bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div id="chats_list" class="md:col-span-1">
            <ChatList @onSelectChat="onSelectChat($event)" />
          </div>

          <div
            v-if="!selectedChatId"
            class="md:col-span-2 flex justify-center items-center"
          >
            <MessagesCourseEmpty
              :imageSrc="image1"
              :message="$t('TITLES.select_chat')"
            />
          </div>

          <div
            id="chat_content"
            v-else-if="selectedChatId"
            class="md:col-span-2"
          >
            <ChatContent :chatId="selectedChatId" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import image1 from "/assets/media/empty_messages/select_message.png";

const route = useRoute();
const selectedChatId = ref(route.query.chatId || null);

const onSelectChat = (id) => {
  selectedChatId.value = id;
};

const currentRoute = ref(route.path);
watch(
  () => route.path,
  (newRoute) => {
    currentRoute.value = newRoute;
  }
);

watch(
  () => route.query.chatId,
  (newChatId) => {
    if (newChatId) {
      selectedChatId.value = newChatId;
    } else {
      selectedChatId.value = null;
    }
  }
);
</script>

<style scoped></style>
