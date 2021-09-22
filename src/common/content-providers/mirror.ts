import axios from 'axios';
import config from '@/config';
import { Content } from './index';

export default {
    verify: async () => {
        return true;
    },
    get: async (address: string, sinceOffset: number = 0, untilTimeStamp: number = 0xffffffff): Promise<Content[]> => {
        try {
            // const res = await axios.get(`${config.hubEndpoint}/asset-profile/${address}/mirror-xyz/?offset=${sinceOffset}&limit=${config.contentRequestLimit}&latest=${untilTimeStamp}`);
            const res = await axios.get(
                `http://143.244.186.198:3000/asset-profile/0x9C159121CEEBF937E9bad98fd0c895d7f6038bd4/mirror-xyz/?key=f09f15D9034732172bC187Cb7e810dEA3A3CfF8c&offset=${sinceOffset}&limit=${config.contentRequestLimit}&latest=${untilTimeStamp}`,
            );
            if (res.data?.status) {
                return res.data.assets;
            }
        } catch (e) {
            console.log(e);
        }
        return [];
    },
};
