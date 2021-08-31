export default {
    rns: {
        test: true,
        infuraProjectId: '76af1228cdf345d2bff6a9c0f35112e1',
        contractNetworks: {
            ropsten: {
                rnsAddr: '0xbe22076940636352860585809c32afb40611fff5',
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
    },
};
