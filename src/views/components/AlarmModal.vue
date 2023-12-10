<template>
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">{{selectedStocks.initial.COMPANY}}  알림설정</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>
            <button @click="decreasePercentage">-</button>
            <p>{{ percentage }}%</p>
            <button @click="increasePercentage">+</button>
          </div>
          <div>
            이상<input id="plus" type="radio" name="plus_minus" value="plus">
            이하<input id= "minus" type="radio" name="plus_minus" value="minus">
          </div>
        </div>
        <div class="modal-footer">
          <!-- '닫기' 버튼. 이 버튼을 누르면 모달이 닫힙니다. -->
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          <!-- '알림 등록하기' 버튼. 이 버튼을 누르면 registerAlert 함수가 호출됩니다. -->
          <button type="button" class="btn btn-primary" @click="registerAlert">알림 등록하기</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {ref} from "vue";
import axios from "axios";

export default {
  name:"AlarmModal",
  props: {
    selectedStock: {
      type: Object
    }
  },
  setup(props) {

    const selectedStocks = ref({...props.selectedStock});
    const percentage = ref(0);
    const selectedValue =ref("");
    console.log("selectedStocks확인ㅇㄹㄴㄹㄹㅇ",selectedStocks )
    const increasePercentage = () => {
      percentage.value += 5;
    };

    const decreasePercentage = () => {
      if (percentage.value > 0) {
        percentage.value -= 5;
      }
    };

    // '알림 등록하기' 버튼을 눌렀을 때 호출되는 함수
    const registerAlert = async() => {
      // 알림 설정 정보를 객체로 만듭니다.
        // stockid: selectedStocks.value.initial.stck_shrn_iscd,  // 선택한 주식의 고유번호
        // username: "장건욱",  // 사용자 이름. 실제 구현에서는 적절한 사용자 이름을 사용해야 합니다.
        // morLes: percentage.value >= 0 ? '+' : '-',  // 퍼센트가 0 이상이면 '+', 아니면 '-'를 설정
        // price: []

          const url = "http://222.102.43.244:8094/favorite_stock/update";

          // JavaScript
          const plus = document.getElementById('plus');
          const minus = document.getElementById('minus');


            if (plus.checked) {
              selectedValue.value = plus.value;
            } else if (minus.checked) {
              selectedValue.value  = minus.value;
            }

          const favoriteStockBody = {
            "account": JSON.parse(sessionStorage.getItem("token")),// 추후 계정 바꿔야함 세션에서 가져오는 아이디로,
            "favorite_stock" : props.selectedStock.initial.stck_shrn_iscd,
            "fluctuation":percentage.value,
            "fluctuation_toggle": selectedValue.value
          }

          // console.log("favoriteStockBody", favoriteStockBody)

          const response = await axios.post(url, favoriteStockBody).catch(() => null)
          if (!response) return null

          const result = response.data

          sessionStorage.setItem("favoite_stock", JSON.stringify(result))
          const data = sessionStorage.getItem("favoite_stock")
          console.log("favoite_stock", JSON.parse(data))
      // Vuex 액션을 호출하여 알림 설정 정보를 스토어에 저장합니다.
      // store.dispatch('saveAlertSetting', alertSetting);
    };


    return {
      registerAlert,
      increasePercentage,
      decreasePercentage,
      selectedStocks,
      percentage,
    };
  }


};

</script>
