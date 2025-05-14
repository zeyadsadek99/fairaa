<template>
  <ul
    class="hidden md:flex md:items-center md:justify-between gap-3 lg:gap-9 xl:gap-12 list-none"
  >
    <li
      v-for="link in navbarLinks"
      :key="link?.id"
      v-show="link?.user_type === type || link?.user_type === 'all'"
      class="navbar_link"
    >
      <NuxtLink
        class="text-[22px] whitespace-nowrap font-semibold text-themeText transition-all duration-100 ease-in-out hover:text-mainTheme"
        :to="localePath(link.url)"
      >
        {{ link?.text }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
const localePath = useLocalePath();
const props = defineProps({
  navbarLinks: Array,
  type: String,
});
</script>
<style>
a.router-link-exact-active {
  @apply text-mainTheme;
}
</style>
