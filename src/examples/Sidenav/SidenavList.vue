<template>
  <div
      id="sidenav-collapse-main"
      class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse nav-text="메인" :to="{ name: 'Dashboard' }">
          <template #icon>
            <icon name="dashboard"/>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse nav-text="증권" :to="{ name: 'Tables' }">
          <template #icon>
            <icon name="tables"/>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse nav-text="뉴스" :to="{ name: 'Billing' }">
          <template #icon>
            <icon name="billing"/>
          </template>
        </sidenav-collapse>
      </li>


      <li class="mt-3 nav-item">
        <h6
            class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
            :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >페이지</h6>
      </li>

      <li class="nav-item">
        <sidenav-collapse nav-text="로그인" :to="{ name: 'Sign In' }">
          <template #icon>
            <icon name="sign-in"/>
          </template>
        </sidenav-collapse>
      </li>
      <li class="nav-item">
        <sidenav-collapse nav-text="회원가입" :to="{ name: 'Sign Up' }">
          <template #icon>
            <icon name="sign-up"/>
          </template>
        </sidenav-collapse>
      </li>
    </ul>
  </div>
  <!--  ------------------------------------------------------------------------------------------------------------------------->
  <!--  <div id="alarm" class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="display: none">-->
  <!--    <div class="toast-header">-->
  <!--      <svg class="bd-placeholder-img rounded me-2" width="50" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#007aff"></rect></svg>-->
  <!--      <strong id="stock_name" class="me-auto">{{ stock_name }}</strong>-->
  <!--      <small id="time_now">{{ time_now }}</small>-->
  <!--      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close">X</button>-->
  <!--    </div>-->
  <!--    <div id="stock_content" class="toast-body">-->
  <!--      {{ stock_content }}-->
  <!--    </div>-->
  <!--  </div>-->
  <!--  -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->

  <!--  <div id="alarm" class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" style="display: none">-->
  <!--    <div class="toast-header">-->
  <!--      <strong class="me-auto">{{ stock_name }}</strong>-->
  <!--      <small class="text-body-secondary">{{ time_now }}</small>-->
  <!--      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>-->
  <!--    </div>-->
  <!--    <div class="toast-body">-->
  <!--      {{ stock_content }}-->
  <!--    </div>-->
  <!--  </div>-->

  <div id="alarm" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <strong class="me-auto">{{ stock_name }}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <span>{{ time_now }}</span>
    <div class="toast-body">
      {{ stock_content }}
    </div>
  </div>

</template>
<script>
import Icon from "@/components/Icon.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import axios from "axios";
import {onBeforeUnmount, onMounted, ref} from "vue";


export default {
  name: "SidenavList",
  components: {
    Icon,
    SidenavCollapse,
  },
  props: {
    cardBg: {
      type: String,
      default: ""
    },
  },
  setup() {


    const stock_name = ref('');
    const time_now = ref('');
    const stock_content = ref('');

    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    //   let intervalId = null;
    //     onMounted( () => {
    //       const Alarm_All = async() => {
    //         const url = "http://192.168.0.91/alarm"
    //         console.log("확인")
    //
    //         const session = window.sessionStorage
    //
    //         let favorite_stock = JSON.parse(session.getItem("favorite_stock"))
    //         console.log("favorite_stock", favorite_stock.favorite_stock)
    //         favorite_stock = favorite_stock.favorite_stock
    //         console.log("favorite_stock",favorite_stock)
    //         const response = await axios.get(url).catch(() => null)
    //         console.log("response",response)
    //         if (!response) return null
    //
    //         const alarm_result = response.data
    //
    //         console.log("alarm_result", alarm_result)
    //         console.log("Object.keys(favorite_stock[j])[0]",Object.keys(favorite_stock[0])[0])
    //         for(let i=0; i<alarm_result.length; i++){
    //          for(let j=0; j<favorite_stock.length; j++){
    //            if(alarm_result[i].stock_num === Object.keys(favorite_stock[j])[0] && favorite_stock[j].fluctuation != "" ){
    //              if(favorite_stock[j].fluctuation_toggle === "plus" &&  favorite_stock[j].fluctuation >= alarm_result.percentage_chage){
    //                document.getElementById("alarm").style.display = "block";//plus
    //                stock_name.value =`종목명 ${favorite_stock[j].name}`
    //                time_now.value = `현재시간 : ${year}년 ${month}월 ${day}일 ${hours}시간 ${minutes}분`
    //                stock_content.value = favorite_stock[j].fluctuation.toFixed(2)
    //              }else if(favorite_stock[j].fluctuation_toggle === "minus" &&  favorite_stock[j].fluctuation <= alarm_result.percentage_chage){
    //                document.getElementById("alarm").style.display = "block";//minus
    //              }else{
    //                continue //위 조건에 안맞으면 다음 조건으로 넘어가버림
    //              }
    //            }else{
    //                 continue //위 조건에 안맞으면 다음 조건으로 넘어가버림
    //            }
    //
    //          }
    //         }
    //
    //       }
    //       intervalId = setInterval(Alarm_All, 1000); // 예시로 10초 간격으로 주기적 호출
    //     });
    //
    //     onBeforeUnmount(() => {
    //       clearInterval(intervalId);
    //     });
    //
    //
    // },

    const Alarm_All = async () => {
      const url = "http://121.179.83.68:9101/alarm"


      const session = window.sessionStorage

      let favorite_stock = JSON.parse(session.getItem("favorite_stock"))
      // console.log("favorite_stock", favorite_stock.favorite_stock)
      favorite_stock = favorite_stock.favorite_stock
      // console.log("favorite_stock", favorite_stock)
      const response = await axios.get(url).catch(() => null)
      // console.log("response",response)
      if (!response) return null

      const alarm_result = response.data
      //[Object.keys(favorite_stock[j])[0]].fluctuation)
      for (let i = 0; i < alarm_result.length; i++) {
        for (let j = 0; j < favorite_stock.length; j++) {
          if (alarm_result[i].stock_num === Object.keys(favorite_stock[j])[0] && favorite_stock[j][Object.keys(favorite_stock[j])[0]].fluctuation !== "") {
            if (favorite_stock[j][Object.keys(favorite_stock[j])[0]].fluctuation_toggle === "plus" && favorite_stock[j][Object.keys(favorite_stock[j])[0]].fluctuation >= alarm_result[i].percent_change) {
              document.getElementById("alarm").style.display = "block";//plus
              console.log("style", document.getElementById("alarm").style.display)
              stock_name.value = `종목명 ${favorite_stock[j][Object.keys(favorite_stock[j])[0]].name}`
              console.log("종목명", stock_name.value)
              time_now.value = `현재시간 : ${year}년 ${month}월 ${day}일 ${hours}시간 ${minutes}분`
              console.log("시간", time_now.value)
              stock_content.value = `주식상승률: ${favorite_stock[j][Object.keys(favorite_stock[j])[0]].fluctuation}`
              console.log("주식상승률", stock_content.value)
            } else if (favorite_stock[j][Object.keys(favorite_stock[j])[0]].fluctuation_toggle === "minus" && favorite_stock[j][Object.keys(favorite_stock[j])[0]].fluctuation <= alarm_result[i].percent_change) {
              document.getElementById("alarm").style.display = "bl ock";//minus
              stock_name.value = `종목명 ${favorite_stock[j][Object.keys(favorite_stock[j])[0]].name}`
              console.log("elseif종목명", stock_name.value)
              time_now.value = `현재시간 : ${year}년 ${month}월 ${day}일 ${hours}시간 ${minutes}분`
              console.log("시간", time_now.value)
              stock_content.value = favorite_stock[j][Object.keys(favorite_stock[j])[0]].fluctuation
              console.log("주식하락률", stock_content.value)
            } else {
              continue //위 조건에 안맞으면 다음 조건으로 넘어가버림
            }
          } else {
            continue //위 조건에 안맞으면 다음 조건으로 넘어가버림
          }
        }
      }
    };
    let intervalId = null;

    onMounted(async () => {
      await Alarm_All;

      intervalId = setInterval(Alarm_All, 5000);
    });


    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    return{
      stock_name,
      time_now,
      stock_content
    }

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


