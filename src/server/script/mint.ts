import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getLocalNounsProviderContract,
} from "@/utils/const";
import { addresses } from "../../utils/addresses";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);

const providerContract = getLocalNounsProviderContract(
  addresses.localProvider[NETWORK],
  provider,
);

// mintイベントの監視 TODO コントラクトにMint イベントを作る
tokenContract.on("Transfer", async (from, to, tokenId, event) => {
  try {
    console.log("mint", tokenId, to);

    console.log("traits", await providerContract.generateTraits(tokenId));

    const [svgPart] = await providerContract.generateSVGPart(tokenId);
    const svg = Buffer.from(svgPart, "base64").toString("utf8");

    console.log("svg", svg.length);
    console.log("decodeData", svg);
  } catch (error) {
    console.error("Error:", error);
  }
});
