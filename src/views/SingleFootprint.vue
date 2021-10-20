<template>
    <div class="h-screen bg-footprint-bg overflow-y-auto">
        <div class="px-4 pt-8 pb-20 max-w-screen-lg m-auto">
            <div class="header flex justify-between items-center pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 bg-secondary-btn text-secondary-btn-text shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="text-xl text-footprint-title font-bold text-center">Footprints</div>
                <ImgHolder
                    class="w-10 h-10 inline-flex my-auto cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                />
            </div>
            <section class="max-w-screen-sm m-auto">
                <FootprintItem class="mb-4" :imageUrl="details.event.image_url" :size="FootprintWidth" />
                <div class="w-full px-5 py-4 mt-4 filter text-body-text flex flex-col">
                    <div class="flex flex-row justify-between items-center">
                        <h2 class="text-xl font-semibold truncate">{{ details.event.name }}</h2>
                        <Button
                            size="sm"
                            class="w-9 h-9 ml-1 bg-footprint-btn-m text-footprint-btn-m-text shadow-footprint-btn-m"
                            @click="toExternalLink"
                        >
                            <i class="bx bx-link-external bx-xs" />
                        </Button>
                    </div>
                    <div class="text-footprint-title truncate cursor-pointer my-2">
                        <i class="bx bx-link align-middle mr-2" />
                        <span>{{ details.event.event_url }}</span>
                    </div>
                    <section class="text-sm text-footprint-title flex flex-col gap-2">
                        <div class="flex flex-row gap-2 items-center">
                            <CalendarIcon />
                            <span class="text-body-text"
                                >{{ details.event.start_date }} - {{ details.event.end_date }}</span
                            >
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <LocationIcon />
                            <span class="text-body-text">{{ details.event.city }} - {{ details.event.country }}</span>
                        </div>
                    </section>
                    <h3 class="text-footprint-title text-lg font-medium capitalize my-2">Description</h3>
                    <p class="text-body-text leading-loose font-medium">
                        {{ details.event.description }}
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import FootprintItem from '@/components/FootprintItem.vue';
import CalendarIcon from '@/components/Icons/CalendarIcon.vue';
import LocationIcon from '@/components/Icons/LocationIcon.vue';
import { POAP } from '@/common/types';
import RSS3 from '@/common/rss3';
import config from '@/config';
import RNSUtils from '@/common/rns';

interface Profile {
    avatar: string;
    username: string;
    address: string;
    bio: string;
}

@Options({
    name: 'SingleFootprint',
    components: { ImgHolder, Button, FootprintItem, CalendarIcon, LocationIcon },
})
export default class SingleFootprint extends Vue {
    rns: string = '';
    ethAddress: string = '';
    FootprintWidth: number = Math.min(window.innerWidth - 32, 640);
    rss3Profile: Profile = {
        avatar: config.defaultAvatar,
        username: '',
        address: '',
        bio: '',
    };
    details: POAP = {
        event: {
            id: 0,
            fancy_id: '',
            country: '',
            city: '',
            description: '',
            year: 1970,
            start_date: '',
            end_date: '',
            expiry_date: '',
            name: '',
            image_url: '',
            event_url: '',
            supply: 0,
        },
        owner: '',
        tokenId: '',
    };

    async mounted() {
        await RSS3.reconnect();
        const rss3 = await RSS3.visitor();
        await this.getAddress();

        const profile = await rss3.profile.get(this.ethAddress);
        this.rss3Profile.avatar = profile?.avatar?.[0] || config.defaultAvatar;
        this.rss3Profile.username = profile?.name || '';
        this.rss3Profile.address = this.ethAddress;

        const platform: string = String(this.$route.params.platform);
        const identity: string = String(this.$route.params.identity);
        const id: string = String(this.$route.params.id);

        // Setup theme
        const themes = RSS3.getAvailableThemes(await rss3.assets.get(this.ethAddress));
        if (themes[0]) {
            document.body.classList.add(themes[0].class);
        } else {
            document.body.classList.remove(...document.body.classList);
        }

        const footprintData = await RSS3.getAssetProfile(this.ethAddress, 'POAP');

        if (footprintData) {
            const asset = footprintData.assets.find(
                (ag) => ag.platform === platform && ag.identity === identity && ag.id === id,
            );
            if (asset) {
                const detail = (await RSS3.getFootprintDetail(this.ethAddress, platform, identity, id))?.data;
                console.log(detail);
                if (detail) {
                    this.details = detail;
                }
            }
        }
    }

    async getAddress() {
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

    toExternalLink() {
        window.open(this.details.event.event_url);
    }

    back() {
        if (window.history.state.back) {
            window.history.back();
        } else {
            this.$router.push(
                (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) + `/footprints`,
            );
        }
    }
}
</script>

<style></style>
