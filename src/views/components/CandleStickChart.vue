<template>
<ChartName :selectedStock="selectedStock"></ChartName>
  <div >
    <div>
      <button @click="fetchChartData('day')">일봉</button>
      <button @click="fetchChartData('week')">주봉</button>
      <button @click="fetchChartData('month')">월봉</button>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        알림설정
      </button>
      <alarm-modal :selectedStock="selectedStock"></alarm-modal>
      <button @click="$emit('close')">닫기</button>
    </div>
    <apexcharts type="candlestick" height="400" :options="chartoptions.chartOptions" :series="processedChartData"></apexcharts>
    <ChartInformation :selectedStock="selectedStock"></ChartInformation>
  </div>
</template>

<script>
import {computed, reactive, watch} from 'vue';
import {useStore} from 'vuex';
import VueApexCharts from 'vue3-apexcharts';
import ChartName from "@/views/components/ChartName.vue";
import ChartInformation from "@/views/components/ChartInformation.vue";
import AlarmModal from "@/views/components/AlarmModal.vue";

const intervalMap = {
  day: 'daily',
  week: 'week',
  month: 'month'
};


export default {
  name: "CandleStickChart",
  components: {
    AlarmModal,
    ChartInformation,
    ChartName,
    apexcharts: VueApexCharts,
  },
  props: {
    selectedStock: {
      type: Object
    }
  },
  setup(props) {
    const state = reactive({
      series: [],
    });

    const store = useStore();
    const selectedInterval = reactive({value: 'day'});

    const chartData = computed(() => {
      console.log("차트컴포넌트",props.selectedStock.initial)
      const stockType = props.selectedStock.market;
      const interval = selectedInterval.value;
      const intervalKey = intervalMap[interval];

      return store.getters[`StockPage/${intervalKey}${stockType.charAt(0).toUpperCase() + stockType.slice(1)}`];
    });
    const processedChartData = computed(() => {
      const series_list = []
      const processedData = chartData.value.stock_data.map(item => ({
        x: item.stck_bsop_date,
        y: [item.stck_oprc, item.stck_hgpr, item.stck_lwpr, item.stck_clpr]
      }));
      series_list.push({name: chartData.value._id, data: processedData.reverse()})
      return series_list
    });

    const chartoptions = {
      chartOptions: {
        zoom: {
          enabled: false,
          datetimeUTC: false
        },
        chart: {
          height: 400,
          type: 'candlestick',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '85%',
            endingShape: 'rounded',
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#F4D03F'],
        x: {
          reversed: true,
          tickAmount: 'dataPoints',
          position: 'bottom',
          axisBorder: {
            show: false
          },
          labels: {
            show: true
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false,
          }
        },
        y: {
          min: 0,
          max: 500,
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: true,
            formatter: function (val) {
              return val;
            }
          }
        }
      }
    }
    const fetchChartData = (interval) => {
      selectedInterval.value = interval;
      store.dispatch('StockPage/fetchStockChartData', {
        stck_shrn_iscd: props.selectedStock.id,
        interval: interval,
      });
    };
    watch(() => props.selectedStock, (newStock) => {
      if (newStock) {
        fetchChartData(selectedInterval.value);
      }
    }, { immediate: true });

    return {
      state,
      chartoptions,
      fetchChartData,
      processedChartData,
    };
  }
}
</script>

<style scoped>
.button-container {
  display: flex;
  align-items: center;
}

.selected-stock {
  font-size: 20px;
  margin-left: 10px;
}

button {
  margin: 5px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
