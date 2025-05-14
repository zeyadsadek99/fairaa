<template>
  <div class="store-wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>{{ $t("TITLES.store") }}</template>
      <template #breadcrumb_current_page>{{ $t("TITLES.store") }}</template>
    </GlobalBreadCrumbs>

    <Loader1 v-if="isLoading" />

    <div v-else class="store_items_wrapper fadeIn">
      <div class="container mx-auto">
        <MessagesCourseEmpty
          v-if="storeItems.length === 0"
          :imageSrc="image1"
          :message="$t('TITLES.empty_products')"
        />
        <div v-else class="store_items">
          <div
            v-for="item in storeItems"
            :key="item.id"
            class="flex justify-center"
          >
            <button @click="toggleStoreItemModal(item)" class="">
              <div class="store_item_card">
                <div class="item_image_wrapper">
                  <img
                    :src="item?.product_image"
                    alt="Store Item"
                    class="w-full h-full object-contain rounded-[10px]"
                  />
                </div>

                <div class="item_name">
                  <h3>{{ item.name }}</h3>
                </div>

                <div class="item_price">
                  <h3>{{ item.price }} {{ item.currency }}</h3>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <GlobalPagination
        :last_page="lastPage"
        :current_page="currentPage"
        @paginationClick="paginationClick"
      />
    </div>
    <StoreItemModal
      :modalApperanceData="storeItemModalIsOpen"
      :selectedItem="selectedStoreItem"
      @controleModalApperance="toggleStoreItemModal"
    />
  </div>
</template>

<script setup>
import { useStoreWishlist } from "@/stores/storeModule";
import image1 from "/assets/media/empty_messages/empty_cart.png";

const store = useStoreWishlist();
const isLoading = ref(true);
const storeItemModalIsOpen = ref(false);
const selectedStoreItem = ref(null);
const currentPage = ref(1);

const storeItems = computed(() => store.getStoreItems.setStoreItems);
const lastPage = computed(() => store.lastPage || 1);

const toggleStoreItemModal = (item = null) => {
  storeItemModalIsOpen.value = !storeItemModalIsOpen.value;

  if (!storeItemModalIsOpen.value) {
    selectedStoreItem.value = null;
  } else {
    selectedStoreItem.value = item;
  }
};

const paginationClick = (pageNum) => {
  currentPage.value = pageNum;
  store.getProducts(currentPage.value);
};

onMounted(() => {
  store.getProducts(currentPage.value);
  isLoading.value = false;
});
</script>

<style scoped>
.store_items_wrapper {
  @apply py-8;
  .store_items {
    @apply flex flex-wrap justify-center items-center gap-8;
    .store_item_card {
      @apply w-full p-5 border !border-secondaryTheme rounded-[10px]  transition hover:shadow-md;
      .item_image_wrapper {
        @apply w-60 h-60 mx-auto transform transition-transform hover:scale-110;
      }
      .item_name {
        h3 {
          @apply mt-4 py-2 text-center text-[1.75rem] font-medium text-themeText;
        }
      }
      .item_price {
        h3 {
          @apply text-center text-[1.75rem] font-medium text-mainTheme;
        }
      }
    }
  }
}
</style>
