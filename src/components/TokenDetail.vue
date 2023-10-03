<template>
  <svg v-html="svgData"></svg>
  <p class="mb-2 font-londrina text-xl">
    #{{ tokenId }}, {{ $t("prefecture." + prefecture) }},

    <span @click="showComment = !showComment" class="relative z-10">
      <span v-if="$t(head) != head">
        {{ $t(head) }}
      </span>
      <span v-else>
        {{ headName }}
      </span> </span
    >,
    <span v-if="$t(accessory) != accessory">
      {{ $t(accessory) }}
    </span>
    <span v-else>
      {{ accessoryName }}
    </span>
    <span
      v-if="showComment"
      @click="showComment = !showComment"
      class="absolute bg-white border p-3 -top-40 left-0 z-0"
      >{{ $t("partsDescription.heads_" + prefecture + "_" + headName) }}</span
    >
  </p>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    tokenId: {
      type: String,
      required: true,
    },
    prefecture: {
      type: String,
      required: true,
    },
    headName: {
      type: String,
      required: true,
    },
    accessoryName: {
      type: String,
      required: true,
    },
    svgData: {
      type: String,
      required: true,
    },
  },
  name: "TokenDetail",
  setup(props) {
    const showComment = ref(false);

    const head =
      "partsName.heads_" +
      props.prefecture.toLowerCase() +
      "_" +
      props.headName;
    const accessory =
      "partsName.accessories_" +
      props.prefecture.toLowerCase() +
      "_" +
      props.accessoryName;

    console.log("head:", head);
    console.log("accessory:", accessory);
    return {
      showComment,
      head,
      accessory,
    };
  },
});
</script>

<style scoped>
p {
  position: relative;
}
</style>
