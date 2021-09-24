import mirror from './mirror';
import misskey from './misskey';

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
    mirror,
    misskey,
};
