<template>
    <div class="cubebounce">
        <div class="orb" />
        <div
            class="cube"
            :data-face="currentFace"
        >
            <div :class="['face', `face--${i}`, {active: currentFace.toString() === i}]" v-for="face, i in faces">
                <span>{{ (face as unknown as {title: string, section: string}).title }}</span>
            </div>
            <div class='wrap'>
                <div :key="index" class='c' v-for="index in totalPoints" />
            </div>
        </div>
    </div>
    <div class="glow" />
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    const { faces, currentFace } = defineProps<{faces: {title: string, section: string}, currentFace: Number}>();
    const totalPoints = ref(300);
</script>

<style scoped lang="scss">
    @use 'sass:math';
    @use "/src/assets/_mixins.scss" as *;

    * {
         --cubeWidth: 300px;
        @include media { --cubeWidth: 200px }
    }

    .cubebounce {
        transform-style: preserve-3d;
        animation: float 8s infinite ease-in-out;

        .orb {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            transition: var(--anim);
            height: 100vh;
            width: 100vw;
            max-height: var(--cubeWidth);
            max-width: var(--cubeWidth);
            background: radial-gradient(
                circle,
                hsl(from var(--hslColor) h s l / .5) 0%,
                transparent 50%,
            );
            border-radius: 50%;
        }

        .cube {
            height: 100vh;
            width: 100vw;
            max-height: var(--cubeWidth);
            max-width: var(--cubeWidth);
            position: relative;
            transform-style: preserve-3d;
            transition: var(--anim);
            margin: auto;

            &[data-face="0"] {transform: rotateX(-5deg) rotateY(0deg) rotateZ(0deg)}
            &[data-face="1"] {transform: rotateX(-5deg) rotateY(-90deg) rotateZ(0deg)}
            &[data-face="2"] {transform: rotateX(-5deg) rotateY(180deg) rotateZ(0deg)}
            &[data-face="3"] {transform: rotateX(-5deg) rotateY(90deg) rotateZ(0deg)}
            &[data-face="4"] {transform: rotateX(-95deg) rotateY(0deg) rotateZ(0deg)}
            &[data-face="5"] {transform: rotateX(85deg) rotateY(0deg) rotateZ(0deg)}

            .face {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 1px solid hsl(from var(--hslColor) h calc(s * 1.5) calc(l * 1.25) / .5);
                box-shadow: 0 0 10px 0 hsl(from var(--hslColor) h s calc(l) / .5) inset,
                    0 0 5px 0 hsl(from var(--hslColor) h s calc(l) / .5);
                color: rgba(255, 255, 255, .75);
                font-family: 'Major Mono Display', monospace;
                display: flex;
                justify-content: center;
                align-items: center;
                background: radial-gradient(
                    circle,
                    hsl(from var(--hslColor) h s l / 0) 0%,
                    hsl(from var(--hslColor) h s l / 0) 50%,
                    hsl(from var(--hslColor) h s calc(l * .1) / .75) 75%,
                    hsl(from var(--hslColor) h calc(s * .1) calc(l * .1) / 1) 100%
                );
                transition: var(--anim);

                &.face--0 {transform: rotateY(0deg) translateZ(calc(var(--cubeWidth)/2))}
                &.face--1 {transform: rotateY(90deg) translateZ(calc(var(--cubeWidth)/2))}
                &.face--2 {transform: rotateY(180deg) translateZ(calc(var(--cubeWidth)/2))}
                &.face--3 {transform: rotateY(-90deg) translateZ(calc(var(--cubeWidth)/2))}
                &.face--4 {transform: rotateX(90deg) translateZ(calc(var(--cubeWidth)/2))}
                &.face--5 {transform: rotateX(-90deg) translateZ(calc(var(--cubeWidth)/2))}

                &:not(.active) {color: rgb(255, 255, 255, .1)}

                span {
                    text-align: center;
                    background: rgba(0, 0, 0, 1);
                    padding: .25em;
                    padding-left: .75em;
                }
            }
        }
    }

    .glow {
        height: 100vh;
        width: 100vw;
        max-height: var(--cubeWidth);
        max-width: calc(var(--cubeWidth) * 1.5);
        background: radial-gradient(circle, hsl(from var(--hslColor) h calc(s * 1.5) l  / .5) 0%, rgba(0, 0, 0, 0) 100%);
        filter: blur(25px);
        border-radius: 30%;
        position: absolute;
        left: 50%;
        top: calc(var(--cubeWidth) / 1.5);
        transform: scale(1.25) perspective(100px) rotate3d(1,0,0,45deg) translateX(-50%);
        transform-origin: 0% 100%;
        transition: var(--anim);
        animation: glowFloat 8s infinite ease-in-out;
    }

    @keyframes float {
        0% {transform: translateY(0px) translateX(0px) translateZ(0px)}
        50% {transform: translateY(-20px) translateX(7px) translateZ(10px)}
        100% {transform: translateY(0px) translateX(0px) translateZ(0px)}
    }

    @keyframes glowFloat {
        0% {transform: scale(1.55) perspective(100px) rotate3d(1,0,0,45deg) translateX(-50%); opacity: 1;}
        50% {transform: scale(1.5) perspective(100px) rotate3d(1,0,0,45deg) translateX(-50%); opacity: .6;}
        100% {transform: scale(1.55) perspective(100px) rotate3d(1,0,0,45deg) translateX(-50%); opacity: 1;}
    }

    // Particle Sphere
    $total: 300; // total particles
    $particle-size: 4px;
    $time: 15s;

    .wrap {
        position: relative;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        transform-style: preserve-3d;
        perspective: 1000px;
        animation: rotate $time infinite linear; // spin da orb - u -
        transition: var(--anim);
    }
    @keyframes rotate { 100% {transform: rotateY(360deg) rotateX(360deg)} }

    .c {
        position: absolute;
        width: $particle-size;
        height: $particle-size;
        border-radius: 50%;
        opacity: 0;
    }

    @function tweak($val, $randomness) {
        @return calc($val * (1 - ($randomness / 10)));
    }

    @for $i from 1 through $total {
        $z: (math.random(360) * 1deg);
        $y: (math.random(360) * 1deg);
        $randomness: math.random();

        .c:nth-child(#{$i}) { // grab the nth particle
            animation: orbit#{$i} $time infinite;
            animation-delay: ($i * .01s);
            background: hsl(from var(--accentText) h s l / .5);
        }

        @keyframes orbit#{$i}{
            10% {opacity: 1}
            20% {transform: rotateZ(-$z) rotateY($y) translateX(calc(var(--cubeWidth) / 4)) rotateZ($z)}
            50% {transform: rotateZ(-$z) rotateY($y) translateX(tweak(calc(var(--cubeWidth) / 4), $randomness)) rotateZ($z)}
            90% {transform: rotateZ(-$z) rotateY($y) translateX(calc(var(--cubeWidth) / 4)) rotateZ($z); opacity: 1;}
            100% {transform: rotateZ(-$z) rotateY($y) translateX(calc((calc(var(--cubeWidth) / 4) * .75))) rotateZ($z)}
        }
    }

    .scrolling .c {
        animation-play-state: paused !important;
    }
</style>