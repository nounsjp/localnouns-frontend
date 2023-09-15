<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-xl">{{ $t("mint.publicSale") }}</p>
    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
  </div>

  <div class="mx-auto max-w-lg p-2 text-left">
    <Prefectures class="mt-4" />
  </div>
  <div class="mx-auto max-w-lg p-2 text-left">
    <NumOfMint class="mt-4" />
  </div>

  <div class="mx-auto max-w-lg p-2 text-left">
    <span class="ml-16 font-londrina font-yusei text-2xl">
      {{ $t("mint.total") }}: {{ total }} ETH (+ gas fee)
    </span>
  </div>

  <div class="mx-auto max-w-lg p-2 text-center">
  <span class="ml-16 font-londrina font-yusei">
    <span v-if="true">
      <button
        class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
      >
        {{ $t("mint.mint") }}
      </button>
    </span>
    </span>
    </div>

  <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
  <hr />
  <div class="mx-auto max-w-lg p-2 text-center">
    <p class="mb-2 font-londrina text-3xl">
      {{ `${totalSupply}` }} / {{ `${mintLimit}` }} minted
    </p>
  </div>

  <div v-if="tokens.length > 0" class="mt-4">
    <p class="mb-2 font-londrina text-s">Recently minted LocalNouns</p>
    <span v-for="token in tokens" :key="token.tokenId">
      <a :href="`${OpenSeaPath}/${token.tokenId}`" target="_blank">
        <img :src="token.image" class="mr-1 mb-1 inline-block w-32" />
      </a>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";
import { getProvider, getTokenContract, useFetchTokens } from "@/utils/const";
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
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const provider = getProvider(props.network, ALCHEMY_API_KEY);

    // RO means read only.
    const contractRO = getTokenContract(props.tokenAddress, provider);

    const { fetchTokens, totalSupply, nextImage, tokens, mintLimit } =
      useFetchTokens(props.network, props.assetProvider, provider, contractRO);
    console.log(
      "totalSupply, nextImage, tokens, mintLimit =",
      totalSupply.value,
      nextImage.value,
      tokens.value.length,
      mintLimit.value,
    );
    fetchTokens();

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

    const total = 0.05;   // 仮

    return {
      lang,
      totalSupply,
      mintLimit,
      tokens,
      total,
    };
  },
});
</script>
