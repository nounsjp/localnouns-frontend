<template>
  <svg v-html="token.svg"></svg>
  <p class="mb-2 font-londrina text-xl">
    #{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }},

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
      >{{
        $t("partsDescription.heads_" + token.prefecture + "_" + token.head)
      }}</span
    >
  </p>
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
</style>
