<template>
<ChartName :selectedStock="selectedStock"></ChartName>
  <div class="flex-between">
    <div>
      <button class="btn-candle" @click="fetchChartData('day')">일봉</button>
      <button class="btn-candle" @click="fetchChartData('week')">주봉</button>
      <button class="btn-candle" @click="fetchChartData('month')">월봉</button>
      <button class="btn-candle" @click="openNotificationModal">알림 설정</button>
      <NotificationModal v-if="isNotificationModalOpen" @close="closeNotificationModal" :stockId="selectedStock.id"></NotificationModal>
    </div>
    <i type="button" class="far fa-times-circle" style="font-size: 25px" @click="$emit('close')"></i>
  </div>


    <apexcharts type="candlestick" height="400" :options="chartoptions.chartOptions" :series="processedChartData"></apexcharts>
    <ChartInformation :selectedStock="selectedStock"></ChartInformation>
</template>


<script>
import {computed, reactive, watch, ref} from 'vue';
import {useStore} from 'vuex';
import VueApexCharts from 'vue3-apexcharts';
import ChartName from "@/views/components/ChartName.vue";
import ChartInformation from "@/views/components/ChartInformation.vue";

const intervalMap = {
  day: 'daily',
  week: 'week',
  month: 'month'
};


export default {
  name: "CandleStickChart",
  components: {
    ChartInformation,
    ChartName,
    apexcharts: VueApexCharts,
  },
  props: {
    selectedStock: {
      type: Object
    }
  },
  emits: ['close'],

  setup(props) {
    const state = reactive({
      series: [],
    });

    const store = useStore();
    const selectedInterval = reactive({value: 'day'});

    const chartData = computed(() => {

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
        xaxis: {
          tickAmount: 9,
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
    const isNotificationModalOpen = ref(false); // 알림 설정 모달창의 열림 여부

    const openNotificationModal = () => {
      // 알림 설정 모달창을 열기 위한 메서드
      isNotificationModalOpen.value = true;
    };

    const closeNotificationModal = () => {
      // 알림 설정 모달창을 닫기 위한 메서드
      isNotificationModalOpen.value = false;
    };

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
      openNotificationModal,
      closeNotificationModal

    };
  }
}
</script>

<style scoped>

/* 일,주,월,알림설정 버튼 디자인 */
.btn-candle {
  padding-inline: 20px;
  font-size: 20px;
  border-radius: 10px;
  transition: background 0.3s ease, opacity 0.3s ease;
  color: #ffffff;
  background-color: #0e61e0;
  border: none; /* 테두리 제거 */
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
}

/* 일,주,월,알림설정 버튼 호버링  */
.btn-candle:hover {
  background-color: #003D88FF;
  opacity: 1;
}

/* X닫기 버튼 */
.flex-between {
  display: flex;
  justify-content: space-between;
}
</style>
