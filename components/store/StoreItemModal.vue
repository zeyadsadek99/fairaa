<template>
  <div class="store-item-modal-wrapper">
    <BaseModal
      :show="modalApperanceData"
      @controleModalApperance="controleModalApperance"
    >
      <template #modal>
        <div class="selected-store-item-wrapper">
          <div class="image-wrapper">
            <img
              :src="selectedItem.product_image"
              alt="Store Item"
              class="object-cover rounded-lg size-44"
            />
            <span v-if="selectedItem.amount === 0" class="product-status">{{
              $t("STATUS.out_of_stock")
            }}</span>
          </div>

          <div class="name-wrapper">
            <h2 class="">
              {{ selectedItem.name }}
            </h2>
          </div>

          <div class="desc-wrapper">
            <p class="">{{ selectedItem.desc }}</p>
          </div>

          <div class="cart-btns-wrapper">
            <button
              class="increment"
              @click="incrementCartQuantity"
              :disabled="quantityInCart == selectedItem.amount"
            >
              <IconsPlus />
            </button>
            <span class="quantity-in-cart">{{ quantityInCart }}</span>
            <button
              class="decrement"
              @click="decrementCartQuantity"
              :disabled="quantityInCart === 0"
            >
              <IconsMinus />
            </button>
          </div>

          <div class="add-to-cart-and-wishlist-btns-wrapper">
            <button
              class="btn !w-full"
              @click="handleAddToCart"
              :disabled="quantityInCart === 0"
              aria-label="Add to cart"
            >
              {{ $t("BUTTONS.add_to_cart") }}
            </button>

            <button
              v-show="!selectedItem.is_fav"
              class="add-to-wishlist-btn"
              @click="favClick(selectedItem.id)"
              aria-label="Add to wishlist"
            >
              <IconsHeart class="size-8 text-lightRed cursor-pointer" />
            </button>
            <button
              v-show="selectedItem.is_fav"
              class="add-to-wishlist-btn"
              @click="favClick(selectedItem.id)"
              aria-label="Add to wishlist"
            >
              <IconsHeartFilled class="size-8 text-lightRed cursor-pointer" />
            </button>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { useStoreWishlist } from "@/stores/storeModule";
const axios = useNuxtApp().$axios;
const props = defineProps({
  modalApperanceData: Boolean,
  selectedItem: Object,
});
const selectedItemRef = toRef(props, "selectedItem");

const emit = defineEmits(["controleModalApperance", "getStudentFavorites"]);

const store = useStoreWishlist();
const quantityInCart = ref(0);

const controleModalApperance = () => {
  emit("controleModalApperance", null);
};

const incrementCartQuantity = () => {
  if (quantityInCart.value < props.selectedItem.amount) {
    quantityInCart.value++;
  }
};

const decrementCartQuantity = () => {
  if (quantityInCart.value > 0) {
    quantityInCart.value--;
  }
};

const handleAddToCart = async () => {
  try {
    await store.addToCart({
      id: props.selectedItem.id,
      count: quantityInCart.value,
    });
    controleModalApperance();
    quantityInCart.value = 0;
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

const favClick = async (id) => {
  if (!selectedItemRef.value) {
    console.error("❌ selectedItem is undefined!");
    return;
  }
  try {
    const theData = new FormData();
    theData.append("fav_type", "product");
    theData.append("id", id);

    const response = await axios.post("user/favourite", theData, {});

    selectedItemRef.value.is_fav = response.data.data.is_fav;
    store.getProducts();
  } catch (error) {
    console.error("❌ Error updating favorites:", error);
  }
};
</script>

<style scoped>
.selected-store-item-wrapper {
  @apply flex flex-col items-center justify-center gap-4 w-full;
  .image-wrapper {
    @apply relative transition-all duration-500;
    .product-status {
      @apply absolute top-2 left-2 bg-midRed text-white text-sm px-2 py-1 rounded-md;
    }
  }
  .name-wrapper {
    h2 {
      @apply text-[2rem] font-medium text-themeText;
    }
  }
  .desc-wrapper {
    @apply text-center text-lg text-midGray leading-relaxed;
    p {
      @apply text-[22px] text-lightGray;
    }
  }
  .cart-btns-wrapper {
    @apply flex items-center justify-between bg-secondaryTheme px-4 py-2 rounded-lg w-full;
    button {
      @apply flex justify-center items-center  rounded-full  size-[22px] border border-black transition  disabled:opacity-20;
    }
    .quantity-in-cart {
      @apply text-2xl font-medium;
    }
  }
  .add-to-cart-and-wishlist-btns-wrapper {
    @apply flex items-center gap-2 w-full;
    .add-to-wishlist-btn {
      @apply w-[15%] h-10 flex items-center justify-center bg-softRed  rounded-[10px] py-6  transition hover:bg-red-200;
    }
  }
}
</style>
