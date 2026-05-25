<template>
    <div class="projects">
        <div @click="setProj(Number(i))" class="project" v-for="proj, i in projects">
            <label :for="`proj-${i}`">
                <div class="titleCard" :style="`background-image: linear-gradient(to right, hsl(from var(--accentText) h s l / .5) 0%, transparent 50%), url(${proj.img})`">
                    <p>{{ proj.title }}</p>
                </div>
            </label>
        </div>
    </div>
    <Modal :isOpen="modalOpen" @close="closeModal">
        <div class="projectModal">
            <div class="descWrapper">
                <h2 class="emphasized">
                    {{ projects[curProj]?.title }}
                    <span
                        v-html="icon"
                        role="link"
                        title="Check it out on GitHub"
                        @click="openGithub(projects[curProj]?.gitHub)"
                    />
                </h2>
                <component :is="projects[curProj]?.component" />
                <p class="aiNotice" v-if="projects[curProj]?.ai">
                    In the interest of getting used to an agentic development workflow, this project was written using ai assistance.
                </p>
            </div>
        </div>
    </Modal>
</template>

<script setup>
    import { ref, shallowRef, reactive } from 'vue';
    import Modal from './Modal.vue';
    import WinMT from './Projects/WinMT.vue';
    import SeeRT from './Projects/SeeRT.vue';
    import Site from './Projects/lanewheeler.vue';
    import icon from '../assets/github.svg?raw';

    const curProj = ref();
    const modalOpen = ref(false);
    const closeModal = () => modalOpen.value = false;
    const setProj = (index) => {
        curProj.value = index;
        modalOpen.value = true;
    };

    const openGithub = (url) => {
        window.open(url, "_blank");
    }

    const projects = shallowRef([
        {
            title: "WinMT",
            ai: true,
            component: WinMT,
            img: "/img/Projects/WinMT.png",
            gitHub: "https://github.com/lanecwheeler/winmt",
        },
        {
            title: "SeeRT",
            ai: true,
            component: SeeRT,
            img: "/img/SeeRTExamples/SeeRTBeforeAfter.png",
            gitHub: "https://github.com/lanecwheeler/SeeRT-Overlay",
        },
        {
            title: "lanewheeler.dev",
            ai: false,
            component: Site,
            img: "/img/me-cooler.jpg",
            gitHub: "https://github.com/lanecwheeler/Personal-Website",
        },
    ]);
</script>

<style scoped lang="scss">
    @use "/src/assets/_mixins.scss" as *;

    .projects {
        height: 100vh;
        display: flex;
        flex-direction: column;

        @include media() {
            height: calc(100vh - 50px);
        }

        .project {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            transition: var(--quickAnim);

            input { display: none }
            label {
                flex-grow: 1;
                flex-shrink: 1;
                transition: var(--quickAnim);
            }

            .titleCard {
                padding: 2em;
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
                background-size: cover;
                backdrop-filter: blur(10px);
                background-position: 0% 25%;
                opacity: .5;
                transition: var(--quickAnim);
                cursor: pointer;

                &:hover { opacity: 1 }

                p {
                    background: black;
                    padding: .25em .5em;
                    border-right: solid 3px var(--accentText);
                }
            }

            .descWrapper {
                transition: var(--quickAnim);
                flex-grow: 1;
                max-height: 0;
                height: 100%;
                overflow: hidden;
            }
        }
    }

    .projectModal {
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
                color: var(--accentText);
                letter-spacing: normal;
            }
        }
    }
</style>