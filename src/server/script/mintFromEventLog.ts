import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getLocalNounsProviderContract,
} from "@/utils/const";
import { addresses } from "../../utils/addresses";
import { EventLog } from "ethers";

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
  const filter = tokenContract.filters.Transfer(
    "0x0000000000000000000000000000000000000000",
    null,
    null,
  ); // from address(0) への Transfer イベントをフィルタリング
  const events = await tokenContract.queryFilter(filter);

  for (let event of events) {
    if ("args" in event) {
      // EventLog 型の場合のみ実行
      const { from, to, tokenId } = event.args;
      console.log(`To: ${to}, TokenID: ${tokenId}`);
    }
  }
};

main();
