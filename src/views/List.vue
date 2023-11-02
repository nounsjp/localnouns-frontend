<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-xl">{{ $t("list.description") }}</p>
  </div>

  <div
    class="grid w-screen grid-cols-3 place-content-center items-center items-start gap-2 sm:grid-cols-5"
  >
    <span class="ml-2 font-londrina font-yusei text-xl no-wrap">
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
    <span class="ml-2 font-londrina font-yusei text-xl no-wrap">
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
    <span v-if="account" class="ml-2 font-londrina font-yusei text-xl no-wrap">
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
    <span v-else class="ml-2 font-londrina font-yusei text-xl no-wrap">
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
    <Prefectures
      class="mt-4"
      v-model="selectedPrefecture"
      @change="filterTokenByCriteria"
    />
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
        <TokenDetail class="mt-4" :token="token" size="w80" />
      </div>

      <TokenManagement
        :network="network"
        :isOpen="isManagementModalOpen"
        :token="selectedToken"
        @close="closeTokenModal"
      />

      <TokenSaleOrTrade
        :network="network"
        :isOpen="isSaleOrTradeModalOpen"
        :token="selectedToken"
        :myTokens="myTokens"
        @close="closeTokenModal"
      />
      <div v-if="token.holder.toLowerCase() == account">
        <button
          class="inline-block rounded bg-green-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 my-2"
          disabled
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
import TokenManagement from "@/components/TokenManagement.vue";
import TokenSaleOrTrade from "@/components/TokenSaleOrTrade.vue";
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
    TokenManagement,
    TokenSaleOrTrade,
  },
  async setup(props) {
    const store = useStore();
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const myTokens = ref<TOKEN[]>([]);
    const getMyTokenList = async (account: string) => {
      let tokenQuery: Query<TOKEN> = collection(
        db,
        tokenCollectionPath,
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

    const selectedPrefecture = ref(0);
    const filterOnSale = ref(false);
    const filterOnTrade = ref(false);
    const filterOnManage = ref(false);
    const isManagementModalOpen = ref(false);
    const isSaleOrTradeModalOpen = ref(false);

    const tokenCollectionPath = `/${props.network}/${props.tokenAddress}/tokens`;
    const tokens = ref<TOKEN[]>([]);
    const tokensForDisplay = ref<TOKEN[]>([]);
    const getTokenList = async () => {
      const tokenQuery: Query<TOKEN> = collection(
        db,
        tokenCollectionPath,
      ) as Query<TOKEN>;

      try {
        const results = await getDocs(tokenQuery);
        tokens.value = results.docs.map((doc) => {
          return doc.data();
        });
        filterTokenByCriteria();
      } catch (e) {
        console.error("getTokenList", e);
      }
    };
    getTokenList();

    const filterTokenByCriteria = () => {
      tokensForDisplay.value = tokens.value;
      if (selectedPrefecture.value != 0) {
        tokensForDisplay.value = tokensForDisplay.value.filter(
          (token: TOKEN) =>
            token.prefecture == prefectureList[selectedPrefecture.value],
        );
      }
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
