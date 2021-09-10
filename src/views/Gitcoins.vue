<template>
    <div class="h-screen bg-gitcoin-bg overflow-y-auto">
        <div class="main px-4 py-8 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary" @click="back">
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-gitcoin-title font-bold text-center">Donations</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="this.rss3Profile.avatar"
                    :alt="this.rss3Profile.username"
                    @click="toPublicPage(this.rss3Profile.address)"
                />
            </div>
            <div class="gitcoin-gitcoins flex flex-col gap-y-4" v-show="gitcoins.length !== 0">
                <GitcoinTitle :grants="grants" :contributions="contribs"></GitcoinTitle>
                <GitcoinCard
                    v-for="(item, index) in gitcoins"
                    :key="index"
                    :imageUrl="item.info.image_preview_url"
                    :name="item.info.title"
                    :contrib="item.info.total_contribs"
                    @click="toSingleGitcoin(item.platform, item.identity, item.id)"
                ></GitcoinCard>
            </div>
            <div
                class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full"
                v-if="isOwner && gitcoins.length !== 0"
            >
                <Button
                    size="lg"
                    class="m-auto text-lg bg-gitcoin-button text-white shadow-gitcoin"
                    @click="toSetupGitcoins()"
                >
                    Manage Contribs
                </Button>
            </div>
            <div
                class="px-4 py-4 flex gap-5 fixed bottom-0 left-0 right-0 max-w-md m-auto w-full"
                v-show="gitcoins.length === 0"
            >
                <Button size="lg" class="m-auto text-lg bg-gitcoin-button text-white shadow-gitcoin">
                    Go to Gitcoin
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import GitcoinTitle from '@/components/GitcoinTitle.vue';
import GitcoinCard from '@/components/GitcoinCard.vue';
import axios from 'axios';
import config from '@/config';
import RNSUtils from '@/common/rns';
import RSS3 from '@/common/rss3';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    components: { ImgHolder, Button, GitcoinTitle, GitcoinCard },
})
export default class Gitcoins extends Vue {
    rns: string = '';
    ethAddress: string = '';
    public grants: number = 0;
    public contribs: number = 0;
    public gitcoins: Array<Object> = [];
    public isOwner: boolean = false;
    public rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };

    async mounted() {
        const address = <string>this.$route.params.address;
        if (!address.startsWith('0x')) {
            this.rns = address;
            this.ethAddress = (await RNSUtils.name2Addr(`${address}.pass3.me`)).toString();
        } else {
            this.ethAddress = address;
            this.rns = (await RNSUtils.addr2Name(address)).toString();
        }
        const rss3 = await RSS3.visitor();
        const owner: string = <string>rss3.account.address;

        if (owner === this.ethAddress) {
            this.isOwner = true;
        }

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name?.[0] || '';
        this.rss3Profile.address = this.ethAddress;

        await this.loadGitcoin();
    }

    async loadGitcoin() {
        const res = await axios({
            method: 'get',
            url: `http://localhost:3000/asset-profile/${this.ethAddress}`,
        });
        const data: Array<any> = res.data.assets;
        data.forEach((element) => {
            if (element.type == 'Gitcoin-Donation') {
                this.contribs += element.info.total_contribs;
                this.gitcoins.push(element);
            }
        });

        this.grants = this.gitcoins.length;
    }

    public toPublicPage(address: string) {
        this.$router.push(`/${address}`);
    }

    public back() {
        window.history.back();
    }

    public toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }

    public toSingleGitcoin(platform: string, identity: string, id: string) {
        this.$router.push(`/${this.rns}/singlegitcoin/${platform}/${identity}/${id}`);
    }
}
</script>

<style></style>
