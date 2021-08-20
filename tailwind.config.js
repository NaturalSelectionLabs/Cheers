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
                md: '3px',
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
                gray: {
                    bg: '#F4F7F8',
                },
                success: '#00c700',
                danger: '#b01a0a',
            },
            boxShadow: {
                primary: '0px 9px 35px -7px rgba(0, 114, 255, 0.94)', //primary blue button shadow
                secondary: '0px 9px 35px -7px rgba(55, 155, 255, 0.72)', //white button shadow with primary blue text
                account: '0px 4px 9px 1px rgba(64, 210, 47, 0.68)', //solid green button shadow for accounts
                'account-sm': '0px 4px 16px -6px rgba(19, 189, 0, 0.78)', // show/hide white button shadow for accounts
                nft: '0px 9px 35px -7px rgba(117, 83, 255, 0.94)', //solid purple button shadow for nfts
                'nft-sm': '0px 4px 16px -6px rgba(117, 83, 255, 0.78)', // show/hide white button shadow for nfts
                content: '0px 9px 35px -7px rgba(55, 155, 255, 0.94)', //solid blue button shadow for contents
                'content-sm': '-2px 2px 4px rgba(36, 146, 255, 0.13)', //content item card shadow
                'content-md': '0px 2px 13px -5px rgba(23, 139, 255, 0.76)', //content white small button shadow
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
                72: '18rem', //288px
            },
            fontFamily: {
                'sf-compact-rounded': 'SFCompactRounded, sans-serif',
            },
            // inset: {
            //     '4/5': '80%',
            //     '3/2': '150%',
            // },
            width: {
                //     2: '0.5rem', //8px, toggle switch button width
                //     4: '1rem', //16px, toggle switch button width
                //     5: '1.25rem', //20px, toggle switch handle width
                //     8: '2rem', //32px, popup.html [...] button width,
                //     9: '2.25rem', //36px
                //     10: '2.5rem', //40px,
                //     12: '3rem', //48px,
                //     14: '3.5rem', //56px, options.html profile avatar width
                //     19: '4.75rem', //75px
                //     21: '5.25rem', //84px, raw rss3 codeblock tooltip width
                //     26: '6.5rem', //104px, popup.html selected menu item width
                //     27: '6.75rem', //108px, small button width; popup.html collapse [...] menu width
                //     30: '7.5rem', //120px, options.html profile tab avatar size
                //     35: '8.75rem', //140px,
                45: '11.25rem', //180px, discard & save button width
                //     55: '13.75rem', //220px, popup.html main button & input width
                //     61: '15.25rem', //245px, raw rss3 tooltip width
                //     62: '15.5rem', //248px, options.html sidebar width
                //     65: '16.25rem', //260px, popup.html width
                //     89: '22.25rem', //356px, options.html main button width
                //     120: '30rem', //480px, options.html extended button width
                //     155.5: '38.875rem', //622px
                //     160: '40rem', //640px, raw rss3 codeblock input width
                //     180: '45rem', //720px, options.html input & content width
                //     186: '46.5rem', //744px, raw rss3 codeblock input private key
            },
            // height: {
            //     1: '0.25rem', //4px, toggle switch handle height
            //     2: '0.5rem', //8px, toggle switch button height
            //     4: '1rem', //16px, popup.html [...] button height,
            //     5: '1.24rem', //20px, popup.html selected menu item height
            //     6: '1.5rem', //24px, raw rss3 codeblock tooltip height
            //     7: '1.75rem', //28px, popup.html & options.html small button height                9: '2.25rem', //36px, popup.html main button height
            //     10: '2.5rem', //40px,
            //     12: '3rem', //48px, popup.html key container height
            //     14: '3.5rem', //56px, profile avatar width
            //     18: '4.5rem', //72px, options.html main button & single line input height
            //     19: '4.75rem', //76px, raw rss3 tooltip height
            //     19.5: '4.875rem', //78px,
            //     23: '5.75rem', //92px, popup.html bio input textarea height
            //     24: '6rem', //96px, popup.html collapse [...] menu height
            //     30: '7.5rem', //120px, options.html profile tab avatar size
            //     31: '7.75rem', //124px,
            //     45: '11.25rem', //180px, options.html bio input textarea height
            //     60: '15rem', //240px
            //     79: '19.75rem', //316px
            //     80: '20rem',
            //     92: '23rem', // 368px, options.html tips height
            //     101: '25.25rem', //404px
            //     105: '26.25rem', //420px, popup.html height
            //     120: '30rem', //480px, options.html advanced viewbox height
            //     160: '40rem', //640px, options.html advanced profile editor height
            // },
            // transitionTimeFunction: {
            //     'in-out-expo': 'cubic-bezier(.5, -.5, .5, 1.5)',
            // },
            // fontSize: {
            //     '6.3xl': '4rem',
            // },
            // gridTemplateRows: {
            //     popup: '32px auto',
            //     editProfile: '56px 36px 90px 64px 36px',
            //     account: '40px 20px 64px 64px 36px 60px',
            // },
            // gridTemplateColumns: {
            //     profile: '40px 140px 32px',
            //     context: '1/3 2/3',
            // },
            // zIndex: {
            //     '-10': '-10',
            // },
        },
        minHeight: {
            48: '12rem', // Min height for card
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
    plugins: [],
};
