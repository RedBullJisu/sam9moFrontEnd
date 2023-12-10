<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>관심종목</h6>
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
            >관심종목 해제
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="stock in myStocks" :key="stock.id" class="hover:bg-gray-200"  @click="onStockClick(stock)">

          <td>
              <div class="d-flex px-2 py-1">

                <!--
                프로필 이미지 컴포넌트(회사로고나 뉴스기사에도 사용할 수 있을듯)
                               <div>
                                  <vsud-avatar :img="img1" size="sm" border-radius="lg" class="me-3" alt="user1"/>
                                </div>
                                -->

                <div class="d-flex flex-column justify-content-center ">
                  <h6 class="mb-0 text-sm"><p>{{ stock.initial.COMPANY}}</p></h6>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0 ">
                {{ stock.current_trade.STCK_PRPR ? stock.current_trade.STCK_PRPR : stock.initial.stck_prpr }}
              </p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">등락율</p>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">여론/</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ stock.initial.hts_avls }}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">
                {{stock.current_trade.ACML_VOL ? stock.current_trade.ACML_VOL : stock.initial.acml_vol }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500 border-b">
              <!-- 이 버튼을 클릭하면 해당 주식을 관심 종목에서 제거하는 액션 호출 -->
              <button @click.stop="removeFromMyStocks(stock)" class="chart-toggler" type="button">
                <i class="fa fa-minus-circle" aria-hidden="true"></i>
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
import {useStore} from "vuex";
import {computed} from "vue";
import axios from "axios";

export default {
  name: "MyStock",

  setup(_, { emit }) {
    const store = useStore();
    const myStocks = computed(() => store.state.StockPage.myStocks);

    //session 객체 선언
    const sessionStorage = window.sessionStorage;
    const removeFromMyStocks = async (payload) => {
      console.log("mystock확인ㄴㅇㄹㄴㅇㅁㄻㄴㅇㄹㄴㅁㅇㄹ", payload.initial.stck_shrn_iscd)
      const favoriteStockBody = {
        "account": JSON.parse(sessionStorage.getItem("token")).account,// 추후 계정 바꿔야함 세션에서 가져오는 아이디로,
        "favorite_stock": payload.initial.stck_shrn_iscd
      }
      const url = "http://222.102.43.244:8094/favorite_stock/remove";
      const response = await axios.post(url, favoriteStockBody).catch(() => null)
      if (!response) return null

      const result = response.data

      sessionStorage.setItem("favorite_stock", JSON.stringify(result))
      const data = sessionStorage.getItem("favorite_stock")
      console.log("favorite_stock", JSON.parse(data))

      store.dispatch('StockPage/removeFromMyStocks', payload);
    };

    const fetchStockChartData = (payload) => {
      store.dispatch('StockPage/fetchStockChartData', payload);
    };

    const onStockClick = (stock) => {
      fetchStockChartData({ stck_shrn_iscd: stock.id, interval: 'day' });
      emit('onStockClick', stock);
    };

    return {
      myStocks,
      removeFromMyStocks,
      fetchStockChartData,
      onStockClick,
    };
  },
};
</script>