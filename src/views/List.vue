<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-xl">{{ $t("list.description") }}</p>
  </div>

  <div
    class="grid w-full grid-cols-3 place-content-center items-center items-start gap-2 sm:grid-cols-4"
  >
    <span class="ml-2 font-londrina font-yusei text-xl">
      <label>
        <input
          type="checkbox"
          v-model="filterOnSale"
          @change="filterTokenByCriteria"
        />
        <button
          class="inline-block rounded bg-red-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
          disabled
        >
          {{ $t("list.onSale") }}
        </button>
      </label>
    </span>
    <span class="ml-2 font-londrina font-yusei text-xl">
      <label>
        <input
          type="checkbox"
          v-model="filterOnTrade"
          @change="filterTokenByCriteria"
        />
        <button
          class="inline-block rounded bg-blue-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
          disabled
        >
          {{ $t("list.onTrade") }}
        </button>
      </label>
    </span>
    <span v-if="account" class="ml-2 font-londrina font-yusei text-xl">
      <label>
        <input
          type="checkbox"
          v-model="filterOnManage"
          @change="filterTokenByCriteria"
        />
        <button
          class="inline-block rounded bg-green-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
          disabled
        >
          {{ $t("list.manage") }}
        </button>
      </label>
    </span>
    <span v-else class="ml-2 font-londrina font-yusei text-xl">
      <label>
        <input
          disabled
          type="checkbox"
          v-model="filterOnManage"
          @change="filterTokenByCriteria"
        />
        <button
          class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-2 my-2"
          disabled
        >
          {{ $t("list.manage") }}
        </button>
      </label>
    </span>
    <div>
      <Prefectures
        class="mx-2 my-1"
        :notIncludeNotSpecified="true"
        :initialPrefecture="initialPrefecture"
        v-model="selectedPrefecture"
        @change="getTokenList"
      />
      <ListSortOrder
        class="mx-2 my-1"
        v-model="selectedSortOrder"
        @change="filterTokenByCriteria"
      />
    </div>
  </div>
  <div
    class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-5"
  >
    <div
      v-for="token in tokensForDisplay"
      :key="token.key"
      class="px-2 py-6 flex flex-col items-center justify-center"
    >
      <div @click="showTokenModal(token)" class="items-center justify-center">
        <TokenDetail :token="token" size="w80" />
      </div>

      <span
        v-if="token.holder.toLowerCase() == account"
        class="ml-2 font-londrina font-yusei text-xl"
      >
        <button
          class="inline-block rounded bg-green-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 my-2"
          disabled
        >
          {{ $t("list.manage") }}
        </button>
      </span>
    </div>

    <TokenManagement
      v-if="selectedToken"
      :network="network"
      :isOpen="isManagementModalOpen"
      :token="selectedToken"
      @close="closeTokenModal"
    />

    <TokenSaleOrTrade
      v-if="selectedToken"
      :network="network"
      :isOpen="isSaleOrTradeModalOpen"
      :token="selectedToken"
      :myTokens="myTokens"
      @close="closeTokenModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import {
  getDocs,
  collection,
  query,
  where,
  Query,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import Prefectures from "@/components/Prefectures.vue";
import ListSortOrder from "@/components/ListSortOrder.vue";
import TokenDetail from "@/components/TokenDetail.vue";
import TokenManagement from "@/components/TokenManagement.vue";
import TokenSaleOrTrade from "@/components/TokenSaleOrTrade.vue";
import { prefectureList } from "@/i18n/prefectures";
import { TOKEN } from "@/firestore/const";

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
    ListSortOrder,
    TokenDetail,
    TokenManagement,
    TokenSaleOrTrade,
  },
  async setup(props) {
    const store = useStore();
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    // langが変更されたらgetTokenListを実行するウォッチャー
    watch(lang, async (newLang, oldLang) => {
      if (newLang !== oldLang) {
        getTokenList();
      }
    });
    const myTokens = ref<TOKEN[]>([]);
    const getMyTokenList = async (account: string) => {
      let tokenQuery: Query<TOKEN> = collection(
        db,
        tokenCollectionPath + "/tokens",
      ) as Query<TOKEN>;
      if (account) {
        tokenQuery = query(tokenQuery, where("holder", "==", account));
        try {
          const results = await getDocs(tokenQuery);
          myTokens.value = results.docs.map((doc) => {
            return doc.data();
          });
        } catch (e) {
          console.error("getMyTokenList", e);
        }
      }
    };

    let beforeAccount = "";
    const account = computed(() => {
      if (beforeAccount != store.state.account && store.state.account) {
        getMyTokenList(store.state.account);
        beforeAccount = store.state.account;
      }
      return store.state.account;
    });

    // 表示する都道府県をランダムに設定
    const initialPrefecture = new Date().getSeconds() % 47;
    const selectedPrefecture = ref(initialPrefecture + 1);
    const selectedSortOrder = ref("newer");
    const filterOnSale = ref(false);
    const filterOnTrade = ref(false);
    const filterOnManage = ref(false);
    const isManagementModalOpen = ref(false);
    const isSaleOrTradeModalOpen = ref(false);

    const tokenCollectionPath = `/${props.network}/${props.tokenAddress}`;
    const tokens = ref<TOKEN[]>([]);
    const tokensForDisplay = ref<TOKEN[]>([]);
    const getTokenList = async () => {
      let tokenQuery: Query<TOKEN> = collection(
        db,
        tokenCollectionPath + "/tokens",
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
        filterTokenByCriteria();
        getPartsName(tokens.value);
      } catch (e) {
        console.error("getTokenList", e);
      }
    };
    getTokenList();

    const filterTokenByCriteria = () => {
      tokensForDisplay.value = tokens.value;
      if (filterOnSale.value) {
        tokensForDisplay.value = tokensForDisplay.value.filter(
          (token: TOKEN) => token.salePrice > 0,
        );
      }
      if (filterOnTrade.value) {
        tokensForDisplay.value = tokensForDisplay.value.filter(
          (token: TOKEN) => token.isOnTrade == true,
        );
      }
      if (filterOnManage.value && account) {
        tokensForDisplay.value = tokensForDisplay.value.filter(
          (token: TOKEN) => token.holder == account.value,
        );
      }

      switch (selectedSortOrder.value) {
        case "newer":
          tokensForDisplay.value.sort(
            (a, b) => Number(b.tokenId) - Number(a.tokenId),
          );
          break;
        case "older":
          tokensForDisplay.value.sort(
            (a, b) => Number(a.tokenId) - Number(b.tokenId),
          );
          break;
        case "lower":
          tokensForDisplay.value.sort((a, b) => a.salePrice - b.salePrice);
          break;
        case "higher":
          tokensForDisplay.value.sort((a, b) => b.salePrice - a.salePrice);
          break;
      }
    };

    const getPartsName = async (tokens: TOKEN[]) => {
      // パーツ名を取得
      for (const token of tokens) {
        const accessoryRef = doc(
          db,
          tokenCollectionPath + "/parts",
          `Accessories-${token.prefecture.toLowerCase()}-${token.accessory}-${
            lang.value
          }`,
        );
        const accessorySnap = await getDoc(accessoryRef);
        if (accessorySnap.exists()) {
          token.accessory = accessorySnap.data().name;
          token.accessoryDescription = accessorySnap.data().description;
        }

        const headRef = doc(
          db,
          tokenCollectionPath + "/parts",
          `Heads-${token.prefecture.toLowerCase()}-${token.head}-${lang.value}`,
        );
        const headSnap = await getDoc(headRef);
        if (headSnap.exists()) {
          token.head = headSnap.data().name;
          token.headDescription = headSnap.data().description;
        }
      }
    };

    const selectedToken = ref<TOKEN | null>(null);

    // 保有していたら管理用モーダル、そうでない場合はP2P用
    const showTokenModal = (token: TOKEN) => {
      selectedToken.value = token;
      if (!account.value || token.holder != account.value.toLowerCase()) {
        isSaleOrTradeModalOpen.value = true;
      } else {
        isManagementModalOpen.value = true;
      }
    };

    const closeTokenModal = (reload: boolean) => {
      isManagementModalOpen.value = false;
      isSaleOrTradeModalOpen.value = false;
      console.log("closeTokenModal-reload", reload);
      if (reload) {
        getTokenList();
      }
    };

    return {
      account,
      lang,
      tokensForDisplay,
      myTokens,
      selectedPrefecture,
      initialPrefecture,
      selectedSortOrder,
      filterOnSale,
      filterOnTrade,
      filterOnManage,
      filterTokenByCriteria,
      isManagementModalOpen,
      isSaleOrTradeModalOpen,
      getTokenList,
      showTokenModal,
      closeTokenModal,
      selectedToken,
    };
  },
});
</script>
