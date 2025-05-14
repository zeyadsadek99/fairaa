<template>
  <div
    class="block p-2.5 space-y-2 rounded-[10px] border border-secondaryTheme"
  >
    <!-- Title -->
    <div class="flex items-center justify-between text-[1.75rem]">
      <span class="order_number text-themeText font-medium">
        {{ $t("TITLES.order_number") }} {{ order.id }}
      </span>
      <span class="order_date text-lightGray font-medium scale-75">{{
        order.created_at
      }}</span>
    </div>

    <!-- Status -->
    <div class="flex justify-between items-center font-medium text-2xl">
      <span class="orders_count text-lightGray">
        <span class="number text-themeText">{{ order.products.length }}</span>
        {{ $t("TITLES.products") }}
      </span>
      <span class="status" :class="order.status" v-if="order.status">
        <span v-if="order.status === 'accepted'">{{
          $t("STATUS.on_going")
        }}</span>
        <span class="" v-else-if="order.status === 'pending'">{{
          $t("STATUS.pending")
        }}</span>
        <span class="" v-else-if="order.status === 'reject'">{{
          $t("STATUS.canceled")
        }}</span>
      </span>
    </div>

    <!-- Price and Thumbnails -->
    <div class="flex justify-between items-center">
      <h3 class="price font-bold text-[1.75rem]  text-midGreen">
        {{ order.total_with_vat }} {{ $t("TITLES.egp") }}
      </h3>
      <div class="thumbnails flex item-center justify-end gap-1">
        <div
          v-for="thumbnail in order.products"
          :key="thumbnail.id"
          class="thumbnail_wrapper size-[56px] p-0.5 border !border-secondaryTheme rounded-[10px]"
        >
          <img
            :src="thumbnail.product_image"
            alt="product Image"
            class="object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  order: Object,
});
</script>
<style>
.status.accept {
  @apply text-midGreen;
}

.status.reject {
  @apply text-midRed;
}

.status.pending {
  @apply text-gold;
}
</style>
