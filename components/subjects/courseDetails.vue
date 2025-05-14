<template>
  <div class="course-details-group">
    <!-- ✅ COURSE DETAILS -->
    <div class="content-wrapper">
      <h3 class="title">
        {{ subjectName }}
        <span class="academic_year text-lg" v-if="academicYear">
          {{ academicYear.name }}
        </span>
      </h3>

      <div class="start-date-wrapper">
        <span class="start-date-title"
          >{{ t("TITLES.course_start_date") }}:</span
        >
        <span class="start-date">{{ startDate }}</span>
      </div>
    </div>

    <!-- ✅ RATINGS -->
    <div class="content-wrapper">
      <div class="course-rate">
        <span class="title">{{ t("TITLES.ratings") }}</span>
        <span class="rate">
          <IconsStar />
          <span>{{ courseRate }}</span>
        </span>
      </div>

      <div class="price" v-if="courseType === 'online'">
        <h3 v-if="coursePriceAfterDiscount && coursePriceAfterDiscount !== 0">
          <span class="before-discount">{{ coursePrice }}</span>
          <span class="price-after-discount"
            >{{ coursePriceAfterDiscount }}
          </span>
          <span v-if="courseCurrency">{{ courseCurrency }}</span>
          <span v-else>{{ $t("TITLES.egp") }}</span>
        </h3>
        <h3 v-else>
          <span>{{ coursePrice }}</span>
          <span v-if="courseCurrency">{{ courseCurrency }}</span>
          <span v-else>{{ $t("TITLES.egp") }}</span>
        </h3>
      </div>
    </div>

    <!-- ✅ COURSE ACTION BUTTONS -->
    <div class="content-wrapper w-full">
      <div class="actions-buttons-wrapper">
        <NuxtLink
          v-if="registeredUserType == 'teacher'"
          :to="localePath(`/subjects/edit/${courseId}`)"
          class="btn !w-[80%]"
        >
          {{ t("BUTTONS.edit_course") }}
        </NuxtLink>

        <!-- ✅ Share Buttons -->

        <div class="relative w-[15%] md:w-[9%]">
          <button class="btn-secondary" @click.stop="toggleShareBtnsMenu">
            <IconsShare class="size-8" />
          </button>

          <transition mode="out-in" name="fadeInUp">
            <ul v-if="shareBtnsMenuIsOpen" class="social-share-btns">
              <!-- Facebook -->
              <li
                v-for="network in socialNetworks"
                :key="network.name"
                class="single_share_btn"
              >
                <button
                  @click="shareToNetwork(network.name)"
                  class="social-share-button"
                >
                  <img
                    :src="network.icon"
                    class="size-[35px]"
                    alt="Share Icon"
                  />
                </button>
              </li>
            </ul>
          </transition>
        </div>

        <button
          v-show="registeredUserType == 'student' && !isFav"
          class="btn-action"
          @click="favClick"
          aria-label="Add to wishlist"
        >
          <IconsHeart class="text-lightRed size-8" />
        </button>
        <button
          v-show="registeredUserType == 'student' && isFav"
          class="btn-action"
          @click="favClick"
          aria-label="Add to wishlist"
        >
          <IconsHeartFilled class="text-lightRed size-8" />
        </button>

        <NuxtLink
          v-if="registeredUserType === 'student'"
          :to="localePath(`/subjects/quiz/${courseId}?${courseType}`)"
          class="quiz-btn"
          title="Quiz"
        >
          <span>
            {{ $t("BUTTONS.quiz") }}
          </span>
        </NuxtLink>

        <NuxtLink
          v-if="
            courseType == 'online' &&
            registeredUserType == 'student' &&
            !courseIsSubscribed
          "
          :to="localePath(`/subjects/payment/${courseId}`)"
          class="btn !w-[65%]"
        >
          {{ $t("BUTTONS.register_course") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useAuthenticationStore } from "~/stores/authentication"; //

import image1 from "~/assets/media/icons/social/facebook.svg";
import image2 from "~/assets/media/icons/social/Twitter.svg";
import image3 from "~/assets/media/icons/social/whatsapp.svg";
const { t } = useI18n();
const authStore = useAuthenticationStore();
const localePath = useLocalePath();

const props = defineProps({
  courseId: Number,
  subjectName: String,
  subjectDescription: String,
  academicYear: Object,
  startDate: String,
  courseRate: Number,
  coursePrice: Number,
  coursePriceAfterDiscount: Number,
  courseCurrency: String,
  courseType: String,
  routeName: String,
  courseIsFavorite: Boolean,
  courseIsSubscribed: Boolean,
  lessons: Object,
  duration: Object,
});
const { type } = storeToRefs(authStore);
const registeredUserType = ref(type.value);

const deleteModalIsOpen = ref(false);
const shareBtnsMenuIsOpen = ref(false);
const isFav = ref(false);
const route = useRoute();
const axios = useNuxtApp().$axios;
const courseId = route.params.id;
const courseType = route.query.type;
const courseIsSubscribed = ref(false);

const socialNetworks = [
  { name: "facebook", icon: image1 },
  { name: "twitter", icon: image2 },
  { name: "whatsapp", icon: image3 },
];
const shareToNetwork = (network) => {
  const currentUrl = window.location.href;
  const text = "Check out this content!";

  let shareUrl = "";

  switch (network) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(text)}`;
      break;
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${encodeURIComponent(
        text + " " + currentUrl
      )}`;
      break;
    default:
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
};

const toggleDeleteModal = () => {
  deleteModalIsOpen.value = !deleteModalIsOpen.value;
};

const toggleShareBtnsMenu = () => {
  shareBtnsMenuIsOpen.value = !shareBtnsMenuIsOpen.value;
};
const favClick = async () => {
  const formData = new FormData();

  formData.append(
    "fav_type",
    registeredUserType === "teacher" ? "dash_subject" : "subject"
  );
  formData.append("id", courseId);
  try {
    const res = await axios.post("user/favourite", formData);
    isFav.value = res.data.data.is_fav;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  isFav.value = props.courseIsFavorite;
});
</script>

<style scoped>
.course-details-group {
  @apply p-3 border-2  my-3 border-secondaryTheme rounded-2xl flex flex-wrap justify-between;
  .content-wrapper {
    @apply flex flex-col gap-2;
    .title {
      @apply text-2xl font-bold text-themeText;
      .academic_year {
        @apply font-medium text-lightGray;
      }
    }
    .start-date-wrapper {
      .start-date-title {
        @apply font-medium text-lightGray text-[22px];
      }
      .start-date {
        @apply text-[22px] font-medium text-themeText;
      }
    }
    .course-rate {
      @apply bg-softYellow flex py-1 px-2.5 rounded-[10px] text-themeText;
      span {
        @apply text-xl font-bold;
      }
      svg {
        @apply text-gold;
      }
      .title {
        @apply text-xl font-bold text-themeText;
      }
      .rate {
        @apply flex text-xl font-bold;
      }
    }
    .price {
      @apply text-lg font-semibold text-themeText;
      h3 {
        @apply flex items-center gap-2;
        span {
          @apply flex items-center justify-end text-3xl font-bold text-mainTheme;
        }
        .before-discount {
          @apply !text-2xl !font-medium   line-through !text-midGray opacity-50;
        }
      }
    }
    .actions-buttons-wrapper {
      @apply flex items-center my-4 gap-2.5 w-full flex-row-reverse;
      .btn-secondary {
        @apply flex items-center w-full justify-center bg-softMainTheme text-mainTheme h-10  rounded-[10px] py-6;
        i {
          @apply text-[22px] text-mainTheme;
        }
      }
      .social-share-btns {
        @apply absolute  left-0 top-[120%] bg-themeBg  rounded-2xl p-4 flex justify-center items-center gap-5;
        .single_share_btn {
          @apply flex justify-center;
          .social-share-button {
            @apply size-[35px];
          }
        }
      }
      .btn-action {
        @apply w-[15%] md:w-[9%] py-6 h-[40px] flex items-center justify-center rounded-lg bg-softRed text-mainTheme;
        i,
        svg {
          @apply text-[22px] text-lightRed;
        }
      }
      .quiz-btn {
        @apply py-6 w-[60%] md:w-[30%] h-10 flex justify-center items-center bg-themeLightBlue  rounded-[10px] outline-none text-[#1976d2] cursor-pointer;
        span {
          @apply text-2xl font-bold text-blue-800;
        }
      }
    }
  }
}
</style>
