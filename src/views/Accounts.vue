<template>
    <div class="h-screen bg-account-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-account-title font-bold text-center">Accounts</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto"
                    :is-rounded="true"
                    :is-border="false"
                    :src="this.avatar"
                />
            </div>
            <div class="account-list">
                <div class="flex flex-col gap-y-4">
                    <div
                        class="account-wrapper flex flex-row justify-between items-center"
                        v-for="(item, index) in accountList"
                        :key="index"
                    >
                        <AccountItem size="70" :chain="item.chain"></AccountItem>
                        <span class="address text-2xl font-semibold">{{ filter(item.address) }}</span>
                        <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                            <i class="bx bxs-copy bx-sm"></i>
                        </Button>
                        <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                            <i class="bx bx-link-external bx-sm"></i>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import AccountItem from '@/components/AccountItem.vue';
import axios from 'axios';

@Options({
    components: { ImgHolder, Button, AccountItem },
})
export default class Accounts extends Vue {
    public accountList: Array<Object> = [];
    public avatar: String = '';
    public username: String = '';

    async mounted() {
        const address: string = <string>this.$route.params.address;
        const res = await axios.get(`https://rss3-asset-hub-g886a.ondigitalocean.app/asset-profile/${address}`);

        if (res.data) {
            this.avatar = res.data.rss3File.profile?.avatar?.[0];
            this.username = res.data.rss3File.profile?.name?.[0];

            this.accountList.push({
                chain: 'Ethereum',
                address: this.$route.params.address,
            });

            if (res.data.rss3File.accounts) {
                const accounts = res.data.rss3File.accounts;
                for (const item of accounts) {
                    this.accountList.push({
                        chain: item.platform,
                        address: item.identity,
                    });
                }
            }
        }
    }
    /**
     * filter
     */
    public filter(address: string) {
        let res: string = address.slice(0, 6);
        res += '....';
        res += address.slice(-4);
        return res;
    }
    public back() {
        window.history.back();
    }
}
</script>

<style></style>
