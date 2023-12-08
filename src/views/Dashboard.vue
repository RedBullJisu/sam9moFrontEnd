<template>
  <!-- 코스피,코스닥,코스피200 area 차트 -->
  <div class="row justify-content-center">
    <div class="col-lg-10">
      <div class="card z-index-2 chart-width">
        <StockAreaChart/>
      </div>
    </div>
  </div>

  <!-- NewsHashTag 차트 -->
  <div class="row justify-content-center">
    <div class="col-lg-10">
      <div class="card z-index-2 hashtag-list custom-height">
        <NewsHashTagChart/>
      </div>
    </div>
  </div>

  <!-- n-gram bubble 차트 -->
  <div class="row justify-content-center">
    <div class="col-lg-10">
      <div class="card z-index-2 chart-width">
          <NgramChart/>
      </div>
    </div>
  </div>




</template>
<script>

import US from "../assets/img/icons/flags/US.png";
import DE from "../assets/img/icons/flags/DE.png";
import GB from "../assets/img/icons/flags/GB.png";
import BR from "../assets/img/icons/flags/BR.png";
import NgramChart from "@/views/components/NgramChart.vue";
import NewsHashTagChart from "@/views/components/NewsHashTag.vue";
import StockAreaChart from "@/views/components/StockAreaChart.vue";

export default {
  name: "DashboardDefault",
  components: {
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
  margin-left: auto;
}

.hashtag-list {
  margin-top: 30px;
}

.custom-height {
  height: 150px; /* 뉴스해시태그 영역 높이 */
  margin-bottom: 30px
}
</style>