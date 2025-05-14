<template>
  <div class="student-favs-wrapper">
    <div class="container">
      <GlobalTabs :tabsContent="tabsContent">
        <!-- Registered Subjects -->
        <template #registered_subjects>
          <Loader1 v-if="status == 'pending'" />
          <template v-else-if="status === 'success'">
            <MessagesCourseEmpty
              v-if="recordCourses.length === 0"
              :imageSrc="image1"
              :message="$t('TITLES.empty_courses')"
            />
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <CoursesImageCard
                v-for="course in recordCourses"
                :key="course.id"
                :image="course.image"
                :subjectName="course?.subject_name"
                :price="course?.price"
                :StartDate="course?.start_date"
                :Rate="course?.avg_rate"
                :teacher="course?.teacher"
                :link="{
                  path: `/subjects/${course.id}`,
                  query: { type: 'record' },
                }"
              />
            </div>
          </template>
        </template>

        <template #online_subjects>
          <Loader1 v-if="status == 'pending'" />
          <template v-else-if="status === 'success'">
            <MessagesCourseEmpty
              :imageSrc="image1"
              :message="$t('TITLES.empty_courses')"
              v-if="onlineCourses.length === 0"
            />
            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <CoursesImageCard
                v-for="course in onlineCourses"
                :key="course?.subject_id"
                :image="course.subject?.image"
                :subjectName="course?.subject?.subject_name"
                :price="course?.subject?.price"
                :StartDate="course?.subject?.start_date"
                :Rate="course?.subject?.avg_rate"
                :teacher="course?.subject?.teacher"
                :link="{
                  path: `/subjects/${course.subject_id}`,
                  query: { type: 'online' },
                }"
              />
            </div>
          </template>
        </template>

        <!-- Products -->
        <template #products>
          <Loader1 v-if="status == 'pending'" />
          <template v-else-if="status == 'success'">
            <MessagesCourseEmpty
              :imageSrc="image2"
              :message="$t('TITLES.empty_fav_products')"
              v-if="products.length === 0"
            />
            <div
              v-else
              class="flex flex-wrap justify-center items-center gap-8"
            >
              <!-- ✅ Store Item Card -->
              <div
                v-for="item in products"
                :key="item.id"
                class="flex justify-center"
              >
                <button @click="toggleStoreItemModal(item.product)" class="">
                  <div class="store-item-card">
                    <!-- ✅ Item Image -->
                    <div class="item-image-wrapper">
                      <img
                        :src="item?.product.product_image"
                        alt="Store Item"
                        class="w-full h-full object-contain rounded-[10px]"
                      />
                    </div>

                    <!-- ✅ Item Name -->
                    <div class="item-name">
                      <h3 class="text-themeText font-medium py-2.5">
                        {{ item.product.name }}
                      </h3>
                    </div>

                    <!-- ✅ Item Price -->
                    <div class="item-price">
                      <h3 class=" text-mainTheme font-medium">
                        {{ item.product.price }} {{ item.product.currency }}
                      </h3>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </template>

          <StoreItemModal
            :modalApperanceData="storeItemModalIsOpen"
            :selectedItem="selectedStoreItem"
            @controleModalApperance="toggleStoreItemModal"
            @getStudentFavorites="refresh"
          />
        </template>
      </GlobalTabs>
    </div>
  </div>
</template>

<script setup>
// Imports
import image1 from "/assets/media/empty_messages/empty_courses.png";
import image2 from "/assets/media/empty_messages/empty_cart.png";

const recordCourses = ref([]);
const onlineCourses = ref([]);
const products = ref([]);
const storeItemModalIsOpen = ref(false);
const selectedStoreItem = ref(null);
const axios = useNuxtApp().$axios;

// Tabs
const { t } = useI18n();
const tabsContent = [
  { tab: t("TABS.registered_subjects"), key_name: "registered_subjects" },
  { tab: t("TABS.online_subjects"), key_name: "online_subjects" },
  { tab: t("TABS.products"), key_name: "products" },
];

const { data, status, refresh } = await useLazyAsyncData(
  "getStudentFavorites",
  () =>
    axios
      .get("student/favourite")
      .then((res) => {
        recordCourses.value = res.data.data.record;
        onlineCourses.value = res.data.data.online;
        products.value = res.data.data.product;
      })
      .catch((error) => console.error("Error fetching favorites:", error))
);
const toggleStoreItemModal = (item) => {
  storeItemModalIsOpen.value = !storeItemModalIsOpen.value;
  selectedStoreItem.value = item;
};
</script>

<style scoped>
.student-favs-wrapper {
  @apply py-9;
  .store-item-card {
    @apply w-full border p-2.5 border-secondaryTheme rounded-lg overflow-hidden transition-all;
    &:hover img {
      @apply scale-110;
    }
    img {
      @apply w-full h-full object-contain rounded-lg transition-all duration-500 ease-in-out;
    }
    .item-image-wrapper {
      @apply !size-[240px] transition-all duration-500 ease-in-out;
    }
  }
}
</style>
