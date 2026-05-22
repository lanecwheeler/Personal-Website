<template>
    <div :class="['modalOverlay', {open: props.isOpen}]" @click.self="close">
        <div class="modal">
            <div class="close" @click="close">—</div>
            <slot></slot>
            <div class="button">
                <button @click="close">Sweet</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    const props = defineProps({isOpen: Boolean});
    const emits = defineEmits(['close']);
    const close = () => emits('close');
</script>

<style scoped>
    * { --error: hsl(from var(--accentText) mod(calc((h + 120)), 360) s calc(l * 1.2) / 1) }

    .modalOverlay {
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        transition: var(--quickAnim);

        &.open {
            pointer-events: all;
            opacity: 1;
        }
    }

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 999;
        background: rgb(0, 0, 0, .9);
        max-height: 90vh;
        max-width: 90vw;
        width: 800px;
        transition: var(--quickAnim);
        border: 2px solid hsl(from var(--accentText) h calc(s * 1.5) calc(l * 1.25) / .5);
        box-shadow: 0 0 10px 0 hsl(from var(--accentText) h s calc(l) / .5) inset,
            0 0 5px 0 hsl(from var(--accentText) h s calc(l) / .5);
        overflow:auto;

        .emphasized {
            font-size: 1.25em;
            color: var(--accentText);
            font-weight: 500;

            span {
                fill: var(--accentText);
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                transform: scale(1.5);
                transition: var(--quickAnim);
                opacity: .5;

                &:hover {
                    opacity: 1;
                }
            }
        }

        .descWrapper {
            padding: 1em 2em;
            text-align: justify;

            .aiNotice {
                font-size: 1em;
                font-weight: 300;
                color: var(--error);
                letter-spacing: normal;
            }
        }
        
        &.open {
            pointer-events: all;
            opacity: 1;
        }

        .close {
            display: inline;
            position: sticky;
            right: .5em;
            top: 1em;
            left: calc(100% - 2.25em);
            font-size: .75em;
            font-weight: 500;
            letter-spacing: normal;
            cursor: pointer;
            background: black;
            border: 1px solid rgb(255,255,255,.5);
            padding: .25em;
        }

        .button {
            padding: .5em;
            text-align: center;

            button {
                padding: .5em;
                padding-left: 1em;
                background: none;
                border: 2px solid hsl(from var(--accentText) h calc(s * 1.5) calc(l * 1.25) / .5);
                box-shadow: 0 0 10px 0 hsl(from var(--accentText) h s calc(l) / .5) inset,
                    0 0 5px 0 hsl(from var(--accentText) h s calc(l) / .5);
                opacity: .75;
                color: rgb(255, 255, 255);
                font-family: "Ubuntu Sans", sans-serif;
                font-weight: 500;
                letter-spacing: .5em;
                font-size: 1em;
                cursor: pointer;
                transition: var(--quickAnim);

                &:hover { opacity: 1 }
            }
        }
    }
</style>