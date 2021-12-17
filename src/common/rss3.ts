/* eslint-disable import/no-anonymous-default-export */
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import RSS3, { utils as RSS3Utils } from 'rss3';
import axios from 'axios';
import { GitcoinResponse, GeneralAsset, NFTResponse, POAPResponse } from './types';
import config from './config';
import rns from './rns';
import Events from './events';
import Items from 'rss3/dist/items/index';
import Assets from 'rss3/dist/assets/index';

import legacyConfig from '@/config';
import Cookies from 'js-cookie';
import utils from '@/common/utils';
import setupTheme from '@/common/theme';

export interface IAssetProfile {
    assets: GeneralAsset[];
    status?: boolean;
}

export const EMPTY_RSS3_DP: RSS3DetailPersona = {
    files: null,
    persona: null,
    address: '',
    name: '',
    profile: null,
    followers: [],
    followings: [],
    items: null,
    assets: null,
    isReady: false,
};
export type IRSS3 = RSS3;
let RSS3PageOwner: RSS3DetailPersona = Object.create(EMPTY_RSS3_DP);
let RSS3LoginUser: RSS3DetailPersona = Object.create(EMPTY_RSS3_DP);
let assetsProfileCache: Map<string, IAssetProfile> = new Map();
let walletConnectProvider: WalletConnectProvider;
let ethersProvider: ethers.providers.Web3Provider | null;

export interface IAssetProfile {
    assets: GeneralAsset[];
    status?: boolean;
}

export interface RSS3DetailPersona {
    files: any;
    persona: RSS3 | null;
    address: string;
    name: string;
    profile: RSS3Profile | null;
    followers: string[];
    followings: string[];
    items: Items | null;
    assets: Assets | null;
    isReady: boolean;
}

function setStorage(key: string, value: string) {
    if (value) {
        Cookies.set(key, value, cookieOptions);
    } else {
        Cookies.remove(key, cookieOptions);
    }
}
function getStorage(key: string): string {
    return Cookies.get(key) || '';
}

const KeyNames = {
    ConnectMethod: 'CONNECT_METHOD',
    ConnectAddress: 'CONNECT_ADDRESS',
    MetaMask: 'MetaMask',
    WalletConnect: 'WalletConnect',
};

export interface Theme {
    name: string;
    class: string;
    nftIdPrefix: string;
}

const cookieOptions: Cookies.CookieAttributes = {
    domain: '.' + legacyConfig.subDomain.rootDomain,
    secure: true,
    sameSite: 'Strict',
    expires: legacyConfig.subDomain.cookieExpires,
};

async function wcConn(skipSignSync: boolean = false) {
    // WalletConnect Connect
    walletConnectProvider = new WalletConnectProvider(config.walletConnectOptions);

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
        disconnect();
    });

    let address = getStorage(KeyNames.ConnectAddress);
    if (!address) {
        address = await ethersProvider.getSigner().getAddress();
    }

    RSS3LoginUser.persona = new RSS3({
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
    await initUser(RSS3LoginUser, skipSignSync);

    return RSS3LoginUser;
}

async function mmConn(skipSignSync: boolean = false) {
    // MetaMask Connect
    if (!(window as any).ethereum) {
        return null;
    }

    const metamaskEthereum = (window as any).ethereum;
    ethersProvider = new ethers.providers.Web3Provider(metamaskEthereum);

    let address = getStorage(KeyNames.ConnectAddress);
    if (!address) {
        const accounts = await metamaskEthereum.request({
            method: 'eth_requestAccounts',
        });
        address = ethers.utils.getAddress(accounts[0]);
    }

    RSS3LoginUser.persona = new RSS3({
        endpoint: config.hubEndpoint,
        address: address,
        agentSign: true,
        sign: async (data: string) => (await ethersProvider?.getSigner().signMessage(data)) || '',
    });
    await initUser(RSS3LoginUser, skipSignSync);

    return RSS3LoginUser;
}

function saveConnect(method: string) {
    if (isValidRSS3()) {
        setStorage(KeyNames.ConnectMethod, method);
        setStorage(KeyNames.ConnectAddress, RSS3LoginUser.address);
    }
}

async function reconnect() {
    if (isValidRSS3()) {
        return true;
    }
    const lastConnect = getStorage(KeyNames.ConnectMethod);
    const address = getStorage(KeyNames.ConnectAddress);
    if (address) {
        switch (lastConnect) {
            case KeyNames.WalletConnect:
                ethersProvider = null;
                RSS3LoginUser.persona = new RSS3({
                    endpoint: config.hubEndpoint,
                    address: address,
                    agentSign: true,
                    sign: async (data: string) => {
                        if (!ethersProvider) {
                            walletConnectProvider = new WalletConnectProvider(config.walletConnectOptions);
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
                                disconnect();
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
            case KeyNames.MetaMask:
                ethersProvider = null;
                RSS3LoginUser.persona = new RSS3({
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
        await initUser(RSS3LoginUser, true);
    } else if (!isValidRSS3()) {
        switch (lastConnect) {
            case KeyNames.WalletConnect:
                await wcConn(true);
                break;
            case KeyNames.MetaMask:
                await mmConn(true);
                break;
            default:
                setStorage(KeyNames.ConnectMethod, ''); // logout
                break;
        }
        return isValidRSS3();
    }
    return true;
}

async function initUser(user: RSS3DetailPersona, skipSignSync: boolean = false) {
    user.isReady = false;
    if (user.persona) {
        if (!user.address) {
            user.address = user.persona.account.address;
        }
        user.persona.files.set(await user.persona.files.get(user.address));
        if (!skipSignSync) {
            await user.persona.files.sync();
        }
    }
    if (user.name && !user.address) {
        user.address = await rns.name2Addr(user.name);
    }
    if (user.address && !user.name) {
        user.name = await rns.addr2Name(user.address);
    }
    const RSS3APIPersona = apiPersona();
    user.profile = await RSS3APIPersona.profile.get(user.address);
    user.followers = await RSS3APIPersona.backlinks.getList(user.address, 'following');
    user.followings = await RSS3APIPersona.links.getList(user.address, 'following');
    user.items = await RSS3APIPersona.items;
    user.assets = await RSS3APIPersona.assets;
    user.files = await RSS3APIPersona.files;
    user.isReady = true;
    console.log(RSS3APIPersona);
}

function apiPersona(): RSS3 {
    return (
        RSS3LoginUser.persona ||
        new RSS3({
            endpoint: config.hubEndpoint,
        })
    );
}

function isValidRSS3() {
    return !!RSS3LoginUser.persona;
}

async function disconnect() {
    RSS3LoginUser = Object.create(EMPTY_RSS3_DP);
    ethersProvider = null;
    if (walletConnectProvider) {
        await walletConnectProvider.disconnect();
    }
    setStorage(KeyNames.ConnectMethod, '');
    setStorage(KeyNames.ConnectAddress, '');
}

function dispatchEvent(event: string, detail: any) {
    const evt = new CustomEvent(event, {
        detail,
        bubbles: true,
        composed: true,
    });
    console.log(event, detail);
    document.dispatchEvent(evt);
}

async function setPageTitleFavicon() {
    const profile = RSS3PageOwner.profile;
    const favicon = <HTMLLinkElement>document.getElementById('favicon');
    if (profile?.avatar?.[0]) {
        favicon.href = utils.fixURLSchemas(profile.avatar[0]);
    } else {
        favicon.href = '/favicon.ico';
    }
    document.title = profile?.name || 'Web3 Pass';
}

async function ensureLoginUser() {
    return new Promise((resolve, reject) => {
        if (!isValidRSS3()) {
            reject(new Error('Not logged in'));
        } else {
            if (RSS3LoginUser.isReady) {
                resolve(RSS3LoginUser);
            } else {
                document.addEventListener(Events.connect, () => {
                    resolve(RSS3LoginUser);
                });
            }
        }
    });
}

export default {
    connect: {
        walletConnect: async () => {
            if (await wcConn()) {
                saveConnect(KeyNames.WalletConnect);
                dispatchEvent(Events.connect, RSS3LoginUser);
                return RSS3LoginUser;
            } else {
                return null;
            }
        },
        metamask: async () => {
            if (await mmConn()) {
                saveConnect(KeyNames.MetaMask);
                dispatchEvent(Events.connect, RSS3LoginUser);
                return RSS3LoginUser;
            } else {
                return null;
            }
        },
    },
    disconnect: async () => {
        await disconnect();
        dispatchEvent(Events.disconnect, RSS3LoginUser);
    },
    reconnect: async () => {
        const res = await reconnect();
        dispatchEvent(Events.connect, RSS3LoginUser);
        return res;
    },
    getAPIUser: (): RSS3DetailPersona => {
        const user = Object.create(EMPTY_RSS3_DP);
        user.persona = apiPersona();
        return user;
    },
    getLoginUser: () => {
        return RSS3LoginUser;
    },
    ensureLoginUser,
    reloadLoginUser: async () => {
        await initUser(RSS3LoginUser);
        dispatchEvent(Events.connect, RSS3LoginUser);
        return RSS3LoginUser;
    },
    setPageOwner: async (addrOrName: string) => {
        let isReloadRequired = false;
        if (addrOrName.startsWith('0x') && addrOrName.length === 42) {
            if (RSS3PageOwner.address !== addrOrName) {
                isReloadRequired = true;
                RSS3PageOwner.address = addrOrName;
                RSS3PageOwner.name = '';
            }
        } else {
            if (RSS3PageOwner.name !== addrOrName) {
                isReloadRequired = true;
                RSS3PageOwner.name = addrOrName;
                RSS3PageOwner.address = '';
            }
        }
        if (isReloadRequired) {
            await initUser(RSS3PageOwner);
        }
        await setPageTitleFavicon();
        await setupTheme(); // Setup theme
        dispatchEvent(Events.pageOwnerReady, RSS3PageOwner);
        return RSS3PageOwner;
    },
    getPageOwner: () => {
        return RSS3PageOwner;
    },
    reloadPageOwner: async () => {
        await initUser(RSS3PageOwner);
        dispatchEvent(Events.pageOwnerReady, RSS3PageOwner);
        return RSS3PageOwner;
    },
    isNowOwner: () => {
        // await ensureLoginUser();
        return isValidRSS3() && RSS3LoginUser.address === RSS3PageOwner.address;
    },
    isValidRSS3,
    getAssetProfile: async (address: string, type: string, refresh: boolean = false) => {
        if (assetsProfileCache.has(address + type) && !refresh) {
            return <IAssetProfile>assetsProfileCache.get(address + type);
        } else {
            let data: IAssetProfile | null = null;
            try {
                const autoAssets = (await RSS3PageOwner.assets?.auto.getList(address))?.map((asset) =>
                    RSS3Utils.id.parseAsset(asset),
                );
                data = <IAssetProfile>{ assets: autoAssets, status: autoAssets };
                assetsProfileCache.set(address + type, data);
            } catch (error) {
                data = null;
            }
            return data;
        }
    },
    getNFTDetails: async (address: string, platform: string, identity: string, id: string, type: string) => {
        let data: NFTResponse | null = null;
        try {
            const res = await axios.get(`/assets/details`, {
                baseURL: config.hubEndpoint,
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
            const res = await axios.get(`/assets/details`, {
                baseURL: config.hubEndpoint,
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
            const res = await axios.get(`/assets/details`, {
                baseURL: config.hubEndpoint,
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

    buildProductBaseURL: (product: string, address: string, name?: string) => {
        if (product in config.productsList) {
            const p = config.productsList[product];
            if (p.subDomainMode) {
                if (name) {
                    const fixedName = name.endsWith(config.rns.suffix) ? name.replace(config.rns.suffix, '') : name;
                    return `${p.schema}${fixedName}.${p.baseDomain}`;
                } else {
                    return `${p.schema}${p.baseDomain}/${address}`;
                }
            } else {
                return `${p.schema}${p.baseDomain}/${name || address}`;
            }
        }
        return '';
    },
    getAvailableThemes(assets: RSS3AutoAsset[]) {
        // ${platform}-${identity}-${type}-${uniqueID}
        const availableThemes: Theme[] = [];
        for (const theme of legacyConfig.theme) {
            for (const asset of assets) {
                const { type, uniqueID } = RSS3Utils.id.parseAsset(asset);
                if (
                    type.includes('NFT') &&
                    utils.isAssetNotHidden(asset) &&
                    uniqueID.split('.')[0] === theme.nftIdPrefix
                ) {
                    availableThemes.push(theme);
                    break;
                }
            }
        }
        return availableThemes;
    },
    addNewMetamaskAccount: async (): Promise<RSS3Account> => {
        // js don't support multiple return values,
        // so here I'm using signature as a message provider

        if (!isValidRSS3()) {
            return {
                id: '',
                signature: 'Not logged in',
            };
        }
        const metamaskEthereum = (window as any).ethereum;
        ethersProvider = new ethers.providers.Web3Provider(metamaskEthereum);
        try {
            const accounts = await metamaskEthereum.request({
                method: 'eth_requestAccounts',
            });
            const address = ethers.utils.getAddress(accounts[0]);

            // ${platform}-${identity}
            const newAccount = {
                id: `EVM+-${address}`,
            };
            const sigMessage = await (<RSS3>RSS3LoginUser.persona).profile.accounts.getSigMessage(newAccount);
            const signature = await ethersProvider?.getSigner().signMessage(sigMessage);
            return {
                ...newAccount,
                signature,
            };
        } catch (e: any) {
            console.log(e);
            return {
                id: '',
                signature: e.message,
            };
        }
    },
};
