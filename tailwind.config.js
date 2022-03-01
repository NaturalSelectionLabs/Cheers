module.exports = {
    content: [
        // './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            borderRadius: {
                sm: '12px',
                DEFAULT: '20px',
            },
            borderWidth: {
                xs: '1px',
                sm: '2px',
                DEFAULT: '2px',
                card: '0px',
                button: '0px',
                input: '0px',
                modal: '0px',
                link: '0xp',
            },
            colors: {
                primary: {
                    text: '#FED581',
                    btn: '#FED581',
                },
                secondary: {
                    btn: '#FED58133',
                    'btn-card': '#fff',
                },
                white: '#fff',
                black: '#000',
                body: {
                    text: '#2F2F2D',
                },
                // todo: update colors of account settings page
                account: {
                    border: 'transparent',
                    title: '#13bd00',
                    bg: '#f6fff5',
                    'btn-m': '#40d22f',
                    'btn-m-text': '#fff',
                    'btn-m-border': 'transparent',
                    'btn-s': '#fff',
                    'btn-s-text': '#40d22f',
                    'btn-s-border': 'transparent',
                },
                gray: {
                    bg: '#F4F7F8',
                },
                input: {
                    bg: '#f4f7f8',
                    border: 'transparent',
                },
                item: {
                    bg: '#fff',
                    border: '#fff',
                },
                card: {
                    bg: '#F4F4F460',
                    hide: '#f7fafc',
                    overlay: '#e2e8f0',
                },
                btn: {
                    icon: '#F8B808',
                    border: '#f7fafc',
                    disabled: 'transparent',
                },
                modal: {
                    bg: '#fff',
                    border: 'transparent',
                },
                success: '#00c700',
                danger: '#b01a0a',
                walletConnect: '#0072ff',
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
            opacity: {
                20: '0.2', //input label
                30: '0.3',
                35: '0.35', //disabled button/items
                60: '0.6', //overlay
            },
            backgroundOpacity: {
                10: '0.1',
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
                68: '17rem', //272px
            },
            lineHeight: {
                17.5: '4.375rem', // 70px
            },
            fontFamily: {
                'sf-compact-rounded': 'SFCompactRounded, sans-serif',
                serif: 'Times New Roman, SourceHanSerif, SourceHanSerifSC, SourceHanSerifTC, SourceHanSerifK, Times, serif',
            },
            width: {
                19: '4.875rem', //78px, footprint item in footprint card
                22: '5.25rem', //84px, profile avatar width
                27: '6.75rem', //108px, scan tag width
                33: '8.35rem', // 136px
                45: '11.25rem', //180px, discard & save button width,
                50: '12.5rem', //200px
                67: '17.5rem', //272px
                90: '22.5rem', //360px
            },
            height: {
                19: '4.875rem',
                22: '5.25rem', //84px, profile avatar height
                50: '12.5rem', //200px
                72: '18rem',
                112: '28rem',
                120: '30rem',
                160: '40rem',
                'screen-30': '30vh',
                'screen-60': '60vh',
            },
            backgroundImage: (theme) => ({
                EVM: 'url(@/assets/images/chains/evm.png)',
                BSC: 'url(@/assets/images/chains/BSC.png)',
                Ethereum: 'url(@/assets/images/chains/Ethereum.png)',
                Polygon: 'url(@/assets/images/chains/Polygon.png)',
                Arbitrum: 'url(@/assets/images/chains/Arbitrum.png)',
                Avalanche: 'url(@/assets/images/chains/Avalanche.png)',
                Ronin: 'url(@/assets/images/chains/Ronin.png)',
                Misskey: 'url(@/assets/images/chains/Misskey.png)',
                Twitter: 'url(@/assets/images/chains/Twitter.png)',
                Jike: 'url(@/assets/images/chains/Jike.png)',
                Solana: 'url(@/assets/images/chains/Solana.png)',
                Roninscan: 'url(@/assets/images/scans/Roninscan.png)',
            }),
            backgroundSize: {
                85: '85%',
                200: '200px',
            },
            zIndex: {
                '-10': '-10',
                '-5': '-5',
            },
        },
        minHeight: {
            0: '0rem',
            20: '5rem', // Min height of card content
            28: '7rem', // min height of trans bar card
        },
        maxHeight: {
            36: '9rem',
            96: '24rem',
            112: '28rem',
            128: '32rem',
        },
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp'),
        require('tailwind-scrollbar-hide'),
    ],
};
