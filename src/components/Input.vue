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
        @apply flex pb-3 pl-5 pr-5 pt-3 font-extralight bg-input-bg border-input border-input-border rounded-xl box-border;
    }

    .additional {
        @apply flex mx-2 font-medium;
    }

    .input {
        @apply placeholder-black placeholder-opacity-20 flex w-full font-extralight bg-input-bg border-input border-input-border outline-none resize-none;
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
