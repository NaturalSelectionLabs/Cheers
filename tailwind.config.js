module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            borderRadius: {
                sm: '4px',
                DEFAULT: '6px',
                lg: '10px',
            },

            borderWidth: {
                DEFAULT: '0.5px',
                1: '1px',
                6: '6px',
                19: '19px',
                26: '26px',
            },
            dividerWidth: {
                DEFAULT: '0.5px',
            },
            dropShadow: {
                DEFAULT: '0px 1px 4px rgba(0, 0, 0, 0.2)',
            },
            backdropBlur: {
                DEFAULT: '4px',
            },
            colors: {
                primary: '#5c65f4',
                secondary: '#E7E8FE',
                white: '#fff',
                black: '#282828',
                gray: {
                    text: '#3c3c43',
                    light: '#F9FaF9',
                    bg: '#f3f3f3',
                    outline: '#c5c5c7',
                },
                disabled: '#efefef',
                success: '#00c700',
                danger: '#b01a0a',
                warning: '#f5a05d',
            },
            opacity: {
                5: '0.05',
                10: '0.1',
                15: '0.15',
                30: '0.3',
                35: '0.35',
                43: '0.43',
                56: '0.56',
                60: '0.6',
            },
            spacing: {
                0.5: '0.125rem', //2px, 0.5
                1: '0.25rem', //4px, 1
                1.5: '0.375rem', //6px, 1.5
                2: '0.5rem', //8px, 2
                2.5: '0.625rem', //10px, 2.5
                3: '0.75rem', //12px, 3
                4: '1rem', //16px, 4
                5: '1.25rem', //20px, 5
                8: '2rem', //32px, 8
                10: '2.5rem', //40px, 10
                12: '3rem', //48px, 12
                13: '3.25rem', //52px
                15: '3.75rem', //60px, 15
                18: '4.5rem', //72px, 18
                20.5: '5.125rem',
                21: '5.25rem',
                21.5: '5.375rem',
                25: '6.25rem',
                26: '6.5rem',
                36: '9rem',
                37: '9.25rem',
            },
            inset: {
                '4/5': '80%',
                '3/2': '150%',
            },
            width: {
                2: '0.5rem', //8px, toggle switch button width
                4: '1rem', //16px, toggle switch button width
                5: '1.25rem', //20px, toggle switch handle width
                8: '2rem', //32px, popup.html [...] button width,
                10: '2.5rem', //40px,
                12: '3rem', //48px,
                14: '3.5rem', //56px, options.html profile avatar width
                19: '4.75rem', //75px
                21: '5.25rem', //84px, raw rss3 codeblock tooltip width
                26: '6.5rem', //104px, popup.html selected menu item width
                27: '6.75rem', //108px, small button width; popup.html collapse [...] menu width
                30: '7.5rem', //120px, options.html profile tab avatar size
                35: '8.75rem', //140px,
                45: '11.25rem', //180px, popup.html key text width (full view)
                55: '13.75rem', //220px, popup.html main button & input width
                61: '15.25rem', //245px, raw rss3 tooltip width
                62: '15.5rem', //248px, options.html sidebar width
                65: '16.25rem', //260px, popup.html width
                89: '22.25rem', //356px, options.html main button width
                120: '30rem', //480px, options.html extended button width
                155.5: '38.875rem', //622px
                160: '40rem', //640px, raw rss3 codeblock input width
                180: '45rem', //720px, options.html input & content width
                186: '46.5rem', //744px, raw rss3 codeblock input private key
            },
            height: {
                1: '0.25rem', //4px, toggle switch handle height
                2: '0.5rem', //8px, toggle switch button height
                4: '1rem', //16px, popup.html [...] button height,
                5: '1.24rem', //20px, popup.html selected menu item height
                6: '1.5rem', //24px, raw rss3 codeblock tooltip height
                7: '1.75rem', //28px, popup.html & options.html small button height                9: '2.25rem', //36px, popup.html main button height
                10: '2.5rem', //40px,
                12: '3rem', //48px, popup.html key container height
                14: '3.5rem', //56px, profile avatar width
                18: '4.5rem', //72px, options.html main button & single line input height
                19: '4.75rem', //76px, raw rss3 tooltip height
                19.5: '4.875rem', //78px,
                23: '5.75rem', //92px, popup.html bio input textarea height
                24: '6rem', //96px, popup.html collapse [...] menu height
                30: '7.5rem', //120px, options.html profile tab avatar size
                31: '7.75rem', //124px,
                45: '11.25rem', //180px, options.html bio input textarea height
                60: '15rem', //240px
                79: '19.75rem', //316px
                80: '20rem',
                92: '23rem', // 368px, options.html tips height
                101: '25.25rem', //404px
                105: '26.25rem', //420px, popup.html height
                120: '30rem', //480px, options.html advanced viewbox height
                160: '40rem', //640px, options.html advanced profile editor height
            },
            transitionTimeFunction: {
                'in-out-expo': 'cubic-bezier(.5, -.5, .5, 1.5)',
            },
            fontFamily: {
                montserrat: 'Montserrat, sans-serif',
            },
            fontSize: {
                '6.3xl': '4rem',
            },
            gridTemplateRows: {
                popup: '32px auto',
                editProfile: '56px 36px 90px 64px 36px',
                account: '40px 20px 64px 64px 36px 60px',
            },
            gridTemplateColumns: {
                profile: '40px 140px 32px',
                context: '1/3 2/3',
            },
            zIndex: {
                '-10': '-10',
            },
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
        },
    },
    plugins: [],
};
