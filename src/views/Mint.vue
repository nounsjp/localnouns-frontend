<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-3xl">{{ $t("mint.publicSale") }}</p>
    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
  </div>

  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina text-xl">
      Next Token Id: {{ `${totalSupply}` }}
    </p>
    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
  </div>

  <div v-if="tokens.length > 0" class="mt-4">
    <p>Recently minted NFTs</p>
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
  setup(props, context) {
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const alchemyKey = process.env.VUE_APP_ALCHEMY_API_KEY;
    const provider = getProvider(props.network, alchemyKey);

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

    return {
      lang,
      totalSupply,
      tokens,
    };
  },
});
</script>
