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
                // try {
                //     const res = await fetch(account, {
                //         mode: 'no-cors',
                //         redirect: 'manual',
                //     });
                //     console.log('Fetch response: ', res);
                //     fullUrl = res.url;
                //     console.log('Full URL:', fullUrl);
                // } catch (e) {
                //     console.log('Fetch error', e);
                // }
                // Since the whole code is not working, only full URL can be accepted.
                throw new Error(
                    'Should be full (https://m.okjike.com/users/...), maybe open the current link at browser, wait for redirections and copy the final URL?',
                );
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
    accountStyle: 'UUID or full share link',
    availableFields: ['Bio'],
};
