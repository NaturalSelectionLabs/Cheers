<template>
    <div class="m-auto px-4 py-9 max-w-screen-lg text-body-text">
        <Header title="Invite" />
        <div class="flex flex-col gap-8 m-auto mt-4 max-w-screen-sm">
            <section class="flex flex-row gap-4 items-center w-full">
                <Input
                    class="flex flex-1"
                    :is-single-line="true"
                    placeholder="Invitee's Address"
                    v-model="inviteAddress"
                />
                <Button size="sm" class="w-9 h-9 text-white bg-primary-text">
                    <i class="bx bxs-send bx-xs" />
                </Button>
            </section>
            <section>
                <h2 class="mb-2 text-xl font-semibold">Remaining Invitations</h2>
                <h1 class="text-btn-icon text-3xl font-semibold">
                    <vue3-autocounter
                        ref="counter"
                        :startAmount="0"
                        :endAmount="residue"
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

@Options({
    name: 'Invite',
    components: { ImgHolder, Button, Vue3Autocounter, FollowCard, Input, Header },
})
export default class Invite extends Vue {
    avatar: string = config.defaultAvatar;
    ethAddress: string = '';
    rns: string = '';
    residue: number = 5;
    followRenderList: Profile[] = [];
    followList: string[] = [
        '0x55F110395C844963b075674e2956eb414018a7a7',
        '0xcb1DAd9bd43576Edf39768E8990FeAcf9E8BBD89',
        '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
        '0xDA048BED40d40B1EBd9239Cdf56ca0c2F018ae65',
    ];
    inviteAddress: string = '';

    async mounted() {
        if (RSS3.isValidRSS3()) {
            const apiUser = RSS3.getAPIUser().persona;
            const profiles = await apiUser.profile.getList(this.followList);
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
            this.$router.push(config.subDomain.isSubDomainMode ? '/' : `/${this.rns || this.ethAddress}`);
        }
    }
}
</script>

<style></style>
