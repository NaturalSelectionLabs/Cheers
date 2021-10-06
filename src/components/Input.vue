<template>
    <div
        class="wrapper"
        :class="{
            error: $props.isError,
            'cursor-not-allowed': $props.isDisabled,
        }"
    >
        <span v-if="$props.prefix" class="additional">
            {{ $props.prefix }}
        </span>
        <input
            v-if="isSingleLine"
            type="text"
            class="input"
            :class="{
                error: $props.isError,
                'cursor-not-allowed': $props.isDisabled,
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
                'cursor-not-allowed': $props.isDisabled,
            }"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :disabled="$props.isDisabled"
        />
        <span v-if="$props.suffix" class="additional">
            {{ $props.suffix }}
        </span>
    </div>
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
        prefix: String,
        suffix: String,
    },
    emits: ['update:modelValue'],
})
export default class Input extends Vue {}
</script>

<style scoped lang="postcss">
@layer components {
    .wrapper {
        @apply box-border font-extralight pl-5 pr-5 pt-3 pb-3 rounded-xl border-input border-input-border bg-input-bg flex;
    }

    .additional {
        @apply flex;
    }

    .input {
        @apply border-input font-extralight border-input-border resize-none outline-none bg-input-bg placeholder-black placeholder-opacity-20 flex w-full;
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
