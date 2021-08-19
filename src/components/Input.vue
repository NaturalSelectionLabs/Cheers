<template>
    <input
        v-if="isSingleLine"
        type="text"
        class="input"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <textarea
        v-else
        class="input textarea"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
    props: {
        modelValue: String,
        placeholder: String,
        isSingleLine: Boolean,
    },
    emits: ['update:modelValue'],
})
export default class Input extends Vue {}
</script>

<style>
@layer components {
    .input {
        @apply box-border font-extralight pl-5 pr-5 pt-3 pb-3 rounded-xl border-none resize-none outline-none bg-gray-bg;
    }

    .textarea {
        @apply h-40;
    }
}
</style>
