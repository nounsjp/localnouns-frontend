<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p v-if="salePhase == 0" class="mb-2 font-londrina font-yusei text-xl">
      {{ $t("mint.saleLock") }}
    </p>
    <p v-if="salePhase == 1" class="mb-2 font-londrina font-yusei text-xl">
      {{ $t("mint.alSale") }}
    </p>
    <p v-if="salePhase == 2" class="mb-2 font-londrina font-yusei text-xl">
      {{ $t("mint.publicSale") }}
    </p>
    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
  </div>

  <div v-if="salePhase != 0">
    <div class="mx-auto max-w-lg p-2 text-left">
      <Prefectures v-model="selectedPrefecture" />
    </div>

    <div class="mx-auto max-w-lg p-2 text-left">
      <div
        class="grid w-auto grid-cols-1 place-content-center items-center gap-2"
      >
        <span class="font-londrina font-yusei text-xl whitespace-nowrap">
          {{ $t("mint.price") }}: {{ mintPrice }} ETH
        </span>
      </div>
    </div>

    <div class="mx-auto max-w-lg p-2 text-left">
      <NumOfMint limit="10" v-model="selectedNumOfMint" />
    </div>

    <div class="mx-auto max-w-lg p-2 text-left mt-4 mb-4">
      <span class="font-londrina font-yusei text-3xl whitespace-nowrap">
        {{ $t("mint.total") }}: {{ total }} ETH (+ gas fee)
      </span>
    </div>

    <div class="mx-auto max-w-lg p-2 text-left mt-4 mb-4">
      <span class="font-londrina font-yusei">
        <span v-if="account">
          <span v-if="balanceOf == 0 && salePhase == 1">
            <!-- ALセールで特定NFTなし-->
            <span
              class="inline-block rounded bg-gray-600 px-6 py-2.5 leading-tight text-white text-xl shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
              disabled
            >
              {{ $t("mint.notHasSpecificNFT") }}
            </span>
          </span>
          <span v-else>
            <span v-if="mintLimit < totalSupply + selectedNumOfMint">
              <!-- 最大ミント数オーバー-->
              <span
                class="inline-block rounded bg-gray-600 px-6 py-2.5 leading-tight text-white text-xl shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
                disabled
              >
                {{ $t("mint.overMintLimit") }}
              </span>
            </span>
            <span v-else>
              <!-- ミント中 -->
              <button
                type="button"
                v-if="isMinting"
                class="inline-block rounded px-6 py-2.5 leading-tight text-gray-600 shadow-md"
                disabled
              >
                <img
                  class="absolute h-3 w-8 animate-spin"
                  src="@/assets/red160px.png"
                />
                <span class="ml-10">{{ $t("message.processing") }}</span>
              </button>
              <!-- ミントボタン -->
              <button
                v-else
                @click="mint"
                class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
              >
                {{ $t("mint.mint") }}
              </button>
            </span>
          </span>
        </span>
        <span v-else>
          <span
            class="inline-block rounded bg-gray-600 px-6 py-2.5 leading-tight text-white text-xl shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
            disabled
          >
            {{ $t("mint.connectWallet") }}
          </span>
        </span>
      </span>
    </div>

    <!-- ミント終了時のダイアログ -->
    <FinishMintDialog
      :isOpen="displayInformationDialog"
      :mintedTokenId="mintedTokenId"
      :mintedNumber="selectedNumOfMint"
      :hashLink="hashLink"
      @close="closeModal(true)"
    />

    <!-- エラー時のダイアログ -->
    <ErrorDialog
      :isOpen="displayErrorDialog"
      :description="errorDescription"
      @close="closeModal(true)"
    />

    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
    <hr />
    <div class="mx-auto max-w-lg p-2 text-center">
      <p class="mb-2 font-londrina font-yusei text-3xl">
        {{ `${totalSupply}` }} / {{ `${mintLimit}` }} minted
      </p>
    </div>

    <p class="mb-2 font-londrina font-yusei">
      {{ $t("mint.recentlyMinted") }}
    </p>
    <div
      v-if="tokens.length > 0"
      class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-4 mt-4"
    >
      <span v-for="token in tokens" :key="token.tokenId">
        <div>
          <img :src="token.image" class="mr-1 mb-1 inline-block w-32" />
          <p class="mb-2 font-londrina font-yusei text-s">
            #{{ token.tokenId }}
          </p>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { ethers } from "ethers";
import {
  getProvider,
  getTokenContract,
  useFetchTokens,
  useMintConditions,
  getLocalNounsMinterContract,
  getTokenGate,
  useCheckTokenGate,
  getAddresses,
} from "@/utils/const";
import { ChainIdMap } from "@/utils/MetaMask";
import { weiToEther } from "@/utils/utils";
import { ALCHEMY_API_KEY } from "@/config/project";
import Prefectures from "@/components/Prefectures.vue";
import NumOfMint from "@/components/NumOfMint.vue";
import FinishMintDialog from "@/components/FinishMintDialog.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";

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
    // tokenGated: {
    //   type: Boolean,
    //   required: true,
    // },
    tokenGateAddress: {
      type: String,
      required: true,
    },
    // restricted: {
    //   type: String,
    // },
    assetProvider: {
      type: String,
    },
    minterAddress: {
      type: String,
      required: true,
    },
    // limit: {
    //   type: Number,
    // },
  },
  name: "Mint",
  components: {
    Prefectures,
    NumOfMint,
    FinishMintDialog,
    ErrorDialog,
  },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();

    const isMinting = ref(false);
    const displayInformationDialog = ref(false);
    const mintedTokenId = ref(99999);
    const displayErrorDialog = ref(false);
    const errorDescription = ref("");
    const hashLink = ref("");

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const provider = getProvider(props.network, ALCHEMY_API_KEY);

    // RO means read only.
    const contractRO = getTokenContract(props.tokenAddress, provider);
    // Minter
    const minterContract = getLocalNounsMinterContract(
      props.minterAddress,
      provider,
    );
    // TokenGate
    const tokenGateContract = getTokenGate(props.tokenGateAddress, provider);

    const { fetchTokens, totalSupply, tokens } = useFetchTokens(
      props.network,
      props.assetProvider,
      provider,
      contractRO,
    );
    fetchTokens();

    const {
      salePhase,
      mintLimit,
      mintPriceForSpecified,
      mintPriceForNotSpecified,
      mintConditions,
    } = useMintConditions(props.network, minterContract);
    mintConditions();

    provider.once("block", () => {
      contractRO.on(contractRO.filters.Transfer(), async (event) => {
        try {
          // 短時間に呼び出し過ぎるとエラーになる
          console.log("*** event.Transfer calling fetchTokens");
          // Proxy(Result)から値を取得
          const from = event.args[0];
          const to = event.args[1];
          const tokenId = event.args[2]?.toString();
          // ダイアログ表示中でなく、ミント先が自分の場合はダイアログを表示
          if (
            !displayInformationDialog.value &&
            from == "0x0000000000000000000000000000000000000000" &&
            to.toLowerCase() == account.value.toLowerCase()
          ) {
            displayInformationDialog.value = true;
            mintedTokenId.value = Number(tokenId);
          }
          fetchTokens();
        } catch (e) {
          if (e instanceof Error) {
            console.error("event.Transfer:", e.message);
          } else {
            console.error("event.Transfer:", e);
          }
        }
        context.emit("minted");
      });
    });

    const selectedPrefecture = ref(0);
    const selectedNumOfMint = ref(10);

    const mintPrice = computed(() => {
      if (selectedPrefecture.value == 0) {
        return weiToEther(mintPriceForNotSpecified.value);
      } else {
        return weiToEther(mintPriceForSpecified.value);
      }
    });

    const total = computed(() => {
      return mintPrice.value * Number(selectedNumOfMint.value);
    });

    const { balanceOf, checkTokenGate } = useCheckTokenGate(tokenGateContract);

    const account = computed(() => {
      checkTokenGate(store.state.account);
      return store.state.account;
    });

    const mint = async () => {
      const chainId = ChainIdMap[props.network];
      const signer = await store.getters.getSigner(chainId);

      const contract = getLocalNounsMinterContract(props.minterAddress, signer);

      isMinting.value = true;

      try {
        const weiValue = ethers.parseEther(total.value.toString());
        const txParams = { value: weiValue };
        const tx = await contract.mintSelectedPrefecture(
          selectedPrefecture.value,
          selectedNumOfMint.value,
          txParams,
        );
        console.log("hash:", tx.hash);
        const result = await tx.wait();
        const { EtherscanBase } = getAddresses(
          props.network,
          props.minterAddress,
        );
        hashLink.value = EtherscanBase + tx.hash;
        console.log("props.network", props.network);
        console.log("EtherscanBase", EtherscanBase);
        console.log("hashLink.value", hashLink.value);

        // displayInformationDialog.value = true;
        console.log("mint:gasUsed", result.gasUsed);

        // await checkTokenGate(account.value);
      } catch (e) {
        console.error("mintSelectedPrefecture:", e);
        if (e instanceof Error) {
          errorDescription.value = "mintSelectedPrefecture:" + e.message;
        } else {
          errorDescription.value = "mintSelectedPrefecture:" + String(e);
        }
        const indexComma = errorDescription.value.indexOf("(");
        errorDescription.value = errorDescription.value.substring(
          0,
          indexComma,
        );
        if (errorDescription.value.indexOf("user rejected action") < 0) {
          displayErrorDialog.value = true;
        }
      }
      isMinting.value = false;
    };

    const closeModal = () => {
      console.log("closeModal-reload");
      isMinting.value = false;
      displayInformationDialog.value = false;
      displayErrorDialog.value = false;
    };

    return {
      lang,
      salePhase,
      mintPrice,
      totalSupply,
      mintLimit,
      balanceOf,
      tokens,
      total,
      selectedNumOfMint,
      selectedPrefecture,
      isMinting,
      displayInformationDialog,
      mintedTokenId,
      hashLink,
      displayErrorDialog,
      errorDescription,
      closeModal,
      account,
      mint,
    };
  },
});
</script>
