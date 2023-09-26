import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getLocalNounsProviderContract,
} from "@/utils/const";
import { addresses } from "../../utils/addresses";
import { writeToken } from "@/firestore/token";

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
    // traits情報を取得
    const jsonString = await providerContract.generateTraits(tokenId);
    const traits = JSON.parse("[" + jsonString + "]");

    // SVGイメージを取得(base64でエンコードされているのでデコードする)
    const [svgPart] = await providerContract.generateSVGPart(tokenId);
    const svg = Buffer.from(svgPart, "base64").toString("utf8");

    // firestoreに書き込み
    await writeToken(tokenId, to, traits, svg);

    console.log(`Write finish, TokenID: ${tokenId}`);
  } catch (error) {
    console.error("Error:", error);
  }
});
