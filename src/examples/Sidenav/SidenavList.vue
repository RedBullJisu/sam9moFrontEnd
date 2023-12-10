<template>
  <div id="sidenav-collapse-main" class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100">
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse class="menuText" :class="{ 'nav-text': true, 'active': $route.name === 'Dashboard' }" nav-text="메인" :to="{ name: 'Dashboard' }">
          <template #icon>
            <icon name="dashboard" />
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse :class="{ 'nav-text': true, 'active': $route.name === 'Tables' }" nav-text="증권" :to="{ name: 'Tables' }">
          <template #icon>
            <icon name="tables" />
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse :class="{ 'nav-text': true, 'active': $route.name === 'Billing' }" nav-text="뉴스" :to="{ name: 'Billing' }">
          <template #icon>
            <icon name="billing" />
          </template>
        </sidenav-collapse>
      </li>
      <li class="mt-3 nav-item">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6" :class="$store.state.isRTL ? 'me-4' : 'ms-2'">페이지</h6>
      </li>
      <li class="nav-item">
        <sidenav-collapse :class="{ 'nav-text': true, 'active': $route.name === 'Sign In' }" nav-text="로그인" :to="{ name: 'Sign In' }">
          <template #icon>
            <icon name="sign-in" />
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse :class="{ 'nav-text': true, 'active': $route.name === 'Sign Up' }" nav-text="회원가입" :to="{ name: 'Sign Up' }">
          <template #icon>
            <icon name="sign-up" />
          </template>
        </sidenav-collapse>
      </li>
    </ul>
  </div>

</template>
<script>
import Icon from "@/components/Icon.vue";
//import SidenavCollapse from "./SidenavCollapse.vue";
import router from "../../router/index"
import axios from 'axios';

export default {
  name: "SidenavList",
  components: {
    Icon,
    //SidenavCollapse,
  },
  props: {
    cardBg: {
      type: String,
      default: ""
    },
  },
  setup () {

    const sessionStorage = window.sessionStorage;
    const url = "http://221.156.60.18:8989/ping";
    const token = JSON.parse(sessionStorage.getItem("token"))

    const rendering = async () => {
      console.log("sessionStorage", sessionStorage)
      
      if (sessionStorage.length == 0) {
        router.push({name: "Sign In"})
      } else {
        console.log("token", token)  
        let pingHeader = {
          headers : {
            "Authorization" : `Bearer ${token.token_data.accessToken}`,
            "Refresh-Token" : `Bearer ${token.token_data.refreshToken}`,
            "finance-agent" : "SAM9MO/0.0.1"
          }
        }

        console.log("pingHeader", pingHeader)
        const response = await axios.get(url, pingHeader).catch(() => null)
        
        const new_access_token = response.headers["new-access-token"]
        console.log("new_access_token", new_access_token)

        if (new_access_token != null) {
          token.token_data.accessToken = new_access_token
          sessionStorage.setItem("token", JSON.stringify(token))
        }
      }
    }

    rendering()


  },
  data() {
    return {
      title: "Vite Soft UI Dashboard",
      controls: "dashboardsExamples",
      isActive: "active",
    };
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
  },
};
</script>

<style scoped>

.nav-text {
  color: white !important;
}
.nav-text.active {
  color: black !important;
}
</style>