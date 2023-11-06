import { ALCHEMY_API_KEY, NETWORK } from "../../src/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getLocalNounsProviderContract,
} from "../../src/utils/const";
import { addresses } from "../../src/utils/addresses";
import { ethers } from "ethers";
import { updateOwnerOfTokenToFirestore, updatePriceOfTokenOnFirestore, updateTradeOfTokenOnFirestore } from "./token";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);

const providerContract = getLocalNounsProviderContract(
  addresses.localProvider[NETWORK],
  provider,
);

// Transferイベントの監視
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
    await updateOwnerOfTokenToFirestore(tokenId, to);

    console.log(`Transfer, TokenID: ${tokenId}/${to}`);
  } catch (error) {
    console.error("Error:", error);
  }
});

// SetPriceイベントの監視
tokenContract.on("SetPrice", async (tokenId, price, event) => {
  try {
    const ethPrice = ethers.formatEther(price);
    // firestoreに書き込み
    await updatePriceOfTokenOnFirestore(tokenId, Number(ethPrice));

    console.log(`SetPrice, TokenID: ${tokenId}/${ethPrice}`);
  } catch (error) {
    console.error("Error:", error);
  }
});

// PutTradePrefectureイベントの監視
tokenContract.on("PutTradePrefecture", async (tokenId, prefectures, tradeAddress, event) => {
  try {
    console.log("prefectures", prefectures);
    // firestoreに書き込み
    await updateTradeOfTokenOnFirestore(tokenId, true, prefectures, tradeAddress);

    console.log(`PutTradePrefecture, TokenID: ${tokenId}/${prefectures}`);
  } catch (error) {
    console.error("Error:", error);
  }
});

// CancelTradePrefectureイベントの監視
tokenContract.on("CancelTradePrefecture", async (tokenId, event) => {
  try {
    // firestoreに書き込み
    await updateTradeOfTokenOnFirestore(tokenId, false, [], null);

    console.log(`CancelTradePrefecture, TokenID: ${tokenId}`);
  } catch (error) {
    console.error("Error:", error);
  }
});
