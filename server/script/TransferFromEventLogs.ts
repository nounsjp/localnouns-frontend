import { ethers } from "ethers";
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getLocalNounsProviderContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { writeTokenDataToFirestore } from "./token";
import { TOKEN } from "@/firestore/const";

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

  for (const event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { to, tokenId } = event.args;

      // if(tokenId <= 1019){
      //   continue;
      // }

      // traits情報を取得
      const jsonString = await providerContract.generateTraits(tokenId);
      const traits = JSON.parse("[" + jsonString + "]");

      // SVGイメージを取得(base64でエンコードされているのでデコードする)
      // HTML表示時のサイズ調整のためwidth,heiht属性も削除する
      const [svgPart] = await providerContract.generateSVGPart(tokenId);
      const svg = Buffer.from(svgPart, "base64")
        .toString("utf8")
        .replace(/ width="320" height="320"/, "");

      const { prefecture, head, accessory } = convertTrais(traits);
      const salePrice = await tokenContract.getPriceOf(tokenId);
      const ethPrice = ethers.formatEther(salePrice);
      const holder = await tokenContract.ownerOf(tokenId);
      const isOnTrade = await tokenContract.trades(tokenId);
      const tradeToPrefecture = await tokenContract.getTradePrefectureFor(tokenId);

      const tokenInfo: TOKEN = {
        tokenId: tokenId,
        prefecture: prefecture,
        head: head,
        accessory: accessory,
        holder: holder.toLowerCase(), // firestoreでfilterするために小文字変換
        svg: svg,
        salePrice: Number(ethPrice),
        isOnTrade: isOnTrade,
        tradeToPrefecture: tradeToPrefecture.length > 0 ? tradeToPrefecture : [0],
        createdDate: new Date(),
      };

      // firestoreに書き込み
      await writeTokenDataToFirestore(tokenInfo);

      console.log(`Write finish, TokenID: ${tokenId}`);
    }
  }
};

/**
 * Opensea用に生成したTraits情報からPrefecture,head,accessoryを取得
 * @param traits 例： {"trait_type": "prefecture" , "value":"Hokkaido"},{"trait_type": "head" , "value":"goryokaku"},{"trait_type": "accessory" , "value":"melon"}
 * @returns prefecture:string, head:string, accessory:string
 */
const convertTrais = (traits: any) => {
  let prefecture = "";
  let head = "";
  let accessory = "";
  for (let trait of traits) {
    switch (trait.trait_type) {
      case "prefecture":
        prefecture = trait.value;
        break;
      case "head":
        head = trait.value;
        break;
      case "accessory":
        accessory = trait.value;
        break;
    }
  }
  return { prefecture, head, accessory };
};

main();
