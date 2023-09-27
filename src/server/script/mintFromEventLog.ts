import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getLocalNounsProviderContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
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

const main = async () => {
  // from address(0) への Transfer イベントをフィルタリング
  const filter = tokenContract.filters.Transfer(
    "0x0000000000000000000000000000000000000000",
    null,
    null,
  );
  const events = await tokenContract.queryFilter(filter);

  for (let event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { to, tokenId } = event.args;

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
      await writeToken(tokenId, to, traits, svg);

      console.log(`Write finish, TokenID: ${tokenId}`);
    }
  }
};

main();
