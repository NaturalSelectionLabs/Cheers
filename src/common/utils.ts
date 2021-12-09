import RNSUtils from '@/common/rns';
import RSS3 from '@/common/rss3';
import config from '@/config';
import { RSS3Account, RSS3Asset } from 'rss3-next/types/rss3';
import { GeneralAsset, GeneralAssetWithTags } from './types';

const getName = () => {
    return window.location.host.split('.').slice(0, -2).join('.');
};

const orderPattern = new RegExp(`^${config.tags.prefix}:order:(-?\\d+)$`, 'i');

type TypesWithTag = RSS3Account | GeneralAssetWithTags;

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

const setTaggedOrder = (tagged: TypesWithTag, order?: number): void => {
    if (!tagged.tags) {
        tagged.tags = [];
    } else {
        // const orderPattern = /^pass:order:(-?\d+)$/i;
        const oldIndex = tagged.tags.findIndex((tag) => orderPattern.test(tag));
        if (oldIndex !== -1) {
            tagged.tags.splice(oldIndex, 1);
        }
    }
    if (order) {
        tagged.tags.push(`${config.tags.prefix}:order:${order}`);
    } else {
        tagged.tags.push(`${config.tags.prefix}:${config.tags.hiddenTag}`);
    }
};

function sortByOrderTag<T extends TypesWithTag>(taggeds: T[]): T[] {
    taggeds.sort((a, b) => {
        return getTaggedOrder(a) - getTaggedOrder(b);
    });
    return taggeds;
}

const setOrderTag = async (taggeds: TypesWithTag[]): Promise<TypesWithTag[]> => {
    await Promise.all(
        taggeds.map(async (tagged, index) => {
            setTaggedOrder(tagged, index);
        }),
    );
    return taggeds;
};

const setHiddenTag = async (taggeds: TypesWithTag[]): Promise<TypesWithTag[]> => {
    await Promise.all(
        taggeds.map(async (tagged) => {
            setTaggedOrder(tagged);
        }),
    );
    return taggeds;
};

const mergeAssetsTags = async (assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) => {
    return await Promise.all(
        (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
            const origType = ag.type;
            if (config.hideUnlistedAsstes) {
                ag.type = 'Invalid'; // Using as a match mark
            }
            for (const airf of assetsInRSS3File) {
                if (
                    airf.platform === ag.platform &&
                    airf.identity === ag.identity &&
                    airf.id === ag.id &&
                    airf.type === origType
                ) {
                    // Matched
                    ag.type = origType; // Recover type
                    if (airf.tags) {
                        ag.tags = airf.tags;
                    }
                    if (!ag.info.collection) {
                        ag.info.collection = 'Other';
                    }
                    break;
                }
            }
            return ag;
        }),
    );
};

interface AssetsList {
    listed: GeneralAssetWithTags[];
    unlisted: GeneralAssetWithTags[];
    assets: GeneralAssetWithTags[];
}

async function initAssets(
    assetInRSS3: RSS3Asset[],
    assetInAssetProfile: GeneralAsset[],
    type: string,
): Promise<AssetsList> {
    const listed: GeneralAssetWithTags[] = [];
    const unlisted: GeneralAssetWithTags[] = [];

    const allAssets = await utils.mergeAssetsTags(assetInRSS3, assetInAssetProfile);

    for (const asset of allAssets) {
        if (asset.type.endsWith(type)) {
            if (asset.tags?.includes(`${config.tags.prefix}:${config.tags.hiddenTag}`)) {
                unlisted.push(asset);
            } else {
                listed.push(asset);
            }
        }
    }

    return {
        listed: utils.sortByOrderTag(listed),
        unlisted: unlisted,
        assets: allAssets,
    };
}

async function initAccounts(accounts: RSS3Account[]) {
    const listed: RSS3Account[] = [];
    const unlisted: RSS3Account[] = [];

    for (const account of accounts) {
        if (!account.tags?.includes('hidden')) {
            listed.push(account);
        } else {
            unlisted.push(account);
        }
    }

    return {
        listed: utils.sortByOrderTag(listed),
        unlisted: utils.sortByOrderTag(unlisted),
    };
}

async function getAddress(routerAddress: string) {
    let address: string | undefined;
    let ethAddress: string = '';
    let rns: string = '';

    if (config.subDomain.isSubDomainMode) {
        // Is subdomain mode
        address = getName();
    } else if (routerAddress) {
        address = routerAddress;
    }

    if (address) {
        if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
            // Should be address type
            // Get RNS and redirect
            ethAddress = address;
            rns = await RNSUtils.addr2Name(address);
            if (rns !== '') {
                window.location.href =
                    'https://' +
                    rns +
                    '.' +
                    config.subDomain.rootDomain +
                    window.location.pathname.replace(`/${address}`, '');
            }
        } else {
            // RNS
            rns = address;
            ethAddress = (await RNSUtils.name2Addr(address)).toString();
            if (parseInt(ethAddress) === 0) {
                return { ethAddress, rns };
            }
        }
    }

    return { ethAddress, rns };
}

async function saveAssetsOrder(listed: GeneralAssetWithTags[], unlisted: GeneralAssetWithTags[]) {
    const rss3 = await RSS3.get();
    await Promise.all(
        listed.map((asset, index) => {
            return rss3?.assets.patchTags(
                {
                    ...asset,
                },
                [`pass:order:${index}`],
            );
        }),
    );
    await Promise.all(
        unlisted.map((asset) => {
            return rss3?.assets.patchTags(
                {
                    ...asset,
                },
                ['pass:hidden'],
            );
        }),
    );
    await rss3?.files.sync();
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

const utils = {
    sortByOrderTag,
    setOrderTag,
    setHiddenTag,
    mergeAssetsTags,
    initAssets,
    initAccounts,
    getAddress,
    getName,
    saveAssetsOrder,
    extractEmbedFields,
};

export default utils;
