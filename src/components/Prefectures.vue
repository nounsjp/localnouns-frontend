<template>
  <span class="ml-16 font-londrina font-yusei text-xl">
    {{ $t("prefectures.prefectures") }}:

    <select @change="updateValue">
      <option
        v-for="(option, index) in prefecture"
        :value="index"
        :key="index"
        :selected="index == selectedValue ? true : false"
      >
        {{ option }}
      </option>
    </select>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
// import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { languages } from "@/i18n/index";
import prefectures from "@/i18n/prefectures";

export default defineComponent({
  setup(props, context) {
    // const route = useRoute();
    // const router = useRouter();
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    // langの変更に伴って都道府県の言語も変更する
    const prefecture = computed(() => {
      return prefectures[lang.value as keyof typeof prefectures];
    });

    const selectedValue = ref(prefecture.value[0]);

    const updateValue = (event: { target: HTMLSelectElement }) => {
      context.emit("update:modelValue", event.target.value);
      console.log(event.target.value);
    };
    return {
      languages,
      selectedValue,
      prefecture,
      updateValue,
    };
  },
});
</script>
