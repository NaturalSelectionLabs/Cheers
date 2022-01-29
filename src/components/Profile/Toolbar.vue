<template>
    <transition name="fade" mode="out-in">
        <Button size="sm" class="mt-2 w-full text-lg bg-secondary-btn cursor-wait md:m-0" v-if="isLoadingPersona">
            <i class="bx bx-xs bx-loader-circle bx-spin" />
            <span>Loading...</span>
        </Button>
        <Button
            size="sm"
            class="mt-2 w-full text-lg duration-200 md:m-0"
            v-else-if="!isOwner"
            v-bind:class="[isFollowing ? 'bg-white' : 'bg-primary-btn']"
            @click="emitToggleFollow"
        >
            <i class="bx bx-xs no-underline" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
        </Button>
        <Button v-else size="sm" class="mt-2 w-full text-lg bg-white truncate md:m-0" @click="emitSetUp">
            <i class="bx bx-xs bx-pencil" />
            <span>Edit Profile</span>
        </Button>
    </transition>
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
    emits: ['toggleFollow', 'toSetupPage'],
})
export default class Toolbar extends Vue {
    emitToggleFollow() {
        this.$emit('toggleFollow');
    }

    emitSetUp() {
        this.$emit('toSetupPage');
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
