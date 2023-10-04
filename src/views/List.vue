<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-xl">{{ $t("list.description") }}</p>
  </div>

  <div class="mx-auto max-w-lg p-2 text-left">
    <Prefectures
      class="mt-4"
      v-model="selectedPrefecture"
      @change="getTokenList"
    />
  </div>
  <div
    class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-5"
  >
    <div
      v-for="token in tokens"
      :key="token.key"
      class="px-2 py-6 flex flex-col items-center justify-center"
    >
      <TokenDetail
        class="mt-4"
        :token="token"
      />
      <div class="flex justify-center gap-2 w-full">
        <button
          @click="setSelected(token.id)"
          class="inline-block rounded bg-green-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          {{ $t("list.purchace") }}
        </button>
        <button
          @click="setSelected(token.id)"
          class="inline-block rounded bg-green-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          {{ $t("list.trade") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
// import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { getDocs, collection, query, where, Query } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Prefectures from "@/components/Prefectures.vue";
import TokenDetail from "@/components/TokenDetail.vue";
import { prefectureList } from "@/i18n/prefectures";
import { TOKEN } from "@/firestore/token";

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
  name: "List",
  components: {
    Prefectures,
    TokenDetail,
  },
  async setup(props) {
    // const store = useStore();
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const selectedPrefecture = ref(0);
    const tokenCollectionPath = `/${props.network}/${props.tokenAddress}/tokens`;
    const tokens = ref<TOKEN[]>([]);
    const getTokenList = async () => {
      let tokenQuery: Query<TOKEN> = collection(
        db,
        tokenCollectionPath,
      ) as Query<TOKEN>;
      if (selectedPrefecture.value != 0) {
        tokenQuery = query(
          tokenQuery,
          where("prefecture", "==", prefectureList[selectedPrefecture.value]),
        );
      }
      try {
        const results = await getDocs(tokenQuery);
        tokens.value = results.docs.map((doc) => {
          return doc.data();
        });
      } catch (e) {
        console.error("getTokenList", e);
      }
    };

    getTokenList();

    return {
      lang,
      tokens,
      selectedPrefecture,
      getTokenList,
    };
  },
});
</script>
