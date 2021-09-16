import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import RSS3 from 'rss3-next';
import { RSS3Asset, RSS3Index } from 'rss3-next/types/rss3';
import { RSS3Account, RSS3AccountInput } from 'rss3-next/types/rss3';
import axios from 'axios';
import { GitcoinResponse, GeneralAsset, NFTResponse } from './types';
import config from '@/config';

let rss3: RSS3 | null;
let web3: Web3 | null;
let assets: Map<string, IAssetProfile> = new Map();
let provider: WalletConnectProvider;

export type IRSS3 = RSS3;

export interface IAssetProfile {
    assets: GeneralAsset[];
}

export interface Theme {
    name: string;
    class: string;
    nftIdPrefix: string;
}

async function walletConnect() {
    provider = new WalletConnectProvider({
        infuraId: config.infuraId,
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

    rss3 = new RSS3({
        endpoint: config.rss3Endpoint,
        address: address,
        agentSign: true,
        sign: async (data: string) => {
            alert('Ready to sign... You may need to prepare your wallet.');
            return await (<Web3>web3).eth.personal.sign(data, address, '');
        },
    });
    rss3.files.set(await rss3.files.get(address));
    await rss3.files.sync();

    return rss3;
}

async function visitor() {
    if (rss3) {
        return rss3;
    } else {
        return new RSS3({
            endpoint: config.rss3Endpoint,
        });
    }
}

async function metamaskConnect() {
    const metamaskEthereum = (window as any).ethereum;
    web3 = new Web3(metamaskEthereum);

    let address: string;
    if (localStorage.getItem('lastConnect') === 'metamask' && localStorage.getItem('lastAddress')) {
        address = <string>localStorage.getItem('lastAddress');
    } else {
        const accounts = await metamaskEthereum.request({
            method: 'eth_requestAccounts',
        });
        address = web3.utils.toChecksumAddress(accounts[0]);
    }

    rss3 = new RSS3({
        endpoint: config.rss3Endpoint,
        address: address,
        agentSign: true,
        sign: async (data: string) => await (<Web3>web3).eth.personal.sign(data, address, ''),
    });
    rss3.files.set(await rss3.files.get(address));
    await rss3.files.sync();

    return rss3;
}

function isValidRSS3() {
    return !!rss3;
}

async function disconnect() {
    rss3 = null;
    web3 = null;
    if (provider) {
        await provider.disconnect();
    }
    localStorage.removeItem('lastConnect');
    localStorage.removeItem('lastAddress');
}

export default {
    walletConnect: async () => {
        localStorage.setItem('lastConnect', 'walletConnect');
        return await walletConnect();
    },
    metamaskConnect: async () => {
        localStorage.setItem('lastConnect', 'metamask');
        return await metamaskConnect();
    },
    disconnect: async () => {
        disconnect();
    },
    reconnect: async (): Promise<boolean> => {
        if (!isValidRSS3()) {
            const lastConnect = localStorage.getItem('lastConnect');
            switch (lastConnect) {
                case 'walletConnect':
                    await walletConnect();
                    return true;
                case 'metamask':
                    await metamaskConnect();
                    return true;
                default:
                    return false;
            }
        }
        return true;
    },
    visitor: visitor,
    isValidRSS3: isValidRSS3,
    get: async () => {
        return rss3;
    },
    getAssetProfile: async (address: string, refresh: boolean = false) => {
        if (assets.has(address) && !refresh) {
            return <IAssetProfile>assets.get(address);
        } else {
            let data: IAssetProfile | null = null;
            try {
                const res = await axios.get(`${config.rss3Endpoint}/asset-profile/${address}`);
                if (res && res.data) {
                    data = res.data;
                    assets.set(address, <IAssetProfile>data);
                }
            } catch (error) {
                data = null;
            }
            return data;
        }
    },
    getNFTDetails: async (address: string, platform: string, identity: string, id: string) => {
        let data: NFTResponse | null = null;
        try {
            const res = await axios({
                method: 'get',
                url: `${config.rss3Endpoint}/asset-profile/${address}/nft/`,
                params: {
                    platform: platform,
                    id: id,
                    identity: identity,
                },
            });
            if (res && res.data) {
                data = res.data;
            }
        } catch (error) {
            data = null;
        }
        return data;
    },
    getGitcoinDonation: async (address: string, platform: string, identity: string, id: string) => {
        let data: GitcoinResponse | null = null;
        try {
            const res = await axios({
                method: 'get',
                url: `${config.rss3Endpoint}/asset-profile/${address}/gitcoin-donation/`,
                params: {
                    platform: platform,
                    id: id,
                    identity: identity,
                },
            });
            if (res && res.data) {
                data = res.data;
            }
        } catch (error) {
            data = null;
        }
        return data;
    },
    addNewAccount: async (platform: string): Promise<RSS3Account> => {
        // js don't support multiple return values,
        // so here I'm using signature as a message provider
        if (!rss3) {
            return {
                platform: '',
                identity: '',
                signature: 'Not logged in',
            };
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

        return {
            platform: platform,
            identity: address,
            signature: signature,
        };
    },
    getAvailableThemes(assets: RSS3Asset[]) {
        const availableThemes: Theme[] = [];
        for (const theme of config.theme) {
            for (const asset of assets) {
                if (
                    asset.type === 'NFT' &&
                    !asset.tags?.includes('pass:hidden') &&
                    asset.id.startsWith(theme.nftIdPrefix)
                ) {
                    availableThemes.push(theme);
                    break;
                }
            }
        }
        return availableThemes;
    },
};
