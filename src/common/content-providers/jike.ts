import axios from 'axios';
import config from '@/config';
import { Content } from './index';

export default {
    getAccountLink: (account: string) => {
        return `https://m.okjike.com/users/${account}`;
    },
    accountPostProcess: async (account: string) => {
        let uuid = '';
        if (account.startsWith('https://')) {
            // Is link
            let fullUrl = '';
            const baseUrlObj = new URL(account);
            if (baseUrlObj.host !== 'm.okjike.com') {
                // 302 redirect
                try {
                    const res = await axios.get('https://undirect.rss3.dev', {
                        params: {
                            url: encodeURIComponent(account),
                        },
                    });
                    fullUrl = res.data.data;
                } catch (e) {
                    console.log('Fetch error', e);
                    throw new Error(
                        'Failed to get full URL (maybe caused by server limits), try again or input full URL manually?',
                    );
                }
                // throw new Error(
                //     'Should be full (https://m.okjike.com/users/...), maybe open current link at browser, wait for redirections and copy the final URL?',
                // );
            } else {
                fullUrl = account;
            }
            const fullUrlObj = new URL(fullUrl);
            uuid = fullUrlObj.pathname.split('/').pop() || '';
        } else {
            uuid = account;
        }
        return uuid.replace(/-/g, '\\-');
    },
    accountStyle: 'UUID or share link',
    availableFields: ['Bio'],
};
