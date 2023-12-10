<template>
  <!-- 코스피,코스닥,코스피200 area 차트 -->
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-6">
        <div class="card-header pb-3"
             style="border-top-left-radius: 15px;
             border-top-right-radius: 15px;
             background-color: #0b54c4;">
        </div>
        <div class="card-body shadow-lg" style="border-bottom-left-radius: 15px;
             border-bottom-right-radius: 15px; background-color: #ffffff">
          <StockAreaChart/>
        </div>
      </div>


      <!-- n-gram bubble 차트 -->
      <div class="col-md-6">
        <div class="card-header pb-3"
             style="border-top-left-radius: 15px;
             border-top-right-radius: 15px;
             background-color: #0b54c4;">
        </div>

        <div class="card-body shadow-lg" style="border-bottom-left-radius: 15px;
             border-bottom-right-radius: 15px; background-color: #ffffff">
          <h5 class="bubble-text">
            오늘의 키워드
          </h5>
          <NgramChart/>
        </div>
      </div>
    </div>
  </div>



  <!-- NewsHashTag 차트 -->
<!--  <div class="card-header pb-0"-->
<!--       style="border-top-left-radius: 15px;-->
<!--             border-top-right-radius: 15px;-->
<!--             background-color: #0b54c4;">-->
<!--  <div class="row justify-content-center">-->
    <div class="col-lg-11">
      <div class="card z-index-2 custom-height">
        <NewsHashTagChart/>
      </div>
    </div>
<!--  </div>-->
<!--  </div>-->

  <!--  <div class="py-4 container-fluid">-->
  <!--    <div class="row">-->
  <!--      <div class="col-md-6">-->

  <!--      </div>-->
  <!--    </div>-->


  <!-- NewsHashTag 차트 -->
<!--    <div class="col-md-11">-->
<!--      <div class=" hashtag-height" style="background-color: #0b54c4">-->
<!--        <h5 style="color: #ffffff">뉴스 해시태그 순위</h5>-->
<!--      </div>-->

<!--      <div class="card-body shadow-lg" style="border-bottom-left-radius: 15px;-->
<!--             border-bottom-right-radius: 15px; background-color: #ffffff">-->
<!--        <NewsHashTagChart/>-->
<!--      </div>-->
<!--    </div>-->

  <!--  <div class="row justify-content-center">-->
  <!--    <div class="col-lg-11">-->
  <!--      <div class="card z-index-2 custom-height">-->

  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->

  <!--  <div>-->
  <!--  <NewsPage />-->
  <!--  </div>-->


</template>
<script>

import US from "../assets/img/icons/flags/US.png";
import DE from "../assets/img/icons/flags/DE.png";
import GB from "../assets/img/icons/flags/GB.png";
import BR from "../assets/img/icons/flags/BR.png";
import NgramChart from "@/views/components/NgramChart.vue";
import NewsHashTagChart from "@/views/components/NewsHashTag.vue";
import StockAreaChart from "@/views/components/StockAreaChart.vue";
import NewsPage from "@/views/News.vue";

export default {
  name: "DashboardDefault",
  components: {
    NewsPage,
    StockAreaChart,
    NewsHashTagChart,
    NgramChart,
  },
  data() {
    return {
      stats: {
        iconBackground: "bg-gradient-success",
        money: {
          title: "Today's Money",
          value: "$53,000",
          percentage: "+55%",
          iconClass: "ni ni-money-coins",
        },
        users: {
          title: "Today's Users",
          value: "2,300",
          percentage: "+3%",
          iconClass: "ni ni-world",
        },
        clients: {
          title: "New Clients",
          value: "+3,462",
          percentage: "-2%",
          iconClass: "ni ni-paper-diploma",
          percentageColor: "text-danger",
        },
        sales: {
          title: "Sales",
          value: "$103,430",
          percentage: "+5%",
          iconClass: "ni ni-cart",
        },
      },
      sales: {
        us: {
          country: "United States",
          sales: 2500,
          value: "$230,900",
          bounce: "29.9%",
          flag: US,
        },
        germany: {
          country: "Germany",
          sales: "3.900",
          value: "$440,000",
          bounce: "40.22%",
          flag: DE,
        },
        britain: {
          country: "Great Britain",
          sales: "1.400",
          value: "$190,700",
          bounce: "23.44%",
          flag: GB,
        },
        brasil: {
          country: "Brasil",
          sales: "562",
          value: "$143,960",
          bounce: "32.14%",
          flag: BR,
        },
      },
    };
  },
};
</script>
<style scoped>


.chart-width {
  width: 100%;
  padding-inline: 10px;
  padding-bottom: 10px;
}


.custom-height {
  height: 150px; /* 뉴스해시태그 영역 높이 */
  margin-bottom: 30px
}


.bubble-text {
  margin-left: 10px;
  margin-top: 10px;
}

.hashtag-height {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

</style>