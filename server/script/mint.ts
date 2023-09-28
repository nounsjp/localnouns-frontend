import { ALCHEMY_API_KEY, NETWORK } from "../../src/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getLocalNounsProviderContract,
} from "../../src/utils/const";
import { addresses } from "../../src/utils/addresses";
import { writeTokenDataToFirestore } from "../../src/firestore/token";

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
    // HTML表示時のサイズ調整のためwidth,heiht属性も削除する
    const [svgPart] = await providerContract.generateSVGPart(tokenId);
    const svg = Buffer.from(svgPart, "base64")
      .toString("utf8")
      .replace(/ width="320" height="320"/, "");

    // firestoreに書き込み
    await writeTokenDataToFirestore(tokenId, to, traits, svg);

    console.log(`Write finish, TokenID: ${tokenId}`);
  } catch (error) {
    console.error("Error:", error);
  }
});
