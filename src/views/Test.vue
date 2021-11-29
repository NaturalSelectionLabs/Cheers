<template>
    <h1>Test page</h1>
    <div class="flex flex-col gap-8 items-center">
        <BarCard color="account" class="w-96">
            <template #header>
                <span class="inline-flex w-16 text-account-title"> Accounts </span>
            </template>
            <template #content>
                <AccountItem
                    class="inline-block mr-1 cursor-pointer"
                    :size="40"
                    v-for="id in 8"
                    :key="id"
                    chain="Ethereum"
                />
            </template>
            <template #footer>
                <Button size="sm" class="w-8 h-8 text-account-btn-s-text bg-account-btn-s shadow-account-btn-s">
                    <i class="bx bxs-pencil bx-xs" />
                </Button>
            </template>
        </BarCard>

        <BarCard color="nft" class="w-96">
            <template #header>
                <span class="inline-flex w-16 text-nft-title"> NFTs </span>
            </template>
            <template #content>
                <NFTItem
                    class="flex mr-1 cursor-pointer"
                    image-url="https://i.imgur.com/GdWEt4z.jpg"
                    poster-url="https://i.imgur.com/GdWEt4z.jpg"
                    size="sm"
                    v-for="id in 32"
                    :key="id"
                />
            </template>
            <template #footer>
                <Button size="sm" class="w-8 h-8 text-nft-btn-s-text bg-nft-btn-s shadow-nft-btn-s">
                    <i class="bx bxs-pencil bx-xs" />
                </Button>
            </template>
        </BarCard>

        <FootprintCard
            imageUrl="https://i.imgur.com/GdWEt4z.jpg"
            date="May 03, 2021"
            location="NYC"
            username="Joshsua"
            activity="RSS3 presents the Taurus ♉️️ Conference"
        />

        <Button size="sm" class="text-primary shadow-secondary w-10 h-10 bg-white">
            <i class="bx bx-chevron-left bx-sm"></i>
        </Button>
        <Button size="sm" class="text-primary shadow-secondary w-10 h-10 bg-white">
            <i class="bx bx-x bx-sm"></i>
        </Button>
        <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
            <i class="bx bx-plus bx-sm"></i>
        </Button>

        <div class="flex flex-row gap-7">
            <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
                <i class="bx bxs-copy bx-sm"></i>
            </Button>
            <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
                <i class="bx bx-link-external bx-sm"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="text-account-button shadow-account-sm w-8 h-8 bg-white">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="text-account-button shadow-account-sm w-8 h-8 bg-white">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="text-nft-button shadow-nft-sm w-8 h-8 bg-white">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="text-nft-button shadow-nft-sm w-8 h-8 bg-white">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="text-content-button shadow-content-md w-8 h-8 bg-white">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="text-content-button shadow-content-md w-8 h-8 bg-white">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-5">
            <Button size="lg" class="text-primary shadow-secondary w-45 text-lg bg-white"> Discard </Button>
            <Button size="lg" class="bg-primary shadow-primary w-45 text-white text-lg"> Save </Button>
        </div>

        <Button size="lg" class="bg-primary shadow-primary w-80 text-white text-2xl"> Connect A Wallet </Button>

        <Button size="lg" class="text-primary shadow-secondary w-80 text-lg bg-white">
            <span>Edit Profile</span>
            <i class="bx bx-pencil bx-sm"></i>
        </Button>

        <Button size="lg" class="text-primary shadow-secondary w-80 text-lg bg-white">
            <span>Follow</span>
            <i class="bx bx-plus bx-sm"></i>
        </Button>

        <Button size="lg" class="text-primary shadow-secondary w-80 text-lg bg-white">
            <span>Following</span>
            <i class="bx bx-check bx-sm"></i>
        </Button>

        <Button size="sm" class="text-account-button shadow-account-sm text-xs bg-white"> Show All </Button>

        <Button size="sm" class="text-nft-button shadow-nft-sm text-xs bg-white"> Hide All </Button>

        <Button size="sm" class="bg-nft-button text-white text-xs shadow-nft"> Select NFTs to display </Button>

        <Button
            size="sm"
            class="bg-content-button text-white text-xs shadow-content opacity-35 cursor-not-allowed"
            disabled
        >
            Coming Soon
        </Button>

        <Button size="lg" class="bg-account-button text-white text-lg shadow-account"> Manage Accounts</Button>

        <Button size="lg" class="bg-nft-button text-white text-lg shadow-nft"> Manage NFTs</Button>

        <hr />

        <AvatarEditor size="sm" />
        <AvatarEditor size="md" />
        <AvatarEditor size="lg" />
        <Input :is-single-line="true" placeholder="SingleLineInputComponent" v-model="value" class="w-80" />
        <Input :is-single-line="false" placeholder="MultiLineInputComponent" v-model="value" class="w-80" />

        <Card
            title="TestCard"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-80"
            tips="TipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTipsTips"
            :is-having-content="false"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
                    <i class="bx bx-plus bx-sm" />
                </Button>
            </template>
            <template #footer-button>
                <Button size="sm" class="text-account-button shadow-account-sm ml-auto text-xs bg-white">
                    Show All
                </Button>
            </template>
        </Card>
        <Card
            title="TestCard"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-80"
            tips="123456"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #footer-button>
                <Button size="sm" class="text-nft-button shadow-nft-sm text-xs bg-white"> Hide All </Button>
            </template>
        </Card>
        <Card
            title="TestCard"
            color-title="text-content-title"
            color-tips="text-content-title"
            color-background="bg-content-bg"
            class="w-80"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <div class="flex flex-row gap-2">
                    <Button size="sm" class="text-content-button shadow-content-md w-8 h-8 bg-white">
                        <i class="bx bxs-pencil bx-xs"></i>
                    </Button>
                    <Button size="sm" class="text-content-button shadow-content-md w-8 h-8 bg-white">
                        <i class="bx bx-expand-alt bx-xs"></i>
                    </Button>
                </div>
            </template>
            <template #content>
                <div class="flex justify-center">
                    <Button
                        size="lg"
                        class="
                            bg-content-button
                            m-auto
                            text-white text-lg
                            font-extralight
                            shadow-content
                            opacity-35
                            cursor-not-allowed
                        "
                        disabled
                    >
                        Coming Soon
                    </Button>
                </div>
            </template>
        </Card>
        <Card
            title="TestCard"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-80"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    v-for="id in 8"
                    :key="id"
                    class="shadow-account-sm inline-flex m-0.5 rounded-full"
                    :size="64"
                    chain="Ethereum"
                />
            </template>
        </Card>
        <Card
            title="TestCard"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-80"
            tips="123456"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #content>
                <NFTItem
                    v-for="id in 8"
                    :key="id"
                    class="shadow-nft-sm inline-flex m-0.5"
                    size="auto"
                    imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                />
            </template>
        </Card>

        <Card
            title="TestCard"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-80"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    v-for="id in 8"
                    :key="id"
                    class="shadow-account-sm inline-flex m-0.5 rounded-full"
                    :size="64"
                    chain="Ethereum"
                />
            </template>
        </Card>
        <Card
            title="TestCard"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-80"
            tips="123456"
            :is-having-content="true"
            :is-single-line="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #content>
                <NFTItem
                    v-for="id in 8"
                    :key="id"
                    class="shadow-nft-sm inline-flex m-0.5"
                    :size="64"
                    imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                />
            </template>
        </Card>

        <Card
            title="TestCard"
            color-title="text-nft-title"
            color-tips="text-nft-title"
            color-background="bg-nft-bg"
            class="w-80"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #content>
                <details open>
                    <summary class="text-nft-button">Cool Cats NFTs</summary>
                    <p>
                        <NFTItem
                            v-for="id in 8"
                            :key="id"
                            class="shadow-nft-sm inline-flex m-0.5"
                            :size="64"
                            imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                        />
                    </p>
                </details>
                <details class="mt-2">
                    <summary class="text-nft-button">Cool Fendi NFTs</summary>
                    <p>
                        <NFTItem
                            v-for="id in 8"
                            :key="id"
                            class="shadow-nft-sm inline-flex m-0.5"
                            :size="64"
                            imageUrl="https://i.imgur.com/GdWEt4z.jpg"
                        />
                    </p>
                </details>
            </template>
        </Card>

        <FollowerCard
            class="w-80 shadow-content"
            v-for="id in 3"
            :key="id"
            avatar="https://i.imgur.com/GdWEt4z.jpg"
            name="Test"
            address="0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA"
        />

        <AccountItem chain="Ethereum" size="70" :deleteMode="true" />
        <AccountItem chain="Ethereum" size="70" :deleteMode="false" />

        <div class="h-45 relative w-45">
            <NFTItem :size="180" imageUrl="https://i.imgur.com/GdWEt4z.jpg" />
            <NFTBadges
                class="absolute z-50 right-2.5 top-2.5"
                chain="Ethereum"
                location="overlay"
                collectionImg="https://i.imgur.com/GdWEt4z.jpg"
            />
        </div>

        <NFTBadges
            class="absolute z-50 right-2.5 top-2.5"
            chain="Ethereum"
            location="header"
            collectionImg="https://i.imgur.com/GdWEt4z.jpg"
        />

        <ScanTag chain="Ethereum" />
        <ScanTag chain="Ronins" />

        <Card
            :title="`Draggable - 1 (Count: ${accounts.array1.length})`"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-80"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <draggable class="min-h-20" :list="accounts.array1" group="accounts" itemKey="chain">
                    <template #item="{ element }">
                        <AccountItem
                            class="shadow-account-sm inline-flex m-0.5 rounded-full"
                            :size="64"
                            :chain="element.chain"
                        />
                    </template>
                </draggable>
            </template>
        </Card>
        <Card
            :title="`Draggable - 2 (Count: ${accounts.array2.length})`"
            color-title="text-account-title"
            color-tips="text-account-title"
            color-background="bg-account-bg"
            class="w-80"
            :is-having-content="true"
        >
            <template #accessibility>
                <i class="bx bx-info-circle" style="color: rgba(0, 0, 0, 0.2)" />
            </template>
            <template #header-button>
                <Button size="sm" class="bg-account-button w-10 h-10 text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <draggable class="min-h-20" :list="accounts.array2" group="accounts" itemKey="chain">
                    <template #item="{ element }">
                        <AccountItem
                            class="shadow-account-sm inline-flex m-0.5 rounded-full"
                            :size="64"
                            :chain="element.chain"
                        />
                    </template>
                </draggable>
            </template>
        </Card>

        <Button size="lg" class="bg-content-button w-45 text-white shadow-content" @click="isShowingModal = true">
            Open Modal
        </Button>
        <Modal v-if="isShowingModal">
            <template #header>
                <h1>Test Modal</h1>
            </template>
            <template #body>
                <p>Here's something ...</p>
            </template>
            <template #footer>
                <div class="flex flex-row gap-5">
                    <Button
                        size="sm"
                        class="text-primary shadow-secondary w-32 bg-white"
                        @click="isShowingModal = false"
                    >
                        Discard
                    </Button>
                    <Button size="sm" class="bg-primary shadow-primary w-32 text-white" @click="isShowingModal = false">
                        Save
                    </Button>
                </div>
            </template>
        </Modal>

        <div class="flex flex-row gap-5">
            <Button size="lg" class="bg-primary shadow-primary w-40 text-white" @click="walletConnect">
                Wallet Connect
            </Button>
            <Button size="lg" class="w-40 text-white bg-yellow-600" @click="metamaskConnect"> Metamask Connect </Button>
        </div>
        <Button size="lg" class="w-80 text-white bg-danger" @click="disconnect"> Disconnect </Button>

        <Button size="lg" class="bg-primary shadow-primary w-80 text-white" @click="loadingModal"> Loading </Button>

        <Button size="lg" class="bg-primary shadow-primary w-80 text-white" @click="shareModal"> Share </Button>
        <!-- <Modal v-show="isLoading">
            <template #body>
                <span
                    class="absolute block transform -translate-x-1/2 -translate-y-1/2 opacity-50 text-9xl text-primary top-1/2 left-1/2"
                >
                    <i class="bx bx-loader-alt bx-spin"></i>
                </span>
            </template>
        </Modal> -->

        <div class="w-80">
            <div
                class="aspect-w-16 aspect-h-9 rounded-2xl box-border"
                style="background: linear-gradient(107.57deg, #34816e 18.23%, #eae195 99.85%, #9ab85a 99.9%)"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import Input from '@/components/Input/Input.vue';
import AvatarEditor from '@/components/Profile/AvatarEditor.vue';
import Card from '@/components/Card/Card.vue';
import FollowerCard from '@/components/FollowerCard.vue';
import AccountItem from '@/components/Account/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import ScanTag from '@/components/NFT/ScanTag.vue';
import Modal from '@/components/Common/Modal.vue';
import RSS3 from '@/common/rss3';
import FootprintCard from '@/components/Footprint/FootprintCard.vue';

import draggable from 'vuedraggable';

import Loading from '@/components/Loading/Loading.vue';
import BarCard from '@/components/Card/BarCard.vue';

import config from '@/config';

@Options({
    name: 'Test',
    components: {
        BarCard,
        ScanTag,
        Modal,
        FollowerCard,
        Card,
        AvatarEditor,
        Button,
        Input,
        AccountItem,
        NFTItem,
        NFTBadges,
        draggable,
        Loading,
        FootprintCard,
    },
})
export default class Test extends Vue {
    config: typeof config = config;
    value: String = 'value';
    accounts: Object = {
        array1: [
            {
                address: '0x123456789',
                chain: 'Ethereum',
            },
            {
                address: '0x123456789',
                chain: 'BSC',
            },
        ],
        array2: [
            {
                address: '0x123456789',
                chain: 'Ronin',
            },
        ],
    };
    isShowingModal: Boolean = false;
    isLoading: Boolean = false;
    isShareing: Boolean = false;

    async walletConnect() {
        await RSS3.walletConnect();
    }

    async metamaskConnect() {
        await RSS3.metamaskConnect();
    }

    async disconnect() {
        await RSS3.disconnect();
    }

    async loadingModal() {
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
        }, 2000);
    }

    async shareModal() {
        this.isShareing = true;
        setTimeout(() => {
            this.isShareing = false;
        }, 8000);
    }
}
</script>

<style></style>
