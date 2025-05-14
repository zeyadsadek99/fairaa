<template>
  <div class="orders_list_content_wrapper py-7">
    <GlobalTabs :tabsContent="tabsContent" @getItems="getItems" />

    <Loader1 v-if="status === 'pending' && current_page === 1" />
    <template v-else-if="status === 'success'">
      <div>
        <div v-if="currentTab === 'current_orders'" class="space-y-4">
          <MessagesCourseEmpty
            v-if="currentOrders.length === 0"
            :imageSrc="image1"
            :message="$t('TITLES.empty_orders')"
          />
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 container">
            <NuxtLink
              v-for="order in currentOrders"
              :key="order.id"
              :to="localePath(`/orders/${order.id}`)"
              class="order_card"
            >
              <OrdersCard :order="order" />
            </NuxtLink>
          </div>
        </div>

        <div v-if="currentTab === 'finished_orders'" class="space-y-4">
          <MessagesCourseEmpty
            v-if="finishedOrders.length === 0"
            :imageSrc="image1"
            :message="$t('TITLES.empty_orders')"
          />
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink
              v-for="order in finishedOrders"
              :key="order.id"
              :to="localePath(`/orders/${order.id}`)"
              class="order_card"
            >
              <OrdersCard :order="order" />
            </NuxtLink>
          </div>
        </div>
        <GlobalPagination
          :last_page="last_page"
          :current_page="current_page"
          @paginationClick="pagenationClick"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import image1 from "/assets/media/empty_messages/empty_cart.png";
const localePath = useLocalePath();

const currentOrders = ref([]);
const finishedOrders = ref([]);
const currentTab = ref("current_orders");
const current_page = ref(1);
const last_page = ref(1);
const axios = useNuxtApp().$axios;
const tabsContent = [
  { tab: " الحالية", key_name: "current_orders" },
  { tab: " المنتهية", key_name: "finished_orders" },
];

const getMyOrders = async () => {
  let status = currentTab.value === "current_orders" ? "pending" : "finish";

  const res = await axios.get(
    `user/order?page=${current_page.value}&status=${status}`
  );
  if (currentTab.value === "current_orders") {
    currentOrders.value = res.data.data;
  } else {
    finishedOrders.value = res.data.data;
  }
  last_page.value = res.data.meta.last_page;
};

const { data, status, refresh } = await useLazyAsyncData(
  "getOrders",
  getMyOrders
);
const getItems = (item) => {
  currentTab.value = item;
  getMyOrders();
};
const pagenationClick = (pageNum) => {
  current_page.value = pageNum;
  getMyOrders();
};
</script>

<style scoped></style>
