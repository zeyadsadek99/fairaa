// stores/chat.ts
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useChatStore = defineStore("chat", () => {
  const axios = useNuxtApp().$axios;
  const toast = useToast();

  // ✅ State
  const chatsList = ref(null);
  const singleChatData = ref(null);

  // ✅ Getters
  const getChatsListData = computed(() => chatsList.value);
  const getSingleChatData = computed(() => singleChatData.value);

  // ✅ Fetch Chats List
  const getChatsList = async () => {
    try {
      const { data } = await axios.get("chats");
      chatsList.value = data.data;
    } catch (error) {
      toast.error("Failed to load chats.");
    }
  };

  // ✅ Fetch Single Chat Content
  const getChatContent = async (chatId: number) => {
    try {
      const { data } = await axios.get(`chats/${chatId}`);
      singleChatData.value = data;
    } catch (error) {
      toast.error("Failed to load chat content.");
    }
  };

  // ✅ Send Chat Message
  const sendMessage = async (payload: {
    messageDetails: object;
    id: number;
  }) => {
    try {
      await axios.post("chats", payload.messageDetails);

      // ✅ Refresh Chat List & Content
      await getChatsList();
      await getChatContent(payload.id);

      toast.success("Message sent successfully!");
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "Failed to send message.";
      toast.error(errorMessage);
    }
  };

  return {
    chatsList,
    singleChatData,
    getChatsListData,
    getSingleChatData,
    getChatsList,
    getChatContent,
    sendMessage,
  };
});
