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
            },
            colors: {
                // primary: '#0072FF',
                // secondary: '#ffffff',
                primary: {
                    text: '#0072FF',
                    btn: 'var(--color-primary-btn)',
                    'btn-text': 'var(--color-primary-btn-text)',
                    'btn-border': 'var(--color-primary-btn-border)',
                    link: 'var(--color-primary-link-btn)',
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
                    button: '#40D22F',
                    title: '#13BD00',
                    bg: '#F6FFF5',
                    'btn-m': 'var(--color-account-btn-m)',
                    'btn-m-text': 'var(--color-account-btn-m-text)',
                    'btn-m-border': 'var(--color-account-btn-m-border)',
                    'btn-s': 'var(--color-account-btn-s)',
                    'btn-s-text': 'var(--color-account-btn-s-text)',
                    'btn-s-border': 'var(--color-account-btn-s-border)',
                },
                nft: {
                    border: 'var(--color-nft-border)',
                    button: '#7553FF',
                    title: '#2D00E0',
                    bg: '#F7F5FF',
                    'btn-m': 'var(--color-nft-btn-m)',
                    'btn-m-text': 'var(--color-nft-btn-m-text)',
                    'btn-m-border': 'var(--color-nft-btn-m-border)',
                    'btn-s': 'var(--color-nft-btn-s)',
                    'btn-s-text': 'var(--color-nft-btn-s-text)',
                    'btn-s-border': 'var(--color-nft-btn-s-border)',
                    'tag-border': 'var(--color-nft-tag-border)',
                    trait: {
                        bg: 'var( --color-nft-trait-bg)',
                        type: 'var(--color-nft-trait-type)',
                        border: 'var(--color-nft-trait-border)',
                    },
                },
                gitcoin: {
                    border: 'var(--color-gitcoin-border)',
                    button: '#02E2AC',
                    title: '#11BC92',
                    bg: '#F4FFFB',
                    'btn-m': 'var(--color-gitcoin-btn-m)',
                    'btn-m-text': 'var(--color-gitcoin-btn-m-text)',
                    'btn-m-border': 'var(--color-gitcoin-btn-m-border)',
                    'btn-s': 'var(--color-gitcoin-btn-s)',
                    'btn-s-text': 'var(--color-gitcoin-btn-s-text)',
                    'btn-s-border': 'var(--color-gitcoin-btn-s-border)',
                },
                content: {
                    border: 'var(--color-content-border)',
                    button: '#178BFF',
                    title: '#0070E0',
                    bg: '#F5FAFF',
                    'btn-m': 'var(--color-content-btn-m)',
                    'btn-m-text': 'var(--color-content-btn-m-text)',
                    'btn-m-border': 'var(--color-content-btn-m-border)',
                    'btn-s': 'var(--color-content-btn-s)',
                    'btn-s-text': 'var(--color-content-btn-s-text)',
                    'btn-s-border': 'var(--color-content-btn-s-border)',
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
                    overlay: '--color-card-overlay',
                },
                btn: {
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
                'primary-btn': 'var(--shadow-primary-btn)',
                'secondary-btn': 'var(--shadow-secondary-btn)',
                'follow-card': 'var(--shadow-follow-card)',
                account: {
                    btn: {
                        s: 'var(--shadow-account-btn-m)',
                        m: 'var(--shadow-account-btn-s)',
                    },
                    item: 'var(--shadow-account-item)',
                },
                nft: {
                    btn: {
                        s: 'var(--shadow-nft-btn-m)',
                        m: 'var(--shadow-nft-btn-s)',
                    },
                    item: 'var(--shadow-nft-item)',
                },
                gitcoin: {
                    btn: {
                        s: 'var(--shadow-gitcoin-btn-m)',
                        m: 'var(--shadow-gitcoin-btn-s)',
                    },
                    item: 'var(--shadow-gitcoin-item)',
                },
                content: {
                    btn: {
                        s: 'var(--shadow-content-btn-m)',
                        m: 'var(--shadow-content-btn-s)',
                    },
                    item: 'var(--shadow-content-item)',
                },
            },
            dropShadow: {
                account: '-4px 4px 5px rgba(17, 170, 0, 0.12)', //account item shadow
                nft: '-2px 4px 5px rgba(45, 0, 225, 0.12)', //nft item shadow & detail content card shadow
                gitcoin: '-1px 2px 7px rgba(17, 188, 146, 0.21)', //gitcoin item
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
                27: '6.75rem', //108px, scan tag width
                45: '11.25rem', //180px, discard & save button width,
                50: '12.5rem', //200px
            },
            height: {
                50: '12.5rem', //200px
            },
            backgroundImage: (theme) => ({
                BSC: 'url(@/assets/images/chains/BSC.png)',
                Ethereum: 'url(@/assets/images/chains/Ethereum.png)',
                Ronin: 'url(@/assets/images/chains/Ronin.png)',
                Etherscan: 'url(@/assets/images/scans/Etherscan.png)',
                Roninscan: 'url(@/assets/images/scans/Roninscan.png)',
                bscscan: 'url(@/assets/images/scans/bscscan.png)',
                opensea: 'url(@/assets/images/marketplaces/OpenSea.png)',
                rarible: 'url(@/assets/images/marketplaces/rarible.png)',
                pass3gif: 'url(@/assets/images/pass3.gif)',
                pass3logo: 'url(@/assets/images/pass3logo.svg)',
                pass3gradient:
                    'linear-gradient(172.52deg, #0072FF -40.83%, #96C5FF -3.21%, #DDECFF 28.66%, #FFFFFF 44.01%);',
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
