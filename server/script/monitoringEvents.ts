/*
  npx ts-node -r tsconfig-paths/register server/script/monitoringEvents.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { ethers } from "ethers";
import { writeTokenDataToFirestore, updateHolderOfTokenOnFirestore, updatePriceOfTokenOnFirestore, updateTradeOfTokenOnFirestore } from "./tokenOnFirestore";
import { getTokenInfoAtMint } from "./tokenOnContract";
import { TOKEN } from "@/firestore/const";
import { EventQueue } from "@/utils/EventQueue";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);

const eventQueue = new EventQueue();
// Transferイベントの監視
tokenContract.on("Transfer", async (from, to, tokenId, event) => {
  // 同時実行スレッドの数を制限するためキューイングして実行する
  eventQueue.add({ from, to, tokenId, event }, async (event) => {
    try {
      if (from == "0x0000000000000000000000000000000000000000") {
        // mint時のTransfer
        const tokenInfo: TOKEN = await getTokenInfoAtMint(tokenId);
        tokenInfo.holder = from.toLowerCase();
        // firestoreに書き込み
        await writeTokenDataToFirestore(tokenInfo);
        console.log(`Write finish, mint: ${tokenId}`);

      } else {
        // P2PSale, P2PTradeの成立
      }

    } catch (error) {
      console.error("Error:", tokenId);
    }
  });

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
