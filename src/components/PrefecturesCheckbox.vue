<template>
  <div class="flex flex-col items-start w-full">
    <div>
      <!-- <span class="font-londrina font-yusei text-xl no-wrap mb-4">
        {{ $t("prefectures.prefectures") }}:
      </span> -->
      <div>
        <!-- NotSpecified を1行目に表示 -->
        <div class="flex items-center mb-2">
          <input
            type="checkbox"
            value="NotSpecified"
            v-model="selectedValues"
            @change="updateValues"
          />
          <label class="ml-2">{{ $t("prefecture.NotSpecified") }}</label>
        </div>
        <!-- 残りの選択肢を2行目以降に表示 -->
        <div class="flex flex-wrap">
          <div
            v-for="(option, index) in prefectureList"
            :key="index"
            class="flex items-center mr-4 mb-2"
          >
            <div v-if="option !== 'NotSpecified'">
              <input
                type="checkbox"
                :value="index"
                v-model="selectedValues"
                @change="updateValues"
              />
              <label class="ml-2">{{ $t("prefecture." + option) }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { prefectureList } from "@/i18n/prefectures";

export default defineComponent({
  setup(props, context) {
    const selectedValues = ref<number[]>([]);

    const updateValues = () => {
      context.emit("update:modelValue", selectedValues.value);
      console.log(selectedValues.value);
    };
    return {
      selectedValues,
      prefectureList,
      updateValues,
    };
  },
});
</script>
