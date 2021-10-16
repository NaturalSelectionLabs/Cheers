<template>
    <section>
        <Button
            size="sm"
            class="w-full text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn cursor-wait"
            v-if="isLoadingPersona"
        >
            <span>Loading...</span>
            <i class="bx bx-sm bx-loader-circle bx-spin" />
        </Button>

        <Button
            size="sm"
            class="w-full text-lg mb-4 md:m-0 duration-200"
            v-else-if="!isOwner"
            v-bind:class="[
                isFollowing
                    ? 'bg-secondary-btn text-secondary-btn-text shadow-secondary-btn'
                    : 'bg-primary-btn text-primary-btn-text shadow-primary-btn',
            ]"
            @click="emitAction"
        >
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
            <i class="bx bx-sm no-underline" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
        </Button>

        <div class="flex mb-4 gap-2 mt-2 md:m-0" v-else>
            <Button
                size="sm"
                class="text-lg bg-secondary-btn text-secondary-btn-text shadow-secondary-btn flex-1 truncate"
                @click="emitSetUp"
            >
                <span>Edit Profile</span>
                <i class="bx bx-pencil bx-sm"></i>
            </Button>
            <Button
                size="sm"
                class="w-13 text-lg bg-primary-btn text-primary-btn-text shadow-primary-btn"
                @click="emitLogout"
            >
                <i class="bx bx-log-out bx-sm"></i>
            </Button>
        </div>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button.vue';

@Options({
    components: {
        Button,
    },
    props: {
        isLoadingPersona: Boolean,
        isFollowing: Boolean,
        isOwner: Boolean,
    },
    emits: ['action', 'toSetupPage', 'logout'],
})
export default class Toolbar extends Vue {
    emitAction() {
        this.$emit('action');
    }

    emitSetUp() {
        this.$emit('toSetupPage');
    }

    emitLogout() {
        this.$emit('logout');
    }
}
</script>

<style></style>
