<template>
  <div class="teacher-balance-wrapper">
    <GlobalBreadCrumbs>
      <template #page_title>
        {{ $t("TITLES.my_balance") }}
      </template>
      <template #breadcrumb_current_page>
        {{ $t("TITLES.my_balance") }}
      </template>
    </GlobalBreadCrumbs>

    <Loader1 v-if="status == 'pending'" />

    <template v-else-if="status == 'success'">
      <div class="my-balance-card-wrapper fadeIn">
        <div class="container">
          <div class="flex flex-col items-center">
            <div class="my-balance-card">
              <h4>{{ $t("TITLES.your_balance_now") }}</h4>

              <h2>
                {{ wallet.mainValueForWallet }}
                <span>{{ wallet.currency }}</span>
              </h2>
            </div>
            <div v-if="wallet.mainValueForWallet > 0" class="withdraw-btn">
              <NuxtLink class="btn !w-[150px]" :to="localePath('/withdraw')">
                {{ $t("TITLES.withdraw") }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const wallet = ref({});
const localePath = useLocalePath();

const axios = useNuxtApp().$axios;
const { data, status, refresh } = await useLazyAsyncData("wallet", () =>
  axios
    .get("user/wallet")
    .then((res) => {
      wallet.value = res.data.data;
    })
    .catch((error) => console.error("Error fetching wallet data:", error))
);
</script>

<style scoped>
.my-balance-card-wrapper {
  @apply py-9;
  .my-balance-card {
    @apply bg-[rgba(52,191,108,.25)] bg-cover bg-no-repeat py-9 w-[65%] mx-auto text-center rounded-[20px];
    background-image: url("/media/shapes/balance-shape.svg");
    h4 {
      @apply text-lightGray text-[2.3rem];
    }
    h2 {
      @apply text-themeText  text-[4rem] py-2 leading-9  font-bold;
      span {
        @apply text-[1.8rem] font-bold;
      }
    }
  }

  .withdraw-btn {
    @apply text-center mt-6;
  }
}
</style>
