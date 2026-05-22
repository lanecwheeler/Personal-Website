<template>
    <div :class="['game', {solved: levelSolved}]">
        <div class="banner">
            <div class="settings">
                <div class="level">
                    <button v-if="level !== 1" @click="changeLevel(-1)">-</button>
                    <span v-else></span>
                    <span>{{ level }}</span>
                    <button v-if="level !== 5" @click="changeLevel(1)">+</button>
                    <span v-else></span>
                </div>
                <div class="colorSpace">
                    <button
                        v-for="space in Object.values(ColorSpaces)"
                        :class="{selected: space === colorSpace}"
                        @click="() => colorSpace = space"
                    >
                        {{ space }}
                    </button>
                </div>
                <div class="score">
                    <span>Score: {{ score }}</span>
                    <button @click="getNewColor()">Reset?</button>
                </div>
            </div>
            <h1>
                the Great
                <br/><span>{{ convertColorSpace(curColor) }}</span><br/>
                Color Match
            </h1>
            <p role="button" class="next" @click="getNewColor">Next Color!</p>
        </div>
        <div class="swatches">
            <div
                :class="['swatch', {wrongGuess: swatch.wasGuessed}]"
                v-for="swatch, i in swatches"
                :style="{background: convertColorSpace(swatch)}"
                @click="submitGuess(swatch, i)"
            />
        </div>
    </div>
</template>

<script setup lang="tsx">
    import { ref, computed, watch, onMounted } from 'vue';

    interface Color {r: number, b: number, g: number};
    const level = ref(1);
    const score = ref(0);
    const ColorSpaces = {
        RGB: 'RGB',
        HEX: 'HEX',
        HSL: 'HSL'
    };
    const levelSolved = ref(false);
    const colorSpace = ref(ColorSpaces.RGB);
    const curColor = ref<Color>({r: 0, g: 0, b: 0});
    const bgColor = computed(() => convertColorSpace(curColor.value));
    const generateColor = (generateSimilarColor?: boolean): Color => {
        const similarMin = (channel: number) => Math.max(0, channel - (151 - (151 * (1 - (1/level.value)))));
        const similarMax = (channel: number) => Math.min(255, channel + (151 - (151 * (1 - (1/level.value)))));
        
        const boundedRand = (min: number = 0, max: number = 255) => Math.floor((Math.random() * (max - min)) + min);
        const r = generateSimilarColor
            ? boundedRand(similarMin(curColor.value.r ?? 0), similarMax(curColor.value.r ?? 255))
            : boundedRand();
        const g = generateSimilarColor
            ? boundedRand(similarMin(curColor.value.g ?? 0), similarMax(curColor.value.g ?? 255))
            : boundedRand();
        const b = generateSimilarColor
            ? boundedRand(similarMin(curColor.value.b ?? 0), similarMax(curColor.value.b ?? 255))
            : boundedRand();

        return {r, g, b};
    }

    const convertColorSpace = (color: Color) => {
        const {r, g, b} = color;
        switch (colorSpace.value) {
            case ColorSpaces.RGB:
                return `rgb(${r}, ${g}, ${b})`;
            case ColorSpaces.HEX:
                return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
            case ColorSpaces.HSL:
                const r0 = r / 255;
                const g0 = g / 255;
                const b0 = b / 255;
                const max = Math.max(r0, g0, b0);
                const min = Math.min(r0, g0, b0);
                const d = max - min; 

                let h = 0;
                let s = 0;
                let l = (max + min) / 2;

                if (d !== 0) {
                    // Calculate Saturation
                    s = l > 0.5
                        ? d / (2 - max - min)
                        : d / (max + min);

                    // Calculate Hue
                    switch (max) {
                        case r0: h = (g0 - b0) / d + (g0 < b0 ? 6 : 0); break;
                        case g0: h = (b0 - r0) / d + 2; break;
                        case b0: h = (r0 - g0) / d + 4; break;
                    }
                    h /= 6;
                }
                
                return `hsl(${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`
        }
    }

    const getNewColor = () => {
        levelSolved.value = false;
        const colors = [];
        curColor.value = generateColor(false);
        colors.push(curColor.value);

        for (let i = 0; i < 8; i++) {
            colors.push(generateColor(true));
        }

        for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
        }
        swatches.value = colors;
    }

    const submitGuess = (color: Color, index: number) => {
        if (color == curColor.value) {
            levelSolved.value = color == curColor.value
            score.value++;
        } else {
            score.value = 0;
            swatches.value[index].wasGuessed = true;
        }
        
    };

    const changeLevel = (dir: number) => {
        level.value += dir;
        score.value = 0;
    };
    const reset = () => {
        score.value = 0;
        getNewColor();
    }

    onMounted(() => getNewColor());
    
    const swatches = ref<(Color & {wasGuessed?: boolean})[]>([]);

    watch(colorSpace, () => convertColorSpace(curColor.value));
    watch(level, () => getNewColor());
</script>

<style scoped lang="scss">
    @use "/src/assets/_mixins.scss" as *;

    .game {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;

        @include media() {
            height: calc(100vh - 50px);
        }

        .banner {
            background: black;
            text-align: center;
            transition: var(--quickAnim);

            h1 {
                margin-bottom: .5em;

                @include media() {
                    font-size: 1.25em;
                }

                span {
                    font-size: 1.5em;
                    margin-right: -8px;

                    @include media() {
                        font-size: 1em;
                    }
                }
            }

            .settings {
                display: flex;
                justify-content: space-between;
                padding: .25em 1em;
                font-weight: 500;
                letter-spacing: normal;

                button {
                    font-weight: 500;
                    letter-spacing: normal;
                    margin: .25em;
                    opacity: .5;
                    cursor: pointer;
                    background: none;
                    border: none;
                    font-family: "Ubuntu Sans", sans-serif;
                    font-size: 1em;
                    color: inherit;

                    &.selected {
                        opacity: 1;
                    }
                }

                .level {
                    display: flex;
                    align-items: center;
                    flex-grow: 1;

                    * {
                        flex-basis: 1em;
                        width: 1em;
                        text-align: center;
                        letter-spacing: normal;
                        margin: .25em .25em;
                        padding: 0;
                        transition: var(--quickAnim);
                    }

                    button:hover {
                        opacity: 1;
                    }
                }

                .colorSpace {
                    flex-shrink: 1;
                }

                .score {
                    flex-grow: 1;
                    text-align: right;
                    transition: var(--quickAnim);
                    position: relative;

                    span {
                        /* position: static; */
                        display: inline-flex;
                        padding: 5px 0;
                        overflow: hidden;
                    }

                    button {
                        position: absolute;
                        right: -100%;
                        transition: var(--quickAnim);
                        width: 7em;
                        margin-right: 0;
                        text-align: right;
                    }

                    &:hover button {
                        right: 0;
                        z-index: 999;
                        background: black;
                        opacity: 1;
                        cursor: pointer;
                    }
                }
            }

            .next {
                opacity: 0;
                cursor: none;
                font-weight: 500;
                letter-spacing: .1em;
                opacity: 0;
                transition: var(--quickAnim);
                margin: 0 0 .5em 0;
                pointer-events: none;
            }
        }

        .swatches {
            flex-grow: 1;
            display: flex;
            column-gap: 1em;
            row-gap: 2em;
            flex-wrap: wrap;
            padding: 2em;
            justify-content: space-between;

            .swatch {
                flex-basis: 30%;
                cursor: pointer;
                box-sizing: border-box;
                transition: var(--quickAnim);

                &:hover:not(.wrongGuess) {
                    box-shadow: inset 0px 0px 0px 5px rgba(255, 255, 255, 1);
                }

                &.wrongGuess {
                    opacity: .25;
                    pointer-events: none;
                }
            }
        }

                
        &.solved {
            .banner {
                background: v-bind(bgColor);
                color: contrast-color(v-bind(bgColor));

                .settings {
                    button {
                        color: inherit;
                        background: v-bind(bgColor) !important;
                    }

                }

                .next {
                    pointer-events: all;
                    opacity: 1;
                    cursor: pointer;
                    font-weight: 500;
                    letter-spacing: .1em;
                }
            }

            .swatch {
                pointer-events: none;
                opacity: 1 !important;
                background: v-bind(bgColor) !important;
            }
        }
    
    }


</style>