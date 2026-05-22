<template>
    <div class="socials">
        <div
            class="socialBar"
            v-for="social in socials"
            :style="social.style"
        >
            <a :href="social.url" target="_blank">
                <div class="shade" :data-service="social.title" :style="social.shade">{{social.title}}</div>
            </a>
        </div>
    </div>
</template>

<script setup>
    const socials = [
        {
            title: 'Linkedin',
            url: 'https://www.linkedin.com/in/lanecwheeler/',
            style: `
                background-image: url(/src/assets/me-cute.jpg);
                background-position: 50% 40%;
            `,
            shade: `background-color: rgb(0, 115, 177, .75);`
        },
        {
            title: 'Instagram',
            url: 'https://www.instagram.com/lanecwheeler/',
            style: `
                background-image: url(/src/assets/me-and-the-boys.jpg);
                background-position: 60% 60%;
            `,
            shade: `background-color: rgb(237, 73, 86, .75);`
        },
        {
            title: 'Facebook',
            url: 'https://www.facebook.com/lanecwheeler',
            style: `
                background-image: url(/src/assets/me-and-the-fam.jpg);
                background-position: 50% 30%;
            `,
            shade: `background-color: rgb(59, 89, 152, .75);`
        },
        // {
        //     title: 'Twitter',
        //     url: 'https://twitter.com/lanecwheeler',
        //     style: `
        //         background-image: url(/src/assets/me-and-the-pres.jpeg);
        //         background-position: 70% 50%;
        //     `,
        //     shade: `background-color: rgb(29, 161, 242, .75);`
        // },
    ]
</script>

<style scoped lang="scss">
    @use "/src/assets/_mixins.scss" as *;

    .socials {   
        display: flex;
        flex-direction: column;
        height: 100%;

        @include media() {
            height: 100vh;
            padding-top: 50px;
        }
    }

    .socialBar {
        flex-grow: 1;
        background-size: cover;
        position: relative;
        display: flex;

        a {
            width: 100%;
            height: 100%;
        }

        &:hover .shade{
            left: calc(100% - 1.5em);
            background: rgba(0,0,0,1) !important;

            @include media() {
                left: 0;
            }

        }

        .shade {
            position: absolute;
            text-orientation: upright;
            writing-mode: vertical-lr;
            height: 100%;
            color: rgba(255,255,255,1);
            left: 0;
            padding: .25em;
            font-family: "Ubuntu Sans", sans-serif;
            font-size: 1em;
            letter-spacing: .25em;
            font-weight: 500;
            text-decoration: none;
            text-align: center;
            max-width: 50vw;
            width: 100%;
            transition: all .3s ease;

            @include media() {
                max-width: 100vw;
                writing-mode: lr;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2em;
            }
        }
    }
    
    
</style>

