import { createStore } from "vuex";
import { User } from "firebase/auth";
import { startMonitoringMetamask } from "@/utils/MetaMask";
import { auth } from "@/utils/firebase";
import { ethers } from "ethers";

interface State {
  ethereum: any | null;
  chainId: string | null;
  account: undefined | null | string;
  user: User | null | undefined;
  total_eth: number;
  raised_eth: number;
}

export default createStore<State>({
  state: {
    ethereum: null,
    chainId: null,
    account: undefined,
    user: undefined,
    raised_eth: 11.0,
    total_eth: 5.0 + 11.0,
  },
  mutations: {
    setEthereum(state: State, ethereum: any | null) {
      state.ethereum = ethereum;
      if (state.ethereum) {
        startMonitoringMetamask();
      }
    },
    setChainId(state: State, chainId: string | null) {
      state.chainId = chainId;
    },
    setUser(state: State, user: User | null) {
      state.user = user;
    },
    setAccount(state: State, account) {
      state.account = account;
      if (state.user) {
        auth.signOut();
      }
    },
  },
  getters: {
    hasMetaMask: (state: State) => {
      return state.ethereum && state.ethereum.isMetaMask;
    },
    isSignedIn: (state: State) => {
      return state.user !== null && state.user !== undefined;
    },
    displayAccount: (state: State) => {
      const account = state.account;
      if (!account) {
        return "";
      }
      return account.substring(0, 6) + "..." + account.substring(38);
    },
    getSigner: (state: State) => async (chainId: string) => {
      if (state.account && state.chainId == chainId) {
        const provider = new ethers.BrowserProvider(state.ethereum);
        const signer = await provider.getSigner();
        return signer;
      }
      return null;
    },
  },
  actions: {},
  modules: {},
});
