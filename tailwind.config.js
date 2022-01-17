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
                card: 'var(--border-width-card)',
                button: 'var(--border-width-button)',
                input: 'var(--border-width-input)',
                modal: 'var(--border-width-modal)',
                link: 'var(--border-width-linkbutton)',
            },
            colors: {
                primary: {
                    text: '#0072FF',
                    btn: 'var(--color-primary-btn)',
                    'btn-text': 'var(--color-primary-btn-text)',
                    'btn-border': 'var(--color-primary-btn-border)',
                    link: 'var(--color-linkbutton-bg)',
                    'link-border': 'var(--color-linkbutton-border)',
                },
                secondary: {
                    btn: 'var(--color-secondary-btn)',
                    'btn-text': 'var(--color-secondary-btn-text)',
                    'btn-border': 'var(--color-secondary-btn-border)',
                },
                white: '#fff',
                black: '#000',
                body: {
                    bg: 'var(--color-body-bg)',
                    text: 'var(--color-body-text)',
                },
                account: {
                    border: 'var(--color-account-border)',
                    title: 'var(--color-account-title)',
                    bg: 'var(--color-account-bg)',
                    'btn-m': 'var(--color-account-btn-m)',
                    'btn-m-text': 'var(--color-account-btn-m-text)',
                    'btn-m-border': 'var(--color-account-btn-m-border)',
                    'btn-s': 'var(--color-account-btn-s)',
                    'btn-s-text': 'var(--color-account-btn-s-text)',
                    'btn-s-border': 'var(--color-account-btn-s-border)',
                },
                nft: {
                    border: 'var(--color-nft-border)',
                    title: 'var(--color-nft-title)',
                    bg: 'var(--color-nft-bg)',
                    'btn-m': 'var(--color-nft-btn-m)',
                    'btn-m-text': 'var(--color-nft-btn-m-text)',
                    'btn-m-border': 'var(--color-nft-btn-m-border)',
                    'btn-s': 'var(--color-nft-btn-s)',
                    'btn-s-text': 'var(--color-nft-btn-s-text)',
                    'btn-s-border': 'var(--color-nft-btn-s-border)',
                    'tag-border': 'var(--color-nft-tag-border)',
                    'tag-bg': 'var(--color-nft-tag-bg)',
                    trait: {
                        bg: 'var( --color-nft-trait-bg)',
                        type: 'var(--color-nft-trait-type)',
                        border: 'var(--color-nft-trait-border)',
                    },
                },
                gitcoin: {
                    border: 'var(--color-gitcoin-border)',
                    // button: '#02E2AC',
                    title: 'var(--color-gitcoin-title)',
                    bg: 'var(--color-gitcoin-bg)',
                    'btn-m': 'var(--color-gitcoin-btn-m)',
                    'btn-m-text': 'var(--color-gitcoin-btn-m-text)',
                    'btn-m-border': 'var(--color-gitcoin-btn-m-border)',
                    'btn-s': 'var(--color-gitcoin-btn-s)',
                    'btn-s-text': 'var(--color-gitcoin-btn-s-text)',
                    'btn-s-border': 'var(--color-gitcoin-btn-s-border)',
                },
                content: {
                    border: 'var(--color-content-border)',
                    title: 'var(--color-content-title)',
                    bg: 'var(--color-content-bg)',
                    'btn-m': 'var(--color-content-btn-m)',
                    'btn-m-text': 'var(--color-content-btn-m-text)',
                    'btn-m-border': 'var(--color-content-btn-m-border)',
                    'btn-s': 'var(--color-content-btn-s)',
                    'btn-s-text': 'var(--color-content-btn-s-text)',
                    'btn-s-border': 'var(--color-content-btn-s-border)',
                    divider: 'var(--color-content-divider)',
                },
                footprint: {
                    border: 'var(--color-footprint-border)',
                    title: 'var(--color-footprint-title)',
                    bg: 'var(--color-footprint-bg)',
                    'btn-m': 'var(--color-footprint-btn-m)',
                    'btn-m-text': 'var(--color-footprint-btn-m-text)',
                    'btn-m-border': 'var(--color-footprint-btn-m-border)',
                    'btn-s': 'var(--color-footprint-btn-s)',
                    'btn-s-text': 'var(--color-footprint-btn-s-text)',
                    'btn-s-border': 'var(--color-footprint-btn-s-border)',
                    divider: 'var(--color-footprint-divider)',
                },
                gray: {
                    bg: '#F4F7F8',
                },
                input: {
                    bg: 'var(--color-input-bg)',
                    border: 'var(--color-input-border)',
                },
                item: {
                    bg: 'var(--color-item-bg)',
                    border: 'var(--color-item-border)',
                },
                card: {
                    hide: 'var(--color-card-hide)',
                    overlay: 'var(--color-card-overlay)',
                },
                btn: {
                    border: 'var(--color-btn-border)',
                    disabled: 'var(--color-btn-disabled)',
                },
                modal: {
                    bg: 'var(--color-modal-bg)',
                    border: 'var(--color-modal-border)',
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
                metamask: '0px 8px 12px 5px rgba(246, 133, 27, 0.18)', //cream-colored button shadow
                'primary-btn': 'var(--shadow-primary-btn)',
                'secondary-btn': 'var(--shadow-secondary-btn)',
                'follow-card': 'var(--shadow-follow-card)',
                account: 'var(--shadow-account-item)',
                'account-item': 'var(--shadow-account-item)',
                'account-btn-s': 'var(--shadow-account-btn-s)',
                'account-btn-m': 'var(--shadow-account-btn-m)',
                nft: 'var(--shadow-nft-item)',
                'nft-item': 'var(--shadow-nft-item)',
                'nft-btn-s': 'var(--shadow-nft-btn-s)',
                'nft-btn-m': 'var(--shadow-nft-btn-m)',
                gitcoin: 'var(--shadow-gitcoin-item)',
                'gitcoin-item': 'var(--shadow-gitcoin-item)',
                'gitcoin-btn-s': 'var(--shadow-gitcoin-btn-s)',
                'gitcoin-btn-m': 'var(--shadow-gitcoin-btn-m)',
                content: 'var(--shadow-content-item)',
                'content-item': 'var(--shadow-content-item)',
                'content-btn-s': 'var(--shadow-content-btn-s)',
                'content-btn-m': 'var(--shadow-content-btn-m)',
                footprint: 'var(--shadow-footprint-item)',
                'footprint-item': 'var(--shadow-footprint-item)',
                'footprint-btn-s': 'var(--shadow-footprint-btn-s)',
                'footprint-btn-m': 'var(--shadow-footprint-btn-m)',
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
                45: '11.25rem', //180px, discard & save button width,
                50: '12.5rem', //200px
            },
            height: {
                19: '4.875rem',
                22: '5.25rem', //84px, profile avatar height
                50: '12.5rem', //200px
                72: '18rem',
                112: '28rem',
                'screen-30': '30vh',
                'screen-60': '60vh',
            },
            backgroundImage: (theme) => ({
                EVM: 'url(@/assets/images/chains/evm.png)',
                BSC: 'url(@/assets/images/chains/BSC.png)',
                Ethereum: 'url(@/assets/images/chains/Ethereum.png)',
                Polygon: 'url(@/assets/images/chains/Polygon.png)',
                Ronin: 'url(@/assets/images/chains/Ronin.png)',
                Misskey: 'url(@/assets/images/chains/Misskey.png)',
                Twitter: 'url(@/assets/images/chains/Twitter.png)',
                Jike: 'url(@/assets/images/chains/Jike.png)',
                Solana: 'url(@/assets/images/chains/Solana.png)',
                Roninscan: 'url(@/assets/images/scans/Roninscan.png)',
                pass3gif: 'url(@/assets/images/pass3.gif)',
                pass3logo: 'url(@/assets/images/pass3logo.svg)',
                pass3gradient:
                    'linear-gradient(172.52deg, #0072FF -40.83%, #96C5FF -3.21%, #DDECFF 28.66%, #FFFFFF 44.01%);',
                'btn-container': 'var(--color-button-container)',
                'footer-bg': 'var(--color-footer-bg)',
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
    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp'),
        require('postcss-100vh-fix'),
        require('tailwind-scrollbar-hide'),
    ],
};
