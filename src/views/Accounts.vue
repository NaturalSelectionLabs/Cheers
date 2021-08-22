<template>
    <div class="main h-screen px-4 py-8 bg-account-bg">
        <div class="header flex justify-between items-center pb-4">
            <Button size="sm" class="w-10 h-10 bg-white text-account-button shadow-account">
                <i class="bx bx-chevron-left bx-sm"></i>
            </Button>
            <div class="section-title text-2xl text-account-title font-bold text-center">Accounts</div>
            <ImgHolder
                class="w-10 h-10 inline-flex my-auto"
                :is-rounded="true"
                :is-border="false"
                src="https://i.imgur.com/GdWEt4z.jpg"
                alt="nya"
            />
        </div>
        <div class="account-list">
            <div class="flex flex-col gap-y-4">
                <div
                    class="account-wrapper flex flex-row justify-between items-center"
                    v-for="(item, index) in accountList"
                    :key="index"
                >
                    <account-item size="70" :chain="item.chain"></account-item>
                    <span class="address text-2xl font-semibold">{{ filter(item.address) }}</span>
                    <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                        <i class="bx bxs-copy bx-sm"></i>
                    </Button>
                    <Button size="sm" class="w-10 h-10 bg-account-button text-white shadow-account">
                        <i class="bx bx-link-external bx-sm"></i>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';
import ImgHolder from '@/components/ImgHolder.vue';
import AccountItem from '@/components/AccountItem.vue';

@Options({
    components: { ImgHolder, Button, AccountItem },
})
export default class Accounts extends Vue {
    data() {
        return {
            accountList: [
                { chain: 'Ethereum', address: '98765tgdusgakdgetg' },
                { chain: 'BSC', address: '98765tgdusgakdgetg' },
                { chain: 'Ronin', address: '98765tgdusgakdgetg' },
            ],
        };
    }
    /**
     * filter
     */
    public filter(address: string) {
        let res: string = address.slice(0, 6);
        res += '....';
        res += address.slice(-4);
        return res;
    }
}
</script>

<style></style>
