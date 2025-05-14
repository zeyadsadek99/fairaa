<template>
  <div
    :class="['image-header-wrapper', bgColor]"
    :style="[backgroundStyle, customStyle]"
  >
    <div class="header-container container pb-5">
      <div class="flex justify-start items-center">
        <div
          class="header-title-wrapper flex flex-col justify-center mt-6 text-center"
        >
          <img
            v-if="imageSrc"
            :src="imageSrc"
            :alt="title"
            class="w-1/2 object-contain"
          />
          <h1
            class="lg:w-full lg:text-[5rem] font-bold  w-[47%] leading-[3.8rem] text-4xl xs:text-[3.3rem] md:text-[4.5rem] text-themeText font-arb"
          >
            {{ title }}
          </h1>
          <h3
            class="text-midGray mt-2"
            v-if="specializations && specializations.length"
          >
            <div class="flex">
              <template
                v-for="(specialization, index) in specializations.slice(0, 2)"
                :key="specialization.id"
              >
                <h4 class="!text-secondary text-2xl">
                  {{ specialization.name }}
                  <span v-if="index < specializations.length - 1">/</span>
                </h4>
              </template>
              <h4 v-if="specializations.length > 2" class="text-midGray">
                ...
              </h4>
            </div>
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import image1 from "/assets/media/shapes/green_logo_title.png";

const props = defineProps({
  bgColor: {
    type: String,
    default: "bg-[#fff0e1]",
  },
  bgImage: {
    default: image1,
  },
  title: {
    required: true,
  },
  specializations: {
    type: Array,
    default: () => [],
  },
  imageSrc: {
    default: "",
  },
  customStyle: {
    type: Object,
    default: () => ({ marginLeft: "0px" }),
  },
});

const backgroundStyle = computed(() => {
  return props.bgImage
    ? {
        backgroundImage: `url(${props.bgImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left",
      }
    : {};
});
</script>

<style scoped>
.image-header-wrapper {
  @apply h-[350px] flex justify-start items-center relative;
}

@media (max-width: 767px) {
  .image-header-wrapper {
    @apply h-[180px] !bg-[-50%];
  }
}
</style>
