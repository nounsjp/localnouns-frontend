<template>
  <div class="flex justify-center items-center">
    <svg v-if="size=='L'" v-html="token.svg" style="width: 320px; height: 320px;"></svg>
    <svg v-if="size=='S'" v-html="token.svg" style="width: 80%; height: auto;"></svg>
  </div>
  <div class="mb-2 font-londrina text-xl">
    <div>#{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }}</div>

    <div>
      <span @click="showComment = !showComment" class="relative z-10">
        {{ token.head }},
        {{ token.accessory }}
      </span>
      <!-- TODO 説明の表示方法は後で見直す, パーツ名もfirestoreから取得に変更する-->
      <span
        v-if="showComment"
        @click="showComment = !showComment"
        class="absolute bg-white border p-3 -top-40 left-0 z-0"
      >
        {{
          $t("partsDescription.heads_" + token.prefecture + "_" + token.head)
        }}
      </span>

      <div
        class="flex justify-center gap-2 w-full font-londrina font-yusei text-xl"
      >
        <div>
          <button
            v-if="token.salePrice > 0"
            class="inline-block rounded bg-red-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
            disabled
          >
            {{ $t("list.onSale") }}
          </button>
          <button
            v-else
            class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
            disabled
          >
            {{ $t("list.onSale") }}
          </button>
        </div>
        <div>
          <button
            v-if="token.isOnTrade"
            class="inline-block rounded bg-blue-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
            disabled
          >
            {{ $t("list.onTrade") }}
          </button>
          <button
            v-else
            class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
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
import { TOKEN } from "@/firestore/const";

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
    return {
      showComment,
      i18nHead,
      i18nAccessory,
    };
  },
});
</script>
