import { ethers } from 'ethers';
import axios from 'axios';
import config from '@/config';
import { namehash } from 'ethers/lib/utils';

type SPEED = 'fast' | 'average' | 'fastest' | 'safeLow' | undefined;
type CNAME = 'resolver' | 'token';
async function callRNSContract(
    cname: CNAME,
    providerType: 'web3' | 'infura',
    speed: SPEED,
    method: string,
    ...args: any
): Promise<ethers.providers.TransactionResponse> {
    (window as any).ethereum.enable();
    let provider: ethers.providers.Web3Provider | ethers.providers.InfuraProvider;
    let signer; // TODO
    if (providerType === 'web3') {
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
        signer = provider.getSigner();
    } else {
        provider = new ethers.providers.InfuraProvider(config.rns.test ? 'ropsten' : 'homestead', {
            projectId: config.rns.infuraProjectId,
        });
    }

    const contract = await new ethers.Contract(
        getRNSContract(cname),
        config.rns.contract[cname],
        signer ? signer : provider,
    );
    let isView = false;
    const abi = config.rns.contract[cname].find((item: any) => item.name === 'view');
    if (abi) {
        isView = abi.stateMutability === 'view';
    }
    return contract[method](...args, isView ? null : await makeTxParams(speed));
}

async function makeTxParams(speed: SPEED): Promise<ethers.Overrides> {
    speed = speed ? speed : 'average';
    const gasPrice = (
        await axios.get('https://ethgasstation.info/api/ethgasAPI.json', {
            params: {
                'api-key': '403f08c04612ca8c165ae6855136505f7acf017b2662126699e43a874ef6',
            },
        })
    ).data;
    let gasGwei: string = '30';
    gasGwei = (gasPrice[speed] / 10).toString();
    return {
        gasLimit: 1000000,
        gasPrice: ethers.utils.parseUnits(gasGwei, 'gwei'),
    };
}

function getRNSContract(cname: CNAME) {
    if (config.rns.test) {
        return config.rns.contractNetworks.ropsten[cname];
    } else {
        return '';
    }
}

export default {
    async register(name: string, speed: SPEED = 'average') {
        return callRNSContract('token', 'web3', speed, 'register', name);
    },
    addr2Name(addr: string, speed: SPEED = 'average') {
        //TODO
        return callRNSContract('resolver', 'web3', speed, 'getName', addr);
    },
    name2Addr(name: string, speed: SPEED = 'average') {
        return callRNSContract('resolver', 'infura', speed, 'addr', namehash(name));
    },
};
