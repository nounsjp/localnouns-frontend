<template>
  <div class="grid w-auto grid-cols-1 place-content-center items-center gap-2">
    <span class="font-londrina font-yusei text-xl no-wrap">
      {{ $t("prefectures.prefectures") }}:

      <select @change="updateValue">
        <option
          v-for="(option, index) in prefectureList"
          :value="index"
          :key="index"
          :selected="index == selectedValue"
        >
          {{ $t("prefecture." + option) }}
        </option>
      </select>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { prefectureList } from "@/i18n/prefectures";

export default defineComponent({
  setup(props, context) {
    const selectedValue = ref(prefectureList[0]);

    const updateValue = (event: { target: HTMLSelectElement }) => {
      context.emit("update:modelValue", event.target.value);
      console.log(event.target.value);
    };
    return {
      selectedValue,
      prefectureList,
      updateValue,
    };
  },
});
</script>
