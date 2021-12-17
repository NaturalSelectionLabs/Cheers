interface ProductsDefine {
    schema: string;
    baseDomain: string;
    subDomainMode: boolean;
}

const productsList: {
    [key: string]: ProductsDefine;
} = {
    RSS3Bio: {
        schema: 'https://',
        baseDomain: 'rss3.bio',
        subDomainMode: true,
    },
};

const config = {
    hubEndpoint: 'https://node-beta.rss3.dev',
    undefinedImageAlt: 'https://infura-ipfs.io/ipfs/QmcK8FSTtLQVydLEDKLv1hEacLxZgi7j2i4mkQQMyKxv6k',
    hideUnlistedAssets: false,
    tags: {
        prefix: 'pass',
        hiddenTag: 'hidden',
    },
    productsList,
    fieldMaxLength: 280,
    walletConnectOptions: {
        rpc: {
            1: 'https://cloudflare-eth.com',
        },
        bridge: 'https://walletconnect-relay.rss3.dev',
    },
    contentRequestLimit: 5,
    contents: {
        limit: 35,
    },
    followListLimitPerPage: 15,
    recommendations: {
        endpoint: 'https://node-beta.rss3.dev',
        groupLimit: 5,
        userLimit: 10,
    },
    ipfs: {
        download: {
            endpoint: 'https://infura-ipfs.io/ipfs',
        },
        upload: {
            endpoint: 'https://api.pinata.cloud',
            api: {
                url: '/pinning/pinFileToIPFS',
                key: '7a1cd1286fddab8cb792',
                secret: 'eed51e69e8c6ffc04700f83597b46c617f275e9aae3218d9bbe037ea3889ad58',
            },
        },
    },
    rns: {
        suffix: '.rss3',
        serviceUrl: 'https://rss3.domains',
        smartContract: {
            networkID: '0x3',
            networkName: 'ropsten',
            contractAddress: {
                resolver: '0x028A03A4E9Af3f5E078938c69b88740E81391A6a',
                token: '0x63CfEB343975116Ec2fc27125609da236D066615',
            },
            contract: {
                // rns contract abi
                resolver: [
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: true,
                                internalType: 'bytes32',
                                name: '_node',
                                type: 'bytes32',
                            },
                            {
                                indexed: false,
                                internalType: 'address',
                                name: '_addr',
                                type: 'address',
                            },
                        ],
                        name: 'AddrChanged',
                        type: 'event',
                    },
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: true,
                                internalType: 'bytes32',
                                name: '_node',
                                type: 'bytes32',
                            },
                            {
                                indexed: false,
                                internalType: 'string',
                                name: '_name',
                                type: 'string',
                            },
                        ],
                        name: 'NameChanged',
                        type: 'event',
                    },
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'previousOwner',
                                type: 'address',
                            },
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'newOwner',
                                type: 'address',
                            },
                        ],
                        name: 'OwnershipTransferred',
                        type: 'event',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'bytes32',
                                name: '_node',
                                type: 'bytes32',
                            },
                        ],
                        name: 'addr',
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
                                internalType: 'bytes32',
                                name: '_node',
                                type: 'bytes32',
                            },
                        ],
                        name: 'name',
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
                        inputs: [],
                        name: 'owner',
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
                        name: 'renounceOwnership',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'bytes32',
                                name: '_node',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'address',
                                name: '_addr',
                                type: 'address',
                            },
                        ],
                        name: 'setAddr',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'bytes32',
                                name: '_node',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'string',
                                name: '_name',
                                type: 'string',
                            },
                        ],
                        name: 'setName',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'bytes4',
                                name: '_interfaceId',
                                type: 'bytes4',
                            },
                        ],
                        name: 'supportsInterface',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'view',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'newOwner',
                                type: 'address',
                            },
                        ],
                        name: 'transferOwnership',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                ],
                token: [
                    {
                        inputs: [],
                        stateMutability: 'nonpayable',
                        type: 'constructor',
                    },
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'owner',
                                type: 'address',
                            },
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'spender',
                                type: 'address',
                            },
                            {
                                indexed: false,
                                internalType: 'uint256',
                                name: 'value',
                                type: 'uint256',
                            },
                        ],
                        name: 'Approval',
                        type: 'event',
                    },
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'to',
                                type: 'address',
                            },
                            {
                                indexed: false,
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        name: 'Mint',
                        type: 'event',
                    },
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'previousOwner',
                                type: 'address',
                            },
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'newOwner',
                                type: 'address',
                            },
                        ],
                        name: 'OwnershipTransferred',
                        type: 'event',
                    },
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: false,
                                internalType: 'string',
                                name: 'label',
                                type: 'string',
                            },
                            {
                                indexed: false,
                                internalType: 'address',
                                name: 'owner',
                                type: 'address',
                            },
                        ],
                        name: 'Registered',
                        type: 'event',
                    },
                    {
                        anonymous: false,
                        inputs: [
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'from',
                                type: 'address',
                            },
                            {
                                indexed: true,
                                internalType: 'address',
                                name: 'to',
                                type: 'address',
                            },
                            {
                                indexed: false,
                                internalType: 'uint256',
                                name: 'value',
                                type: 'uint256',
                            },
                        ],
                        name: 'Transfer',
                        type: 'event',
                    },
                    {
                        inputs: [],
                        name: 'DOMAIN_SEPARATOR',
                        outputs: [
                            {
                                internalType: 'bytes32',
                                name: '',
                                type: 'bytes32',
                            },
                        ],
                        stateMutability: 'view',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: 'PERMIT_TYPEHASH',
                        outputs: [
                            {
                                internalType: 'bytes32',
                                name: '',
                                type: 'bytes32',
                            },
                        ],
                        stateMutability: 'view',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: 'REGISTRATION_COST',
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
                        inputs: [],
                        name: 'RegistreForOtherTerminated',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'view',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: '_pass3Registrar',
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
                        name: 'acceptOwnership',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'owner',
                                type: 'address',
                            },
                            {
                                internalType: 'address',
                                name: 'spender',
                                type: 'address',
                            },
                        ],
                        name: 'allowance',
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
                                name: 'spender',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        name: 'approve',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'account',
                                type: 'address',
                            },
                        ],
                        name: 'balanceOf',
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
                        inputs: [],
                        name: 'cancelOwnershipTransfer',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: 'decimals',
                        outputs: [
                            {
                                internalType: 'uint8',
                                name: '',
                                type: 'uint8',
                            },
                        ],
                        stateMutability: 'view',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'spender',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'subtractedValue',
                                type: 'uint256',
                            },
                        ],
                        name: 'decreaseAllowance',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'spender',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'addedValue',
                                type: 'uint256',
                            },
                        ],
                        name: 'increaseAllowance',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'to',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        name: 'mint',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: 'name',
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
                                internalType: 'address',
                                name: '',
                                type: 'address',
                            },
                        ],
                        name: 'nonces',
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
                        inputs: [],
                        name: 'owner',
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
                                internalType: 'address',
                                name: 'owner',
                                type: 'address',
                            },
                            {
                                internalType: 'address',
                                name: 'spender',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'value',
                                type: 'uint256',
                            },
                            {
                                internalType: 'uint256',
                                name: 'deadline',
                                type: 'uint256',
                            },
                            {
                                internalType: 'uint8',
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                internalType: 'bytes32',
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'bytes32',
                                name: 's',
                                type: 'bytes32',
                            },
                        ],
                        name: 'permit',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'string',
                                name: 'label',
                                type: 'string',
                            },
                        ],
                        name: 'register',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'string',
                                name: 'label',
                                type: 'string',
                            },
                            {
                                internalType: 'address',
                                name: 'owner_',
                                type: 'address',
                            },
                        ],
                        name: 'registerForOther',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: 'registrable',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'view',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: 'renounceOwnership',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: '_pass3Registrar_',
                                type: 'address',
                            },
                        ],
                        name: 'setENSRegistrar',
                        outputs: [],
                        stateMutability: 'nonpayable',
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
                        name: 'setRegisterRole',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'bool',
                                name: 'registrable_',
                                type: 'bool',
                            },
                        ],
                        name: 'setRegistrable',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [],
                        name: 'symbol',
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
                        inputs: [],
                        name: 'totalSupply',
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
                                name: 'recipient',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        name: 'transfer',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                internalType: 'address',
                                name: 'recipient',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                        ],
                        name: 'transferFrom',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                    {
                        inputs: [
                            {
                                internalType: 'address',
                                name: 'nextOwner_',
                                type: 'address',
                            },
                        ],
                        name: 'transferOwnership',
                        outputs: [],
                        stateMutability: 'nonpayable',
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
                        name: 'valid',
                        outputs: [
                            {
                                internalType: 'bool',
                                name: '',
                                type: 'bool',
                            },
                        ],
                        stateMutability: 'pure',
                        type: 'function',
                    },
                ],
            },
        },
    },
};

export default config;
