<template>
    <div
        class="box-border flex rounded-xl border-input border-input-border bg-card-bg pb-3 pl-5 pr-5 pt-3 font-extralight"
        :class="{
            'bg-red-100': $props.isError,
            'cursor-not-allowed': $props.isDisabled,
        }"
    >
        <span v-if="$props.prefix" class="mr-2 flex font-medium">
            {{ $props.prefix }}
        </span>
        <input
            v-if="isSingleLine"
            type="text"
            class="input flex w-full resize-none border-input border-input-border bg-white bg-opacity-0 font-extralight placeholder-black placeholder-opacity-20 outline-none"
            :class="{
                'bg-red-100': $props.isError,
                'cursor-not-allowed': $props.isDisabled,
            }"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            :disabled="$props.isDisabled"
        />
        <textarea
            v-else
            class="flex h-40 w-full resize-none border-input border-input-border bg-white bg-opacity-0 font-extralight placeholder-black placeholder-opacity-20 outline-none"
            :class="{
                'bg-red-100': $props.isError,
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
.input::placeholder {
    font-weight: 500;
}
</style>
