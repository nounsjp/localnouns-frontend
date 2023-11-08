<template>
  <!-- https://www.npmjs.com/package/vue-google-charts -->
  <GChart
    type="GeoChart"
    :data="chartData"
    :options="chartOptions"
    :settings="chartSettings"
  />
</template>
<script lang="ts">
import { defineComponent, PropType, watch, ref } from "vue";
import { GChart } from "vue-google-charts";
import { prefectureList } from "@/i18n/prefectures";
import { TOKEN } from "@/firestore/const";
import { GOOGLE_MAPS_API_KEY } from "@/config/project";

export default defineComponent({
  props: {
    groupedByPrefecture: {
      type: Object as PropType<{ [key: number]: TOKEN[] }>,
      required: true,
    },
  },
  name: "NounsMap",
  components: {
    GChart,
  },
  setup(props) {
    const chartData = ref([["Prefecture", "Nouns"]]);

    // props.groupedByPrefectureが変更されたときに実行されるwatcher
    watch(
      () => props.groupedByPrefecture,
      (newVal) => {
        chartData.value = [["Prefecture", "Nouns"]];
        Object.entries(newVal).forEach(([prefectureId, tokens]) => {
          chartData.value.push([
            prefectureList[Number(prefectureId)],
            prefectureList[Number(prefectureId)] +
              " : " +
              String(tokens.length),
          ]);
          console.log("NounsPam chartData:", chartData);
        });
      },
    );

    const chartOptions = {
      width: 400,
      height: 300,
      region: "JP",
      resolution: "provinces",
    };

    const chartSettings = {
      packages: ["geochart"],
      mapsApiKey: GOOGLE_MAPS_API_KEY,
    };

    return {
      chartData,
      chartOptions,
      chartSettings,
    };
  },
});
</script>
