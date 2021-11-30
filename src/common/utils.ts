import RNSUtils from '@/common/rns';
import config from '@/config';
import { RSS3Account, RSS3Asset } from 'rss3-next/types/rss3';
import { GeneralAsset, GeneralAssetWithTags } from './types';

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @return  Array           The HSL representation
 * @param r
 * @param g
 * @param b
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                h = 0;
                break;
        }

        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @return  Array           The RGB representation
 * @param h
 * @param s
 * @param l
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p: number, q: number, t: number) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

export function hex2rgb(hex: string): [number, number, number] {
    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return res ? [parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16)] : [0, 0, 0];
}

export function rgb2hex(r: number, g: number, b: number) {
    return (
        '#' +
        Math.round((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)
    );
}

export function getName() {
    return window.location.host.split('.').slice(0, -2).join('.');
}

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
}

async function initAssets(assetInRSS3: RSS3Asset[], assetInAssetProfile: GeneralAsset[], type: string) {
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
        if (address.startsWith('0x')) {
            // Might be address type
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

const utils = {
    sortByOrderTag,
    setOrderTag,
    setHiddenTag,
    mergeAssetsTags,
    initAssets,
    getAddress,
};

export default utils;
