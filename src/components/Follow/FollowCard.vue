<template>
    <div class="flex flex-row gap-6 items-center justify-start px-2 md:my-1 md:px-4" ref="card">
        <div class="avatar">
            <img
                :src="fixedUrl"
                :alt="name"
                class="flex-grow-0 flex-shrink w-9 h-9 rounded-full object-cover md:w-14 md:h-14"
                ref="avatar"
                crossorigin="anonymous"
            />
        </div>
        <div class="flex flex-1 flex-col w-0">
            <div class="flex flex-row">
                <div class="text-sm font-semibold truncate md:text-2xl">
                    {{ $props.name || rnsWithSuffix || formatter($props.address) }}
                </div>
                <span
                    class="
                        ml-1.5
                        px-1.5
                        py-0.5
                        text-sm
                        bg-primary-text bg-opacity-5
                        rounded-sm
                        truncate
                        md:ml-3 md:px-3 md:py-1 md:text-xl
                    "
                >
                    {{ $props.rns ? rnsWithSuffix : formatter($props.address) }}
                </span>
            </div>
            <div class="flex">
                <div class="text-xs truncate md:text-lg">
                    {{ $props.bio }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import utils from '@/common/utils';
import { formatter } from '@/common/address';
import config from '@/common/config';

@Options({
    props: {
        avatar: String,
        name: String,
        bio: String,
        rns: String,
        address: String,
    },
})
export default class FollowCard extends Vue {
    avatar!: string;
    name!: string;
    rns!: string;

    get fixedUrl() {
        return utils.fixURLSchemas(this.avatar);
    }

    get rnsWithSuffix() {
        return this.rns.includes('.') ? this.rns : `${this.rns}${this.rns ? config.rns.suffix : ''}`;
    }

    formatter = formatter;
}
</script>

<style scoped lang="postcss"></style>
