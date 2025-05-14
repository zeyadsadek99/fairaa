<template>
  <div class="shopping-cart-wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.cart") }}</template>
      <template #breadcrumb_current_page>{{ $t("TITLES.cart") }}</template>
    </GlobalBreadCrumbs>

    <Loader1 v-if="isLoading" />

    <div v-else class="fadeIn">
      <MessagesCourseEmpty
        v-if="cartItems?.data?.length === 0"
        :imageSrc="image1"
        :message="$t('TITLES.empty_cart')"
      />

      <div v-else>
        <div class="py-9">
          <div class="px-3 container">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                v-for="item in cartItems?.data"
                :key="item.id"
                class="p-3 border border-secondaryTheme rounded-[10px] flex justify-between items-center"
              >
                <div class="flex gap-4 items-center">
                  <div class="w-[130px] h-[120px]">
                    <img
                      :src="item?.product?.product_image"
                      :alt="item?.product?.name"
                      class="w-full h-full object-cover rounded-[10px]"
                    />
                  </div>
                  <div class="w-full block relative">
                    <div class="flex gap-7 items-center text-[1.6rem]">
                      <span class="font-medium text-themeText">
                        {{ item.product.name }}
                      </span>
                      <span class="text-mainTheme font-medium"
                        >{{ item.count }} X</span
                      >
                    </div>
                    <p class="text-mainTheme font-medium text-[1.75rem]">
                      {{ item.total }} {{ item.product.currency }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center justify-center w-[15%]">
                  <button
                    @click="removeFromCart(item.id)"
                    class="size-12 rounded-full bg-secondaryTheme flex items-center justify-center transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-[360deg]"
                  >
                    <IconsTrash class="text-lightRed size-8" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="py-9">
          <div class="px-3 container">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex justify-between font-medium items-center">
                  <span
                    class="relative text-themeText text-xl after:absolute after:w-48 after:border-b after:border-dashed after:border-secondaryTheme after:bottom-1 after:right-full after:mr-4"
                  >
                    {{ $t("TITLES.products_total") }}
                  </span>
                  <span class="text-themeText text-3xl">
                    {{ cartItems?.price?.main_total }} {{ t("TITLES.egp") }}
                  </span>
                </div>

                <div class="flex justify-between font-medium items-center">
                  <span
                    class="relative text-xl text-themeText after:absolute after:w-48 after:border-b after:border-dashed after:border-secondaryTheme after:bottom-1 after:right-full after:mr-4"
                  >
                    {{ $t("TITLES.added_tax") }}
                  </span>
                  <span class="text-themeText text-3xl">
                    {{ cartItems?.price?.vat_value }} %
                  </span>
                </div>

                <div class="flex justify-between items-center">
                  <span
                    class="relative text-themeText font-medium text-xl after:absolute after:w-48 after:border-b after:border-dashed after:border-secondaryTheme after:bottom-1 after:right-full after:mr-4"
                  >
                    {{ $t("TITLES.total") }}
                  </span>
                  <span class="text-themeText font-bold text-4xl">
                    {{ cartItems?.price?.total_with_vat }} {{ t("TITLES.egp") }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center my-4">
          <NuxtLink :to="localePath('/cart/checkout')" class="btn">
            {{ $t("BUTTONS.next") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStoreWishlist } from "@/stores/storeModule";
import { useI18n } from "vue-i18n";
import image1 from "/assets/media/empty_messages/empty_cart.png";
const localePath = useLocalePath();

const { t } = useI18n();
const store = useStoreWishlist();
const cartItems = storeToRefs(store).shoppingCartItems;

const { getCart, removeFromCart } = store;

const isLoading = ref(true);

onMounted(async () => {
  await getCart();
  isLoading.value = false;
});
</script>

<style scoped></style>
