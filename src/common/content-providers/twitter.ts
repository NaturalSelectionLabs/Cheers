import axios from 'axios';
import config from '@/config';
import { Content } from './index';

export default {
    verify: async (account: string, rns: string, ethAddress: string): Promise<boolean> => {
        // Let hub to do the verify works
        return true;
    },
    // get: async (address: string, sinceOffset: number = 0, untilTimeStamp: number = 0xffffffff): Promise<Content[]> => {
    //     try {
    //         const res = await axios.get(
    //             `${config.hubEndpoint}/asset-profile/${address}/contents/?offset=${sinceOffset}&limit=${config.contentRequestLimit}&latest=${untilTimeStamp}`,
    //         );
    //         if (res.data?.status) {
    //             return res.data.assets;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     return [];
    // },
};
