import { ethers } from 'ethers';
import axios from 'axios';

type SPEED = 'fast' | 'average' | 'fastest' | 'safeLow' | undefined;

const config = {
    networks: {
        ropsten: {
            rnsAddr: '0xbe22076940636352860585809c32afb40611fff5',
        },
        localhost: {
            rnsAddr: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        },
    },
    contract: {
        // rns contract abi
        rnsABI: [
            {
                inputs: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                ],
                name: 'getAddress',
                outputs: [
                    {
                        internalType: 'address',
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'i',
                        type: 'uint256',
                    },
                ],
                name: 'getAddressByID',
                outputs: [
                    {
                        internalType: 'address',
                        name: '',
                        type: 'address',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'getN',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'addr',
                        type: 'address',
                    },
                ],
                name: 'getName',
                outputs: [
                    {
                        internalType: 'string',
                        name: '',
                        type: 'string',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                ],
                name: 'register',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
    },
};

async function callRNSContract(
    providerType: 'web3' | 'infura',
    speed: SPEED,
    method: string,
    ...args: any
): Promise<ethers.providers.TransactionResponse> {
    (window as any).ethereum.enable();
    let provider: ethers.providers.Web3Provider | ethers.providers.InfuraProvider;
    if (providerType === 'web3') {
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
    } else {
        provider = new ethers.providers.InfuraProvider('ropsten', process.env.INFURA_PROJECT_ID);
    }
    const signer = provider.getSigner();

    const contract = await new ethers.Contract(getRNSContract(), config.contract.rnsABI, signer);
    return contract[method](...args, await makeTxParams(speed));
}

async function makeTxParams(speed: SPEED): Promise<ethers.Overrides> {
    speed = speed ? speed : 'average';
    const gasPrice = (await axios.get('ethGas')).data; // TODO
    let gasGwei: string = '30';
    gasGwei = (gasPrice[speed] / 10).toString();
    return {
        gasLimit: 1000000,
        gasPrice: ethers.utils.parseUnits(gasGwei, 'gwei'),
    };
}

function getRNSContract() {
    const network = process.env.VUE_APP_NETWORK;
    if (network === 'ropsten') {
        return config.networks.ropsten.rnsAddr;
    } else if (network === 'localhost') {
        return config.networks.localhost.rnsAddr;
    } else {
        return '';
    }
}

export default {
    register(name: string, speed: SPEED = 'average') {
        return callRNSContract('web3', speed, 'register', name);
    },
    addr2Name(addr: string, speed: SPEED = 'average') {
        return callRNSContract('web3', speed, 'getName', addr);
    },
    name2Addr(name: string, speed: SPEED = 'average') {
        return callRNSContract('infura', speed, 'getAddress', name);
    },
};
