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
    getAccountLink: (account: string) => {
        const { username, instance } = spliceAccountString(account);
        return `https://${instance}/@${username}`;
    },
};
