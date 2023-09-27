<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-xl">{{ $t("p2pSale.description") }}</p>
  </div>

  <div
    class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-5"
  >
    <div v-for="token in tokens" :key="token.key" class="px-2 py-6 flex flex-col items-center justify-center">
      <svg v-html="token.svg"></svg>
    <p class="mb-2 font-londrina text-xl">#{{ token.tokenId}}, {{ token.prefecture}}, {{ token.head}}, {{ token.accessory}}</p>
      <button
        @click="setSelected(token.id)"
        class="inline-block w-32 rounded bg-white px-6 py-2.5 leading-tight text-green-500 shadow-md hover:bg-green-100 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0"
      >
        {{ $t("p2pSale.purchace") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
// import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/utils/firebase";

export default defineComponent({
  props: {
    network: {
      type: String,
      required: true,
    },
    tokenAddress: {
      type: String,
      required: true,
    },
  },
  name: "P2PSale",
  components: {},
  async setup(props) {
    // const store = useStore();
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const path = `/${props.network}/${props.tokenAddress}/tokens/`;

    const getTokenList = async () => {
      try {
        const results = await getDocs(collection(db, path));
        const tokens = results.docs.map((doc) => {
          return doc.data();
        });
        return tokens;
      } catch (e) {
        console.error("getTokenList", e);
      }
    };

    const tokens = await getTokenList();

    return {
      lang,
      tokens,
    };
  },
});
</script>
