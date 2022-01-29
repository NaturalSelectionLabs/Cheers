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
                        <i class="bx bxs-send bx-xs" />
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
                        separator=","
                        :autoinit="true"
                    />
                </h1>
            </section>
            <section>
                <h2 class="mb-2 text-xl font-semibold">Invitees</h2>
                <div class="flex flex-col gap-y-4 p-4 w-full bg-card-bg rounded">
                    <FollowCard
                        class="w-auto cursor-pointer"
                        v-for="item in followRenderList"
                        :key="item.address"
                        :avatar="item.avatar"
                        :name="item.username"
                        :bio="item.bio"
                        :rns="item.rns"
                        :address="item.address"
                    />
                    <div
                        class="flex flex-col items-center justify-center w-full h-32"
                        v-if="followRenderList.length === 0"
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

@Options({
    name: 'Invite',
    components: { ImgHolder, Button, Vue3Autocounter, FollowCard, Input, Header },
})
export default class Invite extends Vue {
    avatar: string = config.defaultAvatar;
    ethAddress: string = '';
    remainQuota: number = 0;
    followRenderList: Profile[] = [];
    inviteAddress: string = '';
    hasBeenInvited: boolean = true;
    tip: string = '';

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

            const apiUser = RSS3.getAPIUser().persona;
            const profiles = await apiUser.profile.getList(res.data.data.invitees);
            for (const profile of profiles) {
                const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
                this.followRenderList.push({
                    avatar: profile.avatar?.[0] || config.defaultAvatar,
                    username: profile.name || '',
                    bio: extracted,
                    address: profile.persona,
                    rns: '',
                });
            }
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
            const apiUser = RSS3.getAPIUser().persona;
            const profile = await apiUser.profile.get(this.inviteAddress);
            const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
            this.followRenderList.push({
                avatar: profile.avatar?.[0] || config.defaultAvatar,
                username: profile.name || '',
                bio: extracted,
                address: this.inviteAddress,
                rns: '',
            });
            this.remainQuota--;
        }
    }
}
</script>

<style></style>
