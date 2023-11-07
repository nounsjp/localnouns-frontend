<template>
  <GChart
    type="GeoChart"
    :data="chartData"
    :options="chartOptions"
    :settings="chartSettings"
  />
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
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
    const chartData = [["Prefecture", "Nouns"]];

    Object.entries(props.groupedByPrefecture).forEach(
      ([prefectureId, tokens]) => {
        chartData.push([
          prefectureList[Number(prefectureId)],
          prefectureList[Number(prefectureId)] + ":" + String(tokens.length),
        ]);
      },
    );

    const chartOptions = {
      width: 800,
      height: 600,
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
