<template>
  <span class="ml-16 font-londrina font-yusei text-xl">
    {{ $t("numOfMint.numOfMint") }}:

    <select @change="updateValue">
      <option
        v-for="(option, index) in numOfMint"
        :value="option"
        :key="index"
        :selected="option == selectedValue ? true : false"
      >
        {{ option }}
      </option>
    </select>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import { useRoute, useRouter } from "vue-router";
// import { useI18n } from "vue-i18n";

import { languages } from "@/i18n/index";

export default defineComponent({
  setup() {
    // const route = useRoute();
    // const router = useRouter();
    // const i18n = useI18n();

    // const lang = computed(() => {
    //   return i18n.locale.value;
    // });

    const numOfMint = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 仮のミント数
    const selectedValue = ref(numOfMint.length);

    const updateValue = (value: { target: HTMLSelectElement }) => {
      console.log(value);
    };
    return {
      languages,
      selectedValue,
      numOfMint,
      updateValue,
    };
  },
});
</script>
