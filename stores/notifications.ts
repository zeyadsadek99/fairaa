import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import axios from "axios";

export const useNotificationsStore = defineStore("notifications", () => {
  // ✅ Reactive state
  const notifications = ref([]);
  const unreadNotifications = ref(0);
  const config = useRuntimeConfig();

  // ✅ Nuxt app & utilities
  const axios = useNuxtApp().$axios;
  const toast = useToast();
  const { t } = useI18n();

  async function getNotifications() {
    try {
      // console.log(" data:");

      const { data } = await axios.get("notifications");
      // console.log("Notifications data:");
      notifications.value = data.data.notifications;
      unreadNotifications.value = data.data.unreadnotifications_count;
    } catch (error) {
      toast.error("Failed to fetch notifications.");
    }
  }

  // ✅ Delete Notification
  async function deleteNotification(notificationId: string) {
    try {
      await axios.delete(`notifications/${notificationId}`);

      toast.success(t("MESSAGES.deleted_successfully"));
      await getNotifications(); // Refresh list after deletion
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        t("MESSAGES.delete_error") ||
        "Failed to delete notification.";
      toast.error(errorMessage);
    }
  }

  return {
    notifications,
    unreadNotifications,
    getNotifications,
    deleteNotification,
  };
});
