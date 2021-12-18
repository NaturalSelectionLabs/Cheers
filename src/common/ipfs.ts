import axios from 'axios';
import config from './config';

const IPFS = {
    upload: (file: File | Blob) => {
        return new Promise<string>(async (resolve, reject) => {
            if (file) {
                const pinataMetadataStringify = JSON.stringify({
                    name: 'Revery',
                });
                const formData = new FormData();
                formData.append('file', file);
                formData.append('cidVersion', '0');
                formData.append('pinataMetadata', pinataMetadataStringify);
                try {
                    const response = await axios.post(config.ipfs.upload.api.url, formData, {
                        baseURL: config.ipfs.upload.endpoint,
                        maxBodyLength: Infinity,
                        headers: {
                            'Content-Type': `multipart/form-data;`,
                            pinata_api_key: config.ipfs.upload.api.key,
                            pinata_secret_api_key: config.ipfs.upload.api.secret,
                        },
                    });
                    resolve('ipfs://' + response.data.IpfsHash);
                } catch (e) {
                    reject(e);
                }
            }
        });
    },
};

export default IPFS;
