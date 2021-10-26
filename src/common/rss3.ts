import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import RSS3 from 'rss3-next';
import { RSS3Account, RSS3Asset } from 'rss3-next/types/rss3';
import axios from 'axios';
import { GitcoinResponse, GeneralAsset, NFTResponse, POAPResponse } from './types';
import config from '@/config';
import Cookies from 'js-cookie';

let rss3: RSS3 | null;
let assets: Map<string, IAssetProfile> = new Map();
let walletConnectProvider: WalletConnectProvider;
let ethersProvider: ethers.providers.Web3Provider | null;

export type IRSS3 = RSS3;

export interface IAssetProfile {
    assets: GeneralAsset[];
    status?: boolean;
}

export interface Theme {
    name: string;
    class: string;
    nftIdPrefix: string;
}

const cookieOptions: Cookies.CookieAttributes = {
    domain: '.' + config.subDomain.rootDomain,
    secure: true,
    sameSite: 'Strict',
    expires: config.subDomain.cookieExpires,
};

const methodKey = 'RSS3BioConnectMethod';
const addressKey = 'RSS3BioConnectAddress';

async function walletConnect(skipSign?: boolean) {
    walletConnectProvider = new WalletConnectProvider({
        // We are not using WalletConnect for transactions now,
        // so here's just something crashing our API limits.
        // For infura, 403 requests are also seen as
        // consumed (57.13% of all requests).
        rpc: {
            1: 'https://cloudflare-eth.com',
        },
    });

    //  Enable session (triggers QR Code modal)
    let session;
    try {
        session = await walletConnectProvider.enable();
    } catch (e) {}
    if (!session) {
        return null;
    }

    ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);

    if (!ethersProvider) {
        return null;
    }

    // Subscribe to session disconnection
    walletConnectProvider.on('disconnect', (code: number, reason: string) => {
        console.log(code, reason);
        rss3 = null;
        ethersProvider = null;
    });

    const address = await ethersProvider.getSigner().getAddress();
    console.log('address', address);

    rss3 = new RSS3({
        endpoint: config.hubEndpoint,
        address: address,
        agentSign: true,
        sign: async (data: string) => {
            alert('Ready to sign... You may need to prepare your wallet.');
            return (
                (await ethersProvider?.send('personal_sign', [
                    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)),
                    address.toLowerCase(),
                ])) || ''
            );
        },
    });
    if (!skipSign) {
        rss3.files.set(await rss3.files.get(address));
        await rss3.files.sync();
    }

    return rss3;
}

async function visitor(): Promise<RSS3> {
    if (rss3) {
        return rss3;
    } else {
        return new RSS3({
            endpoint: config.hubEndpoint,
        });
    }
}

async function metamaskConnect(skipSign?: boolean) {
    const metamaskEthereum = (window as any).ethereum;
    ethersProvider = new ethers.providers.Web3Provider(metamaskEthereum);

    let address: string;
    if (Cookies.get(methodKey) === 'metamask' && Cookies.get(addressKey)) {
        address = Cookies.get(addressKey) || '';
    } else {
        const accounts = await metamaskEthereum.request({
            method: 'eth_requestAccounts',
        });
        address = ethers.utils.getAddress(accounts[0]);
    }

    rss3 = new RSS3({
        endpoint: config.hubEndpoint,
        address: address,
        agentSign: true,
        sign: async (data: string) => (await ethersProvider?.getSigner().signMessage(data)) || '',
    });
    if (!skipSign) {
        rss3.files.set(await rss3.files.get(address));
        await rss3.files.sync();
    }

    return rss3;
}

function isValidRSS3() {
    return !!rss3;
}

async function disconnect() {
    rss3 = null;
    ethersProvider = null;
    if (walletConnectProvider) {
        await walletConnectProvider.disconnect();
    }
    Cookies.remove(methodKey, cookieOptions);
    Cookies.remove(addressKey, cookieOptions);
}

export default {
    walletConnect: async () => {
        await walletConnect();
        if (isValidRSS3()) {
            Cookies.set(methodKey, 'walletConnect', cookieOptions);
            Cookies.set(addressKey, (<RSS3>rss3).account.address, cookieOptions);
        }
        return rss3;
    },
    metamaskConnect: async () => {
        await metamaskConnect();
        if (isValidRSS3()) {
            Cookies.set(methodKey, 'metamask', cookieOptions);
            Cookies.set(addressKey, (<RSS3>rss3).account.address, cookieOptions);
        }
        return rss3;
    },
    disconnect: disconnect,
    reconnect: async (): Promise<boolean> => {
        // Migrate
        const lastConnectMigrate = localStorage.getItem('lastConnect');
        const lastAddressMigrate = localStorage.getItem('lastAddress');
        if (lastConnectMigrate) {
            Cookies.set(methodKey, lastConnectMigrate, cookieOptions);
            localStorage.removeItem('lastConnect');
        }
        if (lastAddressMigrate) {
            Cookies.set(addressKey, lastAddressMigrate, cookieOptions);
            localStorage.removeItem('lastAddress');
        }

        const lastConnect = Cookies.get(methodKey);
        const address = Cookies.get(addressKey);
        if (address) {
            switch (lastConnect) {
                case 'walletConnect':
                    ethersProvider = null;
                    rss3 = new RSS3({
                        endpoint: config.hubEndpoint,
                        address: address,
                        agentSign: true,
                        sign: async (data: string) => {
                            if (!ethersProvider) {
                                walletConnectProvider = new WalletConnectProvider({
                                    rpc: {
                                        1: 'https://cloudflare-eth.com',
                                    },
                                });
                                let session;
                                try {
                                    session = await walletConnectProvider.enable();
                                } catch (e) {}
                                if (!session) {
                                    return '';
                                }
                                ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);
                                if (!ethersProvider) {
                                    return '';
                                }
                                walletConnectProvider.on('disconnect', (code: number, reason: string) => {
                                    console.log(code, reason);
                                    rss3 = null;
                                    ethersProvider = null;
                                });
                            }
                            alert('Ready to sign... You may need to prepare your wallet.');
                            return (
                                (await ethersProvider?.send('personal_sign', [
                                    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)),
                                    address.toLowerCase(),
                                ])) || ''
                            );
                        },
                    });
                    break;
                case 'metamask':
                    ethersProvider = null;
                    rss3 = new RSS3({
                        endpoint: config.hubEndpoint,
                        address: address,
                        agentSign: true,
                        sign: async (data: string) => {
                            if (!ethersProvider) {
                                const metamaskEthereum = (window as any).ethereum;
                                ethersProvider = new ethers.providers.Web3Provider(metamaskEthereum);
                                await metamaskEthereum.request({
                                    method: 'eth_requestAccounts',
                                });
                            }
                            return (await ethersProvider?.getSigner().signMessage(data)) || '';
                        },
                    });
                    break;
            }
        } else if (!isValidRSS3()) {
            switch (lastConnect) {
                case 'walletConnect':
                    await walletConnect(true);
                    break;
                case 'metamask':
                    await metamaskConnect(true);
                    break;
            }
            return isValidRSS3();
        }
        return true;
    },
    visitor: visitor,
    isValidRSS3: isValidRSS3,
    get: async () => {
        return rss3;
    },
    getAssetProfile: async (address: string, type: string, refresh: boolean = false) => {
        if (assets.has(address + type) && !refresh) {
            return <IAssetProfile>assets.get(address + type);
        } else {
            let data: IAssetProfile | null = null;
            try {
                const res = await axios.get(`${config.hubEndpoint}/assets/list`, {
                    params: {
                        personaID: address,
                        type: type,
                    },
                });
                if (res && res.data) {
                    data = <IAssetProfile>res.data;
                    assets.set(address + type, data);
                }
            } catch (error) {
                data = null;
            }
            return data;
        }
    },
    getNFTDetails: async (address: string, platform: string, identity: string, id: string, type: string) => {
        let data: NFTResponse | null = null;
        try {
            const res = await axios({
                method: 'get',
                url: `${config.hubEndpoint}/assets/details`,
                params: {
                    personaID: address,
                    platform: 'EVM+',
                    id,
                    identity,
                    type,
                },
            });
            if (res && res.data) {
                data = <NFTResponse>res.data;
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
                url: `${config.hubEndpoint}/assets/details`,
                params: {
                    personaID: address,
                    platform: 'EVM+',
                    id: id,
                    identity: identity,
                    type: 'Gitcoin-Donation',
                },
            });
            if (res && res.data) {
                data = <GitcoinResponse>res.data;
            }
        } catch (error) {
            data = null;
        }
        return data;
    },
    getFootprintDetail: async (address: string, platform: string, identity: string, id: string) => {
        let data: POAPResponse | null = null;
        try {
            const res = await axios({
                method: 'get',
                url: `${config.hubEndpoint}/assets/details`,
                params: {
                    personaID: address,
                    platform: 'EVM+',
                    id: id,
                    identity: identity,
                    type: 'xDai-POAP',
                },
            });
            if (res && res.data) {
                data = <POAPResponse>res.data;
            }
        } catch (error) {
            data = null;
        }
        return data;
    },
    addNewMetamaskAccount: async (): Promise<RSS3Account> => {
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
        ethersProvider = new ethers.providers.Web3Provider(metamaskEthereum);
        const accounts = await metamaskEthereum.request({
            method: 'eth_requestAccounts',
        });
        const address = ethers.utils.getAddress(accounts[0]);

        const newTmpAddress: RSS3Account = {
            platform: 'EVM+',
            identity: address,
        };

        const signature =
            (await ethersProvider?.getSigner().signMessage(rss3.accounts.getSigMessage(newTmpAddress))) || '';

        return {
            platform: 'EVM+',
            identity: address,
            signature: signature,
        };
    },
    getAvailableThemes(assets: RSS3Asset[]) {
        const availableThemes: Theme[] = [];
        for (const theme of config.theme) {
            for (const asset of assets) {
                if (
                    asset.type?.includes('NFT') &&
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
