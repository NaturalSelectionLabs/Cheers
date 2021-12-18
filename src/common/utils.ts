import legacyConfig from '@/config';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import config from './config';
import RSS3, { IRSS3 } from './rss3';
import { CustomField_Pass, GeneralAsset, GitcoinResponse, NFTResponse, POAPResponse } from './types';

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

    let assetList = await pageOwner.assets?.auto.getList(pageOwner.address);

    let taggedList = <{ id: string; hide?: boolean; order?: number }[]>[];
    const passTags = (await pageOwner.files.get(pageOwner.address))._pass?.assets;
    taggedList = passTags ? passTags : [];

    const hiddenList = taggedList
        .filter((asset: any) => asset.hasOwnProperty('hide'))
        .map((asset: { id: string }) => asset.id);

    const orderedList = taggedList
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
    const donations = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'Donation');
    const footprints = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'POAP');

    const hidenNfts = parsedHidden?.filter((asset) => asset.type.split('.')[1] === 'NFT');
    const hiddenDonations = parsedHidden?.filter((asset) => asset.type.split('.')[1] === 'Donation');
    const hiddenFootprints = parsedHidden?.filter((asset) => asset.type.split('.')[1] === 'POAP');

    return {
        nfts: nfts || [],
        donations: donations || [],
        footprints: footprints || [],
        hiddenNfts: hidenNfts || [],
        hiddenDonations: hiddenDonations || [],
        hiddenFootprints: hiddenFootprints || [],
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

    const res: AnyObject[] = []; // todo: fix this
    let startIndex = 0;
    let isHaveMore = true;

    while (isHaveMore) {
        let endIndex = startIndex + config.splitPageLimits.assets;
        if (endIndex >= assetIDList.length) {
            endIndex = assetIDList.length;
            isHaveMore = false;
        }
        const asset = await await apiUser.assets.getDetails({
            assets: assetIDList.slice(startIndex, endIndex),
            full: true,
        });
        if (asset.length) {
            res.push(...asset);
        }
        startIndex = endIndex;
    }

    return res;
}

async function getAssetsTillSuccess(assetSet: Set<string>, delay: number = 1500, count: number = 5) {
    const pageOwner = RSS3.getPageOwner();
    return new Promise<(NFTResponse | GitcoinResponse | POAPResponse)[]>(async (resolve, reject) => {
        const tryReq = async () => {
            try {
                const details = (await pageOwner.assets?.getDetails({
                    assets: Array.from(assetSet),
                    full: true,
                })) as (NFTResponse | GitcoinResponse | POAPResponse)[];
                if (details) {
                    resolve(details);
                    return true;
                }
            } catch (e) {
                reject(e);
            }
            return false;
        };

        if (!(await tryReq())) {
            let iv = setInterval(async () => {
                count--;
                if (count < 0) {
                    resolve([]);
                    clearInterval(iv);
                } else if (await tryReq()) {
                    clearInterval(iv);
                }
            }, delay);
        }
    });
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

function isAsset(field: string | undefined): boolean {
    const condition = ['NFT', 'POAP', 'Gitcoin'];
    return !!(field && condition.find((item) => field.includes(item)));
}

async function initContent(timestamp: string = '') {
    const pageOwner = await RSS3.getPageOwner();

    let autoItems =
        (await pageOwner.items?.getListByPersona({
            persona: pageOwner.address,
            limit: config.splitPageLimits.contents,
            tsp: timestamp,
            fieldLike: '%items-auto%',
        })) || [];

    let MirrorItems =
        (await pageOwner.items?.getListByPersona({
            persona: pageOwner.address,
            limit: config.splitPageLimits.contents,
            tsp: timestamp,
            fieldLike: '%Mirror.XYZ%',
        })) || [];

    let haveMore = autoItems.length + MirrorItems.length >= config.splitPageLimits.contents;

    let items = autoItems
        .concat(MirrorItems)
        .sort((a, b) => new Date(b.date_updated).valueOf() - new Date(a.date_updated).valueOf())
        .slice(0, 35);

    return {
        listed: items,
        haveMore: haveMore,
        timestamp: items.pop()?.date_created || '',
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

async function updateAssetTags(assetFields: CustomField_Pass[]) {
    const loginUser = await RSS3.getLoginUser();
    if (loginUser.persona) {
        const personaFile = await loginUser.persona.files.get();
        // Init base structure
        if (!personaFile['_pass']) {
            personaFile['_pass'] = {
                assets: [],
            };
        } else if (!personaFile['_pass'].assets) {
            personaFile['_pass'].assets = [];
        }
        const assets: CustomField_Pass[] = personaFile['_pass'].assets;
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
    const assets: CustomField_Pass[] = [];
    await Promise.all(
        listed.map(async (asset, index) => {
            const afo: CustomField_Pass = {
                id: asset,
                order: index,
            };
            assets.push(afo);
        }),
    );
    await Promise.all(
        unlisted.map(async (asset) => {
            const afo: CustomField_Pass = {
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

const isAssetNotHidden = async (asset: RSS3AutoAsset | RSS3CustomAsset) => {
    const pageOwner = await RSS3.getPageOwner();
    const apiUser = await RSS3.getAPIUser();
    const personaFile = await apiUser.persona?.files.get(pageOwner.address);
    // Init base structure
    const assets: CustomField_Pass[] = personaFile?.['_pass']?.assets;
    const af = assets?.find((oaf) => oaf.id === asset);
    return !!af?.hide;
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

const utils = {
    sortByOrderTag,
    initAssets,
    loadAssets,
    initAccounts,
    extractEmbedFields,
    initContent,
    fixURLSchemas,
    setAssetTags,
    setAccountsTags,
    isAssetNotHidden,
    getAddress,
    subDomainModeRedirect,
};

export default utils;
