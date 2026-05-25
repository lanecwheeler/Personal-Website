<template>
    <main
        :style="{'--hslColor': hslParts, '--hue': h}"
        :class="{
            scrolling: currentlyScrolling,
            mobile: isMobile,
            scrolled: isScrolled,
        }"
    >
        <div class="background" :class="{shifted: isOpen}">
            <div class="wall" />
            <div class="floor" />
        </div>
        <div :class="['audioStop', {rave: raving}]" @click="stopRave">Stop Rave</div>
        <div class="content" :class="{ open: isOpen }" @wheel="handleWheel" @scroll="handleScroll">
            <div class="currentLocation">
                <p class="path">guest@localhost:</p>
                <p class="location">~{{ cliText }} $</p>
            </div>
            <div :class="['cubeWrapper', {rave: raving}]">
                <Cube :current-face="currentFace" :faces="faces"/>
            </div>
            <div :class="['menu', {scrolled: isScrolled, open: menuOpen}]">
                <label class="mobileMenu" for="mobileToggle">☰</label>
                <input id="mobileToggle" type="checkbox" v-model="menuOpen"/>
                <!-- <div class="screen" /> -->
                <p class="header"># Select a menu item</p>
                <p
                    v-for="face, i in faces"
                    :class="{ active: Number(i) === currentFace }"
                    @click="setFace(Number(i))"
                >
                    cd ~{{ face.menuTitle }}
                </p>
            </div>
            <div :class="['spacer', `spacer--${currentFace}`]">
            </div>
            <div :class="['cards', `cards--${currentFace}`]">
                <div :class="['card', `card--${i}`]" :id="`card--${i}`" v-for="face, i in faces">
                    <div class="scrollAnchor"/>
                    <component v-if="i !== 0" :is="face.section"/>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
    import { ref, shallowRef, computed, watch, onMounted } from 'vue';
    import Cube from "../components/Cube.vue"
    import AboutMe from "../components/AboutMe.vue"
    import Projects from "../components/Projects.vue"
    import ContactMe from "../components/ContactMe.vue"
    import ColorMatch from "../components/ColorMatch.vue"
    import Socials from "../components/SocialMedia.vue"

    // Accent/Background Colors
    const hslChannel = (min = 0, max = 360) => Math.floor((Math.random() * (max - min)) + min);
    const hue = hslChannel(0, 360);
    const isNastyColor = hue > 20 && hue < 80;
    const h = ref(isNastyColor ? hue + 180 : hue);
    const s = ref(hslChannel(50, 70));
    const l = ref(hslChannel(40, 70));
    const hslParts = computed(() => `hsl(${isNastyColor ? h.value + 180 : h.value} ${s.value} ${l.value})`);

    const isMobile = window.innerWidth < 900;
    // Scroll handler
    const currentlyScrolling = ref(false);
    const isScrolled = ref(false);
    const menuOpen = ref(false);
    const contentEl = ref();
    const allCardPos = ref();
    let audio = null;
    const isPlaying = ref(false);

    onMounted(() => {
        contentEl.value = document.querySelector('.content');
        allCardPos.value = [...contentEl.value.querySelectorAll('.card')].map((el) => el.offsetTop);
        audio = new Audio('/hasenchat-shortened.mp3');
        audio.preload = 'auto';
        audio.addEventListener('ended', () => {
            isPlaying.value = false;
        });
        document.addEventListener('keyup', konamiWatch);
    })

    const handleScroll = (e) => {
        if (isMobile) {
            const curPos = contentEl.value.scrollTop;
            if (curPos >= 100 && !isScrolled.value) {
                isScrolled.value = true;
            } else if (curPos <= 100 && isScrolled.value) {
                isScrolled.value = false;
            }
            
            allCardPos.value.forEach((height, index) => {
                if(curPos >= (height - 50)) {
                    currentFace.value = index;
                }
            })
        } 
    }

    const handleWheel = (e) => {
        if (!isMobile) {
            const el = e.target;
            const isUp = e.deltaY < 0;
            const isInModal = el.closest('.modalOverlay.open');
            const stopScroll = currentlyScrolling.value
                || isUp && currentFace.value === 0
                || !isUp && currentFace.value === 5
                || el.closest('.text')?.scrollHeight > el.closest('.text')?.clientHeight
                || isInModal;
            if (stopScroll) return;

            e.preventDefault;
            // Prevents too many scrolls, or looping (which I originally had... but I don't like it)
            currentlyScrolling.value = true;
            currentFace.value = e.deltaY < 0
                ? (currentFace.value + 5) % 6
                : (currentFace.value + 1) % 6;
            setTimeout(() => currentlyScrolling.value = false, 1000);
        }
    }

    const setFace = (index) => {
        if (isMobile) {
            document.querySelector(`#card--${index} .scrollAnchor`)
                .scrollIntoView({ behavior: 'smooth', block: 'start' });
            menuOpen.value = false;
        } else {
            currentFace.value = index;
        }
    };

    // Cube Faces
    const currentFace = ref(0);
    const isOpen = computed(() => currentFace.value !== 0 && !isMobile);
    const faces = shallowRef({
        0: {title: 'hello', section: undefined, menuTitle: ''},
        1: {title: 'About Me', section: AboutMe, menuTitle: '/AboutMe'},
        2: {title: 'Projects', section: Projects, menuTitle: '/Projects'},
        3: {title: 'Contact Me', section: ContactMe, menuTitle: '/ContactMe'},
        4: {title: 'Color Match', section: ColorMatch, menuTitle: '/ColorMatch'},
        5: {title: 'Social Media', section: Socials, menuTitle: '/Socials'},
    });

    const cliText = ref("");
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    watch(currentFace, async (newFace, oldFace) => {
        
        for (const letter of [...cliText.value]) {
            cliText.value = cliText.value.slice(0, -1);
            await wait(25);
        };

        for (const letter of [...faces.value[newFace].menuTitle]) {
            if (newFace === currentFace.value) {
                cliText.value += letter;
                await wait(25);
            }
        };
    })

    // Konami Code
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 
        'ArrowDown', 'ArrowDown', 
        'ArrowLeft', 'ArrowRight', 
        'ArrowLeft', 'ArrowRight', 
        'b', 'a'
    ];
    const keyPresses = [];
    const raving = ref(false);
    const bpm = 127;
    const beatMs = Math.floor(1/ (bpm / 60) * 1000);
    const beatMsString = ref(`${beatMs}ms`);
    const konamiWatch = (e) => {
        keyPresses.push(e.key);
        keyPresses.splice(-konamiCode.length - 1, keyPresses.length - konamiCode.length);
        if (keyPresses.join('').toLowerCase() === konamiCode.join('').toLowerCase()) {
            engageRaveMode();
        }
    }
    const engageRaveMode = async () => {
        if (!audio) return;
        faces.value[0].title = 'Rave Out.'
        raving.value = true;
        await audio.play();
        for (let i = 0; i < 40; i++) {
            if (raving.value) {
                shiftColor();
                if (i > 29) {
                    audio.volume -= 0.1;
                }
                await wait(beatMs);
            }
        }
        stopRave();
    };
    const stopRave = async () => {
        raving.value = false;
        audio.pause();
        audio.currentTime = 0.0;
        audio.volume = 1;
        faces.value[0].title = 'hello';
    };
    const shiftColor = () => h.value = (h.value + 36) % 360;
</script>

<style lang="scss">
    @use "/src/assets/_mixins.scss" as *;
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&display=swap');

    * {
        box-sizing: border-box;
        --anim: all 1s cubic-bezier(0.65,0,0.35,1);
        --quickAnim: all .25s cubic-bezier(0.65,0,0.35,1);
        --accentText: oklch(60% 0.1 var(--hue));
        --bpm: bassBump v-bind(beatMsString) ease-out infinite;
        
        &::-webkit-scrollbar {
            width: 10px;
        }

        &::-webkit-scrollbar-thumb {
            background: hsl(from var(--accentText) h s l / .5);
            background-clip: padding-box; 
            border: 3px solid transparent;
            border-radius: 5px;

            &:hover {
                background: hsl(from var(--accentText) h s l / 1);
                background-clip: padding-box; 
                border: 3px solid transparent;
                border-radius: 5px;
            }
        }
    }

    html,
    body {
        margin: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        font-family: "Ubuntu Sans", sans-serif;
        font-weight: 100;
        letter-spacing: .5em;

        .background {
            width: 200vw;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            transition: var(--anim);

            @include media { width: 100vw }

            &.shifted {
                left: -25%;
                .floor { height: 65vh }
            }

            .wall {
                height: 40vh;
                background: radial-gradient(
                    circle at 25% 40%,
                    hsl(from var(--hslColor) h calc(s * .8) calc(l * .2) / 1) 0%,
                    rgba(0, 0, 0, 0) 60%
                );
            }
            .floor {
                height: 95vh;
                background: radial-gradient(
                    ellipse at 25% 50%,
                    hsl(from var(--hslColor) h calc(s * .8) calc(l * .4) / .7) 0%,
                    rgba(0, 0, 0, 0) 60%
                );
                transition: var(--anim);
            }
        }

        .audioStop {
            position: fixed;
            top: 20vh;
            left: 50%;
            transform: translateX(-50%);
            background: black;
            font-weight: 600;
            padding: .5em .5em .5em 2.5em;
            text-align: center;
            border-radius: .25em;
            color: var(--hslColor);
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: var(--anim);
            border: 1px solid hsl(from var(--hslColor) h calc(s * 1.5) calc(l * 1.25) / .5);
            box-shadow: 0 0 10px 0 hsl(from var(--hslColor) h s calc(l) / .5) inset,
                0 0 5px 0 hsl(from var(--hslColor) h s calc(l) / .5);
            
            &::after {
                content: '';
                position: absolute;
                left: .75em;
                top: 50%;
                transform: translateY(-50%);
                // width: 1em;
                height: calc(100% - 1em);
                aspect-ratio: 1 / 1;
                background: var(--hslColor);
                transition: var(--anim);
            }

            &.rave {
                pointer-events: all;
                opacity: 1;
                cursor: pointer;
            }
        }

        .content {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
            padding: 2em; 
            position: relative;

            @include media() {
                padding: 1em;
                overflow-x: hidden;
                overflow-y: auto;
            }

            .cubeWrapper {
                width: 100%;
                max-width: 100vw;
                perspective: 1000px;
                font-family: sans-serif;
                position: relative;
                transition: var(--anim);

                @include media() {
                    margin-bottom: 25vh;
                }
            }

            .cubeWrapper.rave {
                animation: var(--bpm);
                transform-origin: center center;
            }

            @keyframes bassBump {
                0% { transform: scale(1) }
                15% { transform: scale(1.25) }
                30% { transform: scale(0.85) }
                100% { transform: scale(1) }
            }

            &.open .cubeWrapper {
                max-width: 50vw;
                margin-bottom: 25vh;
                transform: scale(.75);

                @include media() {
                    max-width: 100vw;
                    margin-bottom: 0;
                    transform: scale(1);
                }
            }

            .spacer {
                width: 100vw;
                max-width: 0;
                transition: var(--anim);
                top: 0;

                @include media() {
                    display: none;
                }
            }
            &.open .spacer { max-width: 50vw; }

            .cards{
                position: absolute;
                top: 0;
                right: 0;
                width: 50vw;
                color: white;
                transition: var(--anim);

                @include media() {
                    width: 100vw;
                }
                
                .card {
                    background: rgb(0 0 0 / .5);
                    height: 100vh;

                    &.card--0 {
                        background: transparent;

                        @include media() {
                            height: 100vh;
                        }
                    }

                    @include media() {
                        height: unset;
                        min-height: 100vh;
                        position: relative;

                        .scrollAnchor {
                            position: absolute;
                            top: -50px;
                            height: 1px;
                            width: 100vw;
                        }

                        &.card--5 .scrollAnchor {
                            top: 0;
                        }
                    }
                }

                @for $i from 0 through 5 {
                    &.cards--#{$i} { top: calc(-100vh * $i) }
                    
                    @include media() {
                        &.cards--#{$i} { top: 0 }
                    }
                }
            }
        }
        
        .menu {
            position: absolute;
            bottom: 1em;
            left: 2em;
            color: rgb(255,255,255,1);
            z-index: 999;
            font-size: 1em;

            #mobileToggle { display: none }

            label {
                display: none;
                transition: var(--quickAnim);
            }

            @include media() {
                transition: var(--quickAnim);
                position: fixed;
                width: 100vw;
                left: 0;

                label {
                    display: inline-block;
                    opacity: 0;
                    pointer-events: none;
                    border: 1px solid var(--accentText);
                    border-bottom: none;
                }

                &.scrolled {
                    bottom: -43vh;
                    z-index: 999;

                    label {
                        pointer-events: all;
                        background: black;
                        padding: .5em .25em .75em .75em;
                        border-radius: .5em .5em 0 0;
                        opacity: 1;
                    }

                    &.open {
                        bottom: 0;

                        label {
                            margin-bottom: 0em;
                            position: relative;
                            padding: .5em .25em .5em .75em;

                            &::after {
                                content: '';
                                position: absolute;
                                bottom: -2px;
                                left: 0;
                                width: 100%;
                                height: 4px;
                                background: black;
                            }
                        }

                        p {
                            opacity: 1;
                            background: rgb(0, 0, 0);
                            border-left: 1px solid var(--accentText); 
                            border-right: 1px solid var(--accentText); 

                            &:first-of-type {
                                border: 1px solid var(--accentText);
                                border-bottom: none;
                                border-radius: 0 .5em 0 0;
                            }
                        }
                    }
                }

            }
            
            p {
                margin: 0;
                padding: 1em;
                opacity: .5;
                transition: var(--anim);

                @include media() {
                    transition: var(--quickAnim);
                }

                &:hover:not(.header) {
                    color: white;
                    background: rgb(30, 30, 30);
                    opacity: 1;
                    cursor: pointer;

                    @include media() {
                        background: none;
                    }
                }

                &.active {
                    color: var(--accentText);
                    font-weight: 500;
                }
            }
        }

        .open .menu p {
            padding: .5em 0;

            @include media() {
                padding: 0;
                margin: 0;
            }
        }

        .currentLocation {
            position: absolute;
            font-size: 1em;
            font-weight: 500;
            top: 1em;
            left: 2em;
            z-index: 999;
            color: var(--accentText);
            display: flex;

            @include media() {
                transition: var(--quickAnim);
                position: fixed;
                top: 0;
                left: 0;
                padding: 1em 2em;
                width: 100%;
                
                .path {
                    transition: var(--quickAnim);
                    width: auto;
                    max-width: 100%;
                    overflow: hidden;
                }
            }

            p {
                display: inline-block;

                &.location {
                    border-right: 3px solid hsl(from var(--accentText) h s l / .25);
                    animation: caretBlink 1s step-end infinite;
                }

                @keyframes caretBlink {
                    from, to { border-color: transparent; }
                    50% { border-color: hsl(from var(--accentText) h s l / .25); }
                }
            }
        }

        & .scrolled .currentLocation {
            @include media() {
                padding: .5em 2em;
                font-size: .75em;
                max-width: 100%;
                overflow: hidden;
                background: black;

                .path {
                    max-width: 0;
                }
            }
        }
    }
</style>