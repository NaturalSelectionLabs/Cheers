import axios from 'axios';
import config from '@/config';
import { Content } from './index';

export default {
    getAccountLink: (account: string) => {
        return `https://m.okjike.com/users/${account}`;
    },
    accountPostProcess: async (account: string) => {
        const throwErrpr = (msg) => {
            throw new Error(msg);
        };
        let uuid = '';
        try {
            const baseUrlObj = new URL(account);
            let fullUrl = '';
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
                    throwErrpr(
                        'Failed to get full URL (maybe caused by server limits), try again or input full URL manually?',
                    );
                }
            } else {
                fullUrl = account;
            }
            console.log(fullUrl);
            const fullUrlObj = new URL(fullUrl);
            uuid = fullUrlObj.pathname.split('/').pop() || '';
        } catch (e) {
            // is not URL
            uuid = account;
        }
        return uuid.replace(/-/g, '\\-');
    },
    accountStyle: 'UUID or share link',
    notice: 'What is a "share link": \n1. Click the share button at the right corner of your personal page\'s top bar.\n2. Click Copy Link button and paste it into the input box below.',
    availableFields: ['Bio'],
};
