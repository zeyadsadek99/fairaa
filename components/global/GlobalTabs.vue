<template>
  <div class="tabs-wrapper">
    <v-card flat class="tabs-card">
      <v-tabs
        align-tabs="center"
        v-model="activeTab"
        class="tabs-header"
        bg-color="themeBg"
      >
        <v-tab
          v-for="item in tabsContent"
          :key="item.key_name"
          :value="item.key_name"
          @click="changeTab(item.key_name)"
          class="tab-button"
          :class="{ 'active-tab': activeTab === item.key_name }"
        >
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item
          v-for="item in tabsContent"
          :key="item.key_name"
          :value="item.key_name"
        >
          <div class="tab-content container">
            <slot :name="item.key_name"></slot>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  tabsContent: {
    type: Array,
    required: true,
  },
  gap: {
    type: String,
    default: "20", // Default gap value if none is provided
  },
});

// Emits
const emit = defineEmits(["getItems"]);

// Reactive Variables
const activeTab = ref(null);

// Change Active Tab
const changeTab = (tab) => {
  activeTab.value = tab;
  emit("getItems", tab);
};

watch(
  () => props.tabsContent,
  (newTabs) => {
    if (newTabs?.length > 0 && !activeTab.value) {
      activeTab.value = newTabs[0].key_name;
      emit("getItems", newTabs[0].key_name);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.tabs-wrapper {
  @apply w-full  bg-themeBg;
}

.tabs-card {
  @apply bg-themeBg rounded-lg;
}

.tabs-header {
  @apply border-secondaryTheme gap-10 mx-auto justify-center bg-themeBg;
}

.tab-button {
  @apply text-themeSecondaryText text-base md:text-xl font-semibold pb-2 border-b-2 border-transparent transition-all duration-300 cursor-pointer;
}

.active-tab {
  @apply border-mainTheme text-mainTheme font-bold;
}

.tab-content {
  @apply py-6;
}
:deep(.v-slide-group__content) {
  @apply gap-3 md:!gap-28;
}
</style>
