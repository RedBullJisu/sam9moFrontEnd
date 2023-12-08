<template>
  <div>
    <apexcharts type="area" height="250" :options="state.chartOptions"
                :series="state.series[selectedMarket] || []"></apexcharts>
  </div>
  <div>
    <apexcharts type="bar" height="200" :options="state.volumeChartOption"
                :series="state.volumeChartseries[selectedMarket] || []"></apexcharts>
  </div>

  <div>
    <!-- 시장 선택 버튼 -->
    <div class="button-container">
      <button v-for="market in markets"
              :key="market.value"
              @click="selectMarket(market.value); market.clicked = true"
              :class="{ selected: selectedMarket === market.value }"
              style="border-radius: 10px;">
        {{ market.text }}
      </button>
<!--      <div class="selected-market">-->
<!--        선택된 종목: {{ selectedMarket }}-->
<!--      </div>-->
    </div>

    <!-- 타임라인 선택 버튼 -->
    <div class="button-container" v-if="selectedMarket">
      <button v-for="timeline in timelines"
              :key="timeline.value"
              @click="updateDataAndTimeline(timeline.value)"
              :class="{ selected: selectedTimeline === timeline.value }"
              style="border-radius: 10px;">
        {{ timeline.text }}
      </button>
    </div>
  </div>


</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import axios from "axios";
import {ref, reactive, onMounted} from 'vue'

export default {
  name: "StockAreaChart",
  components: {
    apexcharts: VueApexCharts,
  },

  setup() {
    const state = reactive({
      series: {
        kospi: [],
        kosdaq: [],
        kospi200: [],
      },
      chartOptions: {
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },

        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 6,
          labels: {
            formatter: function (value) {
              const date = new Date(value);

              // 년,월,일
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();

              // 한글 형식 날짜 문자열 반환
              return `${year}년 ${month}월 ${day}일`;

            }
          }
        },
        tooltip: {
          x: {
            formatter: function (value) {
              const date = new Date(value);

              // 년,월,일
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();
              const hours = date.getHours();
              const minutes = date.getMinutes();

              return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
            }

          },

        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value.toFixed(2);
            }
          }
        }
      },
      volumeChartseries: {
        kospi: [],
        kosdaq: [],
        kospi200: [],
      },
      volumeChartOption: {
        chart: {
          id: 'area-datetime',
          type: 'bar',
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        colors: ['#e33f1a'],
        plotOptions: {
          bar: {
            columnWidth: '90%', // 막대의 두께를 조절
            dataLabels:{
              position: 'top',
            },
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 6,
          labels: {
            formatter: function (value) {

              const date = new Date(value);

              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              const day = date.getDate();

              return `${year}년 ${month}월 ${day}일`;
            },
            tooltip: {
              x: {
                formatter: function (value) {

                  const date = new Date(value);

                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  const day = date.getDate();
                  const hours = date.getHours();
                  const minutes = date.getMinutes();

                  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
                }

              }
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                }
              }
            },

            yaxis: {
              axisBorder: {
                show: false
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
                formatter: function (value) {
                  return value.toFixed(2);
                }
              }
            }
          },
        }
      }
    });

    const markets = [
      {value: 'kospi', text: 'KOSPI'},
      {value: 'kosdaq', text: 'KOSDAQ'},
      {value: 'kospi200', text: 'KOSPI200'},
    ];

    const timelines = [
      {value: 'D1', text: '1일'},
      {value: 'D5', text: '5일'},
      {value: 'M1', text: '1개월'},
      {value: 'M6', text: '6개월'},
      {value: 'YTD', text: '1년'},
    ];

    const selectedTimeline = ref(null);

    const updateDataAndTimeline = async (timeline) => {
      selectedTimeline.value = timeline;
      await fetchData(timeline, state.series);
      await fetchVolumeData(timeline);
    };

    // dashboard 페이지 구동 시, 출력 되는 기본값 차트
    onMounted(() => {
      selectMarket('kospi');
      updateDataAndTimeline('D1');
    });

    const selectedMarket = ref(null);

    const selectMarket = (market) => {
      if (selectedMarket.value !== market) {
        state.series[market] = [];
        state.volumeChartseries[market] = [];
      }
      selectedMarket.value = market;
    };

    const fetchData = async (timeline, series) => {
      let url;
      if (selectedMarket.value === 'kospi') {
        url = `http://221.156.60.18:9199/kospi/kospi_${timeline}`;
      } else if (selectedMarket.value === 'kosdaq') {
        url = `http://221.156.60.18:9199/kosdaq/kosdaq_${timeline}`;
      } else if (selectedMarket.value === 'kospi200') {
        url = `http://221.156.60.18:9199/kospi200/kospi200_${timeline}`;
      }


      const response = await axios.get(url, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // *** JSON.parse 기억!!! ***
      const AreaChartData = response.data;
      const processedData = [];

      if (AreaChartData.data) {
        AreaChartData.data.forEach(data => {
          const timestamp = new Date(data.timestamp * 1000);
          const {open, low, high, close} = data;

          processedData.push({
            x: timestamp,
            y: [open, low, high, close]
          });
        });
      }


      if (!series[selectedMarket.value]) {
        series[selectedMarket.value] = [];
      }

      series[selectedMarket.value] = [{name: selectedMarket.value, data: processedData}];
    };
    const fetchVolumeData = async (timeline) => {
      let url;
      if (selectedMarket.value === 'kospi') {
        url = `http://221.156.60.18:9199/kospi/kospi_${timeline}`;
      } else if (selectedMarket.value === 'kosdaq') {
        url = `http://221.156.60.18:9199/kosdaq/kosdaq_${timeline}`;
      } else if (selectedMarket.value === 'kospi200') {
        url = `http://221.156.60.18:9199/kospi200/kospi200_${timeline}`;
      }

      const response = await axios.get(url, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });


      const AreaChartData = response.data;
      const processedData = [];

      console
      if (AreaChartData.data) {
        AreaChartData.data.forEach(data => {
          const timestamp = new Date(data.timestamp * 1000);
          const {volume} = data;

          processedData.push({
            x: timestamp,
            y: [volume]
          });
        });
      }


      if (!state.volumeChartseries[selectedMarket.value]) {
        state.volumeChartseries[selectedMarket.value] = [];
      }

      state.volumeChartseries[selectedMarket.value] = [{name: selectedMarket.value, data: processedData}];
    };

    const updateData = async (timeline) => {
      await fetchData(timeline, state.series);
    };

    const updateVolumeChartData = async (timeline) => {
      await fetchVolumeData(timeline);
    };

    return {
      markets,
      timelines,
      updateVolumeChartData,
      state,
      selectMarket,
      selectedMarket,
      updateData,
      updateDataAndTimeline,
      selectedTimeline
    };
    // 주석 추가
  }
}
</script>

<style scoped>

/* 시장,타임라인 버튼 위치 */
.button-container {
  display: flex;
  justify-content: right;
  flex-wrap: wrap;
}

button {
  margin: 1px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.5s ease;
}

/* 버튼 호버링 색상 */
button:hover {
  background-color: #1d77e3;
}

/* 선택된 버튼 스타일 */
button.selected {
  background-color: #878c93;
}

</style>
