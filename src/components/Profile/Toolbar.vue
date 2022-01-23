<template>
    <transition name="fade" mode="out-in">
        <Button size="sm" class="mt-2 w-full text-lg bg-secondary-btn cursor-wait md:m-0" v-if="isLoadingPersona">
            <span>Loading...</span>
            <i class="bx bx-sm bx-loader-circle bx-spin" />
        </Button>
        <Button
            size="sm"
            class="mt-2 w-full text-lg duration-200 md:m-0"
            v-else-if="!isOwner"
            v-bind:class="[isFollowing ? 'bg-white' : 'bg-primary-btn']"
            @click="emitToggleFollow"
        >
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
            <i class="bx no-underline" v-bind:class="[isFollowing ? 'bx-check' : 'bx-plus']"></i>
        </Button>
        <Button v-else size="sm" class="mt-2 w-full text-lg bg-white truncate md:m-0" @click="emitSetUp">
            <span>Edit Profile</span>
            <i class="bx bx-pencil"></i>
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
