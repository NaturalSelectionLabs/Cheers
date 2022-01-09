import misskey from './misskey';
import twitter from './twitter';
import Jike from './jike';

interface ContentInfo {
    title: string;
    pre_content: string;
    timestamp: number;
    txHash: string;
    link: string;
}

export interface Content {
    id: string;
    identity: string;
    platform: string;
    type: string;
    info: ContentInfo;
    accessible?: boolean;
}

export default {
    Misskey: misskey,
    Twitter: twitter,
    Jike: Jike,
};
