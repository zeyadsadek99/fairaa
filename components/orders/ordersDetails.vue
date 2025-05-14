<template>
  <div>
    <Loader1 v-if="isLoading" />
    <div v-else class="order-details-wrapper fadeIn">
      <div class="order-header">
        <span class="text-themeText"
          >{{ $t("TITLES.order_number") }} {{ orderDetails.id }}</span
        >
        <span class="order-date">{{ orderDetails.created_at }}</span>
      </div>
      <div class="order-status">
        <span class="text-lightGray">
          <span class="count">{{ orderDetails?.products?.length }}</span>
          {{ $t("TITLES.products") }}
        </span>
        <span class="status" :class="orderDetails.status">
          <span v-if="orderDetails.status === 'accepted'">{{
            $t("STATUS.on_going")
          }}</span>
          <span v-else-if="orderDetails.status === 'pending'">{{
            $t("STATUS.pending")
          }}</span>
        </span>
      </div>

      <div class="grid gap-4 my-7 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in orderDetails.products"
          :key="product.id"
          class="order-item"
        >
          <div class="flex items-center gap-4">
            <div class="w-[130px] h-[120px]">
              <img
                :src="product.product_image"
                :alt="product.product"
                class="order-item-img"
              />
            </div>

            <div class="block relative w-full">
              <div class="text-[1.6rem] font-medium flex items-center gap-7">
                <span class="text-themeText">{{ product.product }}</span>
                <span class="text-mainTheme">{{ product.count }}X</span>
              </div>
              <p class="text-mainTheme text-[1.75rem] font-bold">
                {{ product.total }} {{ $t("TITLES.egp") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="section-wrapper">
          <h3 class="section-title">{{ $t("TITLES.delivery_info") }}</h3>
          <div>
            <p class="text-lightGray text-2xl mb-2">
              {{ $t("TITLES.address") }}
            </p>
            <p class="flex gap-2 text-2xl items-center text-themeText">
              <IconsMapPin />
              {{ orderDetails.street }} - {{ orderDetails.neighborhood }} -
              {{ orderDetails.city }}
            </p>
          </div>
          <div class="mt-4">
            <p class="text-lightGray text-2xl mb-2">
              {{ $t("TITLES.another_phone") }}
            </p>
            <p class="flex gap-2 text-2xl items-center text-themeText">
              <IconsMobile />
              {{ orderDetails.phone }}
            </p>
          </div>
        </div>

        <div class="section-wrapper">
          <h3 class="section-title">{{ $t("TITLES.price_details") }}</h3>
          <div class="space-y-3">
            <div
              class="flex justify-between items-center text-themeText font-medium"
            >
              <span class="text-xl">{{ $t("TITLES.products_total") }}</span>
              <span class="text-[1.75rem]"
                >{{ orderDetails.total }} {{ $t("TITLES.egp") }}</span
              >
            </div>
            <div
              class="flex justify-between items-center text-themeText font-medium"
            >
              <spa class="text-xl">{{ $t("TITLES.added_tax") }}</spa>
              <span class="text-[1.75rem]">{{ orderDetails.vat_value }}%</span>
            </div>
            <div
              class="flex justify-between items-center text-themeText font-medium border-t pt-3"
            >
              <span class="text-xl">{{ $t("TITLES.total") }}</span>
              <span class="text-[35px] font-bold text-mainTheme"
                >{{ orderDetails.total_with_vat }} {{ $t("TITLES.egp") }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const orderDetails = ref({});
const isLoading = ref(false);
const route = useRoute();
const axios = useNuxtApp().$axios;

const { data, status, refresh } = await useLazyAsyncData("orderDetails", () =>
  axios
    .get(`user/order/${route.params.id}`)
    .then((res) => {
      orderDetails.value = res.data.data || [];
    })
    .catch((error) => console.error("Error fetching courses:", error.response))
);
</script>

<style scoped>
.order-details-wrapper {
  @apply py-9 space-y-4 container;
  .order-header {
    @apply font-medium flex items-center justify-between text-[2rem];
    .order-date {
      @apply text-lightGray scale-75;
    }
  }
  .order-status {
    @apply flex justify-between items-center text-2xl font-medium;
    .count {
      @apply text-themeText;
    }
    .status.accepted {
      @apply text-midGreen;
    }
    .status.pending {
      @apply text-gold;
    }
  }
  .order-item {
    @apply p-3 border border-secondaryTheme flex items-center justify-between rounded-[10px];

    img {
      @apply rounded-[10px] w-full h-full object-cover;
    }
  }
  .section-wrapper {
    @apply py-9 rounded-xl space-y-4;

    .section-title {
      @apply text-themeText font-medium text-[1.75rem] mb-2;
    }
  }
}
</style>
