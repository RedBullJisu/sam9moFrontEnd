<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>모든종목</h6>
      <select v-model="selectedMarket" @change="updateMarket">
        <option value="kospi">코스피</option>
        <option value="kosdaq">코스닥</option>
      </select>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <thead>
          <tr>
            <th class="text-xs font-weight-bolder opacity-7">종목명</th>
            <th
                class="text-xs font-weight-bolder opacity-7 ps-2"
            >현재가
            </th>
            <th
                class="text-center text-xs font-weight-bolder opacity-7"
            >등락율
            </th>
            <th
                class="text-center text-xs font-weight-bolder opacity-7"
            >여론
            </th>
            <th
                class="text-center text-xs font-weight-bolder opacity-7"
            >시가총액
            </th>
            <th
                class="text-center text-xs font-weight-bolder opacity-7"
            >누적거래량
            </th>
            <th
                class="text-center text-xs font-weight-bolder opacity-7"
            >관심종목 추가
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="stock in currentMarketStocks" :key="stock.id" class="hover:bg-gray-200"  @click="onStockClick(stock)">
            <td>
              <div class="d-flex px-2 py-1">

                <!--                프로필 이미지 컴포넌트(회사로고나 뉴스기사에도 사용할 수 있을듯)-->
                <!--                <div>-->
                <!--                  <vsud-avatar :img="img1" size="sm" border-radius="lg" class="me-3" alt="user1"/>-->
                <!--                </div>-->

                <div class="d-flex flex-column justify-content-center ">
                  <h6 class="mb-0 text-sm"><p>{{ stock.initial.COMPANY }}</p></h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0 ">
                {{ stock.current_trade.STCK_PRPR ? stock.current_trade.STCK_PRPR : stock.initial.stck_prpr }}
              </p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0 "> </p>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">여론</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ stock.initial.hts_avls }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{
                  stock.current_trade.ACML_VOL ? stock.current_trade.ACML_VOL : stock.initial.acml_vol
                }}</span>
            </td>
            <td class="px-6 py-4 text-gray-500 border-b">
              <!-- 이 버튼을 클릭하면 해당 주식을 관심 주식으로 추가하는 액션 호출 -->
              <button @click.stop="addToMyStocks(stock)" class="chart-toggler" type="button">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </button>
            </td>
          </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex'
import axios from "axios";

export default {
  name: "AllStock",
  setup(props, context) {
    const store = useStore();
    const selectedMarket = ref(store.state.StockPage.currentMarket);
    const filteredAllStocks = computed(() => store.getters["StockPage/filteredAllStocks"])

    // const sentiment = computed(()=> store.state.StockPage.sentiment);
    console.log("allstock컴포넌트에서 필터링된 모든주식",filteredAllStocks.value)
    // console.log("allstock컴포넌트에서 sentiment 확인",sentiment)

    // 선택된 시장의 주식 데이터를 가져옵니다.
    const currentMarketStocks = computed(() => {
      if (filteredAllStocks.value) { // allStocks가 정의되었는지 확인합니다.
        // 선택된 시장에 따른 주식 데이터를 가져옵니다.
        if (selectedMarket.value === 'kospi') {
          return filteredAllStocks.value.filter(stock => stock.market === 'kospi');
        } else {
          return filteredAllStocks.value.filter(stock => stock.market === 'kosdaq');
        }
      } else {
        return []; // allStocks가 정의되지 않았다면 빈 배열을 반환합니다.
      }
    });

    function onStockClick(stock) {
      store.dispatch('StockPage/fetchStockChartData', { stck_shrn_iscd: stock.initial.stck_shrn_iscd, interval: 'day' });
      context.emit('onStockClick', stock);
      // console.log("stock",stock)
    }

    function updateMarket() {
      store.dispatch('StockPage/updateMarket', selectedMarket.value);
    }

    const addToMyStocks = async (stock)=> {
      store.dispatch('StockPage/addToMyStocks', stock);
      // const alarmstock = { stockid: stock.initial.stck_shrn_iscd, morLes: '+', username: "장건욱", price: 0.1};
      // console.log("allstock에서 넘어가는 stockid 확인",alarmstock)
      // store.dispatch("StockPage/alarmstock", alarmstock)

      //session 객체 선언
        const sessionStorage = window.sessionStorage;
        const url = "http://222.102.43.244:8094/favorite_stock/add";

        const favoriteStockBody = {
          "account": JSON.parse(sessionStorage.getItem("token")).account, // 추후 계정 바꿔야함 세션에서 가져오는 아이디로
          "favorite_stock" : {
            [stock.initial.stck_shrn_iscd]:{ // 주식고유번호
              "name": stock.initial.COMPANY, // 회사명
              "fluctuation" : "", //숫자
              "fluctuation_toggle" : "" //plus,minus
            }
          }
        }
        // console.log("favoriteStockBody", favoriteStockBody)
        const response = await axios.post(url, favoriteStockBody).catch(() => null)
        if (!response) return null

        const result = response.data

                                // favoite_stock: 세션이름 json형태로 result 넣어줌
        sessionStorage.setItem("favorite_stock", JSON.stringify(result))
        const data = sessionStorage.getItem("favorite_stock")
        console.log("favorite_stock", JSON.parse(data))
    }

    return {
      selectedMarket,
      currentMarketStocks,
      onStockClick,
      updateMarket,
      addToMyStocks,
      filteredAllStocks
    };
  }
};
</script>


