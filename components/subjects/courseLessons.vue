<template>
  <div class="lessons-wrapper">
    <h3 class="title">
      {{ $t("TITLES.subject_lessons") }}
    </h3>

    <ul class="lessons-list">
      <li
        v-for="(lesson, index) in lessonsList.listens"
        :key="lesson.id"
        class="lesson"
      >
        <div class="lesson-details">
          <NuxtLink
            :to="localePath(`/course-videos/${lesson.id}`)"
            v-if="courseType === 'record'"
          >
            <div class="item-content-wrapper">
              <span class="lesson-number">#{{ index + 1 }}</span>
              <div class="lesson-info">
                <span class="name">{{ lesson.name }}</span>
                <span class="price">{{ lesson.price }}</span>
                <span class="lesson-duration" v-show="lesson.duration !== 0">
                  {{ Math.floor(lesson.duration / 60) }} {{ $t("TITLES.hour") }}
                </span>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="localePath(lesson.link)"
            target="_blank"
            :class="{
              disabled: !lesson.is_paid && registeredUserType !== 'teacher',
            }"
            v-if="courseType === 'online'"
          >
            <div class="item-content-wrapper">
              <span class="lesson-number">#{{ index + 1 }}</span>
              <div class="lesson-info">
                <span class="name">{{ lesson.name }}</span>

                <div
                  v-if="registeredUserType == 'student'"
                  class="flex flex-col"
                >
                  <span class="price">{{ lesson.price }} جنيه</span>
                  <span class="desc">
                    {{ lesson.lesson_price }} + {{ lesson.app_persentage }}%
                    الضريبة المضافة
                  </span>
                </div>
                <div
                  v-else-if="registeredUserType == 'teacher'"
                  class="flex flex-col"
                >
                  <span class="price">
                    {{ lesson.teacher_lesson_price }}
                    جنيه
                  </span>
                  <span class="desc">
                    {{ lesson.lesson_price }} -
                    {{ lesson.app_percentage_from_teacher + " % نسبة التطبيق" }}
                  </span>
                  <span class="text-[#1976d2]">
                    {{
                      lesson.all_amount_for_teacher > 0
                        ? lesson.all_amount_for_teacher
                        : "لا يوجد طلبات حالية"
                    }}
                  </span>
                </div>

                <span>
                  <span
                    class="lesson-status running"
                    v-if="lesson.status === 'now'"
                  >
                    <IconsCircle class="size-3" />

                    <p>
                      {{ $t("STATUS.on_going") }}
                    </p>
                  </span>
                  <span
                    class="lesson-status done"
                    v-if="lesson.status === 'finish'"
                  >
                    <IconsCircle class="size-3" />

                    <p>{{ $t("STATUS.done") }}</p>
                  </span>
                  <span
                    class="lesson-status have-not"
                    v-if="lesson.status === 'have_not_came_yet'"
                  >
                    <IconsCircle class="text-midGray size-3" />

                    <p>
                      {{ lesson.start_date }}
                    </p>
                  </span>
                </span>
              </div>
            </div>
          </NuxtLink>

          <div class="left-part">
            <div class="item-btns-wrapper">
              <NuxtLink
                :to="localePath(`/course-videos/${lesson.id}`)"
                class="play-icon"
                v-if="
                  courseType === 'record' && registeredUserType !== 'teacher'
                "
              >
                <IconsCirclePlay class="size-5 text-primary" />
              </NuxtLink>

              <span
                class="lock-icon disabled"
                v-if="
                  courseType === 'online' &&
                  !lesson.is_paid &&
                  registeredUserType !== 'teacher'
                "
              >
                <IconsLock class="size-5" />
              </span>

              <div
                class="lesson-actions-menu-wrapper relative"
                v-if="registeredUserType == 'teacher'"
              >
                <button
                  class="single-lesson-actions-btn"
                  @click.stop="toggleActionsMenu($event)"
                >
                  <IconsEllipsis />
                </button>

                <ul class="lesson-actions-menu">
                  <li class="menu-item">
                    <button
                      @click.stop="
                        closeActionsMenu($event);
                        toggleEditLessonModal(lesson);
                      "
                    >
                      {{ $t("BUTTONS.edit_lesson") }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- Modals -->
    <ModalsEditLessonsModal
      :courseType="courseType"
      :selectedLesson="selectedLessonToEdit"
      :modalApperanceData="editLessonModalIsOpen"
      @controleModalApperance="toggleEditLessonModal"
      @getDetailsAfterEdit="getDetailsAfterEdit"
    />

    <!-- <DeleteModal
      :targetElement="'lesson'"
      :selectedLesson="selectedLessonToDelete"
      :modalApperanceData="deleteModalIsOpen"
      @controleModalApperance="toggleDeleteModal"
      @getDetailsAfterDelete="getDetailsAfterEdit"
    /> -->
  </div>
</template>

<script setup>
import { useAuthenticationStore } from "~/stores/authentication"; //
const authStore = useAuthenticationStore();
const { type } = storeToRefs(authStore);
const localePath = useLocalePath();

const props = defineProps(["courseType", "routeName", "lessonsList"]);
const editLessonModalIsOpen = ref(false);
const deleteModalIsOpen = ref(false);
const selectedLessonToEdit = ref(null);
const selectedLessonToDelete = ref(null);
const registeredUserType = ref(type.value);
const emit = defineEmits(["getDetailsAfterEdit"]);

const toggleActionsMenu = (event) => {
  event.currentTarget.nextSibling.classList.toggle("active");
};

const closeActionsMenu = (event) => {
  event.target.closest(".lesson-actions-menu").classList.remove("active");
};

const toggleEditLessonModal = (lesson) => {
  editLessonModalIsOpen.value = !editLessonModalIsOpen.value;
  selectedLessonToEdit.value = lesson;
};

const toggleDeleteModal = (lesson) => {
  deleteModalIsOpen.value = !deleteModalIsOpen.value;
  selectedLessonToDelete.value = lesson;
};

const getDetailsAfterEdit = () => {
  emit("getDetailsAfterEdit");
};
</script>

<style scoped>
.lessons-wrapper {
  @apply p-2.5;
  .title {
    @apply text-themeText mb-2 text-3xl font-bold;
  }
  .lessons-list {
    @apply list-none  min-h-[300px] max-h-[300px] overflow-y-auto;
    &::-webkit-scrollbar {
      @apply w-1;
    }
    &::-webkit-scrollbar-track {
      @apply bg-secondaryTheme rounded-xl;
    }
    &::-webkit-scrollbar-thumb {
      @apply bg-mainTheme border-2 border-secondary rounded-xl;
    }

    .lesson:not(:last-of-type) {
      @apply mb-2;
    }
    .lesson-details {
      @apply flex items-center justify-between pe-3;
      .disabled {
        @apply opacity-50 cursor-not-allowed pointer-events-none;
      }
      .item-content-wrapper {
        @apply flex items-center gap-4;
        .lesson-number {
          @apply text-[45px] text-[#888] font-bold;
        }
        .lesson-info {
          @apply flex flex-col;
          .name {
            @apply text-themeText text-[22px] font-medium !leading-none;
          }
          .price {
            @apply text-black text-[22px] font-extrabold !leading-none;
          }
          .desc {
            @apply !text-[#888] text-xl leading-tight;
          }
          .lesson-status {
            @apply text-xl flex items-center gap-2;
            &.done {
              @apply text-midRed;
            }
            &.running {
              @apply text-midGreen;
            }
            &.have-not p {
              @apply !text-midGray;
            }
          }
        }
      }
      .left-part {
        @apply flex items-center;
        .lesson-actions-menu-wrapper {
          @apply relative;
          .single-lesson-actions-btn {
            @apply size-10 flex items-center justify-center bg-secondaryTheme text-mainTheme rounded-full;
          }
          .lesson-actions-menu {
            @apply absolute top-[130%] left-[120%]   bg-themeBg rounded-[10px] z-10 shadow-md opacity-0 scale-0 overflow-hidden transition-all duration-500 ease-in-out  transform -translate-x-1/2 origin-top;
            &.active {
              @apply transform -translate-x-1/2 opacity-100 scale-100;
            }
            .menu-item {
              @apply px-5 py-2  flex items-center transition-all duration-300 ease-in-out;
              button {
                @apply text-themeText whitespace-nowrap text-lg font-medium;
              }
            }
          }
        }
      }
    }
  }
}
</style>
