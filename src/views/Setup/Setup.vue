<template>
    <div class="h-screen text-body-text bg-body-bg overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-md">
            <div class="mb-4 text-center">
                <h1 class="text-primary-text text-xl font-bold">Setup</h1>
            </div>
            <AvatarEditor class="m-auto mb-4" size="lg" :url="profile.avatar" ref="avatar" />
            <Input class="mb-4 w-full" :is-single-line="true" placeholder="Username" v-model="profile.name" />
            <Input
                class="mb-4 w-full"
                :is-single-line="true"
                placeholder="Personal link"
                prefix="https://"
                v-model="profile.link"
            />
            <Input class="mb-4 w-full" :is-single-line="false" placeholder="Bio" v-model="profile.bio" />

            <BarCard color="account" class="mb-4 w-full">
                <template #header><AccountIcon /></template>
                <template #content>
                    <div
                        class="shadow-account-sm inline-flex m-0.5 rounded-full"
                        v-for="item in accounts"
                        :key="item.platform + item.identity"
                    >
                        <EVMpAccountItem v-if="item.platform === 'EVM+'" :size="40" :address="item.identity" />
                        <AccountItem v-else :size="40" :chain="item.platform" :address="item.identity" />
                    </div>
                </template>
                <template #footer>
                    <Button
                        size="sm"
                        class="w-8 h-8 text-account-btn-m-text bg-account-btn-m shadow-account-btn-m"
                        @click="toManageAccounts"
                    >
                        <i class="bx bx-pencil bx-sm" />
                    </Button>
                </template>
            </BarCard>

            <BarCard color="nft" class="mb-4 w-full">
                <template #header>
                    <NFTIcon />
                </template>
                <template #content>
                    <template v-if="isLoadingAssets.NFT">
                        <span class="text-nft-title">Loading... Hold on a little bit 🙌</span>
                    </template>
                    <template v-else-if="nfts.length === 0">
                        <span class="text-nft-title">Haven't found anything yet...</span>
                    </template>
                    <template v-else>
                        <NFTItem
                            class="inline-flex mx-0.5"
                            v-for="asset in nfts"
                            :key="asset.platform + asset.identity + asset.id"
                            size="sm"
                            :image-url="asset.info.animation_url || asset.info.image_preview_url"
                            :poster-url="asset.info.image_preview_url"
                        />
                    </template>
                </template>
                <template #footer>
                    <Button
                        size="sm"
                        class="w-8 h-8 text-nft-btn-m-text bg-nft-btn-m shadow-nft-btn-m"
                        @click="toManageNFTs"
                    >
                        <i class="bx bx-pencil bx-sm" />
                    </Button>
                </template>
            </BarCard>

            <BarCard color="gitcoin" class="mb-4 w-full">
                <template #header>
                    <GitcoinIcon :iconColor="currentTheme === 'loot' ? 'white' : 'black'" />
                </template>
                <template #content>
                    <template v-if="isLoadingAssets.Gitcoin">
                        <span class="text-gitcoin-title">Loading... Hold on a little bit 🙌</span>
                    </template>
                    <template v-else-if="nfts.length === 0">
                        <span class="text-gitcoin-title">Haven't found anything yet...</span>
                    </template>
                    <template v-else>
                        <GitcoinItem
                            class="inline-flex mx-0.5"
                            v-for="item in gitcoins"
                            :key="item.platform + item.identity + item.id"
                            size="sm"
                            :imageUrl="item.info.image_preview_url"
                        />
                    </template>
                </template>
                <template #footer>
                    <Button
                        size="sm"
                        class="w-8 h-8 text-gitcoin-btn-m-text bg-gitcoin-btn-m shadow-gitcoin-btn-m"
                        @click="toManageGitcoins"
                    >
                        <i class="bx bx-pencil bx-sm" />
                    </Button>
                </template>
            </BarCard>

            <BarCard color="footprint" class="mb-4 w-full">
                <template #header>
                    <FootprintIcon />
                </template>
                <template #content>
                    <template v-if="isLoadingAssets.Footprint">
                        <span class="text-footprint-title">Loading... Hold on a little bit 🙌</span>
                    </template>
                    <template v-else-if="nfts.length === 0">
                        <span class="text-footprint-title">Haven't found anything yet...</span>
                    </template>
                    <template v-else>
                        <FootprintItem
                            class="inline-flex mx-0.5"
                            v-for="asset in footprints"
                            :key="asset.platform + asset.identity + asset.id"
                            :size="40"
                            :image-url="asset.info.image_preview_url"
                        />
                    </template>
                </template>
                <template #footer>
                    <Button
                        size="sm"
                        class="w-8 h-8 text-footprint-btn-m-text bg-footprint-btn-m shadow-footprint-btn-m"
                        @click="toManageFootprints"
                    >
                        <i class="bx bx-pencil bx-sm" />
                    </Button>
                </template>
            </BarCard>

            <BarCard color="content" class="mb-4 w-full">
                <template #header>
                    <ContentIcon />
                </template>
                <template #content>
                    <span class="text-content-title">Check out in homepage!</span>
                </template>
            </BarCard>

            <div
                class="
                    fixed
                    bottom-0
                    left-0
                    right-0
                    flex
                    gap-5
                    justify-between
                    m-auto
                    px-4
                    py-4
                    w-full
                    max-w-md
                    bg-btn-container
                "
            >
                <Button
                    size="lg"
                    class="flex-1 text-secondary-btn-text text-lg bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                    ><span>Back</span></Button
                >
                <Button
                    size="lg"
                    class="flex-1 text-primary-btn-text text-lg bg-primary-btn shadow-primary-btn"
                    @click="save"
                    ><span>Done</span></Button
                >
            </div>
            <LoadingContainer v-show="isLoading" />

            <Modal v-if="isShowingNotice">
                <template #header>
                    <h1>Oops!</h1>
                </template>
                <template #body>
                    <p class="mt-1 p-4">
                        {{ notice }}
                    </p>
                </template>
                <template #footer>
                    <div class="flex flex-row gap-5">
                        <Button
                            size="sm"
                            class="w-72 text-primary-btn-text bg-primary-btn shadow-primary-btn"
                            @click="isShowingNotice = false"
                        >
                            OK
                        </Button>
                    </div>
                </template>
            </Modal>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import AvatarEditor from '@/components/AvatarEditor.vue';
import Card from '@/components/Card.vue';
import BarCard from '@/components/BarCard.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import Input from '@/components/Input.vue';
import Modal from '@/components/Modal.vue';
import Loading from '@/components/Loading.vue';
import LoadingContainer from '@/components/LoadingContainer.vue';
import { RSS3Account, RSS3Asset, RSS3Profile } from 'rss3-next/types/rss3';
import RSS3, { IRSS3 } from '@/common/rss3';
import config from '@/config';

import NFTIcon from '@/components/Icons/NFTIcon.vue';
import GitcoinIcon from '@/components/Icons/GitcoinIcon.vue';
import ContentIcon from '@/components/Icons/ContentIcon.vue';
import AccountIcon from '@/components/Icons/AccountIcon.vue';
import FootprintIcon from '@/components/Icons/FootprintIcon.vue';

import { GeneralAsset, GeneralAssetWithTags } from '@/common/types';
import GitcoinItem from '@/components/GitcoinItem.vue';
import RNSUtils from '@/common/rns';
import FootprintItem from '@/components/FootprintItem.vue';
import EVMpAccountItem from '@/components/EVMpAccountItem.vue';

@Options({
    name: 'Setup',
    components: {
        EVMpAccountItem,
        FootprintItem,
        Modal,
        Button,
        AvatarEditor,
        Card,
        BarCard,
        GitcoinItem,
        AccountItem,
        NFTItem,
        Input,
        Loading,
        LoadingContainer,
        AccountIcon,
        NFTIcon,
        GitcoinIcon,
        ContentIcon,
        FootprintIcon,
    },
})
export default class Setup extends Vue {
    profile: {
        avatar: string;
        name: string;
        bio: string;
        link: string;
    } = {
        avatar: config.defaultAvatar,
        name: '',
        bio: '',
        link: '',
    };
    accounts: RSS3Account[] = [];
    nfts: GeneralAssetWithTags[] = [];
    gitcoins: GeneralAssetWithTags[] = [];
    footprints: GeneralAssetWithTags[] = [];
    rss3: IRSS3 | null = null;
    isLoading: Boolean = true;
    isLoadingAssets: {
        NFT: boolean;
        Gitcoin: boolean;
        Footprint: boolean;
    } = {
        NFT: true,
        Gitcoin: true,
        Footprint: true,
    };
    loadingAssetsIntervalID: ReturnType<typeof setInterval> | null = null;
    maxValueLength: Number = 280;
    notice: String = '';
    isShowingNotice: Boolean = false;
    currentTheme: string = '';
    $gtag: any;
    lastRoute: string = '';
    firstLoad: boolean = true;

    async initLoad() {
        if (!(await RSS3.reconnect())) {
            sessionStorage.setItem('redirectFrom', this.$route.fullPath);
            await this.$router.push('/');
        } else {
            this.rss3 = await RSS3.get();
        }
        // Trigger force refresh
        // await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, true);
        // await (<IRSS3>this.rss3).files.get((<IRSS3>this.rss3).account.address, true);

        const profile = await (<IRSS3>this.rss3).profile.get();
        console.log(profile);
        this.profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.profile.name = profile?.name || '';
        this.profile.bio = profile?.bio || '';

        if (profile?.avatar?.[0]) {
            const favicon = <HTMLLinkElement>document.getElementById('favicon');
            favicon.href = profile.avatar[0];
        }

        if (profile?.name) {
            document.title = profile.name;
        }

        if (profile?.bio) {
            const fieldPattern = /<([A-Z]+?)#(.+?)?>/gi;
            const fields = profile.bio.match(fieldPattern) || [];
            this.profile.bio = profile.bio.replace(fieldPattern, '');

            for (const field of fields) {
                const splits = fieldPattern.exec(field) || [];
                switch (splits[1]) {
                    case 'SITE':
                        this.profile.link = splits[2];
                        break;
                    default:
                        // Do nothing
                        break;
                }
            }
        }

        // Setup theme
        const themes = RSS3.getAvailableThemes(await (<IRSS3>this.rss3).assets.get());
        if (themes[0]) {
            this.currentTheme = themes[0].name;
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        // this.startLoadingAssets();

        this.isLoading = false;
    }

    startLoadingAccounts() {
        this.accounts = [];
        setTimeout(async () => {
            // Push original account
            this.accounts.push({
                platform: 'EVM+',
                identity: (<IRSS3>this.rss3).account.address,
                signature: '',
                tags: ['pass:order:-1'],
            });

            await this.loadMoreAccounts(await (<IRSS3>this.rss3).accounts.get());
        }, 0);
    }

    async ivLoadNFT(refresh: boolean): Promise<boolean> {
        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, 'NFT', refresh);
        if (data && data.status !== false) {
            await this.mergeAssets(
                await (<IRSS3>this.rss3).assets.get((<IRSS3>this.rss3).account.address),
                <GeneralAsset[]>data.assets,
                'NFT',
            );
            this.isLoadingAssets.NFT = false;
            return true;
        }
        return false;
    }

    async ivLoadGitcoin(refresh: boolean): Promise<boolean> {
        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, 'Gitcoin-Donation', refresh);
        if (data && data.status !== false) {
            await this.mergeAssets(
                await (<IRSS3>this.rss3).assets.get((<IRSS3>this.rss3).account.address),
                <GeneralAsset[]>data.assets,
                'Gitcoin-Donation',
            );
            this.isLoadingAssets.Gitcoin = false;
            return true;
        }
        return false;
    }

    async ivLoadFootprint(refresh: boolean): Promise<boolean> {
        const data = await RSS3.getAssetProfile((<IRSS3>this.rss3).account.address, 'POAP', refresh);
        if (data && data.status !== false) {
            await this.mergeAssets(
                await (<IRSS3>this.rss3).assets.get((<IRSS3>this.rss3).account.address),
                <GeneralAsset[]>data.assets,
                'POAP',
            );
            this.isLoadingAssets.Footprint = false;
            return true;
        }
        return false;
    }

    async ivLoadAssets(refresh: boolean = true): Promise<boolean> {
        let isFinish = true;
        if (this.isLoadingAssets.NFT) {
            isFinish = (await this.ivLoadNFT(refresh)) && isFinish;
        }
        if (this.isLoadingAssets.Gitcoin) {
            isFinish = (await this.ivLoadGitcoin(refresh)) && isFinish;
        }
        if (this.isLoadingAssets.Footprint) {
            isFinish = (await this.ivLoadFootprint(refresh)) && isFinish;
        }
        if (isFinish) {
            if (this.loadingAssetsIntervalID) {
                clearInterval(this.loadingAssetsIntervalID);
                this.loadingAssetsIntervalID = null;
            }
        }
        return isFinish;
    }

    async startLoadingAssets() {
        if (!(await this.ivLoadAssets())) {
            this.loadingAssetsIntervalID = setInterval(async () => {
                await this.ivLoadAssets();
            }, 2000);
        }
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

    private getAssetOrder(nft: RSS3Asset) {
        let order = -1;
        nft.tags?.forEach((tag: string) => {
            if (tag.startsWith('pass:order:')) {
                order = parseInt(tag.substr(11));
            }
        });
        return order;
    }

    async loadMoreAccounts(accounts: RSS3Account[]) {
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

    async mergeAssets(assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[], type: string) {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                if (config.hideUnlistedAsstes) {
                    ag.type = 'Invalid'; // Using as a match mark
                }
                for (const airf of assetsInRSS3File) {
                    if (
                        airf.platform === ag.platform &&
                        airf.identity === ag.identity &&
                        airf.id === ag.id &&
                        airf.type === origType
                    ) {
                        // Matched
                        ag.type = origType; // Recover type
                        if (airf.tags) {
                            ag.tags = airf.tags;
                        }
                        break;
                    }
                }
                return ag;
            }),
        );

        const List: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type.includes(type)) {
                List.push(am);
            } // else Invalid
        }

        const res = List.filter((asset) => !asset.tags || asset.tags.indexOf('pass:hidden') === -1).sort(
            (a, b) => this.getAssetOrder(a) - this.getAssetOrder(b),
        );

        if (type.includes('NFT')) {
            this.nfts = res;
        } else if (type === 'Gitcoin-Donation') {
            this.gitcoins = res;
        } else if (type === 'POAP') {
            this.footprints = res;
        }
    }

    toManageAccounts() {
        // this.saveEdited();
        this.$router.push('/setup/accounts');
    }
    toManageNFTs() {
        // this.saveEdited();
        if (this.isLoadingAssets.NFT) {
            this.notice = 'NFTs still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/nfts');
        }
    }
    toManageGitcoins() {
        if (this.isLoadingAssets.Gitcoin) {
            this.notice = 'Gitcoins still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/gitcoins');
        }
    }
    toManageFootprints() {
        if (this.isLoadingAssets.Footprint) {
            this.notice = 'Footprints still loading... Maybe check back later?';
            this.isShowingNotice = true;
        } else {
            this.$router.push('/setup/footprints');
        }
    }
    async back() {
        // this.clearEdited();
        this.$gtag.event('cancelEditProfile', { userid: (<IRSS3>this.rss3).account.address });
        window.history.back();
    }
    async save() {
        this.isLoading = true;
        if (!this.rss3) {
            this.rss3 = await RSS3.get();
        }
        if (this.profile.name.length > this.maxValueLength) {
            this.notice = `Name cannot be longer than ${this.maxValueLength} chars`;
            this.isLoading = false;
            this.isShowingNotice = true;
            return;
        }
        if (this.profile.bio?.length + this.profile.link?.length + 8 > this.maxValueLength) {
            this.notice = `Bio cannot be longer than ${this.maxValueLength} chars`;
            this.isLoading = false;
            this.isShowingNotice = true;
            return;
        }
        const newProfile: RSS3Profile = {
            name: this.profile.name,
            bio: this.profile.bio + (this.profile.link ? `<SITE#${this.profile.link}>` : ''),
        };
        const avatarUrl = await (<any>this.$refs.avatar).upload();
        if (avatarUrl) {
            newProfile.avatar = [avatarUrl];
        }
        await (<IRSS3>this.rss3).profile.patch(newProfile);
        try {
            await (<IRSS3>this.rss3).files.sync();
        } catch (e) {
            console.log(e);
            this.isLoading = false;
            return;
        }
        // this.clearEdited();
        this.$gtag.event('finishEditProfile', { userid: (<IRSS3>this.rss3).account.address });
        this.isLoading = false;
        const redirectFrom = sessionStorage.getItem('redirectFrom');
        sessionStorage.removeItem('redirectFrom');

        const ethAddress = (<IRSS3>this.rss3).account.address;
        const rns = await RNSUtils.addr2Name(ethAddress);
        if (rns && config.subDomain.isSubDomainMode) {
            window.location.href = '//' + rns + '.' + config.subDomain.rootDomain;
        } else {
            await this.$router.push(redirectFrom || `/${ethAddress}`);
        }
    }

    async mounted() {
        await this.initLoad();
        this.firstLoad = false;
        this.startLoadingAccounts();
        await this.startLoadingAssets();
    }

    async activated() {
        if (this.rss3 && !this.firstLoad) {
            this.startLoadingAccounts();
            await this.startLoadingAssets();
        }
    }

    deactivated() {
        if (this.loadingAssetsIntervalID) {
            clearInterval(this.loadingAssetsIntervalID);
            this.loadingAssetsIntervalID = null;
        }
        this.isLoading = false;
    }
}
</script>

<style lang="postcss" scoped></style>
