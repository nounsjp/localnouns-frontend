<template>
  <div class="mb-4">
    <hr class="border-t border-gray-600 my-4 w-full" />

    <p class="font-londrina font-yusei text-2xl text-center">
      {{ $t("statistics.last30days") }}
    </p>

    <div class="flex justify-center">
      <!-- https://www.npmjs.com/package/vue-google-charts -->
      <GChart
        type="ColumnChart"
        :data="chartData"
        :options="chartOptions"
        :settings="chartSettings"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { GChart } from "vue-google-charts";
import { HISTORY } from "@/firestore/const";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default defineComponent({
  props: {
    network: {
      type: String,
      required: true,
    },
    tokenAddress: {
      type: String,
      required: true,
    },
  },
  name: "RecordChart",
  components: {
    GChart,
  },
  setup(props) {
    const collectionPath = `/${props.network}/${props.tokenAddress}`;

    const histories = ref<HISTORY[]>([]);
    const getHistories = async () => {
      // コレクションへの参照を取得
      const historyCollectionRef = collection(db, collectionPath + "/history");

      // クエリ条件（orderByとlimit）を適用
      const historyQuery = query(
        historyCollectionRef,
        orderBy("timestamp", "desc"),
      );
      try {
        const results = await getDocs(historyQuery);
        histories.value = results.docs.map((doc) => {
          // return doc.data();
          const data = doc.data();
          // doc.data() を HOLDER 型にキャスト
          const history: HISTORY = {
            hash: data.hash,
            blocknumber: data.blocknumber,
            action: data.action,
            tokenId: data.tokenId,
            from: data.from,
            to: data.to,
            fromName: data.fromName,
            toName: data.toName,
            // FirestoreのtimestampをDateオブジェクトに変換
            timestamp: data.timestamp?.toDate(), // timestampが存在する場合、toDate() メソッドで Date オブジェクトに変換
          };
          console.log(history.timestamp, history.action, history.tokenId);
          return history;
        });
      } catch (e) {
        console.error("getHistories", e);
      }
    };
    getHistories();

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    console.log(startOfToday);

    const chartData = ref([["Date", 0, 0, 0]]);
    chartData.value = [["Date", "Mint", "P2PSale", "P2PTrade"]];

    chartData.value.push(["1/1", 10, 5, 1]);
    chartData.value.push(["1/2", 4, 2, 2]);
    chartData.value.push(["1/3", 6, 3, 1]);
    chartData.value.push(["1/4", 10, 5, 1]);

    const chartOptions = {
      width: 600,
      height: 400,
    };

    const chartSettings = {};

    return {
      chartData,
      chartOptions,
      chartSettings,
    };
  },
});
</script>
