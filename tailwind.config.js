module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            borderRadius: {
                sm: '12px',
                DEFAULT: '20px',
            },
            borderWidth: {
                xs: '1px',
                sm: '2px',
                DEFAULT: '4px',
            },
            colors: {
                primary: '#0072FF',
                white: '#fff',
                black: '#000',
                account: {
                    button: '#40D22F',
                    title: '#13BD00',
                    bg: '#F6FFF5',
                },
                nft: {
                    button: '#7553FF',
                    title: '#2D00E0',
                    bg: '#F7F5FF',
                },
                content: {
                    button: '#178BFF',
                    title: '#0070E0',
                    bg: '#F5FAFF',
                },
                gitcoin: {
                    button: '#02E2AC',
                    title: '#11BC92',
                    bg: '#F4FFFB',
                },
                gray: {
                    bg: '#F4F7F8',
                },
                success: '#00c700',
                danger: '#b01a0a',
                metamask: {
                    text: '#944300',
                    bg: '#fff4eb',
                },
                error: '#D75F5F',
                pending: {
                    bg: '#DDECFF',
                },
                top: {
                    title: '#FFDB4C',
                    bg: '#FFDB4C1A',
                },
                earliest: {
                    title: '#F579A6',
                    bg: '#F579A61A',
                },
                share: {
                    bg: '#FFF8F8',
                },
            },
            boxShadow: {
                blank: '5px 10px 22px rgba(0, 0, 0, 0.25);', // using on the share card
                primary: '0px 9px 35px -7px rgba(0, 114, 255, 0.94)', //primary blue button shadow
                secondary: '0px 9px 35px -7px rgba(55, 155, 255, 0.72)', //white button shadow with primary blue text
                'primary-card': '0px 9px 18px -9px rgba(55, 155, 255, 0.25);', //follower card shadow
                metamask: '0px 8px 12px 5px rgba(246, 133, 27, 0.18)', //cream-colored button shadow
                account: '0px 4px 9px 1px rgba(64, 210, 47, 0.68)', //solid green button shadow for accounts
                'account-sm': '0px 4px 16px -6px rgba(19, 189, 0, 0.78)', // show/hide white button shadow for accounts
                nft: '0px 9px 35px -7px rgba(117, 83, 255, 0.94)', //solid purple button shadow for nfts
                'nft-sm': '0px 4px 16px -6px rgba(117, 83, 255, 0.78)', // show/hide white button shadow for nfts
                content: '0px 9px 35px -7px rgba(55, 155, 255, 0.94)', //solid blue button shadow for contents
                'content-sm': '-2px 2px 4px rgba(36, 146, 255, 0.13)', //content item card shadow
                'content-md': '0px 2px 13px -5px rgba(23, 139, 255, 0.76)', //content white small button shadow
                gitcoin: '0px 9px 35px -7px rgba(71, 228, 191, 1)',
                'gitcoin-sm': '-1px 2px 7px 0px rgba(17, 188, 146, 0.21)',
                'gitcoin-md': '0px 3px 8px 1px rgba(17, 188, 146, 0.2)',
                'share-card': '9px 19px 22px rgba(0, 0, 0, 0.25)', // share card shadow
            },
            dropShadow: {
                account: '-4px 4px 5px rgba(17, 170, 0, 0.12)', //account item shadow
                nft: '-2px 4px 5px rgba(45, 0, 225, 0.12)', //nft item shadow & detail content card shadow
            },
            opacity: {
                30: '0.2', //input label
                35: '0.35', //disabled button/items
                60: '0.6', //overlay
            },
            spacing: {
                0.5: '0.125rem', //2px
                1: '0.25rem', //4px
                2: '0.5rem', //8px
                2.5: '0.625rem', //10px
                4: '1rem', //16px
                5: '1.25rem', //20px
                7: '1.75rem', //28px
                8: '2rem', //32px
                9: '2.25rem', //36px
                13: '3.25rem',
                17.5: '4.375rem', // 70px
                18.5: '4.625rem', // 74px
                83.5: '20.875rem', // 334px
                72: '18rem', //288px
            },
            lineHeight: {
                17.5: '4.375rem', // 70px
            },
            fontFamily: {
                'sf-compact-rounded': 'SFCompactRounded, sans-serif',
            },
            width: {
                27: '6.75rem', //108px, scan tag width
                45: '11.25rem', //180px, discard & save button width,
                50: '12.5rem', //200px
            },
            height: {
                50: '12.5rem', //200px
            },
            backgroundImage: (theme) => ({
                BSC: "url('@/assets/images/chains/BSC.png')",
                Ethereum: "url('@/assets/images/chains/Ethereum.png')",
                Ronin: "url('@/assets/images/chains/Ronin.png')",
                Etherscan: "url('@/assets/images/scans/Etherscan.png')",
                Roninscan: "url('@/assets/images/scans/Roninscan.png')",
                bscscan: "url('@/assets/images/scans/bscscan.png')",
                opensea: "url('@/assets/images/marketplaces/OpenSea.png')",
                rarible: "url('@/assets/images/marketplaces/rarible.png')",
                pass3gif: 'url(@/assets/images/pass3.gif)',
                pass3logo: 'url(@/assets/images/pass3logo.svg)',
                pass3gradient:
                    'linear-gradient(172.52deg, #0072FF -40.83%, #96C5FF -3.21%, #DDECFF 28.66%, #FFFFFF 44.01%);',
            }),
            backgroundSize: {
                85: '85%',
            },
            zIndex: {
                '-10': '-10',
                '-5': '-5',
            },
        },
        minHeight: {
            20: '5rem', // Min height of card content
        },
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            backgroundOpacity: ['active'],
            textColor: ['active'],
            borderColor: ['active'],
            display: ['group-hover'],
            fill: ['active', 'focus'],
            transfrom: ['active'],
            translate: ['active'],
        },
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/line-clamp')],
};
