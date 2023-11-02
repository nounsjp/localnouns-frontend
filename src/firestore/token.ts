import * as admin from "firebase-admin";
import { NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { SERVICE_ACCOUNT_KEY_PATH } from "@/config/project";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT_KEY_PATH),
  });
}
const firestore = admin.firestore();
const tokenAddress = addresses.localNounsToken[NETWORK];

export interface TOKEN {
  tokenId: string;
  prefecture: string;
  head: string;
  accessory: string;
  holder: string;
  svg: string;
  salePrice: number;
  isOnTrade: boolean;
  tradeToPrefecture: number[];
  createdDate: admin.firestore.Timestamp;
  canTrade?: boolean; // firestoreでなく画面で使用
}

export const writeTokenDataToFirestore = async (
  tokenId: string,
  to: string,
  traits: any,
  svg: string,
) => {
  // 他のドキュメントにも書くかもしれないのでトランザクションで格納しておく
  await admin.firestore().runTransaction(async (tr) => {
    const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenId}`;

    const { prefecture, head, accessory } = convertTrais(traits);

    const tokenInfo: TOKEN = {
      tokenId: tokenId,
      prefecture: prefecture,
      head: head,
      accessory: accessory,
      holder: to.toLowerCase(), // firestoreでfilterするために小文字変換
      svg: svg,
      salePrice: 0,
      isOnTrade: false,
      tradeToPrefecture: [0], // firestore上は '0':指定しないをセット
      createdDate: admin.firestore.Timestamp.now(),
    };

    await tr.set(firestore.doc(tokenDocumentPath), tokenInfo);
  });

  return {
    result: true,
  };
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

export const updatePriceOfTokenOnFirestore = async (
  tokenId: string,
  newSalePrice: number,
) => {
  // ドキュメントのパスを指定
  const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenId}`;

  const tokenDoc = await firestore.doc(tokenDocumentPath).get();

  // tokenId に関連するドキュメントが存在しない場合、エラーを返す
  if (!tokenDoc.exists) {
    return {
      result: false,
      message: `No token found with tokenId ${tokenId}`,
    };
  }

  // firestore にドキュメントを更新
  await tokenDoc.ref.update({
    salePrice: newSalePrice,
  });

  return {
    result: true,
    message: `Updated salePrice of token with tokenId ${tokenId} to ${newSalePrice}`,
  };
};

export const updateTradeOfTokenOnFirestore = async (
  tokenId: string,
  isOnTrade: boolean,
  tradeToPrefecture: number[],
) => {
  // ドキュメントのパスを指定
  const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenId}`;

  const tokenDoc = await firestore.doc(tokenDocumentPath).get();

  // tokenId に関連するドキュメントが存在しない場合、エラーを返す
  if (!tokenDoc.exists) {
    return {
      result: false,
      message: `No token found with tokenId ${tokenId}`,
    };
  }

  // 都道府県指定がない場合は [0] (指定しない)をセット
  const updatedTradeToPrefecture = [...tradeToPrefecture]; // 新しい配列を作成
  if (updatedTradeToPrefecture.length == 0) {
    updatedTradeToPrefecture.push(0); // 新しい配列に変更を加える
  }

  // firestore にドキュメントを更新
  await tokenDoc.ref.update({
    isOnTrade: isOnTrade,
    tradeToPrefecture: updatedTradeToPrefecture,
  });

  return {
    result: true,
    message: `Updated salePrice of token with tokenId ${tokenId} isOnTrade:${isOnTrade}`,
  };
};
