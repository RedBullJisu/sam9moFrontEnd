import axios from 'axios';

// 증권 URL 주소
const STOCK_URL = "http://121.179.83.68:8881/stock_api";

// 차트 URL 주소
const CHART_API_BASE_URL = 'http://221.156.60.18:8081';

const STOCK_CODES = {
    // 코스피 리스트
    kospi: ['005930', '373220', '000660', '207940', '005935',
        '005490', '005380', '051910', '035420', '000270',
        '006400', '068270', '003670', '035720', '105560',
        '028260', '012330', '055550', '066570', '096770',
        '032830', '003550', '323410', '033780', '086790',
        '000810', '034730', '015760', '138040', '017670',
        '018260', '011200', '329180', '010130', '009150',
        '047050', '259960', '316140', '034020', '024110'],

    // 코스닥 리스트
    kosdaq: ['247540', '086520', '091990', '022100', '066970',
        '028300', '196170', '068760', '035900', '277810',
        '403870', '058470', '263750', '214150', '293490',
        '357780', '041510', '039030', '145020', '005290',
        '095340', '112040', '240810', '036930', '253450',
        '035760', '000250', '086900', '121600', '214370',
        '067310', '393890', '025900', '034230', '237690',
        '078600', '048410', '141080', '365340', '195940']
}

// 특정 주식의 차트 데이터를 가져오는 함수
function getSpecificChartData(state, type, stock) {
    // 주어진 타입의 차트 데이터 중에서 주식의 고유번호에 해당하는 데이터를 반환
    return state[type][stock.initial.stck_shrn_iscd];
}

// updateChartData Mutation이 시장 타입을 판별하기 위한 객체
const chartTypes = {
    'kospi': {
        'daily': 'dailyKospi',
        'week': 'weekKospi',
        'month': 'monthKospi'
    },
    'kosdaq': {
        'daily': 'dailyKosdaq',
        'week': 'weekKosdaq',
        'month': 'monthKosdaq'
    }
};
const intervalMap = {
    day: 'daily_stock',
    week: 'week_stock',
    month: 'month_stock'
};

//스토어 상태 정의
const state = {
    allStocks: [], // 모든 주식
    myStocks: [], // 관심 주식
    sentiment: [], // 종목의 여론 데이터
    cachedSentiments: {}, // 여론 데이터를 캐싱하는 객체
    currentMarket: 'kospi', // 현재 사용자가 선택한 주식 시장 (기본값: 'kospi')
    dailyKospi: {_id: '', stock_data: []}, // 코스피 일봉차트
    weekKospi: {_id: '', stock_data: []}, // 코스피 주봉차트
    monthKospi: {_id: '', stock_data: []},// 코스피 월봉차트
    dailyKosdaq: {_id: '', stock_data: []}, // 코스닥 일봉차트
    weekKosdaq: {_id: '', stock_data: []}, // 코스닥 주봉차트
    monthKosdaq: {_id: '', stock_data: []},  // 코스닥 월봉차트
    stockAlarm: [], // 사용자가 설정한 주식 알림을 저장하는 배열
        priceChanges: [] // API로부터 받은 주식 가격 정보를 저장
};

// 스토어 변이(Mutation) 정의
const mutations = {
    // 모든 주식 목록을 업데이트
    updateAllStocks(state, stocks) {
        state.allStocks = stocks;
    },
    // 관심 주식 목록을 업데이트
    updateMyStocks(state, stocks) {
        state.myStocks = stocks;
    },
    //일봉, 주봉, 월봉 차트 업데이트
    updateChartData(state, {type, data}) {
        const [market, interval] = type.split('_');
        const chartDataKey = chartTypes[market][interval];
        if (chartDataKey) {
            state[chartDataKey] = data;
        }
    },
    updateSentiment(state, sentimentData) {
        // 새로운 여론 데이터를 상태에 추가하는 뮤테이션
        state.sentiment.push(sentimentData);
    },
    // 여론 데이터를 캐시에 추가하는 뮤테이션
    cacheSentiment(state, { stockCode, sentimentData }) {
        state.cachedSentiments[stockCode] = sentimentData;
    },
    // 관심주식 추가
    addToMyStocks(state, stock) {
        state.myStocks.push(stock);
        state.allStocks = state.allStocks.filter(s => s.id !== stock.id);
    },
    // 관심주식제거
    removeFromMyStocks(state, stock) {
        state.myStocks = state.myStocks.filter(s => s.id !== stock.id);
        if (stock.market === state.currentMarket) {
            state.allStocks.push(stock);
        }
    },
    // 현재 사용자가 선택한 주식 시장 업데이트
    updateCurrentMarket(state, market) {
        state.currentMarket = market;
    },
    // 스토어 상태를 초기화
    resetState(state) {
        state.allStocks = [];  // 모든 주식 초기화
        state.myStocks = [];  // 관심 주식 초기화
        state.dailykospi = {};  // 코스피 일봉 차트 초기화
        state.weeklykospi = {};  // 코스피 주봉 차트 초기화
        state.monthlyKospi = {};  // 코스피 월봉 차트 초기화
        state.dailyKosdaq = {};  // 코스닥 일봉 차트 초기화
        state.weeklyKosdaq = {};  // 코스닥 주봉 차트 초기화
        state.monthlyKosdaq = {};  // 코스닥 월봉 차트 초기화
        state.stockAlarm = [];  // 알림 설정 초기화
        state.priceChanges = [];  // 주식 가격 정보 초기화
        state.sentiment =[]; // 여론 데이터 초기화
        state.priceChanges = {}; //
    },


    // // SET_NOTIFICATION: 사용자가 알림을 설정할 때 호출되는 뮤테이션. 주식의 고유번호와 퍼센트를 인자로 받아 stockAlarm 상태를 변경
    // SET_NOTIFICATION(state, {stockId, percentage}) {
    //     const index = state.stockAlarm.findIndex(n => n.stockId === stockId);
    //     if (index !== -1) {
    //         // 이미 설정된 알림이 있으면, 퍼센트를 업데이트
    //         state.stockAlarm[index].percentage = percentage;
    //     } else {
    //         // 설정된 알림이 없으면, 새로운 알림을 추가
    //         state.stockAlarm.push({stockId, percentage});
    //     }
    // },
    // SET_PRICE_CHANGES: API로부터 받은 주식 가격 정보를 스토어에 저장하는 뮤테이션. 주식 가격 정보를 인자로 받아 priceChanges 상태를 변경
    // SET_PRICE_CHANGES(state, priceChanges) {
    //     state.priceChanges = priceChanges;
    // }
};

// 스토어 액션(Action) 정의
const actions = {
    // 모든 주식 정보를 가져오는 액션
    async fetchAllStocks({commit, state, dispatch}) {
        try {
            // 요청할 데이터
            const dataToBeSent = {
                "company": "0",
                "initial": ["stck_shrn_iscd", "COMPANY", "stck_prpr", "hts_avls", "acml_vol", "per",
                    "pbr", "eps", "stck_prdy_oprc", "stck_prdy_hgpr", "stck_prdy_lwpr", "acml_vol"
                ],
                "current_trade": ["STCK_PRPR", "ACML_VOL"]
            };
            const response = await axios.post(`${STOCK_URL}`, dataToBeSent);
            if (!response.data) {
                console.log('API 응답에 데이터가 없습니다.');
                return;
            }
            //
            const stocks = Object.values(response.data);
            console.log("모든주식정보 API응답", stocks)

            const processedStocks = stocks.map(stock => {
                const id = stock.initial.stck_shrn_iscd;
                // 코스피 코스닥 판단
                const marketType = STOCK_CODES.kospi.includes(stock.initial.stck_shrn_iscd) ? 'kospi' : 'kosdaq';
                // current_trade를 사용하는데 안에 데이터가 없으면 initial사용
                const data = stock.current_trade && stock.current_trade.length > 0
                    ? stock.current_trade
                    : stock.initial && stock.initial.length > 0
                        ? stock.initial
                        : [];

                return {id, ...stock, data, market: marketType};
            });

            // 현재 선택된 시장에 해당하는 주식만 필터링
            let filteredStocks = processedStocks.filter(stock => STOCK_CODES[state.currentMarket].includes(stock.initial.stck_shrn_iscd));
            // 관심 주식 목록에 있는 주식은 제외
            filteredStocks = filteredStocks.filter(stock => !state.myStocks.some(myStock => myStock.id === stock.id));
            commit('updateAllStocks', filteredStocks);

            const updatedMyStocks = state.myStocks.map((stock) =>
                processedStocks.find((s) => s.id === stock.id) || stock
            );
            commit('updateMyStocks', updatedMyStocks);
            console.log("fetchAllStocks액션이 실행되었습니다.")

            if (state.currentMarket === 'kospi') {
                state.myStocks.forEach((stock) => {
                    delete state.dailyKospi[stock.id];
                });
            } else {
                state.myStocks.forEach((stock) => {
                    delete state.dailyKosdaq[stock.id];
                });
            }
        } catch (error) {
            console.error('API 에러:', error);
            setTimeout(() => {
                dispatch('fetchAllStocks');
            }, 5000);
        }
    },
    // 특정 주식을 관심 주식 목록에 추가하는 액션
    addToMyStocks({commit}, stock) {
        commit('addToMyStocks', stock);
    },
    // 특정 주식을 관심 주식 목록에서 제거하는 액션
    removeFromMyStocks({commit}, stock) {
        commit('removeFromMyStocks', stock);
    },

    updateMarket({commit, dispatch, state}, market) {
        commit('updateCurrentMarket', market);
        dispatch('fetchAllStocks').then(() => {
            const filteredStocks = state.allStocks.filter(stock => stock.market === state.currentMarket);
            commit('updateAllStocks', filteredStocks);
        });
    },
    // 여론 데이터를 가져오는 액션
    async fetchSentiment({ commit }, stck_shrn_iscd) {
        try {
            const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            console.log("이건 확인111110",stck_shrn_iscd)
            console.log("날짜",today)
            const response = await axios.get(`http://221.156.60.18:8092/sentiment/count/${stck_shrn_iscd}?date=${today}`);
            commit('updateSentiment', response.data);
        } catch (error) {
            console.error(error);
            commit('updateSentiment', []);
        }
    },
    // 주식의 차트 데이터 가져오는 액션
    async fetchStockChartData({commit, state}, {stck_shrn_iscd, interval}) {
        const stock = state.allStocks.find(stock => stock.initial.stck_shrn_iscd === stck_shrn_iscd);
        if (stock) {
            try {
                const _id = stock.id;
                let marketType = "";
                if (STOCK_CODES.kospi.includes(_id)) {
                    marketType = 'kospi';
                } else if (STOCK_CODES.kosdaq.includes(_id)) {
                    marketType = 'kosdaq';
                } else {
                    throw new Error(`알 수 없는 주식 코드: ${_id}`);
                }

                if (marketType) {
                    const mappedInterval = intervalMap[interval];
                    const response = await axios.post(`${CHART_API_BASE_URL}/${marketType}_${mappedInterval}/${_id}`);
                    // processChartData 함수의 내용을 직접 작성
                    const data = {
                        _id: response.data._id,
                        stock_data: response.data.stock_data
                    };
                    commit('updateChartData', {type: `${marketType}_${mappedInterval}`, data});
                    console.log("fetchStockChartData실행 후 updateChartData뮤테이션으로 이동", data)

                }
            } catch (error) {
                console.error(`차트 데이터를 가져오는데 실패했습니다: ${error}`);
            }
        }
    },

    // 모든 상태를 초기화
    resetStore({commit}) {
        commit('resetState');
    },
};

// 스토어 게터(Getter) 정의
const getters = {
    dailyKospi: state => state.dailyKospi,
    weekKospi: state => state.weekKospi,
    monthKospi: state => state.monthKospi,
    dailyKosdaq: state => state.dailyKosdaq,
    weekKosdaq: state => state.weekKosdaq,
    monthKosdaq: state => state.monthKosdaq,
    // 모든 주식 목록을 반환
    getAllStocks: (state) => state.allStocks,
    // 관심 주식 목록을 반환
    getMyStocks: (state) => state.myStocks,
    // 여론 반환
    getsentiment: (state) =>state.sentiment,
    // 주어진 종류(type)와 주식 코드(stockCode)에 해당하는 차트 데이터를 반환하는 게터
    getChartData: (state) => (type, stock) => getSpecificChartData(state, type, stock),
    // 현재 선택된 시장 정보를 반환(KOSPI, KOSDAQ)
    getCurrentMarket: (state) => state.currentMarket,

    // 현재 선택된 시장의 주식 목록을 필터링하여 반환하는 게터
    getCurrentMarketStocks: (state) => {
        const filteredStocks = state.allStocks.filter(stock => STOCK_CODES[state.currentMarket].includes(stock.initial.stck_shrn_iscd));
        return filteredStocks;
    },

};

// Vuex 모듈로 만들어 내보냄
const StockPage = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};

export default StockPage;
