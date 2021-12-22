<template>
    <section>
        <Button
            size="sm"
            class="w-full text-secondary-btn-text text-lg bg-secondary-btn shadow-secondary-btn cursor-wait"
            v-if="isLoadingPersona"
        >
            <span>Loading...</span>
            <i class="bx bx-sm bx-loader-circle bx-spin" />
        </Button>

        <Button
            size="sm"
            class="mb-4 w-full text-lg duration-200 md:m-0"
            v-else-if="!isOwner"
            v-bind:class="[
                isFollowing
                    ? 'bg-secondary-btn text-secondary-btn-text shadow-secondary-btn'
                    : 'bg-primary-btn text-primary-btn-text shadow-primary-btn',
            ]"
            @click="emitToggleFollow"
        >
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
            <i class="bx bx-sm no-underline" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
        </Button>

        <div class="flex gap-2 mb-4 mt-2 md:m-0" v-else>
            <Button
                size="sm"
                class="flex-1 text-secondary-btn-text text-lg bg-secondary-btn shadow-secondary-btn truncate"
                @click="emitSetUp"
            >
                <span>Edit Profile</span>
                <i class="bx bx-pencil bx-sm"></i>
            </Button>
            <Button
                size="sm"
                class="w-13 text-secondary-btn-text text-lg bg-secondary-btn shadow-secondary-btn"
                @click="emitLogout"
            >
                <i class="bx bx-log-out bx-sm"></i>
            </Button>
        </div>
    </section>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';

@Options({
    components: {
        Button,
    },
    props: {
        isLoadingPersona: Boolean,
        isFollowing: Boolean,
        isOwner: Boolean,
    },
    emits: ['toggleFollow', 'toSetupPage', 'logout'],
})
export default class Toolbar extends Vue {
    emitToggleFollow() {
        this.$emit('toggleFollow');
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
