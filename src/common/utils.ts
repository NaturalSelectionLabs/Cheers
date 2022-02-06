import legacyConfig from '@/config';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import config from './config';
import RSS3, { IRSS3 } from './rss3';
import { CustomField_PassAssets, GeneralAsset } from './types';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import Cookies from 'js-cookie';
import chunk from 'lodash/chunk';

const orderPattern = new RegExp(`^${config.tags.prefix}:order:(-?\\d+)$`, 'i');
const hiddenTag = `${config.tags.prefix}:${config.tags.hiddenTag}`;

type TypesWithTag = RSS3Account;

const getTaggedOrder = (tagged: TypesWithTag): number => {
    if (!tagged.tags) {
        return -1;
    }
    // const orderPattern = /^pass:order:(-?\d+)$/i;
    for (const tag of tagged.tags) {
        if (orderPattern.test(tag)) {
            return parseInt(orderPattern.exec(tag)?.[1] || '-1');
        }
    }
    return -1;
};

function sortByOrderTag<T extends TypesWithTag>(taggeds: T[]): T[] {
    taggeds.sort((a, b) => {
        return getTaggedOrder(a) - getTaggedOrder(b);
    });
    return taggeds;
}

async function initAssets() {
    const pageOwner = RSS3.getPageOwner();
    const apiUserPersona = RSS3.getAPIUser().persona as IRSS3;

    let assetList = await apiUserPersona.assets.auto.getList(pageOwner.address);

    const passTags = pageOwner.file?.['_pass']?.assets;
    const taggedList: CustomField_PassAssets[] = passTags || [];
    const validTaggedList = taggedList.filter((tagged) => assetList.includes(tagged.id));

    const hiddenList = validTaggedList
        .filter((asset: any) => asset.hasOwnProperty('hide'))
        .map((asset: { id: string }) => asset.id);

    const orderedList = validTaggedList
        .filter((asset: any) => asset.hasOwnProperty('order'))
        .sort((a: any, b: any) => a.order - b.order)
        .map((asset: { id: string }) => asset.id);

    if (hiddenList.length > 0) {
        assetList = assetList?.filter((asset) => hiddenList.indexOf(asset) < 0);
    }
    if (orderedList.length > 0) {
        assetList = assetList?.filter((asset) => orderedList.indexOf(asset) < 0);
    }
    const hiddenAssetList = hiddenList;
    const orderedAssetList = assetList?.concat(orderedList);

    const parsedHidden = hiddenAssetList?.map((asset) => RSS3Utils.id.parseAsset(asset));
    const parsedAssets = orderedAssetList?.map((asset) => RSS3Utils.id.parseAsset(asset));

    const nfts = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'NFT');

    const nftsWithClassName = nfts.map((nft) => {
        const className = validTaggedList.find(
            (asset) => asset.id === RSS3Utils.id.getAsset(nft.platform, nft.identity, nft.type, nft.uniqueID),
        )?.class;
        return {
            ...nft,
            class: className === 'Vitrine' ? 'Collectibles' : className, // change the old 'Vitrine' to 'Collectibles'
        };
    });

    const donations = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'Donation');
    const footprints = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'POAP');

    const hiddenNfts = parsedHidden?.filter((asset) => asset.type.split('.')[1] === 'NFT');
    const hiddenDonations = parsedHidden?.filter((asset) => asset.type.split('.')[1] === 'Donation');
    const hiddenFootprints = parsedHidden?.filter((asset) => asset.type.split('.')[1] === 'POAP');

    return {
        nfts,
        nftsWithClassName,
        donations,
        footprints,
        hiddenNfts,
        hiddenDonations,
        hiddenFootprints,
    };
}

async function loadAssets(parsedAssets: GeneralAsset[]) {
    if (!parsedAssets.length) {
        return [];
    }

    const apiUser = (await RSS3.getAPIUser().persona) as IRSS3;
    const assetIDList = parsedAssets.map((asset) =>
        RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
    );
    const assetDetailsList: AnyObject[] = []; // todo: fix this

    // only retry 10 times
    for (let i = 0; i < 10; i++) {
        // find all the assets without details from res
        const assetsNoDetails = assetIDList.filter((asset) => !assetDetailsList.find((detail) => detail.id === asset));
        if (!assetsNoDetails.length) {
            // all the assets have details, break
            break;
        } else if (assetDetailsList.length !== 0) {
            // already request but not get full details
            // sleep for two seconds
            await new Promise((r) => setTimeout(r, 3100));
        }

        // divide asset ID list into different parts to avoid "code:1"
        // https://lodash.shujuwajue.com/array/chunk
        const splitList: Array<string[]> = chunk(assetsNoDetails, config.splitPageLimits.assets);

        // process asset requests concurrently
        await Promise.all(
            splitList.map(async (items) => {
                const res = await apiUser.assets.getDetails({
                    assets: items,
                    full: true,
                });
                // if have details return, add them to the res list
                if (res?.length) {
                    assetDetailsList.push(...res);
                }
            }),
        );
    }

    // sort asset details
    const sortedAssetDetailsList: AnyObject[] = [];
    assetIDList.map((assetID) => {
        const detailedAsset = assetDetailsList.find((details) => details.id === assetID);
        if (detailedAsset) {
            sortedAssetDetailsList.push(detailedAsset);
        }
    });

    return sortedAssetDetailsList;
}

async function initAccounts(pageOwner = RSS3.getPageOwner()) {
    const listed: RSS3Account[] = [];
    const unlisted: RSS3Account[] = [];

    const allAccounts = (await pageOwner.profile?.accounts) || [];
    for (const account of allAccounts) {
        if (account.tags?.includes(`${config.tags.prefix}:${config.tags.hiddenTag}`)) {
            unlisted.push(account);
        } else {
            listed.push(account);
        }
    }

    return {
        listed: utils.sortByOrderTag(listed),
        unlisted,
    };
}

async function initContent(timestamp: string = '', isWeb3Only: boolean) {
    const pageOwner = await RSS3.getPageOwner();
    const apiUserPersona = RSS3.getAPIUser().persona as IRSS3;

    let QUERY_STRING = isWeb3Only ? 'Mirror.XYZ' : 'Twitter,Misskey,Mirror.XYZ,Jike';

    let allItems =
        (await apiUserPersona.items.getListByPersona({
            persona: pageOwner.address,
            limit: config.splitPageLimits.contents,
            tsp: timestamp,
            fieldLike: QUERY_STRING,
        })) || [];

    let haveMore = allItems.length === config.splitPageLimits.contents;

    return {
        listed: allItems,
        haveMore: haveMore,
        timestamp: allItems[allItems.length - 1]?.date_created || '',
    };
}

function extractEmbedFields(raw: string, fieldsEmbed: string[]) {
    const fieldPattern = /<([A-Z]+?)#(.+?)>/gi;
    const fields = raw.match(fieldPattern) || [];
    const extracted = raw.replace(fieldPattern, '');
    const fieldsMatch: {
        [key: string]: string;
    } = {};

    for (const field of fields) {
        const splits = fieldPattern.exec(field) || [];
        if (fieldsEmbed.includes(splits[1])) {
            fieldsMatch[splits[1]] = splits[2];
        }
    }

    return {
        extracted,
        fieldsMatch,
    };
}

function fixURLSchemas(url: string) {
    let fixedUrl = url;
    if (url.startsWith('ipfs://')) {
        fixedUrl = url.replace('ipfs://', config.ipfs.download.endpoint + '/');
    }
    return fixedUrl;
}

async function updateAssetTags(assetFields: CustomField_PassAssets[]) {
    const loginUser = await RSS3.getLoginUser();
    if (loginUser.file) {
        const personaFile = loginUser.file;
        // Init base structure
        if (!personaFile['_pass']) {
            personaFile['_pass'] = {
                assets: [],
            };
        } else if (!personaFile['_pass'].assets) {
            personaFile['_pass'].assets = [];
        }
        const assets: CustomField_PassAssets[] = personaFile['_pass'].assets;
        await Promise.all(
            assetFields.map((afo) => {
                // Asset Field Object (afo)
                // Old   Asset Field  (oaf)
                const index = assets.findIndex((oaf) => oaf.id === afo.id);
                if (index === -1) {
                    // New Asset
                    assets.push(afo);
                } else {
                    // Replace old Asset
                    assets.splice(index, 1, afo);
                }
            }),
        );

        // Update field
        personaFile['_pass'].assets = assets;
        loginUser.persona?.files.set(personaFile);
        // Sync File
        await loginUser.persona?.files.sync();
    }
}

async function setAssetTags(listed: RSS3AutoAsset[], unlisted: RSS3AutoAsset[]) {
    const assets: CustomField_PassAssets[] = [];
    await Promise.all(
        listed.map(async (asset, index) => {
            const afo: CustomField_PassAssets = {
                id: asset,
                order: index,
            };
            assets.push(afo);
        }),
    );
    await Promise.all(
        unlisted.map(async (asset) => {
            const afo: CustomField_PassAssets = {
                id: asset,
                hide: true,
            };
            assets.push(afo);
        }),
    );
    await updateAssetTags(assets);
}

const setTaggedOrder = (tagged: TypesWithTag, order?: number) => {
    const reservedTags: string[] = [];
    while (tagged.tags?.length) {
        if (!orderPattern.test(tagged.tags[0]) && tagged.tags[0] !== hiddenTag) {
            reservedTags.push(tagged.tags[0]);
        }
        tagged.tags.splice(tagged.tags.indexOf(tagged.tags[0]), 1);
    }
    tagged.tags = reservedTags;
    if (typeof order === 'number') {
        tagged.tags.push(`${config.tags.prefix}:order:${order}`);
    } else {
        tagged.tags.push(`${config.tags.prefix}:${config.tags.hiddenTag}`);
    }
    return tagged;
};
const setAccountsTags = async (listed: TypesWithTag[], unlisted: TypesWithTag[]): Promise<TypesWithTag[]> => {
    await Promise.all(listed.map((tagged, index) => setTaggedOrder(tagged, index)));
    await Promise.all(unlisted.map((tagged) => setTaggedOrder(tagged)));
    return listed.concat(unlisted);
};

const isAssetNotHidden = async (asset: RSS3AutoAsset | RSS3CustomAsset, _passAssetsField: CustomField_PassAssets[]) => {
    // Init base structure
    if (!_passAssetsField.length) {
        return true;
    } else {
        const af = _passAssetsField.find((oaf) => oaf.id === asset);
        return !!af?.hide;
    }
};

function getAddress(routerAddress: string) {
    if (legacyConfig.subDomain.isSubDomainMode) {
        // Is subdomain mode
        return window.location.host.split('.').slice(0, -2).join('.');
    } else {
        return routerAddress;
    }
}

const subDomainModeRedirect = (rns: string) => {
    if (config.subDomain.preferSubDomainMode) {
        // We prefer subdomain mode
        if (rns && !legacyConfig.subDomain.isSubDomainMode) {
            // Redirect
            const oldUrlPattern = new RegExp(`${legacyConfig.subDomain.rootDomain}/.+?/`);
            window.location.href = window.location.href = (window.location.href + '/') // Add trailing slash for pattern (rss3.test/candinya)
                .replace(oldUrlPattern, `${rns}.${legacyConfig.subDomain.rootDomain}/`)
                .replace(
                    /\/$/, // Remove ending slash (if any) for format consistency
                    '',
                );
        }
    }
};

const tryEnsureOrRedirect = async (route: RouteLocationNormalizedLoaded, router: Router) => {
    if (RSS3.isValidRSS3() || (await RSS3.reconnect())) {
        await RSS3.ensureLoginUser();
    } else {
        // Redirect
        if (legacyConfig.subDomain.isSubDomainMode) {
            // redirect back to root domain
            window.location.host = legacyConfig.subDomain.rootDomain;
        } else {
            setCrossDomainStorage('redirectFrom', route.fullPath);
            await router.push('/');
        }
    }
};

function setStorage(key: string, value: string) {
    if (value) {
        localStorage.setItem(key, value);
    } else {
        localStorage.removeItem(key);
    }
}

function getStorage(key: string): string | null {
    return localStorage.getItem(key);
}

const cookieOptions: Cookies.CookieAttributes = {
    domain: '.' + legacyConfig.subDomain.rootDomain,
    secure: true,
    sameSite: 'Strict',
    expires: legacyConfig.subDomain.cookieExpires,
};

function setCrossDomainStorage(key: string, value: string) {
    if (value) {
        Cookies.set(key, value, cookieOptions);
    } else {
        Cookies.remove(key, cookieOptions);
    }
}
function getCrossDomainStorage(key: string): string {
    return Cookies.get(key) || '';
}

const utils = {
    sortByOrderTag,
    initAssets,
    loadAssets,
    initAccounts,
    extractEmbedFields,
    initContent,
    fixURLSchemas,
    setAssetTags,
    updateAssetTags,
    setAccountsTags,
    isAssetNotHidden,
    getAddress,
    subDomainModeRedirect,
    tryEnsureOrRedirect,
    setStorage,
    getStorage,
    setCrossDomainStorage,
    getCrossDomainStorage,
};

export default utils;
