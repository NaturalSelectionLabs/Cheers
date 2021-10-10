import axios from 'axios';
import config from '@/config';
import { Content } from './index';

const userInfoMap = new Map();

function spliceAccountString(account: string) {
    const splices = account.split('@');
    if (splices.length < 2) {
        return {
            instance: '',
            username: '',
        };
    }
    const username = splices[0];
    const instance = splices[1];
    return {
        instance,
        username,
    };
}

async function getUser(account: string, refresh: boolean = false) {
    const { username, instance } = spliceAccountString(account);
    if (!username || !instance) {
        return null;
    }
    if (!refresh && userInfoMap.has(account)) {
        return userInfoMap.get(account);
    }
    // Else
    try {
        const res = await axios.post(`https://${instance}/api/users/show`, {
            username: username,
        });
        if (res.data) {
            userInfoMap.set(account, res.data);
        }
        return res.data;
    } catch (e) {
        console.log(e);
    }
    // If fails
    return null;
}

// Only necessary parts for type

export interface Note {
    id: string;
    createdAt: string;
    text: string;
    renoteCount: number;
    repliesCount: number;
    reactions: {
        [key: string]: number;
    };
    files: File[];
}

interface File {
    id: string;
    type: string;
    url: string;
    thumbnailUrl: string;
}

export default {
    verify: async (account: string, rns: string, ethAddress: string): Promise<boolean> => {
        const u = await getUser(account);
        if (u) {
            // Phase 1: in "name"
            if ((rns && u.name?.includes(rns)) || u.name?.includes(ethAddress)) {
                return true;
            }

            // Phase 2: in "description"
            if ((rns && u.description?.includes(rns)) || u.description?.includes(ethAddress)) {
                return true;
            }

            // Phase 3: in "fields"
            if (u.fields?.length) {
                for (const pair of u.fields) {
                    if ((rns && pair.value?.includes(rns)) || pair.value?.includes(ethAddress)) {
                        return true;
                    }
                }
            }

            // Phase 4: in "pinnedNotes"
            if (u.pinnedNotes?.length) {
                for (const note of u.pinnedNotes) {
                    if ((rns && note.text?.includes(rns)) || note.text?.includes(ethAddress)) {
                        return true;
                    }
                }
            }
        }

        // Else: not verified
        return false;
    },
    getAccountLink: (account: string) => {
        const { username, instance } = spliceAccountString(account);
        return `https://${instance}/@${username}`;
    },
    get: async (account: string, sinceOffset: number = 0, untilTimeStamp: number = 0xffffffff): Promise<Content[]> => {
        const { instance } = spliceAccountString(account);
        const u = await getUser(account);
        if (u) {
            try {
                const reqData = {
                    userId: u.id,
                    includeReplies: false,
                    untilDate: untilTimeStamp * 1000,
                    limit: config.contentRequestLimit,
                    excludeNsfw: true,
                };
                const res = await axios.post(`https://${instance}/api/users/notes`, reqData);
                if (res.data) {
                    const notes = <Note[]>res.data;
                    const contents: Content[] = [];
                    for (const note of notes) {
                        contents.push({
                            id: note.id,
                            identity: account,
                            platform: 'Misskey',
                            type: 'Misskey',
                            info: {
                                title: '',
                                pre_content: note.text,
                                timestamp: Math.floor(Number(new Date(note.createdAt)) / 1000),
                                txHash: `https://${instance}/notes/${note.id}`,
                                link: `https://${instance}/notes/${note.id}`,
                            },
                        });
                    }
                    return contents;
                }
            } catch (e) {
                console.log(e);
            }
        }
        // Else or fail
        return [];
    },
};
