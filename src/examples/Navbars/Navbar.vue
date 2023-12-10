<template>
  <nav
      v-bind="$attrs"
      id="navbarBlur"
      class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl"
      data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs :current-page="currentRouteName" :text-white="textWhite"/>
      <div
          id="navbar"
          class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
          :class="$store.state.isRTL ? 'px-0' : 'me-sm-4'"
      >
        <div
            class="pe-md-3 d-flex align-items-center"
            :class="$store.state.isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
        <button type="button" class="btn btn-info mt-3 fs-5" @click="signOut">로그아웃</button>
        </div>

      </div>
    </div>
  </nav>
</template>
<script>
import Breadcrumbs from "../Breadcrumbs.vue";
import {mapMutations, mapActions} from "vuex";
import router from "../../router/index"

export default {
  name: "NavbarComponent",

  components: {
    Breadcrumbs,
  },
  props: {
    minNav: {
      type: Function,
      default: () => {
      }
    },
    textWhite: {
      type: String,
      default: ""
    },
  },
  setup() {
    const signOut = () => {
      const sessionStorage = window.sessionStorage
      sessionStorage.clear()
      router.push({name : "Home"})
    }

    return {
      signOut
    }
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  created() {
    this.minNav;
  },
  updated() {
    const navbar = document.getElementById("navbarBlur");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10 && this.$store.state.isNavFixed) {
        navbar.classList.add("blur");
        navbar.classList.add("position-sticky");
        navbar.classList.add("shadow-blur");
      } else {
        navbar.classList.remove("blur");
        navbar.classList.remove("position-sticky");
        navbar.classList.remove("shadow-blur");
      }
    });
  }, methods: {
    ...mapMutations(["navbarMinimize", "toggleConfigurator"]),
    ...mapActions(["toggleSidebarColor"]),

    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },
  },
};
</script>
