<template>
    <h1>Test page</h1>
    <Input :is-single-line="false" v-model="value" />
    <span>
        {{ value }}
    </span>
    <Avatar />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Input from '@/components/Input.vue';
import Avatar from '@/components/Avatar.vue';

@Options({
    components: { Avatar, Input },
})
export default class Test extends Vue {
    value: String = 'value';
}
</script>

<style></style>
