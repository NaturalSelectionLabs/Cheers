<template>
    <div class="h-screen bg-body-bg overflow-y-auto">
        <div class="px-4 pt-8 pb-20 max-w-md m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="section-title text-2xl text-primary-text font-bold text-center">Followings</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                    :alt="rss3Profile.username"
                    @click="toPublicPage(rns, ethAddress)"
                />
            </div>
            <div class="follow-list flex flex-col gap-y-4">
                <FollowerCard
                    class="w-auto cursor-pointer"
                    v-for="item in followingList"
                    :key="item.address"
                    :avatar="item.avatar"
                    :name="item.username"
                    :address="item.rns || item.displayAddress"
                    @click="toPublicPage(item.rns, item.address)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import FollowerCard from '@/components/FollowerCard.vue';
import RSS3, { IRSS3 } from '@/common/rss3';
import RNSUtils from '@/common/rns';
import config from '@/config';
import { reverse } from 'lodash';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
    rns: string;
    displayAddress: string;
}

@Options({
    name: 'Followings',
    components: { ImgHolder, Button, FollowerCard },
})
export default class Followings extends Vue {
    public followingList: Array<Profile> = [];
    public rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
        rns: '',
        displayAddress: '',
    };
    rns: string = '';
    ethAddress: string = '';
    lastRoute: string = '';
    isPageActive: boolean = false;
    loadingNo: number = 0;

    async setupAddress() {
        let address: string = '';
        if (config.subDomain.isSubDomainMode) {
            // Is subdomain mode
            address = window.location.host.split('.')[0];
        } else if (this.$route.params.address) {
            address = <string>this.$route.params.address;
        } else {
            return false;
        }

        if (address) {
            if (address.startsWith('0x')) {
                // Might be address type
                // Get RNS and redirect
                this.ethAddress = address;
                this.rns = (await RNSUtils.addr2Name(address)).replace(config.rns.suffix, '');
                if (this.rns !== '') {
                    if (config.subDomain.isSubDomainMode) {
                        window.location.host = this.rns + '.' + config.subDomain.rootDomain;
                    } else {
                        await this.$router.push(`/${this.rns}`);
                    }
                }
            } else {
                // RNS
                this.rns = address;
                this.ethAddress = (await RNSUtils.name2Addr(address + config.rns.suffix)).toString();
                if (parseInt(this.ethAddress) === 0) {
                    return false;
                }
            }
        }

        return true;
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.followingList = [];
        this.loadingNo = 0;

        const rss3 = await RSS3.visitor();
        const initFollowersList = (await rss3.links.get(this.ethAddress, 'following'))?.list || [];
        const followersList = reverse(initFollowersList);

        if (rss3 && followersList) {
            for (const item of followersList) {
                this.followingList.push({
                    avatar: config.defaultAvatar,
                    username: '',
                    bio: '',
                    address: item,
                    displayAddress: this.filter(item),
                    rns: '',
                });
            }
            setTimeout(() => {
                this.loadDetails(rss3);
            }, 0);
        }
    }

    async loadDetails(rss3: IRSS3) {
        const startNo = this.loadingNo;
        const endNo = this.followingList.length;
        for (let i = startNo; i < endNo; i++) {
            if (this.isPageActive) {
                const item = this.followingList[i];
                try {
                    const profile = (await rss3.profile.get(item.address)) || {};
                    item.avatar = profile.avatar?.[0] || config.defaultAvatar;
                    item.username = profile.name || '';
                    item.bio = profile.bio || '';
                    item.rns = (await RNSUtils.addr2Name(item.address)).replace(config.rns.suffix, '');
                } catch (e) {
                    console.log(item, e);
                }
                this.loadingNo = i;
            }
        }
    }

    async setupTheme() {
        const rss3 = await RSS3.visitor();
        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }
    }

    async setProfile() {
        const rss3 = await RSS3.visitor();
        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;
    }

    async setPageTitleFavicon() {
        const rss3 = await RSS3.visitor();
        const profile = await rss3.profile.get(this.ethAddress);
        const favicon = <HTMLLinkElement>document.getElementById('favicon');
        favicon.href = profile?.avatar?.[0] || '/favicon.ico';
        document.title = profile?.name || 'Web3 Pass';
    }

    filter(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    toPublicPage(rns: string, ethAddress: string) {
        if (rns && config.subDomain.isSubDomainMode) {
            window.location.href = '//' + rns + '.' + config.subDomain.rootDomain;
        } else {
            window.location.href = '//' + config.subDomain.rootDomain + `/${rns || ethAddress}`;
        }
    }

    public back() {
        this.$router.push(config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}`);
    }

    async activated() {
        this.isPageActive = true;
        await this.setupAddress();
        setTimeout(async () => {
            await this.setupTheme();
            await this.setPageTitleFavicon();
            if (this.lastRoute !== this.$route.fullPath) {
                await this.setProfile();
                await this.initLoad();
            } else if (this.loadingNo < this.followingList.length) {
                await this.loadDetails(await RSS3.visitor());
            }
        }, 0);
    }

    async deactivated() {
        this.isPageActive = false;
    }
}
</script>

<style></style>
