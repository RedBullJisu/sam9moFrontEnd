<template>
  <div class="card mb-4">
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <thead>
          <tr>
            <th class="text-center text-xs font-weight-bolder opacity-7">
              <button @click="selectTab('종합')">종합</button>
            </th>
            <th class="text-center text-xs font-weight-bolder opacity-7">
              <button @click="handleNewsClick">뉴스</button>
            </th>
            <th class="text-center text-xs font-weight-bolder opacity-7">
            </th>
          </tr>
          </thead>

          <tbody v-if="selectedTab === '종합'" style="height: 100px; overflow-y: auto;">
          <tr>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">주식 전일 시가:{{ selectedStocks.initial.stck_prdy_oprc }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">주식 전일 최저가:{{ selectedStocks.initial.stck_prdy_lwpr }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">주식 전일 최고가:{{ selectedStocks.initial.stck_prdy_hgpr }}</p>
            </td>
          </tr>
          <tr>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">전일종가:{{ selectedStocks.initial.stck_prpr }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">누적 거래량</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">누적 거래 대금</p>
            </td>
          </tr>
          <tr>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">전일 거래량:{{ selectedStocks.initial.prdy_vol }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">전일시가</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">전일고가</p>
            </td>
          </tr>
          <tr>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">PER:{{ selectedStocks.initial.per }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">PBR:{{ selectedStocks.initial.pbr }}</p>
            </td>
            <td class="align-middle text-center text-sm">
              <p class="text-xs font-weight-bold mb-0">EPS:{{ selectedStocks.initial.eps }}</p>
            </td>
          </tr>
          </tbody>
        </table>

        <div @scroll="CompanyCheckScroll" style="height: 200px; overflow-y: auto;">
          <div v-if="selectedTab === '뉴스'">
            <div v-for="(news,index) in companynews" :key="index">
              <h3>{{ news.news_title }}</h3>
              <p>{{ news.content_summary }}</p>
              <p>{{ news.keyword }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref, onMounted} from "vue";
import axios from "axios";

export default {
  name: "ChartInformation",
  props: {
    selectedStock: {
      type: Object
    }
  },


  setup(props) {
    const selectedStocks = ref({...props.selectedStock});
    const selectedTab = ref('종합'); // 초기값은 '종합'
    console.log("확인", selectedStocks.value.id)
    const companynews = ref([]);
    const companypage = ref(1);

    const handleNewsClick = () => {
      selectTab('뉴스');
      CompanyNews();
    }

    const selectTab = (tabName) => {
      selectedTab.value = tabName;
      if (tabName === '뉴스') {
        CompanyNews(); // '뉴스' 버튼을 클릭했을 때 뉴스 데이터를 가져옴
      }
    };

    const CompanyNews = async () => {
      try {
        const res = await axios.get(`http://221.156.60.18:8072/news/stock/${selectedStocks.value.id}?page_Idx=${companypage.value}`);
        if (Array.isArray(res.data.news_list)) {
          companynews.value = [...companynews.value, ...res.data.news_list];
        }
      } catch (error) {
        console.error(error);
      }
    };

    const CompanyCheckScroll = (event) => {
      if (selectedTab.value !== '뉴스') return;

      let element = event.target;
      if (element.scrollHeight - element.scrollTop <= element.clientHeight + 200) {
        companypage.value += 1;
        CompanyNews();
      }
    }


    onMounted(() => {
      CompanyNews();
    });

    return {
      selectedStocks,
      selectedTab,
      companynews,
      selectTab,
      CompanyCheckScroll,
      handleNewsClick
    };
  },

}

</script>