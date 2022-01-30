<template>
    <div class="m-auto px-4 py-9 max-w-screen-lg text-body-text">
        <Header title="Invite" />
        <div class="flex flex-col gap-8 m-auto mt-4 max-w-screen-sm">
            <section>
                <div class="flex flex-row gap-4 items-center w-full">
                    <Input
                        class="flex flex-1"
                        :is-single-line="true"
                        placeholder="Invitee's Address"
                        v-model="inviteAddress"
                    />
                    <Button size="sm" class="w-9 h-9 text-white bg-primary-text" @click="invite">
                        <i class="bx bx-beer bx-xs" />
                    </Button>
                </div>
                <span class="flex px-2 w-full text-left" v-if="tip">
                    <i class="bx bx-info-circle mr-2 text-btn-icon text-lg" />
                    <span> {{ tip }} </span>
                </span>
            </section>
            <section>
                <h2 class="mb-2 text-xl font-semibold">Remaining Invitations</h2>
                <h1 class="text-btn-icon text-3xl font-semibold">
                    <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="remainQuota"
                        :duration="1"
                        :autoinit="true"
                    />
                </h1>
            </section>
            <section>
                <h2 class="mb-2 text-xl font-semibold">Invitees</h2>
                <div class="flex flex-col gap-y-4 p-4 w-full bg-card-bg rounded">
                    <div
                        class="flex flex-row gap-2 items-center"
                        v-for="item in inviteesRenderList"
                        :key="item.address"
                    >
                        <FollowCard
                            class="flex-1 cursor-pointer"
                            :avatar="item.avatar"
                            :name="item.username"
                            :bio="item.bio"
                            :rns="item.rns"
                            :address="item.address"
                            @click="toPublicPage(item.rns, item.address)"
                        />
                        <i v-show="getActiveState(item.address)" class="bx bx-sm bx-check text-account-btn-m" />
                    </div>
                    <div
                        class="flex flex-col items-center justify-center w-full h-32"
                        v-if="inviteesRenderList.length === 0"
                    >
                        <span>No invitees yet</span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import ImgHolder from '@/components/Common/ImgHolder.vue';
import Vue3Autocounter from 'vue3-autocounter';
import FollowCard from '@/components/Follow/FollowCard.vue';
import Input from '@/components/Input/Input.vue';
import Header from '@/components/Common/Header.vue';
import RSS3 from '@/common/rss3';
import config from '@/config';
import { Profile } from '@/common/types';
import utils from '@/common/utils';
import axios from 'axios';
import RNS from '@/common/rns';

@Options({
    name: 'Invite',
    components: { ImgHolder, Button, Vue3Autocounter, FollowCard, Input, Header },
})
export default class Invite extends Vue {
    avatar: string = config.defaultAvatar;
    ethAddress: string = '';
    remainQuota: number = 0;
    inviteesRenderList: Profile[] = [];
    inviteAddress: string = '';
    hasBeenInvited: boolean = true;
    tip: string = '';
    loadingNo: number = 0;
    invitees: any[] = [];

    async mounted() {
        if (RSS3.isValidRSS3()) {
            const rss3Profile = RSS3.getLoginUser();
            this.ethAddress = rss3Profile.address;
            const res = await axios.get(`https://whitelist.cheer.bio/api/status/${this.ethAddress}`);

            if (!res.data.ok) {
                this.hasBeenInvited = res.data.ok;
                return;
            }

            this.remainQuota = res.data.data.remain_quota;
            this.invitees = res.data.data.invitees;

            const apiUser = RSS3.getAPIUser().persona;
            const profiles = await apiUser.profile.getList(this.invitees.map((invitee) => invitee.address));
            for (const profile of profiles) {
                const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
                this.inviteesRenderList.push({
                    avatar: profile.avatar?.[0] || config.defaultAvatar,
                    username: profile.name || '',
                    bio: extracted,
                    address: profile.persona,
                    rns: '',
                });
            }
            this.startLoadRNS();
        } else {
            this.$router.push('/');
        }
    }

    async invite() {
        if (this.remainQuota < 1) {
            this.tip = 'All quota exhausted.';
            return;
        }
        const res = await axios.post('https://whitelist.cheer.bio/api/invite', {
            address: this.ethAddress,
            invitee: this.inviteAddress,
        });
        this.tip = res.data.message;
        if (res.data.code === 200 && res.data.ok) {
            //  active status for the new invited user
            this.invitees.push({ address: this.inviteAddress, is_activated: false });
            const apiUser = RSS3.getAPIUser().persona;
            const profile = await apiUser.profile.get(this.inviteAddress);
            const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
            this.inviteesRenderList.push({
                avatar: profile.avatar?.[0] || config.defaultAvatar,
                username: profile.name || '',
                bio: extracted,
                address: this.inviteAddress,
                rns: '',
            });
            this.remainQuota--;
            this.startLoadRNS();
        }
    }

    startLoadRNS() {
        setTimeout(() => {
            this.loadRNS();
        }, 0);
    }

    async loadRNS() {
        const startNo = this.loadingNo;
        const endNo = this.inviteesRenderList.length;
        for (let i = startNo; i < endNo; i++) {
            const item = this.inviteesRenderList[i];
            try {
                item.rns = await RNS.addr2Name(item.address);
            } catch (e) {
                console.log(item, e);
            }
            this.loadingNo = i;
        }
    }

    toPublicPage(rns: string, ethAddress: string) {
        if (rns) {
            window.location.href = `//${rns}.${config.subDomain.rootDomain}`;
        } else {
            window.location.href = `//${config.subDomain.rootDomain}/${ethAddress}`;
        }
    }

    getActiveState(address: string) {
        const invitee = this.invitees.find((invitee) => invitee.address === address);
        return invitee.is_activated;
    }
}
</script>

<style></style>
