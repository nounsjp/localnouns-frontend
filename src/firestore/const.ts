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
  createdDate: Date;
  canTrade?: boolean; // firestoreでなく画面で使用
}
