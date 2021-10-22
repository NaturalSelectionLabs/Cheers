import axios from 'axios';
import config from '@/config';
import { Content } from './index';

export default {
    verify: async () => {
        return true;
    },
    get: async (address: string, untilTimeStamp: number = 0xffffffff): Promise<Content[]> => {
        try {
            const res: any = await axios.get(`${config.hubEndpoint}/assets/list`, {
                params: {
                    personaID: address,
                    limit: config.contentRequestLimit,
                    latest: untilTimeStamp,
                    type: 'Twitter|Misskey|Mirror-XYZ',
                },
            });
            if (res.data?.status) {
                return res.data.assets;
            }
        } catch (e) {
            console.log(e);
        }
        return [];
    },
};
