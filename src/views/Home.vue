<template>
    <div v-if="isRNSExist" class="main px-4 py-8 flex flex-col gap-y-2 max-w-md m-auto">
        <Profile
            :avatar="rss3Profile.avatar"
            :username="rss3Profile.username"
            :address="rss3Profile.address"
            :rns="rns"
            :followers="rss3Relations.followers"
            :followings="rss3Relations.followings"
            :NFTs="assets.length"
            :bio="rss3Profile.bio"
        ></Profile>
        <Button
            size="sm"
            class="w-auto text-lg shadow-secondary mb-4 duration-200"
            v-if="!isOwner"
            v-bind:class="[isFollowing ? 'bg-white text-primary' : 'bg-primary text-white']"
            @click="action()"
        >
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
            <i class="bx bx-sm" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
        </Button>
        <Button
            size="sm"
            class="w-auto text-lg bg-white text-primary shadow-secondary mb-4"
            v-if="isOwner"
            @click="toSetupPage"
        >
            <span>Edit Profile</span>
            <i class="bx bx-pencil bx-sm"></i>
        </Button>

        <AccountCard>
            <template #header-button>
                <div v-if="isOwner" class="flex flex-row gap-2">
                    <Button
                        size="sm"
                        class="w-8 h-8 bg-white text-account-button shadow-account-sm"
                        @click="toManageAccounts"
                    >
                        <i class="bx bxs-pencil bx-xs" />
                    </Button>
                    <Button
                        size="sm"
                        class="w-8 h-8 bg-white text-account-button shadow-account-sm"
                        @click="toAccountsPage"
                    >
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </div>
                <Button
                    v-else
                    size="sm"
                    class="w-10 h-10 text-account-button bg-white shadow-account-sm"
                    @click="toAccountsPage"
                >
                    <i class="bx bx-expand-alt bx-xs"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    class="inline-block mr-1 cursor-pointer"
                    :size="40"
                    :chain="item.platform"
                    v-for="(item, index) in accounts"
                    :key="index"
                    @click="displayDialog(item.identity, item.platform)"
                />
            </template>
        </AccountCard>

        <Card
            title="NFTs"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-auto"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #accessibility>
                <!-- <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" /> -->
            </template>
            <template #header-button>
                <div v-if="isOwner" class="flex flex-row gap-2">
                    <Button
                        size="sm"
                        class="w-8 h-8 bg-white text-nft-button shadow-nft-sm"
                        v-if="isOwner"
                        @click="toManageNFTs"
                    >
                        <i class="bx bxs-pencil bx-xs" />
                    </Button>
                    <Button size="sm" class="w-8 h-8 bg-white text-nft-button shadow-nft-sm" @click="toNFTsPage">
                        <i class="bx bx-expand-alt bx-xs" />
                    </Button>
                </div>
                <Button v-else size="sm" class="w-10 h-10 text-nft-button bg-white shadow-nft-sm" @click="toNFTsPage">
                    <i class="bx bx-expand-alt bx-xs"></i>
                </Button>
            </template>
            <template #content>
                <NFTItem
                    class="inline-block mr-1 cursor-pointer"
                    v-for="(item, index) in assets"
                    :key="index"
                    :imageUrl="item.info.animation_url || item.info.image_url"
                    :poster-url="item.info.image_url"
                    :size="70"
                    @click="toSinglenftPage(item.info.platform, item.info.account, item.info.index)"
                ></NFTItem>
            </template>
        </Card>

        <Card
            title="Contents"
            color-title="text-content-title"
            color-tips="text-content-title"
            color-background="bg-content-bg"
            class="w-auto"
            :is-having-content="true"
        >
            <template #content>
                <Button
                    size="sm"
                    class="
                        text-xs
                        bg-content-button
                        opacity-35
                        text-white
                        shadow-content
                        cursor-not-allowed
                        m-auto
                        mt-4
                    "
                    disabled
                >
                    Coming Soon
                </Button>
            </template>
        </Card>

        <Modal v-show="isdisplaying">
            <template #header>
                <Button
                    size="sm"
                    class="absolute left-4 w-10 h-10 bg-white text-primary shadow-secondary"
                    @click="closeDialog"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
            </template>
            <template #body>
                <div class="flex flex-col gap-y-4 items-center">
                    <AccountItem class="m-auto mt-4" :size="90" :chain="this.dialogChain"></AccountItem>
                    <span class="address text-xl font-semibold break-all text-center mt-4">{{
                        this.dialogAddress
                    }}</span>
                    <Button
                        size="sm"
                        class="text-md bg-account-button text-white shadow-account m-auto mt-4"
                        @click="copyToClipboard(this.dialogAddress)"
                    >
                        Copy
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
    <div
        v-else
        class="onboarding h-full text-center bg-cover bg-fixed flex items-center justify-center bg-pass3gradient"
    >
        <div class="body px-4 h-2/3 flex flex-col justify-center items-center justify-between">
            <div class="logo-container w-50 h-50 bg-pass3logo bg-center bg-contain bg-no-repeat"></div>
            <div class="text-primary text-2xl max-w-md">
                <p>
                    This RNS is not claimed yet. <br />
                    Grab it as yours or claim your own!
                </p>
            </div>
            <div class="leading-17.5 text-white w-83.5 text-2xl mx-auto">
                <Button size="lg" class="bg-primary shadow-primary rounded-3xl w-full h-17.5 mb-9" @click="toSetupRNS">
                    <span> Claim an RNS </span>
                </Button>
                <Button
                    size="lg"
                    class="text-primary bg-white shadow-primary rounded-3xl w-full h-17.5"
                    @click="toHomePage"
                >
                    <span> Go Home </span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import Profile from '@/components/Profile.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import RSS3, { IAssetProfile, IRSS3 } from '@/common/rss3';
import { RSS3Account, RSS3Asset, RSS3Backlink, RSS3ID } from 'rss3-next/types/rss3';
import { DetailedNFT, RSS3AssetShow, RSS3AssetWithInfo } from '@/common/types';
import Modal from '@/components/Modal.vue';
import RNSUtils from '@/common/rns';
import config from '@/config';
import AccountCard from '@/components/AccountCard.vue';

interface ProfileInfo {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

interface Relations {
    followers: RSS3ID[];
    followings: RSS3ID[];
}

@Options({
    components: { Button, Card, Profile, AccountItem, NFTItem, Modal, AccountCard },
})
export default class Home extends Vue {
    rns: string = '';
    ethAddress: string = '';
    public rss3?: IRSS3;
    public isFollowing: boolean = false;
    public isOwner: boolean = false;
    public isdisplaying: boolean = false;
    public dialogAddress: string = '';
    public dialogChain: string = '';
    isRNSExist: boolean = true;

    public rss3Profile: ProfileInfo = {
        avatar: config.defaultAvatar,
        username: '...',
        address: '',
        bio: '...',
    };
    public rss3Relations: Relations = {
        followers: [],
        followings: [],
    };
    accounts: RSS3Account[] = [];
    assets: Object[] = [];
    $gtag: any;

    async mounted() {
        await this.initLoad();
    }

    async initLoad() {
        const isValidRSS3 = await RSS3.reconnect();
        this.rss3 = await RSS3.visitor();
        const owner: string = <string>this.rss3.account.address;
        let address: string = <string>this.rss3.account.address;
        if (this.$route.params.address) {
            address = <string>this.$route.params.address;
            if (address.startsWith('0x')) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = (await RNSUtils.addr2Name(address)).toString().replace('.pass3.me', '');
                if (this.rns !== '') {
                    await this.$router.push(`/${this.rns}`);
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(`${address}.pass3.me`)).toString();
                if (parseInt(this.ethAddress) !== 0) {
                    if (this.ethAddress === owner) {
                        this.isOwner = true;
                    }
                } else {
                    this.isRNSExist = false;
                }
            }
        } else {
            if (!isValidRSS3) {
                sessionStorage.setItem('redirectFrom', this.$route.fullPath);
                await this.$router.push('/');
            } else {
                this.rns = (await RNSUtils.addr2Name(owner)).toString().replace('.pass3.me', '');
                if (this.rns === '') {
                    await this.$router.push('/rns');
                } else {
                    this.ethAddress = owner;
                    this.isOwner = true;
                }
            }
        }

        // console.log(this.ethAddress);
        const data = await RSS3.getAssetProfile(this.ethAddress);
        if (!data) {
            return;
        }

        const profile = data.rss3File.profile;
        await this.checkIsFollowing();

        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.bio = profile?.bio || '';
        this.rss3Profile.address = this.ethAddress;

        if (profile?.avatar?.[0]) {
            const favicon = <HTMLLinkElement>document.getElementById('favicon');
            favicon.href = profile.avatar[0];
        }
        if (profile?.name) {
            document.title = profile.name;
        }

        if (data) {
            this.accounts.push({
                platform: 'Ethereum',
                identity: this.ethAddress,
                signature: '',
                tags: ['pass:order:-1'],
            });

            await this.loadAccounts(<RSS3Account[]>data.rss3File.accounts);
            await this.loadNFTs(<RSS3Asset[]>data.rss3File.assets);
        }

        // Split time-consuming methods from main thread, so it won't stuck the page loading progress
        setTimeout(async () => {
            this.rss3Relations.followers = (await this.rss3?.backlinks.get(this.ethAddress, 'following')) || [];
            this.rss3Relations.followings = (await this.rss3?.links.get(this.ethAddress, 'following'))?.list || [];
        }, 0);
    }

    getTaggedOrder(taggedElement: RSS3Account | RSS3Asset): number {
        if (!taggedElement.tags) {
            return -1;
        }
        const orderPattern = /^pass:order:(-?\d+)$/i;
        for (const tag of taggedElement.tags) {
            if (orderPattern.test(tag)) {
                return parseInt(orderPattern.exec(tag)?.[1] || '-1');
            }
        }
        return -1;
    }

    private async getInfo(nft: RSS3Asset) {
        const data = await RSS3.getAssetProfile(this.ethAddress);
        const assets = data?.assets;
        for (let chain in assets) {
            for (let i = 0; i < assets[chain].length; i++) {
                const chainInfo = assets[chain][i];
                for (let j = 0; j < chainInfo.nft.length; j++) {
                    const nftInfo = chainInfo.nft[j];
                    if (
                        nftInfo.chain === nft.platform &&
                        nftInfo.token_id === nft.id &&
                        nftInfo.asset_contract.address === nft.identity
                    ) {
                        let res: any = nftInfo;
                        res.account = i;
                        res.index = j;
                        res.platform = chain;
                        return res;
                    }
                }
            }
        }
        return null;
    }

    private getNFTOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    async loadNFTs(NFTs: RSS3Asset[]) {
        const NFTList: Array<RSS3AssetWithInfo> = await Promise.all(
            (JSON.parse(JSON.stringify(NFTs)) || []).map(async (nft: RSS3AssetWithInfo) => {
                const info = await this.getInfo(nft);
                if (info) {
                    nft.info = info;
                }
                return nft;
            }),
        );

        this.assets = NFTList.filter((nft) => (!nft.tags || nft.tags.indexOf('pass:hidden') === -1) && nft.info).sort(
            (a, b) => this.getNFTOrder(a) - this.getNFTOrder(b),
        );
    }

    async loadAccounts(accounts: RSS3Account[]) {
        // Get accounts
        if (accounts) {
            accounts.forEach((account: RSS3Account) => {
                if (!account.tags?.includes('hidden')) {
                    this.accounts.push(account);
                }
            });
            this.accounts.sort((a, b) => {
                return this.getTaggedOrder(a) - this.getTaggedOrder(b);
            });
        }
    }

    public async action() {
        if (RSS3.isValidRSS3()) {
            if (this.isFollowing) {
                await this.unfollow();
                this.rss3Relations.followers.splice(
                    this.rss3Relations.followers.indexOf((<IRSS3>this.rss3).account.address),
                    1,
                );
            } else {
                await this.follow();
                this.rss3Relations.followers.push((<IRSS3>this.rss3).account.address);
            }
            await (<IRSS3>this.rss3).files.sync();
        } else {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        }
    }

    public async checkIsFollowing() {
        if (!this.ethAddress) {
            this.ethAddress = (await RNSUtils.name2Addr(`${this.rns}.pass3.me`)).toString();
        }
        const followList = await this.rss3?.links.get(this.rss3.account.address, 'following');
        if (typeof followList === 'undefined') {
            // No following list. Not following
            this.isFollowing = false;
            return false;
        } else if (followList.list?.includes(this.ethAddress)) {
            this.isFollowing = true;
            return true;
        } else {
            this.isFollowing = false;
            return false;
        }
    }

    async follow() {
        const rss3 = await RSS3.get();
        if (!(await this.checkIsFollowing())) {
            this.$gtag.event('followFriend', { userid: this.rss3Profile['address'] });
            await rss3?.link.post('following', this.ethAddress);
        }
        this.isFollowing = true;
    }

    async unfollow() {
        const rss3 = await RSS3.get();
        if (await this.checkIsFollowing()) {
            this.$gtag.event('unfollowFriend', { userid: this.rss3Profile['address'] });
            await rss3?.link.delete('following', this.ethAddress);
        }
        this.isFollowing = false;
    }

    toManageAccounts() {
        this.$router.push('/setup/accounts');
    }
    toManageNFTs() {
        this.$router.push('/setup/nfts');
    }

    public toAccountsPage() {
        this.$gtag.event('visitAccountsPage', { userid: this.rns });
        this.$router.push(`/${this.rns}/accounts`);
    }

    public toNFTsPage() {
        this.$gtag.event('visitNftPage', { userid: this.rns });
        this.$router.push(`/${this.rns}/nfts`);
    }

    public toSinglenftPage(chain: string, account: string, index: number) {
        this.$gtag.event('visitSingleNft', {
            userid: this.rns || this.ethAddress,
            chain: chain,
            nftid: account,
            nftindex: index,
        });
        this.$router.push(`/${this.rns || this.ethAddress}/singlenft/${chain}/${account}/${index}`);
    }

    public toSetupPage() {
        this.$router.push(`/profile`);
    }

    toSetupRNS() {
        this.$router.push('/rns');
    }

    async toHomePage() {
        await this.$router.push('/home');
        this.isRNSExist = true;
        await this.initLoad();
    }

    public displayDialog(address: string, chain: string) {
        this.dialogAddress = address;
        this.dialogChain = chain;
        this.isdisplaying = true;
    }

    public closeDialog() {
        this.isdisplaying = false;
    }

    public copyToClipboard(address: string) {
        navigator.clipboard.writeText(address).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.error('Async: Could not copy the account: ', err);
            },
        );
    }
}
</script>

<style></style>
