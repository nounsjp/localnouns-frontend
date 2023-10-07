<template>
  <div class="flex justify-center items-center">
    <svg v-html="token.svg" :class="'svg-size-' + size"></svg>
  </div>
  <div class="mb-2 font-londrina text-xl">
    <div>#{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }}</div>

    <div>
      <span @click="showComment = !showComment" class="relative z-10">
        <span v-if="$t(i18nHead) != i18nHead">
          {{ $t(i18nHead) }}
        </span>
        <span v-else>
          {{ token.head }}
        </span> </span
      >,
      <span v-if="$t(i18nAccessory) != i18nAccessory">
        {{ $t(i18nAccessory) }}
      </span>
      <span v-else>
        {{ token.accessory }}
      </span>
      <!-- TODO 説明の表示方法は後で見直す-->
      <span
        v-if="showComment"
        @click="showComment = !showComment"
        class="absolute bg-white border p-3 -top-40 left-0 z-0"
      >
        {{
          $t("partsDescription.heads_" + token.prefecture + "_" + token.head)
        }}
      </span>

      <div class="flex justify-center gap-2 w-full">
        <div>
          <button
            v-if="token.salePrice > 0"
            class="inline-block rounded bg-red-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"
          >
            {{ $t("list.onSale") }}
          </button>
          <button
            v-else
            class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out"
            disabled
          >
            {{ $t("list.onSale") }}
          </button>
        </div>
        <div>
          <button
            v-if="token.isOnTrade"
            class="inline-block rounded bg-blue-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          >
            {{ $t("list.onTrade") }}
          </button>
          <button
            v-else
            class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out"
            disabled
          >
            {{ $t("list.onTrade") }}
          </button>
        </div>
      </div>

      <p v-if="token.salePrice > 0" class="mb-2 font-londrina text-xl">
        {{ token.salePrice }} ETH
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { TOKEN } from "@/firestore/token";

export default defineComponent({
  props: {
    token: {
      type: Object as () => TOKEN,
      required: true,
    },
    size: {
      type: String,
      required: false,
    },
  },
  name: "TokenDetail",
  setup(props) {
    const showComment = ref(false);

    const i18nHead =
      "partsName.heads_" +
      props.token.prefecture.toLowerCase() +
      "_" +
      props.token.head;
    const i18nAccessory =
      "partsName.accessories_" +
      props.token.prefecture.toLowerCase() +
      "_" +
      props.token.accessory;

    console.log("head:", i18nHead);
    console.log("accessory:", i18nAccessory);
    return {
      showComment,
      i18nHead,
      i18nAccessory,
    };
  },
});
</script>

<style scoped>
p {
  position: relative;
}
.svg-size-L {
  width: 320px;
  height: 320px;
}
.svg-size-w80 {
  width: 80%;
  height: auto;
}
</style>
