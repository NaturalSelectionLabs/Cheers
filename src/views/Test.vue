<template>
    <h1>Test page</h1>
    <div class="flex flex-col gap-8 items-center">
        <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary">
            <i class="bx bx-chevron-left bx-sm"></i>
        </Button>
        <Button size="sm" class="w-10 h-10 bg-white text-primary shadow-secondary">
            <i class="bx bx-x bx-sm"></i>
        </Button>
        <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
            <i class="bx bx-plus bx-sm"></i>
        </Button>

        <div class="flex flex-row gap-7">
            <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                <i class="bx bxs-copy bx-sm"></i>
            </Button>
            <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                <i class="bx bx-link-external bx-sm"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="w-8 h-8 bg-white text-account-button shadow-account-sm">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="w-8 h-8 bg-white text-account-button shadow-account-sm">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="w-8 h-8 bg-white text-nft-button shadow-nft-sm">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="w-8 h-8 bg-white text-nft-button shadow-nft-sm">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-2">
            <Button size="sm" class="w-8 h-8 bg-white text-content-button shadow-content-md">
                <i class="bx bxs-pencil bx-xs"></i>
            </Button>
            <Button size="sm" class="w-8 h-8 bg-white text-content-button shadow-content-md">
                <i class="bx bx-expand-alt bx-xs"></i>
            </Button>
        </div>

        <div class="flex flex-row gap-5">
            <Button size="lg" class="w-45 text-lg bg-white text-primary shadow-secondary"> Discard </Button>
            <Button size="lg" class="w-45 text-lg bg-primary text-white shadow-primary"> Save </Button>
        </div>

        <Button size="lg" class="w-80 text-2xl bg-primary text-white shadow-primary"> Connect A Wallet </Button>

        <Button size="lg" class="w-80 text-lg bg-white text-primary shadow-secondary">
            <span>Edit Profile</span>
            <i class="bx bx-pencil bx-sm"></i>
        </Button>

        <Button size="lg" class="w-80 text-lg bg-white text-primary shadow-secondary">
            <span>Follow</span>
            <i class="bx bx-plus bx-sm"></i>
        </Button>

        <Button size="lg" class="w-80 text-lg bg-white text-primary shadow-secondary">
            <span>Following</span>
            <i class="bx bx-check bx-sm"></i>
        </Button>

        <Button size="sm" class="text-xs bg-white text-account-button shadow-account-sm"> Show All </Button>

        <Button size="sm" class="text-xs bg-white text-nft-button shadow-nft-sm"> Hide All </Button>

        <Button size="sm" class="text-xs bg-nft-button text-white shadow-nft"> Select NFTs to display </Button>

        <Button
            size="sm"
            class="text-xs bg-content-button opacity-35 text-white shadow-content cursor-not-allowed"
            disabled
        >
            Coming Soon
        </Button>

        <Button size="lg" class="text-lg bg-account-button text-white shadow-account"> Manage Accounts</Button>

        <Button size="lg" class="text-lg bg-nft-button text-white shadow-nft"> Manage NFTs</Button>

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
                <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #footer-button>
                <Button size="sm" class="text-xs bg-white text-account-button shadow-account-sm ml-auto">
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
                <Button size="sm" class="text-xs bg-white text-nft-button shadow-nft-sm"> Hide All </Button>
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
                    <Button size="sm" class="w-8 h-8 bg-white text-content-button shadow-content-md">
                        <i class="bx bxs-pencil bx-xs"></i>
                    </Button>
                    <Button size="sm" class="w-8 h-8 bg-white text-content-button shadow-content-md">
                        <i class="bx bx-expand-alt bx-xs"></i>
                    </Button>
                </div>
            </template>
            <template #content>
                <Button
                    size="lg"
                    class="text-xs bg-content-button opacity-35 text-white shadow-content cursor-not-allowed m-auto"
                    disabled
                >
                    Coming Soon
                </Button>
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
                <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    v-for="id in 8"
                    :key="id"
                    class="shadow-account-sm inline-flex m-0.5"
                    size="64"
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
                    :size="64"
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
                <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <AccountItem
                    v-for="id in 8"
                    :key="id"
                    class="shadow-account-sm inline-flex m-0.5"
                    size="64"
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

        <div class="relative w-45 h-45">
            <NFTItem size="180" imageUrl="https://i.imgur.com/GdWEt4z.jpg" />
            <NFTBadges
                class="absolute z-50 top-2.5 right-2.5"
                chain="Ethereum"
                location="overlay"
                collectionImg="https://i.imgur.com/GdWEt4z.jpg"
            />
        </div>

        <NFTBadges
            class="absolute z-50 top-2.5 right-2.5"
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
                <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <draggable class="min-h-20" :list="accounts.array1" group="accounts" itemKey="chain">
                    <template #item="{ element, index }">
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
                <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                    <i class="bx bx-plus bx-sm"></i>
                </Button>
            </template>
            <template #content>
                <draggable class="min-h-20" :list="accounts.array2" group="accounts" itemKey="chain">
                    <template #item="{ element, index }">
                        <AccountItem
                            class="shadow-account-sm inline-flex m-0.5 rounded-full"
                            :size="64"
                            :chain="element.chain"
                        />
                    </template>
                </draggable>
            </template>
        </Card>

        <Button size="lg" class="w-45 bg-content-button text-white shadow-content" @click="isShowingModal = true">
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
                        class="w-32 bg-white text-primary shadow-secondary"
                        @click="isShowingModal = false"
                    >
                        Discard
                    </Button>
                    <Button size="sm" class="w-32 bg-primary text-white shadow-primary" @click="isShowingModal = false">
                        Save
                    </Button>
                </div>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';
import AvatarEditor from '@/components/AvatarEditor.vue';
import Card from '@/components/Card.vue';
import FollowerCard from '@/components/FollowerCard.vue';
import AccountItem from '@/components/AccountItem.vue';
import NFTItem from '@/components/NFT/NFTItem.vue';
import NFTBadges from '@/components/NFT/NFTBadges.vue';
import ScanTag from '@/components/NFT/ScanTag.vue';
import Modal from '@/components/Modal.vue';

import draggable from 'vuedraggable';

@Options({
    components: {
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
    },
})
export default class Test extends Vue {
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
}
</script>

<style></style>
