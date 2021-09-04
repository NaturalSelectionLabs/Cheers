import { ethers } from 'ethers';
import axios from 'axios';
import config from '@/config';
import { utils } from 'ethers/lib';

type SPEED = 'fast' | 'average' | 'fastest' | 'safeLow' | undefined;
type CNAME = 'resolver' | 'token';
async function callRNSContract<T>(
    cname: CNAME,
    providerType: 'web3' | 'infura',
    speed: SPEED,
    method: string,
    ...args: any
): Promise<T> {
    (window as any).ethereum?.enable();
    let provider: ethers.providers.Web3Provider | ethers.providers.InfuraProvider;
    let signer; // TODO
    if (providerType === 'web3') {
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
        signer = provider.getSigner();
    } else {
        provider = new ethers.providers.InfuraProvider(config.rns.test ? 'ropsten' : 'homestead', {
            projectId: config.infuraId,
        });
    }

    const contract = await new ethers.Contract(
        getRNSContract(cname),
        config.rns.contract[cname],
        signer ? signer : provider,
    );
    let isView = false;
    const abi = config.rns.contract[cname].find((item: any) => item.name === method);
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

// sha3HexAddress https://eips.ethereum.org/EIPS/eip-181
function sha3HexAddress(addr: string) {
    addr = '00' + addr.slice(2);
    const lookup = '3031323334353637383961626364656600000000000000000000000000000000';
    let res = '';
    for (let i = 40; i > 0; i--) {
        const bit = Number('0x' + addr.slice(i, i + 2)) & 0xf;
        res = lookup.slice(2 * bit, 2 * bit + 2) + res;
    }
    return utils.keccak256('0x' + res);
}

export default {
    async register(name: string, speed: SPEED = 'average') {
        return callRNSContract<ethers.providers.TransactionResponse>('token', 'web3', speed, 'register', name);
    },
    addr2Name(addr: string, speed: SPEED = 'average') {
        const reverseNode = '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';
        const addrHex = sha3HexAddress(addr.toLowerCase());
        const node = utils.keccak256(utils.defaultAbiCoder.encode(['bytes32', 'bytes32'], [reverseNode, addrHex]));
        return callRNSContract<string>('resolver', 'infura', speed, 'name', node);
    },
    name2Addr(name: string, speed: SPEED = 'average') {
        return callRNSContract<string>('resolver', 'infura', speed, 'addr', utils.namehash(name));
    },
    async balanceOfPass3(addr: string, speed: SPEED = 'average') {
        const balance = await callRNSContract<ethers.BigNumber>('token', 'web3', speed, 'balanceOf', addr);
        return Number(ethers.utils.formatUnits(balance, 18));
    },
};
