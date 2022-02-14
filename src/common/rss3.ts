import utils from '@/common/utils';
import legacyConfig from '@/config';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, utils as ethersUtils } from 'ethers';
import RSS3, { utils as RSS3Utils } from 'rss3';
import config from './config';
import Events from './events';
import rns from './rns';
import AsyncLock from 'async-lock';
import { CustomField_PassAssets, GeneralAsset } from './types';

export interface IAssetProfile {
    assets: GeneralAsset[];
    status?: boolean;
}

export interface RSS3DetailPersona {
    file: RSS3Index | null;
    address: string;
    name: string;
    profile: RSS3Profile | null;
    followers: string[];
    followings: string[];
    isReady: boolean;
}

export interface RSS3SDKPersona {
    persona: RSS3;
}

export type RSS3FullPersona = RSS3SDKPersona & RSS3DetailPersona;

export const EMPTY_RSS3_DP: RSS3DetailPersona = {
    file: null,
    address: '',
    name: '',
    profile: null,
    followers: [],
    followings: [],
    isReady: false,
};
export type IRSS3 = RSS3;
const RSS3PageOwner: RSS3DetailPersona = Object.create(EMPTY_RSS3_DP);
let RSS3LoginUser: RSS3FullPersona = Object.create(EMPTY_RSS3_DP);
const RSS3APIUser: RSS3SDKPersona = {
    persona: new RSS3({
        endpoint: config.hubEndpoint,
    }),
};
let walletConnectProvider: WalletConnectProvider;
let ethersProvider: ethers.providers.Web3Provider | null;
const lock = new AsyncLock();
let isSettingPageOwner: boolean = false;

export interface IAssetProfile {
    assets: GeneralAsset[];
    status?: boolean;
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

    let address = utils.getCrossDomainStorage(KeyNames.ConnectAddress);
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

    let address = utils.getCrossDomainStorage(KeyNames.ConnectAddress);
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
        utils.setCrossDomainStorage(KeyNames.ConnectMethod, method);
        utils.setCrossDomainStorage(KeyNames.ConnectAddress, RSS3LoginUser.address);
    }
}

async function reconnect() {
    if (isValidRSS3()) {
        return true;
    }
    const lastConnect = utils.getCrossDomainStorage(KeyNames.ConnectMethod);
    const address = utils.getCrossDomainStorage(KeyNames.ConnectAddress);
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
                utils.setCrossDomainStorage(KeyNames.ConnectMethod, ''); // logout
                break;
        }
        return isValidRSS3();
    }
    return true;
}

async function initUser(user: RSS3DetailPersona | RSS3FullPersona, skipSignSync: boolean = false) {
    const RSS3APIPersona = apiPersona();
    user.isReady = false;
    await lock.acquire('InitializingUser', async () => {
        if ('persona' in user && !user.address) {
            // Fix address
            user.address = user.persona.account.address;
        }
        if (user.name && !user.address) {
            user.address = await rns.name2Addr(user.name);
        }
        // console.log(user.file, user.name)
        // todo: save page owner into state management system
        //  (SDK getList will trigger get file, which produces one more request
        //  and make pre-inject meta useless, or just delay the follow list loading ?)
        const [followers, followings, file, name] = await Promise.all([
            RSS3APIPersona.backlinks.getList(user.address, 'following'),
            RSS3APIPersona.links.getList(user.address, 'following'),
            user.file ?? RSS3APIPersona.files.get(user.address),
            user.name ?? rns.addr2Name(user.address),
        ]);
        // await new Promise((r) => {}); // lock process for debug
        user.followers = followers;
        user.followings = followings;
        user.file = file as RSS3Index;
        user.name = name;
        if ('persona' in user && user.file) {
            // Sync persona
            user.persona.files.set(user.file);
            if (!skipSignSync) {
                await user.persona.files.sync();
            }
        }
        user.profile = user.file?.profile || {};
        user.isReady = true;
    });
}

function apiPersona(): RSS3 {
    return RSS3APIUser.persona;
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
    utils.setCrossDomainStorage(KeyNames.ConnectMethod, '');
    utils.setCrossDomainStorage(KeyNames.ConnectAddress, '');
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
    document.title = profile?.name || 'Cheers Bio';
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
        let res = false;
        await lock.acquire('reconnect', async () => {
            res = await reconnect();
            if (res) {
                dispatchEvent(Events.connect, RSS3LoginUser);
            }
        });
        return res;
    },
    getAPIUser: (): RSS3SDKPersona => {
        return {
            persona: apiPersona(),
        };
    },
    getLoginUser: () => {
        return RSS3LoginUser;
    },
    ensureLoginUser,
    reloadLoginUser: async () => {
        RSS3LoginUser.file = (await apiPersona().files.get(RSS3LoginUser.address, true)) as RSS3Index;
        RSS3LoginUser.profile = RSS3LoginUser.file.profile || {};
        dispatchEvent(Events.connect, RSS3LoginUser);
        return RSS3LoginUser;
    },
    setPageOwner: async (addrOrName: string) =>
        new Promise<RSS3DetailPersona>(async (resolve, reject) => {
            if (!isSettingPageOwner) {
                console.log('Setting page owner', addrOrName);
                isSettingPageOwner = true;
                let isReloadRequired = false;
                if (addrOrName.startsWith('0x') && addrOrName.length === 42) {
                    if (RSS3PageOwner.address !== addrOrName) {
                        isReloadRequired = true;
                        RSS3PageOwner.address = ethersUtils.getAddress(addrOrName);
                        RSS3PageOwner.name = await rns.addr2Name(addrOrName);
                    }
                } else {
                    if (RSS3PageOwner.name !== addrOrName) {
                        isReloadRequired = true;
                        RSS3PageOwner.name = addrOrName;
                        RSS3PageOwner.address = await rns.name2Addr(addrOrName);
                    }
                }
                if (isReloadRequired) {
                    const preinjectPageOwner = (window as any).USER;
                    if (typeof preinjectPageOwner !== 'undefined' && RSS3PageOwner.address === preinjectPageOwner.id) {
                        console.log('file hit', preinjectPageOwner);
                        RSS3PageOwner.file = preinjectPageOwner;
                    } else {
                        RSS3PageOwner.file = null;
                    }
                    await initUser(RSS3PageOwner);
                }
                await setPageTitleFavicon();
                dispatchEvent(Events.pageOwnerReady, RSS3PageOwner);
                isSettingPageOwner = false;
                resolve(RSS3PageOwner);
            } else {
                document.addEventListener(Events.pageOwnerReady, () => {
                    resolve(RSS3PageOwner);
                });
            }
        }),
    getPageOwner: () => {
        return RSS3PageOwner;
    },
    reloadPageOwner: async () => {
        RSS3PageOwner.file = (await apiPersona().files.get(RSS3PageOwner.address, true)) as RSS3Index;
        RSS3PageOwner.profile = RSS3PageOwner.file.profile || {};
        dispatchEvent(Events.pageOwnerReady, RSS3PageOwner);
        return RSS3PageOwner;
    },
    isNowOwner: () => {
        // await ensureLoginUser();
        return isValidRSS3() && RSS3LoginUser.address === RSS3PageOwner.address;
    },
    isValidRSS3,

    getAvailableThemes(assets: RSS3AutoAsset[], _passAssetsField: CustomField_PassAssets[]) {
        // ${platform}-${identity}-${type}-${uniqueID}
        const availableThemes: Theme[] = [];
        for (const theme of legacyConfig.theme) {
            for (const asset of assets) {
                const { type, uniqueID } = RSS3Utils.id.parseAsset(asset);
                if (
                    type.includes('NFT') &&
                    utils.isAssetNotHidden(asset, _passAssetsField) &&
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
