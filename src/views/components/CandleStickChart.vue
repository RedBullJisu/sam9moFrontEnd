<template>
<ChartName :selectedStock="selectedStock"></ChartName>
  <div >
    <div>
      <button @click="fetchChartData('day')">일봉</button>
      <button @click="fetchChartData('week')">주봉</button>
      <button @click="fetchChartData('month')">월봉</button>
<!--      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">-->
<!--        알림설정-->
<!--      </button>-->
      <button @click="openNotificationModal">알림 설정</button>
      <NotificationModal v-if="isNotificationModalOpen" @close="closeNotificationModal" :stockId="selectedStock.id"></NotificationModal>
      <button @click="$emit('close')">닫기</button>
    </div>


<!--    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">-->
<!--      <div class="modal-dialog">-->
<!--        <div class="modal-content">-->
<!--          <div class="modal-header">-->
<!--            <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>-->
<!--            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--          </div>-->
<!--          <div class="modal-body">-->
<!--            안나나나-->
<!--          </div>-->
<!--          <div class="modal-footer">-->
<!--            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--            <button type="button" class="btn btn-primary">Understood</button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <apexcharts type="candlestick" height="400" :options="chartoptions.chartOptions" :series="processedChartData"></apexcharts>
    <ChartInformation :selectedStock="selectedStock"></ChartInformation>
  </div>
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
      console.log("차트컴포넌트",chartData)
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
