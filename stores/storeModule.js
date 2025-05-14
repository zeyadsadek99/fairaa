import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

export const useStoreWishlist = defineStore("storeWishlist", () => {
  const { t } = useI18n();
  const axios = useNuxtApp().$axios;
  const toast = useToast();

  const storeItems = ref([]);
  const lastPage = ref(null);
  const shoppingCartItems = ref([]);
  const showCash = ref(false);
  const favorites = ref({
    registeredSubjects: [],
    onlineSubjects: [],
    teacherSubjects: [],
    products: [],
  });

  const getStoreItems = computed(() => ({
    setStoreItems: storeItems.value,
    lastPage: lastPage.value,
  }));

  const getShoppingCartItems = computed(() => shoppingCartItems.value);
  const getWishlistItems = computed(() => favorites.value);
  const getShowCash = computed(() => showCash.value);


  const getCart = async () => {
    try {
      const response = await axios.get("user/cart");

      shoppingCartItems.value = response.data;
    } catch (error) {
      toast.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (payload) => {
    try {
      const theData = new FormData();
      theData.append("product_id", payload.id);
      theData.append("count", payload.count.toString());

      await axios.post("user/cart", theData);
      await getCart(); 

      toast.success(t("MESSAGES.added_to_cart"), { timeout: 2000 });
    } catch (error) {
      toast.error(error.response?.data?.message || t("VALIDATION.error"), {
        timeout: 2000,
      });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`user/cart/${productId}`);
      await getCart(); 

      toast.success(t("MESSAGES.deleted_successfully"), { timeout: 2000 });
    } catch (error) {
      toast.error(error.response?.data?.message || t("VALIDATION.error"), {
        timeout: 2000,
      });
    }
  };

  const getProducts = async (page) => {
    try {
      const response = await axios.get(`user/product?page=${page}`);
      storeItems.value = response.data.data;
      lastPage.value = response.data.meta.last_page;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return {
    storeItems,
    lastPage,
    shoppingCartItems,
    showCash,
    favorites,
    getStoreItems,
    getShoppingCartItems,
    getWishlistItems,
    getShowCash,
    getCart,
    addToCart,
    removeFromCart,
    getProducts,
  };
});
