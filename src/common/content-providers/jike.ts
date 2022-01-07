import axios from 'axios';
import config from '@/config';
import { Content } from './index';

export default {
    getAccountLink: (account: string) => {
        return `https://m.okjike.com/users/${account}`;
    },
    accountPostProcess: (account: string) => {
        return account.replace(/-/gi, '\\-');
    },
    accountStyle: 'UUID',
    availableFields: ['Bio'],
};
