import axios from 'axios';
import config from '@/config';
import { Content } from './index';

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

export default {
    getAccountLink: (account: string) => {
        const { username, instance } = spliceAccountString(account);
        return `https://${instance}/@${username}`;
    },
};
