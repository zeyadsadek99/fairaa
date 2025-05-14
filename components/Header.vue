<script setup>
import { useAuthenticationStore } from "@/stores/authentication";
import { useNotificationsStore } from "@/stores/notifications";
import { useI18n } from "vue-i18n";
import { useStoreWishlist } from "@/stores/storeModule";
const authStore = useAuthenticationStore();
const notificationsStore = useNotificationsStore();
const { t } = useI18n();
const localePath = useLocalePath();
const store = useStoreWishlist();
const { shoppingCartItems } = storeToRefs(store);
const { profile, type, dataToVerfiy } = storeToRefs(authStore);
const smallScreensNavbarIsOpen = ref(false);
const searchIsOpen = ref(false);
const profileMenuIsOpen = ref(false);
const notificationsMenuIsOpen = ref(false);
const loading = ref(true);
const userData = computed(() => authStore.getAuthenticatedUserData());

// const cart = computed(() => store.getCart());
// const notifications = computed(() => notificationsStore.getNotifications());
// Navbar Links
const navbarLinks = ref([
  { id: "0", url: "/", text: t("NAVBAR.home"), user_type: "all" },
  { id: "1", url: "/about-us", text: t("NAVBAR.about_us"), user_type: "all" },
  {
    id: "2",
    url: "/my-sons",
    text: t("NAVBAR.my_sons"),
    user_type: "parent",
  },
  {
    id: "3",
    url: "/courses",
    text: t("NAVBAR.subjects"),
    user_type: "student",
  },
  {
    id: "4",
    url: "/teachers",
    text: t("NAVBAR.teachers"),
    user_type: "student",
  },
  { id: "5", url: "/store", text: t("NAVBAR.store"), user_type: "student" },
  {
    id: "6",
    url: "/subjects",
    text: t("NAVBAR.added_subjects"),
    user_type: "teacher",
  },
]);

// Methods
const toggleSmallScreensNavBar = () => {
  smallScreensNavbarIsOpen.value = !smallScreensNavbarIsOpen.value;
  searchIsOpen.value = false;
  profileMenuIsOpen.value = false;
  notificationsMenuIsOpen.value = false;
};

const toggleSearch = () => {
  searchIsOpen.value = !searchIsOpen.value;
  smallScreensNavbarIsOpen.value = false;
  profileMenuIsOpen.value = false;
  notificationsMenuIsOpen.value = false;
};

const toggleProfileMenu = () => {
  profileMenuIsOpen.value = !profileMenuIsOpen.value;
  smallScreensNavbarIsOpen.value = false;
  searchIsOpen.value = false;
  notificationsMenuIsOpen.value = false;
};

const toggleNotificationsMenu = () => {
  notificationsMenuIsOpen.value = !notificationsMenuIsOpen.value;
  smallScreensNavbarIsOpen.value = false;
  searchIsOpen.value = false;
  profileMenuIsOpen.value = false;
  // notificationsStore.getNotifications();
};
const closeMenus = () => {
  profileMenuIsOpen.value = false;
  notificationsMenuIsOpen.value = false;
};

// const logout = () => {
//   // Reset the necessary data
//   dataToVerfiy.value = null;
//   type.value = null;
//   token.value = null;
//   profile.value = null;
//   avatar.value = null;

//   // Navigate to the root page and reload the page
//   navigateTo("/").then(() => {
//     window.location.reload();
//   });
// };
const logout = async () => {
  authStore.logout();
};

onUnmounted(() => {
  window.removeEventListener("click", closeMenus);
});
onMounted(async () => {
  window.addEventListener("click", closeMenus);

  if (useCookie("elmo3lm_elmosa3d_user_token").value) {
    try {
      await notificationsStore.getNotifications();
      if (type.value === "student") {
        await store.getCart();
      }
    } catch (error) {
      console.error("Error fetching notifications or cart data:", error);
    }
  }
  loading.value = false;
});
</script>
<template>
  <template v-if="!loading">
    <nav id="navbar" class="navbar">
      <Search v-if="searchIsOpen" @closeSearch="toggleSearch" />

      <div class="navbar_wrapper">
        <div class="flex items-center justify-between gap-6 container">
          <div class="flex items-center gap-1 lg:gap-9">
            <NuxtLink class="logo_wrapper" :to="localePath('/')">
              <img
                src="../assets/media/logo/logo.svg"
                alt="Al-Moalem Al-Mosaed App Logo"
                width="81"
                height="67"
              />
            </NuxtLink>

            <HeaderNavLinks :navbarLinks="navbarLinks" :type="type" />
          </div>

          <div class="navbar_btns_wrapper">
            <NuxtLink
              v-if="!userData?.token"
              :to="localePath('/login')"
              class="login_route"
            >
              {{ t("NAVBAR.login") }}
            </NuxtLink>

            <NuxtLink
              v-if="!userData.token"
              :to="localePath('/register')"
              class="register_route btn2"
            >
              {{ t("NAVBAR.register") }}
            </NuxtLink>

            <NuxtLink
              v-show="userData?.token && type == 'teacher'"
              :to="localePath('/add-subject')"
              class="add_subject_route btn2"
            >
              <span>
                <IconsPlus />
              </span>
              {{ t("NAVBAR.add_subject") }}
            </NuxtLink>

            <div
              class="user_notification_content_wrapper"
              v-if="userData?.token"
            >
              <button class="label1" @click.stop="toggleNotificationsMenu">
                <IconsBell />

                <span
                  class="badge"
                  v-show="notificationsStore.unreadNotifications !== 0"
                >
                  {{ notificationsStore.unreadNotifications }}
                </span>
                <span class="toolTip">
                  {{ t("TOOLTIPS.notifications") }}
                </span>
              </button>

              <transition name="fadeInUp" mode="out-in">
                <ul class="notifications_menu" v-if="notificationsMenuIsOpen">
                  <li
                    class="empty_image"
                    v-if="notificationsStore?.notifications.length == 0"
                  >
                    <img
                      src="../assets/media/empty_messages/empty_notifications.png"
                      alt="Empty Notifications"
                      width="180"
                      height="90"
                    />
                  </li>
                  <li
                    v-for="notification in notificationsStore?.notifications"
                    :key="notification.id"
                    class="notifications_menu_item"
                  >
                    <div class="icon_wrapper">
                      <span class="notification_icon_wrapper">
                        <IconsBell />
                      </span>
                    </div>
                    <div class="notification_body_wrapper">
                      <p class="notification_body">{{ notification.body }}</p>
                      <p class="notification_date">
                        {{ notification.created_at }}
                      </p>
                    </div>
                    <div class="delete_btn_wrapper">
                      <button
                        class="delete_notification_btn"
                        @click.stop="
                          notificationsStore.deleteNotification(notification.id)
                        "
                      >
                        <IconsTrash />
                      </button>
                    </div>
                  </li>
                </ul>
              </transition>
            </div>

            <NuxtLink
              v-if="userData?.token"
              :to="localePath('/chat')"
              class="route"
            >
              <IconsChat class="" />
              <span class="toolTip">{{ t("TOOLTIPS.chats") }}</span>
            </NuxtLink>
            <NuxtLink
              v-if="userData.token && (type == 'parent' || type == 'teacher')"
              :to="localePath('/strengthening-requests')"
              class="route"
            >
              <IconsBook />
              <span class="toolTip">{{
                t("TOOLTIPS.strengthening_requests")
              }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="userData.token && type == 'student'"
              :to="localePath('/my-courses')"
              class="route"
            >
              <IconsBook />
              <span class="toolTip">{{ t("TOOLTIPS.my_courses") }}</span>
            </NuxtLink>

            <NuxtLink
              v-if="userData?.token && type == 'student'"
              :to="localePath('/cart')"
              class="label1"
            >
              <IconsCart />
              <span v-if="shoppingCartItems.cart_count > 0" class="badge">{{
                shoppingCartItems.cart_count
              }}</span>
              <span class="toolTip">{{ t("TOOLTIPS.shopping_cart") }}</span>
            </NuxtLink>

            <button
              class="label1"
              @click="toggleSearch"
              v-if="userData.token && type === 'student'"
            >
              <IconsSearch />
              <span class="toolTip">{{ t("TOOLTIPS.search") }}</span>
            </button>

            <div class="relative" v-if="profile">
              <button
                class="user_profile_menu_btn"
                @click.stop="toggleProfileMenu"
              >
                <div class="size-10 rounded-[10px] overflow-hidden">
                  <img
                    :src="profile.profile_image"
                    width="45"
                    height="45"
                    class="w-full h-full object-cover"
                  />
                </div>
              </button>

              <transition name="fadeInUp" mode="out-in">
                <ul v-if="profileMenuIsOpen" class="user_profile_menu">
                  <li
                    class="user_profile_menu_item"
                    @click.stop="toggleProfileMenu"
                  >
                    <NuxtLink :to="localePath('/user-account')">
                      {{ t("NAVBAR.my_account") }}
                    </NuxtLink>
                  </li>

                  <li
                    v-if="type === 'teacher'"
                    class="user_profile_menu_item"
                    @click.stop="toggleProfileMenu"
                  >
                    <NuxtLink :to="localePath('/my-courses')">
                      {{ t("NAVBAR.my_tutorials") }}
                    </NuxtLink>
                  </li>

                  <li
                    v-if="type === 'teacher'"
                    class="user_profile_menu_item"
                    @click.stop="toggleProfileMenu"
                  >
                    <NuxtLink :to="localePath('/my-balance')">
                      {{ t("NAVBAR.my_cash") }}
                    </NuxtLink>
                  </li>

                  <li
                    v-if="type === 'student' || type === 'teacher'"
                    class="user_profile_menu_item"
                    @click.stop="toggleProfileMenu"
                  >
                    <NuxtLink :to="localePath('/favorites')">
                      {{ t("NAVBAR.favorites") }}
                    </NuxtLink>
                  </li>

                  <li
                    v-if="type === 'student'"
                    class="user_profile_menu_item"
                    @click.stop="toggleProfileMenu"
                  >
                    <NuxtLink :to="localePath('/orders')">
                      {{ t("NAVBAR.my_orders") }}
                    </NuxtLink>
                  </li>

                  <li class="user_profile_menu_item">
                    <button @click="logout">
                      {{ t("BUTTONS.logout") }}
                    </button>
                  </li>
                </ul>
              </transition>
            </div>

            <button
              class="small_screens_navbar_toggeler"
              @click="toggleSmallScreensNavBar"
            >
              <IconsBars class="size-8" />
            </button>
          </div>
        </div>
      </div>

      <div
        class="small_screens_navbar"
        :class="smallScreensNavbarIsOpen ? 'left-0' : '-left-full'"
      >
        <button class="close_btn" @click="toggleSmallScreensNavBar">
          <IconsClose />
        </button>

        <ul class="small_screens_links">
          <li v-if="!userData.token" @click="toggleSmallScreensNavBar">
            <NuxtLink :to="localePath('/login')">{{
              $t("NAVBAR.login")
            }}</NuxtLink>
          </li>
          <li v-if="!userData.token" @click="toggleSmallScreensNavBar">
            <NuxtLink :to="localePath('/register')">{{
              $t("NAVBAR.register")
            }}</NuxtLink>
          </li>

          <li
            v-for="link in navbarLinks"
            :key="link.id"
            v-show="link?.user_type == type || link?.user_type == 'all'"
            @click="toggleSmallScreensNavBar"
          >
            <NuxtLink :to="localePath(link.url)">{{ link.text }}</NuxtLink>
          </li>

          <li
            v-if="userData.token && type === 'teacher'"
            @click="toggleSmallScreensNavBar"
          >
            <NuxtLink :to="localePath('/add-subject')">{{
              $t("NAVBAR.add_subject")
            }}</NuxtLink>
          </li>

          <li v-if="userData.token" @click="toggleSmallScreensNavBar">
            <NuxtLink :to="localePath('/chat')">{{
              $t("NAVBAR.chats")
            }}</NuxtLink>
          </li>

          <li
            v-if="userData.token && (type === 'parent' || type === 'teacher')"
            @click="toggleSmallScreensNavBar"
          >
            <NuxtLink :to="localePath('/strengthening-requests')">{{
              $t("NAVBAR.strengthening_requests")
            }}</NuxtLink>
          </li>

          <li
            v-if="userData.token && type === 'student'"
            @click="toggleSmallScreensNavBar"
          >
            <NuxtLink :to="localePath('/my-courses')">{{
              $t("NAVBAR.my_courses")
            }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </template>
</template>
<style>
.navbar {
  @apply relative py-3 md:py-6 bg-themeBg;
  .navbar_wrapper {
    .logo_wrapper img {
      @apply w-[71px] h-[57px] md:w-[81px] md:h-[67px];
    }
    .navbar_btns_wrapper {
      @apply justify-end flex items-center gap-2.5;
      .login_route {
        @apply relative text-[22px] font-semibold whitespace-nowrap text-mainTheme px-2.5 py-2;
      }
      .add_subject_route {
        @apply hidden md:flex  items-center whitespace-nowrap  gap-1;
        span {
          @apply flex items-center justify-center;
        }
      }
      .user_notification_content_wrapper {
        @apply relative;
        .notifications_menu {
          @apply absolute top-[130%] left-1/2 transform -translate-x-1/2 
       z-40 list-none min-w-[280px] w-fit  flex flex-col items-center 
      justify-center bg-themeBg rounded-[10px] shadow-[0_0_10px_2px_var(--simple_shadow_clr)]  overflow-hidden;
          .empty_image {
            @apply p-4 flex items-center justify-center;
          }
          .notifications_menu_item {
            @apply w-full p-3 flex items-center justify-start gap-2 
          transition-all duration-[400ms] border-b last:border-b-0 last:mb-2 border-veryLightTheme;

            &:hover {
              @apply bg-softMainTheme;
            }
            .icon_wrapper {
              @apply w-1/5;
              .notification_icon_wrapper {
                @apply flex items-center justify-center size-10 bg-mainTheme 
              text-white rounded-lg;
                svg {
                  @apply text-white text-lg;
                }
              }
            }
            .notification_body_wrapper {
              @apply w-3/5;
              .notification_body {
                @apply text-themeText text-lg font-medium leading-relaxed;
              }
              .notification_date {
                @apply text-lightGray text-sm font-medium;
              }
            }
            .delete_btn_wrapper {
              @apply w-1/5 flex items-center justify-center;
              .delete_notification_btn {
                @apply flex items-center justify-center size-10 bg-secondaryTheme 
            text-midRed rounded-full transition hover:bg-red-200;
                svg {
                  @apply text-lg text-midRed;
                }
              }
            }
          }
        }
      }
      .label1 {
        @apply relative size-10 flex items-center justify-center 
        !bg-softMainTheme text-mainTheme rounded-lg;
        .badge {
          @apply absolute -top-2 right-0.5 flex items-center justify-center 
      min-w-[17px] h-[17px] text-xs rounded-3xl 
      text-white bg-mainTheme;
        }
      }
      .route {
        @apply hidden md:flex relative size-10  items-center justify-center 
        !bg-softMainTheme text-mainTheme rounded-lg;
      }
      .toolTip {
        @apply absolute bottom-[-35px] left-0 right-0 
      w-max px-2 text-lg font-medium text-themeText 
      bg-themeBg shadow-lg rounded-lg 
      z-[21] transition-all duration-300 
      transform scale-0 opacity-0 origin-top;
      }
      :hover .toolTip {
        @apply scale-100 opacity-100;
      }
      .user_profile_menu {
        @apply absolute top-[130%] left-0   list-none bg-themeBg rounded-[10px] shadow-[0_0_10px_2px_var(--simple_shadow_clr)] z-[31] overflow-hidden w-max;
        .user_profile_menu_item {
          @apply transition-all duration-[400ms] ease-in-out;
          &:hover {
            @apply bg-softMainTheme;
          }
          a,
          button {
            @apply block relative w-full text-center py-1.5 px-6 text-themeText text-[22px] font-medium;
          }
          &:not(:last-of-type) {
            @apply border-b !border-veryLightTheme;
          }
        }
      }
      .small_screens_navbar_toggeler {
        @apply text-[22px] text-mainTheme flex items-center justify-center md:hidden;
      }
    }
  }
  .small_screens_navbar {
    @apply fixed top-0  w-full h-screen bg-[rgba(0,0,0,0.8)] backdrop-blur-sm z-30 flex items-center justify-center transition-all duration-500;
    .close_btn {
      @apply absolute top-6 left-6 text-white text-2xl transition-transform duration-500;
      &:hover {
        @apply text-midRed rotate-90 scale-110;
      }
    }

    .small_screens_links {
      @apply list-none  mt-12;
      li {
        @apply text-center py-2;
        a {
          @apply text-white text-2xl font-medium transition-colors duration-300;
          &:hover {
            @apply text-mainTheme;
          }
          &.router-link-exact-active {
            @apply text-mainTheme;
          }
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .login_route,
  .register_route {
    @apply hidden;
  }
}

.fadeInUp-enter-active,
.fadeInUp-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fadeInUp-enter-from,
.fadeInUp-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
