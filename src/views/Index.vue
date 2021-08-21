<template>
    <div class="onboarding h-full text-center bg-cover bg-fixed flex items-center justify-center">
        <div class="body h-2/3 flex flex-col justify-between">
            <h1 class="hello text-8xl text-primary font-bold">Hello</h1>
            <div class="leading-17.5 text-white w-83.5 text-2xl mx-auto">
                <div class="connect bg-primary rounded-3xl h-17.5 cursor-pointer mb-9" @click="walletConnect">
                    Connect a wallet
                </div>
                <div class="metamask rounded-3xl h-17.5 cursor-pointer" @click="metaMask">Metamask</div>
            </div>
        </div>
    </div>
</template>

<script>
// import RSS3 from '@/common/rss3'

export default {
    methods: {
        async walletConnect() {
            //  Get RSS3
            //   const rss3 = await RSS3.get()
            //   console.log(rss3)
            //   let profile
            //   try {
            //     profile = await rss3.profile.get()
            //     console.log(profile)
            //   } catch (e) {
            //     console.error(e)
            //   }
            //   if (profile) {
            //     this.$gtag.config(rss3.account.address)
            //     this.$gtag.event('login', { userid: rss3.account.address, event_label: rss3.account.address })
            //     await this.$router.push('/public')
            //   } else {
            //     this.$gtag.config(rss3.account.address)
            //     this.$gtag.event('sign_up', { userid: rss3.account.address, event_label: rss3.account.address })
            //     await this.$router.push('/settings')
            //   }
            // const sign = await Web3.sign('Demo data')
            // console.log(sign)
        },
        async metaMask() {},
    },
};
</script>

<style lang="postcss" scoped>
.onboarding {
    background-image: url('../assets/images/rss3-bg.png');

    .body {
        .hello {
            text-shadow: 0 9px 35px #b7d7ff;
        }

        .connect {
            box-shadow: 0px 9px 35px -7px rgba(0, 114, 255, 0.94);
        }

        .metamask {
            background: #fff4eb;
            box-shadow: 0px 8px 12px 5px rgba(246, 133, 27, 0.18);
            color: #944300;
        }
    }
}
</style>
