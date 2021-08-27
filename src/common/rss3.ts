import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import RSS3 from 'rss3-next';
import { RSS3Account, RSS3AccountInput } from 'rss3-next/types/rss3';
import axios from 'axios';

const infuraId = '76af1228cdf345d2bff6a9c0f35112e1';
const endpoint = 'https://rss3-asset-hub-g886a.ondigitalocean.app';

let rss3: RSS3 | null;
let web3: Web3 | null;
let assets = new Map();
let provider: WalletConnectProvider;

export type IRSS3 = RSS3;

async function walletConnect() {
    provider = new WalletConnectProvider({
        infuraId: infuraId,
    });

    //  Enable session (triggers QR Code modal)
    await provider.enable();

    //  Create Web3 instance
    web3 = new Web3(provider as any);

    if (!web3) {
        return null;
    }

    // Subscribe to session disconnection
    provider.on('disconnect', (code: number, reason: string) => {
        console.log(code, reason);
        rss3 = null;
        web3 = null;
    });

    const address = (await web3.eth.getAccounts())[0];

    console.log(address);

    rss3 = new RSS3({
        endpoint: endpoint,
        address: address,
        sign: async (data: string) => {
            alert('Ready to sign... You may need to prepare your wallet.');
            return await (<Web3>web3).eth.personal.sign(data, address, '');
        },
    });

    return rss3;
}

async function visitor() {
    if (rss3) {
        return rss3;
    } else {
        return new RSS3({
            endpoint: endpoint,
        });
    }
}

async function metamaskConnect() {
    const metamaskEthereum = (window as any).ethereum;
    web3 = new Web3(metamaskEthereum);

    const accounts = await metamaskEthereum.request({
        method: 'eth_requestAccounts',
    });
    const address = web3.utils.toChecksumAddress(accounts[0]);

    console.log(address);

    rss3 = new RSS3({
        endpoint: endpoint,
        address: address,
        sign: async (data: string) => await (<Web3>web3).eth.personal.sign(data, address, ''),
    });

    return rss3;
}

export default {
    walletConnect: walletConnect,
    metamaskConnect: metamaskConnect,
    walletDisconnect: async () => {
        rss3 = null;
        web3 = null;
        if (provider) {
            await provider.disconnect();
        }
    },
    visitor: visitor,
    isValidRSS3: () => {
        return !!rss3;
    },
    get: async () => {
        return rss3;
    },
    getAssetProfile: async (address: string, refresh: boolean = false) => {
        if (!address) {
            return null;
        }
        if (assets.has(address) && !refresh) {
            return assets.get(address);
        } else {
            const res = await axios.get(`${endpoint}/asset-profile/${address}`);
            assets.set(address, res.data);
            return res.data;
        }
    },
    addNewAccount: async (platform: string): Promise<RSS3Account | null> => {
        if (!rss3) {
            return null;
        }
        const metamaskEthereum = (window as any).ethereum;
        const metaMaskWeb3 = new Web3(metamaskEthereum);
        const accounts = await metamaskEthereum.request({
            method: 'eth_requestAccounts',
        });
        const address = metaMaskWeb3.utils.toChecksumAddress(accounts[0]);

        const newTmpAddress: RSS3AccountInput = {
            platform: platform,
            identity: address,
        };
        const signature = await metaMaskWeb3.eth.personal.sign(rss3.accounts.getSigMessage(newTmpAddress), address, '');

        const newAddress: RSS3Account = {
            platform: platform,
            identity: address,
            signature: signature,
        };
        return await rss3.accounts.post(newAddress);
        // await rss3.files.sync();
    },
};
