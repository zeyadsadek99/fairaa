<script setup>
const axios = useNuxtApp().$axios;
const localePath = useLocalePath();

const userData = ref([]);
const { data, status, refresh } = await useLazyAsyncData("favs", () =>
  axios
    .get("parent/my-children")
    .then((res) => {
      userData.value = res.data.data;
    })
    .catch((error) => console.error("Error fetching sons data:", error))
);
</script>

<template>
  <div class="sons_wrapper">
    <GlobalBreadCrumbs>
      <template v-slot:page_title> {{ $t("TITLES.my_sons") }} </template>
      <template v-slot:breadcrumb_current_page>
        {{ $t("TITLES.my_sons") }}
      </template>
    </GlobalBreadCrumbs>

    <Loader1 v-if="status == 'pending'" />

    <template v-else-if="status == 'success'">
      <div class="sons_content_wrapper">
        <div class="container mx-auto px-4">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <NuxtLink
              v-for="son in userData"
              :key="son.id"
              :to="localePath(`/my-sons/${son.child_data.id}`)"
              class="son-card-wrapper"
            >
              <div class="image-wrapper">
                <img :src="son.child_data.image" alt="Son Image" class="" />
              </div>

              <h3 class="name">
                {{ son.child_data.fullname }}
              </h3>

              <h4 class="study-year">
                {{ son.child_data.academic_year.name }}
              </h4>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.sons_wrapper {
  @apply w-full;

  .sons_content_wrapper {
    @apply py-9;

    .son-card-wrapper {
      @apply block   bg-themeBg p-4 rounded-lg shadow-md transition hover:scale-105;

      .image-wrapper {
        @apply w-full h-40;

        img {
          @apply w-full h-full object-cover rounded-lg;
        }
      }

      .name {
        @apply text-center mt-4 text-2xl font-medium text-themeText;
      }

      .study-year {
        @apply text-center mt-2 text-lg text-lightGray;
      }
    }
  }
}
</style>
