<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-10">
        <CandleStickChart v-if="selectedStock" :selectedStock="selectedStock"
                          @close="handleCloseClick"></CandleStickChart>
        <MyStock :stocks="myStocks" @removeFromMyStocks="removeFromMyStocks" @onStockClick="handleStockClick"/>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-10">
        <AllStock :stocks="filteredAllStocks" @addToMyStocks="addToMyStocks" @onStockClick="handleStockClick"/>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, onBeforeUnmount, computed} from 'vue';
import MyStock from "./components/MyStock.vue";
import AllStock from "@/views/components/AllStock.vue";
import CandleStickChart from "@/views/components/CandleStickChart.vue"
import {useStore} from 'vuex';

export default {
  name: "StockPage",
  components: {
    MyStock,
    AllStock,
    CandleStickChart
  },

  setup() {
    const store = useStore();
    const selectedStock = ref(null);

    // mounted() {
    //   console.log("사용자의 관심종목을 먼저 가져옴")
    //   this.$store.dispatch('fetchFavoriteMyStocks');
    // },
    const myStocks = computed(() => store.state.StockPage.myStocks);
    const allStocks = computed(() => store.state.StockPage.allStocks);
    const filteredAllStocks = computed(() => store.getters["StockPage/filteredAllStocks"])
    // const sentiment = computed(() => store.state.StockPage.sentiment);

    const fetchAllStocks = async () => {
      try {
        await store.dispatch('StockPage/fetchAllStocks');
        await store.dispatch('StockPage/fetchFavoriteMyStocks')
        // console.log("stockpage에서 fetchAllStocks액션 실행")
      } catch (error) {
        // console.error('API 에러:', error);
      }
    };

    // const alarmstock = async () => {
    //   try {
    //     await store.dispatch('StockPage/alarmstock')
    //     console.log("alarmstock 실행")
    //   } catch (error) {
    //     console.log("alarmstock 에러")
    //   }
    // };

    const addToMyStocks = (stock) => {
      store.dispatch('StockPage/addToMyStocks', stock);
    };

    const removeFromMyStocks = (stock) => {
      store.dispatch('StockPage/removeFromMyStocks', stock);
    };

    const handleStockClick = async (stock) => {
      selectedStock.value = stock;
      console.log("특정종목 클릭시 차트 데이터로 넘어가는 selectedStock확인작업", selectedStock.value._id)
      try {
        await store.dispatch('StockPage/fetchStockChartData', {
          stck_shrn_iscd: selectedStock.value.id,
          interval: 'day'
        });
      } catch (error) {
        console.error('차트 데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    const handleCloseClick = () => {
      selectedStock.value = null;
    };

    let intervalId = null;

    onMounted(async () => {
      await fetchAllStocks();
      // await alarmstock()
      // // 주식 목록을 순회하면서 각 주식에 대한 여론 데이터를 가져오는 API 호출
      // const allStocks = store.state.StockPage.allStocks;
      // for (const stock of allStocks) {
      //   await store.dispatch('StockPage/fetchSentiment', stock.initial.stck_shrn_iscd);
      // }

      intervalId = setInterval(fetchAllStocks, 10000); // 예시로 10초 간격으로 주기적 호출
    });


    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });

    return {
      allStocks,
      myStocks,
      addToMyStocks,
      removeFromMyStocks,
      handleStockClick,
      selectedStock,
      handleCloseClick,
      filteredAllStocks
    }
  }
};
</script>


<style>
.table-component, .chart-component {
  width: 50%;
}
</style>
