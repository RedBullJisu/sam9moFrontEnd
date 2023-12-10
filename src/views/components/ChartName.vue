<template>
<!--느리면 API새로 호출-->
  <div class="mb-4 card">
    <div class="p-3 card-body">
      <div class="d-flex">
        <div>
          <div class="numbers">
            <p class="mb-0 text-sm text-capitalize font-weight-bold">{{ selectedStocks.market}}</p>
            <h5 id="company" class="mb-0 font-weight-bolder">
              {{ selectedStocks.initial.COMPANY}}
              <span class="text-sm font-weight-bolder">등락율</span>
            </h5>
            <h5 class="mb-0 font-weight-bolder">
              {{ selectedStocks.current_trade.STCK_PRPR ? selectedStocks.current_trade.STCK_PRPR : selectedStocks.initial.stck_prpr }}
            </h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { watch,ref } from 'vue';

export default {
  name: "ChartName",

  props: {
    selectedStock: {
      type: Object
    }
  },

  setup(props) {
    const store = useStore();
    const selectedStocks = ref(props.selectedStock);
    // console.log("확인",props.selectedStock)

    watch(() => [store.state.StockPage.myStocks, store.state.StockPage.allStocks], () => {
      const matchingStock = [...store.state.StockPage.myStocks, ...store.state.StockPage.allStocks].find(
          (stock) => props.selectedStock.id === stock.initial.stck_shrn_iscd
      );
      if (matchingStock) {
        selectedStocks.value = matchingStock;
      }
    });
    return {
      selectedStocks
    };
  }
};
</script>