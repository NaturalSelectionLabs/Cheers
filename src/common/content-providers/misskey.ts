import axios from 'axios';

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
    getNotes: async (account: string, sinceDate?: string, untilDate?: string): Promise<Note[]> => {
        const { instance } = spliceAccountString(account);
        const u = await getUser(account);
        if (u) {
            try {
                const reqData = {
                    userId: u.id,
                    sinceDate,
                    untilDate,
                    limit: 20,
                    excludeNsfw: true,
                };
                const res = await axios.post(`https://${instance}/api/users/notes`, reqData);
                if (res.data) {
                    return <Note[]>res.data;
                }
            } catch (e) {
                console.log(e);
            }
        }
        // Else or fail
        return [];
    },
};
