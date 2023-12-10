<template>
  <div class="card mb-4">
    <div class="card-header pb-0" style="border-top-left-radius: 15px; border-top-right-radius: 15px; background-color: #01275b;">
      <h5 style="color: white;">관심종목</h5>
    </div>
    <div class="card-body px-0 pt-0 pb-0">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <thead>
          <tr>
            <th class="text-center font-weight-bolder opacity-7">종목명</th>
            <th class="text-center font-weight-bolder opacity-7">현재가</th>
            <th class="text-center font-weight-bolder opacity-7">등락율</th>
            <th class="text-center font-weight-bolder opacity-7">여론</th>
            <th class="text-center font-weight-bolder opacity-7">시가총액</th>
            <th class="text-center font-weight-bolder opacity-7">누적거래량</th>
            <th class="text-center font-weight-bolder opacity-7">관심종목 해제</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="stock in myStocks" :key="stock.id" class="my-list" @click="onStockClick(stock)">
            <td class="text-center">
              <div class="d-flex px-2 py-1 justify-content-center">
                <h6 class="mb-0 text-sm">{{ stock.initial.COMPANY }}</h6>
              </div>
            </td>
            <td class="text-center">
              <p class="text-xs font-weight-bold mb-0 ">
                {{ formatNumber(stock.current_trade.STCK_PRPR ? stock.current_trade.STCK_PRPR : stock.initial.stck_prpr) }}
              </p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">등락율</p>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">여론</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">{{ formatNumber(stock.initial.hts_avls) }}</span>
            </td>
            <td class="align-middle text-center">
    <span class="text-secondary text-xs font-weight-bold">{{
        formatNumber(stock.current_trade.ACML_VOL ? stock.current_trade.ACML_VOL : stock.initial.acml_vol)
      }}</span>
            </td>
            <td class="px-6 py-4 text-center text-gray-500 border-b">
                <i @click.stop="removeFromMyStocks(stock)" class="fa fa-minus-circle" style="font-size: 25px" aria-hidden="true"></i>
            </td>
          </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import img1 from "../../assets/img/team-2.jpg";
// import VsudAvatar from "@/components/VsudAvatar.vue";
// import VsudBadge from "@/components/VsudBadge.vue";
import {mapState, mapActions} from "vuex";
import {formatNumber} from "chart.js/helpers";

export default {
  name: "MyStock",
  computed: {
    ...mapState('StockPage', ['myStocks']),
  },
  methods: {
    formatNumber,
    ...mapActions('StockPage', ['removeFromMyStocks', 'fetchStockChartData']),
    onStockClick(stock) {
      this.fetchStockChartData({stck_shrn_iscd: stock.id, interval: 'day'});
      this.$emit('onStockClick', stock);

    },
  },
};
</script>

<style scoped>
.my-list:hover {
  background-color: #5B5B5B42; /* 원하는 색상으로 변경 가능 */
  cursor: pointer;
  transition: background 0.3s ease, opacity 1s ease;
}

</style>