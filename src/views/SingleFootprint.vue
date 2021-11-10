<template>
    <div class="h-screen bg-footprint-bg overflow-y-auto">
        <div class="m-auto pb-20 pt-8 px-4 max-w-screen-lg">
            <div class="header flex items-center justify-between pb-4">
                <Button
                    size="sm"
                    class="w-10 h-10 text-secondary-btn-text bg-secondary-btn shadow-secondary-btn"
                    @click="back"
                >
                    <i class="bx bx-chevron-left bx-sm"></i>
                </Button>
                <div class="text-center text-footprint-title text-xl font-bold">Footprints</div>
                <ImgHolder
                    class="inline-flex my-auto w-10 h-10 cursor-pointer"
                    :is-rounded="true"
                    :is-border="false"
                    :src="rss3Profile.avatar"
                />
            </div>
            <section class="m-auto max-w-screen-sm">
                <FootprintItem class="mb-4" :imageUrl="details.event.image_url" :size="FootprintWidth" />
                <div class="flex flex-col mt-4 px-5 py-4 w-full text-body-text filter">
                    <div class="flex flex-row items-center justify-between">
                        <h2 class="text-xl font-semibold truncate">{{ details.event.name }}</h2>
                        <Button
                            v-if="details.event.event_url"
                            size="sm"
                            class="ml-1 w-9 h-9 text-footprint-btn-m-text bg-footprint-btn-m shadow-footprint-btn-m"
                            @click="toExternalLink"
                        >
                            <i class="bx bx-link-external bx-xs" />
                        </Button>
                    </div>
                    <div v-if="details.event.event_url" class="my-2 text-footprint-title truncate">
                        <i class="bx bx-link align-middle mr-2" />
                        <span>{{ details.event.event_url }}</span>
                    </div>
                    <section class="flex flex-col gap-2 text-footprint-title text-sm">
                        <div class="flex flex-row gap-2 items-center">
                            <CalendarIcon />
                            <span class="text-body-text">{{ getDate() }}</span>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <LocationIcon />
                            <span class="text-body-text">{{
                                details.event.city || details.event.country || 'Metaverse'
                            }}</span>
                        </div>
                    </section>
                    <section v-if="details.event.description">
                        <h3 class="my-2 text-footprint-title text-lg font-medium capitalize">Description</h3>
                        <p class="text-body-text font-medium leading-loose">
                            {{ details.event.description }}
                        </p>
                    </section>
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
import { getName } from '@/common/utils';

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
            address = getName();
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
                this.rns = await RNSUtils.addr2Name(address);
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
                this.ethAddress = (await RNSUtils.name2Addr(address)).toString();
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

    getDate(): string {
        return this.details.event.start_date
            ? this.formatDate(this.details.event.start_date) +
                  (this.details.event.end_date && this.details.event.end_date !== this.details.event.start_date
                      ? ` ~ ${this.formatDate(this.details.event.end_date)}`
                      : '')
            : 'Loading...';
    }
    formatDate(ts: string): string {
        return new Date(parseInt(ts) * 1000).toLocaleDateString('en-US');
    }
}
</script>

<style></style>
