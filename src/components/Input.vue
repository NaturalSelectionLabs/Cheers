<template>
    <input
        v-if="isSingleLine"
        type="text"
        class="input"
        :class="{
            error: $props.isError,
        }"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="$props.isDisabled"
    />
    <textarea
        v-else
        class="input textarea"
        :class="{
            error: $props.isError,
        }"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="$props.isDisabled"
    />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        modelValue: String,
        placeholder: String,
        isSingleLine: Boolean,
        isError: Boolean,
        isDisabled: Boolean,
    },
    emits: ['update:modelValue'],
})
export default class Input extends Vue {}
</script>

<style scoped lang="postcss">
@layer components {
    .input {
        @apply box-border font-extralight pl-5 pr-5 pt-3 pb-3 rounded-xl border-input border-input-border resize-none outline-none bg-input-bg placeholder-black placeholder-opacity-20;
    }
    .input::placeholder {
        font-weight: 500;
    }

    .textarea {
        @apply h-40;
    }

    .error {
        @apply bg-red-100;
    }
}
</style>
