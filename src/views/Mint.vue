<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p v-if="salePhase==0" class="mb-2 font-londrina font-yusei text-xl">
      {{ $t("mint.saleLock") }}
    </p>
    <p v-if="salePhase==1" class="mb-2 font-londrina font-yusei text-xl">
      {{ $t("mint.alSale") }}
    </p>
    <p v-if="salePhase==2" class="mb-2 font-londrina font-yusei text-xl">
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
      <span class="ml-24 font-londrina font-yusei">
        <span v-if="account">
          <button
            @click="mint"
            class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
          >
            {{ $t("mint.mint") }}
          </button>
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

    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
    <hr />
    <div class="mx-auto max-w-lg p-2 text-center">
      <p class="mb-2 font-londrina font-yusei text-3xl">
        {{ `${totalSupply - 1}` }} / {{ `${mintLimit}` }} minted
      </p>
    </div>

    <div v-if="tokens.length > 0" class="mt-4">
      <p class="mb-2 font-londrina font-yusei text-s">
        {{ $t("mint.recentlyMinted") }}
      </p>
      <span v-for="token in tokens" :key="token.tokenId">
        <img :src="token.image" class="mr-1 mb-1 inline-block w-32" />
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
} from "@/utils/const";
import { ChainIdMap } from "@/utils/MetaMask";
import { weiToEther } from "@/utils/utils";
import { ALCHEMY_API_KEY } from "@/config/project";
import Prefectures from "@/components/Prefectures.vue";
import NumOfMint from "@/components/NumOfMint.vue";

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
    // tokenGateAddress: {
    //   type: String,
    //   required: true,
    // },
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
  },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();

    const isMinting = ref(false);
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
      contractRO.on(
        contractRO.filters.Transfer(),
        async (from, to, tokenId) => {
          console.log("*** event.Transfer calling fetchTokens");
          console.log("from, to, tokenId=", from, to, tokenId);
          fetchTokens();
          context.emit("minted");
        },
      );
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

    const account = computed(() => store.state.account);

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
        const result = await tx.wait();
        console.log("mint:gasUsed", result.gasUsed.toNumber());

        // await checkTokenGate(account.value);
      } catch (e) {
        console.error(e);
      }
      isMinting.value = false;
    };

    return {
      lang,
      salePhase,
      mintPrice,
      totalSupply,
      mintLimit,
      tokens,
      total,
      selectedNumOfMint,
      selectedPrefecture,
      isMinting,
      account,
      mint,
    };
  },
});
</script>
