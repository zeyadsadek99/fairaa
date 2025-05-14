<template>
  <div class="courses-categories fadeIn">
    <GlobalBreadCrumbs>
      <template v-slot:page_title>
        {{ $t("TITLES.added_subjects") }}
      </template>
      <template v-slot:breadcrumb_current_page>
        {{ $t("TITLES.added_subjects") }}
      </template>
    </GlobalBreadCrumbs>

    <div class="courses-content py-10">
      <div class="container">
        <GlobalTabs :tabsContent="tabsContent" @getItems="getItems">
          <template #online_courses v-if="currentTab === 'online_courses'">
            <Loader1 v-if="status == 'pending'" />

            <template v-else-if="status == 'success'">
              <MessagesCourseEmpty
                v-if="onlineCourses.length === 0"
                :imageSrc="image1"
                :message="$t('TITLES.empty_courses')"
              />

              <div
                v-else
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                <div v-for="course in onlineCourses" :key="course.id">
                  <NuxtLink
                    :to="
                      localePath({
                        path: `/subjects/${course.id}`,
                        query: { type: 'online' },
                      })
                    "
                    class="flex flex-col gap-4 p-5 bg-white rounded-lg border border-secondaryTheme transition-all duration-300 hover:shadow-xl"
                  >
                    <div class="h-[170px] relative">
                      <img
                        :src="course.image"
                        alt="Course Category Image"
                        class="w-full h-full object-center rounded-md"
                      />
                    </div>

                    <div class="flex flex-col">
                      <p class="text-xl font-semibold text-themeText">
                        {{ course.subject_name.subject_name }}
                      </p>
                      <p class="text-xl font-semibold text-themeText">
                        {{ course.academic_year.name }} ({{
                          course.degree.degree.name
                        }})
                      </p>
                      <p class="text-xl font-semibold text-themeText">
                        {{ course.number_of_subscription }}
                        طالب مسجل
                      </p>
                      <p class="text-xl font-semibold text-themeText">
                        {{ course.status_trans }}
                      </p>

                      <div class="flex flex-col">
                        <p class="text-2xl text-mainTheme font-semibold">
                          سعر الحصة : {{ course.price }} ج.م
                        </p>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </template>
        </GlobalTabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import image1 from "/assets/media/empty_messages/empty_courses.png";

const axios = useNuxtApp().$axios;
const onlineCourses = ref([]);
const { t } = useI18n();

const currentTab = ref("online_courses");
const localePath = useLocalePath();

const tabsContent = ref([
  //   { tab: t("TABS.registered_courses"), key_name: "registered_courses" },
  { tab: t("TABS.online_courses"), key_name: "online_courses" },
]);
const getCourseDetails = async () => {
  const { data } = await axios.get(`teacher/subject?subject_kind=online`);
  onlineCourses.value = data.data;
};
const { data, status, refresh } = await useLazyAsyncData(
  "getCourseDetails",
  getCourseDetails
);

const getItems = (item) => {
  currentTab.value = item;
};
</script>

<style scoped></style>
