<template>
  <div class="strengthening-requests-wrapper">
    <!-- ✅ Breadcrumb -->
    <GlobalBreadCrumbs>
      <template #page_title>
        {{ $t("TITLES.strengthening_requests") }}
      </template>
      <template #breadcrumb_current_page>
        {{ $t("TITLES.strengthening_requests") }}
      </template>
    </GlobalBreadCrumbs>

    <!-- ✅ Empty Message -->
    <MessagesCourseEmpty
      v-if="strengtheningRequestsData?.length === 0"
      :imageSrc="image1"
      :message="$t('TITLES.empty_requests')"
    />

    <!-- ✅ Requests Cards -->
    <div v-else class="strengthening-requests-cards-wrapper">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="request in strengtheningRequestsData?.strengtheningRequestsData"
            :key="request.id"
          >
            <!-- ✅ Loader -->
            <Loader1 v-if="isLoading" />
            <!-- ✅ Request Card -->
            <!-- <RequestCard v-else :requestData="request" class="fadeIn" /> -->
          </div>
        </div>

        <!-- ✅ Pagination -->
        <GlobalPagination
          :last_page="strengtheningRequestsData.last_page"
          :current_page="current_page"
          @paginationClick="pagenationClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// ✅ Imports
import { useStrengtheningRequestsStore } from "@/stores/strengtheningRequests";
import image1 from "/assets/media/empty_messages/empty_courses.png";

// ✅ Store
const store = useStrengtheningRequestsStore();
const { strengtheningRequestsData } = storeToRefs(store);

// ✅ State
const isLoading = ref(true);
const current_page = ref(1);

// ✅ Methods
const getStrengtheningRequests = (page) => {
  store.fetchStrengtheningRequests(page);
};

// ✅ Pagination handler
const pagenationClick = (pageNum) => {
  current_page.value = pageNum;
  getStrengtheningRequests(pageNum);
};

// ✅ Mounted
onMounted(() => {
  getStrengtheningRequests(current_page.value);
  setTimeout(() => (isLoading.value = false), 1500);
});
</script>

<style scoped>
/* ✅ Main Wrapper */

/* ✅ Cards Wrapper */
.strengthening-requests-cards-wrapper {
  @apply py-8;
}
</style>
