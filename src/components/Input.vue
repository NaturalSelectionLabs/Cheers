<template>
    <input
        v-if="isSingleLine"
        type="text"
        class="input"
        :placeholder="placeholder"
        :style="style"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
    <textarea
        v-else
        class="input"
        :placeholder="placeholder"
        :style="style"
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
        width: String,
        isSingleLine: Boolean,
    },
    emits: ['update:modelValue'],
})
export default class Input extends Vue {}
</script>

<style>
@layer components {
    .input {
        @apply box-border font-extralight pl-3 pr-5 rounded-xl border-none resize-none outline-none text-sm; /* color && bg */

        &:focus {
            @apply pl-4; /* bg */
        }

        &::placeholder {
            @apply font-medium; /* color*/
        }
    }
}
</style>
