<template>
  <div class="videos_list_wrapper">
    <div class="container">
      <div id="iframe_section" class="course_title_wrapper">
        <h3 class="title">{{ subjectData?.subject_name }}</h3>
        <h3 class="duration">
          {{ hours }}
          {{ $t("TITLES.hours") }}
        </h3>
      </div>

      <div class="video_frame_wrapper">
        <iframe
          id="video_iframe"
          :src="lessonData?.link"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <ul class="videos_list">
        <li
          v-for="(video, index) in videos"
          :key="video.id"
          class="lesson"
          @click="playVideo(video.link)"
        >
          <div class="wrapper">
            <span class="lesson_number"> #{{ index + 1 }} </span>
            <p class="lesson_details">
              <span class="name"> {{ video.name }} </span>
              <span class="lesson_duration" v-show="video.duration != 0">
                <span>
                  {{ Math.floor(video.duration / 60) }}
                  {{ $t("TITLES.hour") }}
                </span>
              </span>
            </p>
          </div>

          <span class="play_icon">
            <IconsCirclePlay class="size-5" />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";

const axios = useNuxtApp().$axios;
const subjectData = ref(null);
const lessonData = ref(null);
const videos = ref([]);
const hours = ref(null);
const route = useRoute();

const { data, status, refresh } = await useLazyAsyncData("courseVideo", () =>
  axios
    .get(`student/listen/${route.params.id}`)
    .then((res) => {
      subjectData.value = res.data.data.subject_name;
      lessonData.value = res.data.data.listen;
      videos.value = res.data.data.listens;
      hours.value = res.data.data.num_of_hour;
    })
    .catch((error) =>
      console.error("Error fetching course video:", error.response)
    )
);

const playVideo = (url) => {
  const iframe_section = document.querySelector("#iframe_section");
  const video_iframe = document.querySelector("#video_iframe");
  video_iframe.src = url;
  iframe_section.scrollIntoView();
};
</script>
<style>
.videos_list_wrapper {
  @apply w-full py-10;
  .course_title_wrapper {
    @apply flex items-center justify-start space-x-2.5;
    .title {
      @apply text-3xl font-medium !text-themeText;
    }
    .duration {
      @apply text-lg text-lightGray;
    }
  }
  .video_frame_wrapper {
    iframe {
      @apply w-full h-[300px] md:h-[500px] rounded-2xl shadow-[0_0_10px_2px_var(--simple_shadow_clr)];
    }
  }
  .videos_list {
    @apply list-none mt-5  max-h-[300px] overflow-y-auto;
    &::-webkit-scrollbar {
      @apply w-[8px];
    }
    &::-webkit-scrollbar-track {
      @apply bg-secondaryTheme rounded-2xl;
    }
    &::-webkit-scrollbar-thumb {
      @apply bg-mainTheme border-[2px] border-secondaryTheme rounded-2xl;
    }
    .lesson {
      @apply cursor-pointer mx-3 py-2 px-3 flex items-center justify-between rounded-[10px] transition-all ease-in-out duration-500;
      &:not(:last-of-type) {
        @apply mb-2.5;
      }
      &:hover {
        @apply bg-secondaryTheme;
      }
      .wrapper {
        @apply flex items-center justify-start space-x-2.5;
        .lesson_number {
          @apply text-4xl font-bold text-gray-500;
        }
        .lesson_details {
          @apply flex flex-col  justify-center;
          .name {
            @apply text-themeText text-2xl font-medium;
          }
          .lesson_duration {
            @apply text-lg text-lightGray;
          }
        }
      }
    }
    .play_icon svg {
      @apply text-mainTheme text-4xl;
    }
  }
}
</style>
