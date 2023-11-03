import languages from "@/i18n/languages";
import { prefecture_ja as prefecture } from "@/i18n/prefectures";

const lang = {
  nav: {
    top: "トップ",
    mint: "ミント",
    list: "リスト",
    p2pSale: "P2Pセール",
    p2pTrade: "P2Pトレード",
    goods: "グッズ",
  },
  menu: {
    connect: "接続",
    connected: "サインイン",
    signedIn: "サインアウト",
    nometamask: "メタマスク不在",
    switch: "切り替える",
    form: "提出フォーム",
  },
  mint: {
    publicSale: "パブリックセール中",
    alSale: "ALセール中",
    total: "合計",
    mint: "ミント",
    connectWallet: "右上の「接続」ボタンからウォレット接続してください",
    recentlyMinted: "産まれたてのLocalNounsたちです.⌐◨-◨",
  },
  list: {
    description: "ここではご当地Nounsを購入することができます",
    purchace: "購入",
    trade: "交換",
    onTrade: "交換可",
    onSale: "販売中",
    manage: "所有",
  },
  prefectures: {
    prefectures: "都道府県",
  },
  listSortOrder: {
    sortOrder: "ソート順",
    lower: "価格が低い順",
    higher: "価格が高い順",
    older: "古い順",
    newer: "新しい順",
  },
  numOfMint: {
    numOfMint: "ミント数",
  },
  tokenManagement: {
    sale: "販売設定",
    saleDescription:
      "P2Pセールの販売価格を設定してください。ロイヤリティ5%を含みます。",
    setSalePrice: "0ETHより大きい価格をセットすると販売対象になります",
    setPriceButton: "価格設定",
    stopSaleButton: "販売停止",
    trade: "トレード設定",
    tradeDescription: "トレード希望の都道府県を指定してください。",
    setTrade:
      "トレード希望の都道府県を指定してください。交換リストに出す手数料は0.002ETH(ガス代含まず)です。",
    setTradeButton: "トレードに出す",
    stopTradeButton: "トレードから下げる",
    close: "閉じる",
    finishSetSalePrice: "販売価格設定が完了しました!",
    finishRemoveSalePrice: "販売設定を取り消しました!",
    validSelectPrefectures:
      "「指定しない」またはいずれかの都道府県を選択してください",
    finishSetTrade: "トレード設定が完了しました!",
    finishStopTrade: "トレード設定を取り消しました!",
  },
  TokenSaleOrTrade: {
    sale: "販売",
    saleDescription: "所有者が販売価格を設定したNounのみ購入可能です。",
    buy: "購入",
    trade: "交換",
    tradeDescription:
      "あなたの所有するNounと交換します。都道府県が指定されている場合はその都道府県のNounのみ交換可能です。",
    tradeForPrefecture: "交換希望",
    tradeForNoun: "交換するNoun",
    finishBuyNoun: "Nounの購入に成功しました!",
    selectNounForTrade: "交換するNounを選んでください",
    finishTradeNoun: "Nounの交換に成功しました!",
  },
  validator: {
    validNumber: "0より大きい数値を入力してください",
  },
  commingSoon: {
    commingSoon: "近日公開",
  },
  message: {
    description:
      "ナウンズ・アート・フェスティバル (ナウンズフェス) は、平和で維持可能な地球の大切さを 一人でも多くの人に知ってもらうことを目的に、NounsDAOのメンバーによって作られた、オンライン・アート・フェスティバルです。",
    prized2022:
      "６ヶ月間に渡るオンライン・コンペティションの結果2022年の優秀作品が決定しました。",
    thanks2022:
      "たくさんのご応募ありがとうございます。 2023年も開催予定ですのでお楽しみに！",
    grand: "最優秀賞",
    excellent: "優秀賞",
    processing: "処理中...",
    walletId: "ウォレットID:",
    pleaseInstall:
      "サポーターNFTをお持ちの方は、Metamask をインストールして下さい。",
    pleaseConnect: "サポーターNFTをお持ちの方は、Metamask を接続して下さい。",
    pleaseSwitchToPolygon: "Polygon ネットワークに切り替えて下さい。",
    youHaveNFTs:
      "{namedNounCount}個の Named Noun NFT をお持ちであることが確認出来ました。サポート、ありがとうございます。",
    youHaveNouns:
      "{nounsCount}個の Nouns Love NFT をお持ちであることが確認出来ました。サポート、ありがとうございます。",
    please_connect:
      "Tokenをお持ちの方は右上のConnectボタンでWalletを接続してください。",
    hello: "こんにちは、世界",
  },
  vote: {
    title: "NounsArtFestival2022決戦投票ページ",
    description:
      "ナウンズ・アート・フェスティバル (ナウンズフェス) は、平和で維持可能な地球の大切さを 一人でも多くの人に知ってもらうことを目的に、NounsDAOのメンバーによって作られた、オンライン・アート・フェスティバルです。",
    voted_thanks:
      "投票ありがとうございます。結果発表までしばらくお待ち下さい。",
    how_to_vote:
      "ノミネーション作品に対する投票をおこない、優秀作品を選びます。一人、一票好きな作品に投稿できます。投票には下記どちらかのNFTを保持していることが必要です。",
    vote_notice:
      "一人、一票好きな作品に投稿ください。一度投票すると変更できないのでご注意ください。",
    before_vote: "投票期間開始までしばらくお待ち下さい。",
    after_vote: "投票期間は終了いたしました。",
    voted_total: "投票総数",
    voted_selection: "得票数",
    button_vote: "投票",
    button_voting: "投票中",
    button_voted: "投票完了",
    button_need_token: "投票にはTokenが必要です",
    button_need_signin: "投票にはコネクトと、サインインが必要です",
    button_selection: "投票候補",
    button_selected: "選択済み",
  },
  derivatives: {
    title: "関連作品",
  },
  languages,
  prefecture,
};

export default lang;
