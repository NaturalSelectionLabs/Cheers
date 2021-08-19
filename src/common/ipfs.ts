const axios = require('axios');

export default {
    upload: (file: File | Blob) => {
        return new Promise<string>(async (resolve) => {
            if (file) {
                let pinataMetadataStringify = JSON.stringify({
                    name: 'RSS3Page',
                });
                const formData = new FormData();
                formData.append('file', file);
                formData.append('cidVersion', '0');
                formData.append('pinataMetadata', pinataMetadataStringify);
                const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data;`,
                        pinata_api_key: '7a1cd1286fddab8cb792',
                        pinata_secret_api_key: 'eed51e69e8c6ffc04700f83597b46c617f275e9aae3218d9bbe037ea3889ad58',
                    },
                });
                resolve('https://rss3.mypinata.cloud/ipfs/' + response.data.IpfsHash);
            }
        });
    },
};
