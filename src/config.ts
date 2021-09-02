export default {
    rns: {
        test: true,
        infuraProjectId: '76af1228cdf345d2bff6a9c0f35112e1',
        contractNetworks: {
            ropsten: {
                resolver: '0x1eC9D936099Fb5953cC3F72a7D944bB84E38Bedd',
                token: '0xc05aD0b90E58ce1774Ee0B210319126D9DC67549',
            },
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
                    name: 'REGISTRATION_COST',
                    outputs: [
                        {
                            internalType: 'uint256',
                            name: '',
                            type: 'uint256',
                        },
                    ],
                    stateMutability: 'pure',
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
                            name: 'owner',
                            type: 'address',
                        },
                    ],
                    name: 'registerForOther',
                    outputs: [],
                    stateMutability: 'nonpayable',
                    type: 'function',
                },
            ],
        },
    },
};
