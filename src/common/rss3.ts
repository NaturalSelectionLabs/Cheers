import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import RSS3 from 'rss3-next';

const infuraId = '76af1228cdf345d2bff6a9c0f35112e1';
const endpoint = 'https://rss3-asset-hub-g886a.ondigitalocean.app';

let rss3;
let web3;

async function walletConnect() {
    const provider = new WalletConnectProvider({
        infuraId: infuraId,
    });

    //  Enable session (triggers QR Code modal)
    await provider.enable();

    //  Create Web3 instance
    web3 = new Web3(provider);

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
        console.log(code, reason);
        rss3 = null;
    });

    const address = (await web3.eth.getAccounts())[0];

    console.log(address);

    rss3 = new RSS3({
        endpoint: endpoint,
        address: address,
        sign: async (data) => await web3.eth.personal.sign(data, address, ''),
    });

    return rss3;
}

async function metamaskConnect() {
    web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
    });
    const address = metaMaskWeb3.utils.toChecksumAddress(accounts[0]);

    console.log(address);

    rss3 = new RSS3({
        endpoint: endpoint,
        address: address,
        sign: async (data) => await web3.eth.personal.sign(data, address, ''),
    });

    return rss3;
}

export default {
    walletConnect: walletConnect(),
    metamaskConnect: metamaskConnect(),
    isValidRSS3: () => {
        return !!rss3;
    },
    get: async () => {
        if (!rss3) {
            await walletConnect();
        }
        return rss3;
    },
    addNewAccount: async (platform) => {
        if (!rss3) {
            await walletConnect();
        }
        const metaMaskWeb3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        const address = metaMaskWeb3.utils.toChecksumAddress(accounts[0]);

        const newAddress = {
            platform: platform,
            identity: mainAddr,
        };
        newAddress.signature = await metaMaskWeb3.eth.personal.sign(
            rss3.accounts.getSigMessage(newAddress),
            address,
            '',
        );
        await rss3.accounts.post(address);
        await rss3.files.sync();
    },
};
