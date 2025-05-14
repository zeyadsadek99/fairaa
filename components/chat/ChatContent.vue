<template>
  <div class="chat-content-wrapper">
    <MessagesCourseEmpty
      v-if="!props.chatId"
      :imageSrc="image1"
      :message="$t('TITLES.select_chat')"
    />
    <template v-else>
      <div class="messages-box">
        <p class="start-of-chat">{{ t("TITLES.start_of_the_chat") }}</p>

        <LoadersSkeleton v-if="isLoading" />

        <div
          v-else
          v-for="message in [...singleChatData.data].reverse()"
          :key="message.id"
          class="message-wrapper"
          :class="
            message.message_position === 'current' ? 'sender' : 'receiver'
          "
        >
          <p
            class="text-message-content"
            v-if="message.message_type === 'text'"
          >
            {{ message.message }}
          </p>

          <div
            class="image-message-content"
            v-else-if="message.message_type === 'image'"
          >
            <img
              :src="message.message"
              alt="Image Message"
              class="rounded-md shadow-md"
            />
          </div>

          <div class="file-message-content" v-else>
            <a
              :href="message.message"
              target="_blank"
              class="flex items-center gap-2"
            >
              <IconsFile class="text-lg text-mainTheme" />
              <span>{{ message.message.substring(0, 25) + "..." }}</span>
            </a>
          </div>
        </div>
      </div>

      <form @submit.prevent="sendChatMessage" class="chat-input-wrapper">
        <transition mode="fadeIn">
          <div class="selected-file-preview" v-if="filePreviewIsOpen">
            <p>{{ selectedMediaFile.name }}</p>
            <button
              type="button"
              class="close-file-preview"
              @click.stop="closeFilePreview"
            >
              <IconsClose />
            </button>
          </div>
        </transition>

        <div class="input-wrapper">
          <input
            type="text"
            class="form-control"
            :placeholder="t('PLACEHOLDERS.write_here')"
            v-model.trim="textMessageContent"
            :disabled="selectedMediaFile.file"
          />

          <div class="media-buttons-wrapper">
            <div class="wrapper">
              <label for="select-media">
                <IconsPaperClip class="size-8 text-lightGray" />
              </label>
              <input
                id="select-media"
                type="file"
                accept=".jpg, .jpeg, .png, .doc, .docx, .pdf, .txt"
                @change="selectMediaFile"
              />
            </div>

            <div class="chat-emoji">
              <button
                type="button"
                class="select-emoji"
                @click="toggleEmojiPicker"
              >
                <IconsSmile class="size-8 text-lightGray" />
              </button>
              <div class="emojis" v-if="isEmojiPickerOpen">
                <EmojiPicker :native="true" @select="onSelectEmoji" />
              </div>
            </div>
          </div>
        </div>

        <div class="send-btn">
          <button type="submit" class="btn1">
            <IconsSend class="size-8" />
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import image1 from "/assets/media/empty_messages/select_message.png";

// import { io } from "socket.io-client";

import { useChatStore } from "@/stores/chat";
import { useAuthenticationStore } from "~/stores/authentication";
// const {
//   public: { baseGeneralURL },
// } = useRuntimeConfig();

// const socket = io(baseGeneralURL);

// function setConnection() {
//   socket.off(`un-read-messages:${props.chatId}`);

//   socket.on(`un-read-messages:${props.chatId}`, (value) => {
//     messages.push(value)
//   });
// }

const { t } = useI18n();
const route = useRoute();
const chatStore = useChatStore();
const authStore = useAuthenticationStore();
const { token } = storeToRefs(authStore);
const isLoading = ref(true);
const isEmojiPickerOpen = ref(false);
const props = defineProps({
  chatId: Number,
});
const senderId = computed(() => useCookie("dataToVerfiy").value);
const singleChatData = computed(() => chatStore.getSingleChatData);
console.log("singleChatData", singleChatData.value);
const SearchActive = ref(false);
const chatData = computed(() => chatStore.getChatContent(props.chatId));
const searchEmoji = ref("");
const properties = ref(false);
const filePreviewIsOpen = ref(false);
const textMessageContent = ref("");
const chat_id = ref("");
const userIdLogin = ref("");
const selectedMediaFile = ref({
  file: null,
  name: null,
  path: null,
  type: null,
});
const toggleEmojiPicker = () => {
  isEmojiPickerOpen.value = !isEmojiPickerOpen.value;
};
const toggleClassActive = () => {
  SearchActive.value = !SearchActive.value;
};

const append = (emoji) => {
  textMessageContent.value += emoji;
};

const showProperties = () => {
  properties.value = !properties.value;
};
const closeFilePreview = () => {
  filePreviewIsOpen.value = false;
  selectedMediaFile.value = { file: null, name: null, path: null, type: null };
};

const selectMediaFile = (e) => {
  const file = e.target.files[0];
  selectedMediaFile.value = {
    file,
    name: file.name,
    path: URL.createObjectURL(file),
    type: file.type,
  };
  filePreviewIsOpen.value = true;
};

const sendChatMessage = async () => {
  const messageDetails = new FormData();
  messageDetails.append("sender_id", senderId.value.id);
  messageDetails.append("receiver_id", props.chatId);

  if (textMessageContent.value && !selectedMediaFile.value.file) {
    messageDetails.append("message_type", "text");
    messageDetails.append("message", textMessageContent.value);
    textMessageContent.value = "";
  } else if (!textMessageContent.value && selectedMediaFile.value.file) {
    const mediaType = selectedMediaFile.value.type.split("/")[0];

    messageDetails.append("message_type", mediaType);
    messageDetails.append("message", selectedMediaFile.value.file);

    closeFilePreview();
  }

  await chatStore.sendMessage({ messageDetails, id: props.chatId });
  textMessageContent.value = "";
  closeFilePreview();
};
// const runSocketOnVuex = (id) => {
//   chatStore.getChatContent(id);
//   setTimeout(() => {
//     receiveMessage();
//   }, 1000);
// };
// const receiveMessage = () => {
//   if (token.value) {
//     window.io = require("socket.io-client");
//     window.Echo = new Echo({
//       broadcaster: "socket.io",
//       host: "https://moaalem.khlod.aait-d.com:6045",
//       csrfToken: "Bearer " + token.value,
//       auth: {
//         headers: {
//           Authorization: "Bearer " + token.value,
//           Accept: "application/json",
//         },
//       },
//     });

//     window.Echo.private(
//       `mo3alem-mosa3ed-chat.${chatStore.singleChatData?.conversation_id}`
//     ).listen(".ChatEvent", (payload) => {
//       if (payload) {
//         chatStore.getChatsList();
//         chatStore.getChatContent(chatStore.receiverId);
//       }
//     });
//   }
// };

// runSocketOnVuex(route.params.id);

onMounted(async () => {
  if (props?.chatId) {
    await chatStore.getChatContent(props.chatId);
  }

  isLoading.value = false;
});
</script>

<style scoped>
.chat-content-wrapper {
  @apply relative min-h-[80vh] max-h-[80vh] overflow-y-auto;
  &::-webkit-scrollbar {
    @apply w-0;
  }
  .messages-box {
    @apply min-h-[68vh] max-h-[68vh] overflow-y-auto;
    &::-webkit-scrollbar {
      @apply w-0;
    }
    .start-of-chat {
      @apply my-2 text-center text-2xl font-medium text-lightGray;
    }
    .message-wrapper {
      @apply py-2 w-full;
      .text-message-content {
        @apply max-w-[70%] relative  py-3 px-6 text-[22px] font-medium rounded-[30px];
        &::after {
          content: "";
          @apply absolute block w-[25px] h-[15px] bg-no-repeat bg-center bg-contain;
        }
      }
      .file-message-content {
        @apply max-w-[70%] relative  py-3 px-6 text-[22px] font-medium rounded-[30px];
        &::after {
          content: "";
          @apply absolute block w-[25px] h-[15px] bg-no-repeat bg-center bg-contain;
        }
        a {
          @apply flex items-center justify-center flex-col;
          svg {
            @apply text-mainTheme text-[40px];
          }
          span {
            @apply text-themeText text-2xl;
          }
        }
      }

      .image-message-content {
        @apply max-w-[30%];
        img {
          @apply w-full h-full object-cover rounded-2xl;
        }
      }
    }
    .sender {
      @apply flex items-center justify-start;
      .text-message-content,
      .file-message-content {
        @apply text-themeText bg-secondaryTheme;
        &::after {
          content: "";
          @apply bottom-[-7px] right-[10px] left-auto bg-[url('../media/shapes/secondary_clr_message_notch.svg')];
        }
      }
    }

    .receiver {
      @apply flex items-center justify-end;
      .text-message-content,
      .file-message-content {
        @apply text-white bg-mainTheme;
        &::after {
          content: "";
          @apply bottom-[-7px] left-[10px] right-auto bg-[url('../media/shapes/main_clr_message_notch.svg')];
        }
      }
    }
  }
  .chat-input-wrapper {
    @apply absolute bottom-[15px] mt-[15px] w-full flex items-center justify-between gap-2.5;
    .selected-file-preview {
      @apply absolute top-[-100%] left-0 w-full p-2.5 bg-softMainTheme rounded-[35px] flex items-center justify-between;
      p {
        @apply text-[22px] truncate;
      }
      .close-file-preview {
        @apply flex items-center justify-between;
        .close-file-preview svg {
          @apply text-2xl text-midRed;
        }
      }
    }
    .input-wrapper {
      @apply w-full bg-secondaryTheme rounded-[30px] flex items-center justify-between;
      input {
        @apply bg-transparent border-0 p-3 px-5 w-full text-[22px] text-themeText focus:outline-none;
      }
      .media-buttons-wrapper {
        @apply mt-[6px] flex items-center justify-center gap-4 mx-5;

        .wrapper {
          @apply cursor-pointer mb-2;
          input[type="file"] {
            @apply hidden;
          }
        }
        .chat-emoji {
          @apply relative w-full;
          .emojis {
            @apply absolute left-0 z-10 -top-80;
          }
        }
      }
    }
    .send-btn {
      @apply w-[8%];
      .btn1 {
        @apply relative size-[55px] text-white flex items-center justify-center
            rounded-[10px]  
            
           transition-all !duration-[600ms] ease-in-out;
        background-image: linear-gradient(
          45deg,
          transparent 50%,
          var(--main_theme_clr) 50%
        );
        background-position: 100%;
        background-size: 400%;
        border: 1px solid var(--main_theme_clr);
        &:hover {
          @apply bg-[0px] text-mainTheme;
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .chat-content-wrapper {
    @apply min-h-[90vh] max-h-[90vh];
  }

  .messages-box {
    @apply min-h-[75vh] max-h-[75vh];
  }

  .messages-box .message-wrapper .text-message-content {
    @apply w-full;
  }

  .messages-box .message-wrapper .image-message-content {
    @apply max-w-[60%];
  }

  .chat-input-wrapper {
    @apply bottom-[15px];
  }

  .input-wrapper {
    @apply w-full bg-secondaryTheme rounded-[30px] flex items-center justify-between;
  }

  .input-wrapper input {
    @apply bg-transparent border-0 p-3 px-5 text-[22px] text-themeText;
  }

  .media-buttons-wrapper {
    @apply mt-[6px] flex items-center justify-center  mx-5;
  }

  .media-buttons-wrapper .select-media svg,
  .media-buttons-wrapper .select-media i,
  .media-buttons-wrapper .select-emoji svg,
  .media-buttons-wrapper .select-emoji i {
    @apply text-2xl text-lightGray;
  }

  .media-buttons-wrapper .wrapper label {
    @apply cursor-pointer;
  }

  .media-buttons-wrapper .wrapper label svg,
  .media-buttons-wrapper .wrapper label i {
    @apply text-2xl text-lightGray;
  }

  .send-btn {
    @apply w-[20%];
  }
}
</style>
