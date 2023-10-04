<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-xl">{{ $t("list.description") }}</p>
  </div>

  <div
    class="grid w-screen grid-cols-2 place-content-left items-left items-start gap-2 sm:grid-cols-5"
  >
    <span class="ml-16 font-londrina font-yusei text-xl no-wrap">
      <label>
        <input type="checkbox" v-model="filterOnSale" @change="getTokenList" />
        <button
          class="inline-block rounded bg-red-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
          disabled
        >
          {{ $t("list.onSale") }}
        </button>
      </label>
    </span>
    <span class="ml-16 font-londrina font-yusei text-xl no-wrap">
      <label>
        <input type="checkbox" v-model="filterOnTrade" @change="getTokenList" />
        <button
          class="inline-block rounded bg-blue-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
          disabled
        >
          {{ $t("list.onTrade") }}
        </button>
      </label>
    </span>
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
      <TokenDetail class="mt-4" :token="token" />
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
      <div v-if="token.holder.toLowerCase() == account">
        <button
          class="inline-block rounded bg-green-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg my-2"
        >
          {{ $t("list.manage") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
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
    const store = useStore();
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const account = computed(() => store.state.account);

    const selectedPrefecture = ref(0);
    const filterOnSale = ref(false);
    const filterOnTrade = ref(false);
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
      console.log("filterOnTrade.value", filterOnTrade.value);
      console.log("filterOnSale.value", filterOnSale.value);
      if (filterOnSale.value) {
        tokenQuery = query(tokenQuery, where("salePrice", ">", 0));
      }
      if (filterOnTrade.value) {
        tokenQuery = query(tokenQuery, where("isOnTrade", "==", true));
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
      account,
      lang,
      tokens,
      selectedPrefecture,
      filterOnSale,
      filterOnTrade,
      getTokenList,
    };
  },
});
</script>
