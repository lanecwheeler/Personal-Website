<template>
    <div class="wrapper">
        <div class="photo" />
        <div class="text">
            <p>
                <span class="emphasized">First, I am follower of Jesus.</span>
                I believe that Jesus loves us all and can't wait to have a relationship with us.
                It is my goal to show as many people that relationship as I can through my daily interactions and work ethic.

                <span class="emphasized">Second, I am a developer.</span>
                I've been making web applications for nearly a decade, honing my skills to become proficient in almost all
                aspects of the job. I've done time in front-end development and design. I've implemented new back-end architecture and fixed legacy code. I've partitioned
                whole servers, set up databases, written docker configurations, implemented NGINX proxies, written accessibility standards, trained new hires, and on and on and on...
                In short, I'm pretty dangerous Vim (Emacs fanboys can see themselves out).

                <span class="emphasized">Finally, I'm a people person.</span>
                I've always felt my purpose and passion in this world is to help people. In my work, I make a concious effort to assist others
                in a way that makes them feel happy they asked, and lets them leave feeling confident in their ability to move forward!
                From walking clients through how to use a CMS, to training new hires on company infrastructure, to helping my Mom free up
                space on her phone (she takes <strong>so</strong> many photos...), I get no greater joy on this planet than making someones day a little easier.
            </p>

            <h2 class="emphasized">TLDR; My Name is Lane, and I love this job.</h2>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "/src/assets/_mixins.scss" as *;
    .wrapper {
        max-height: 100vh;
        display: flex;
        flex-direction: column;

        @include media() {
            max-height: unset;
        }
    }

    .photo {
        min-height: 30vh;
        position: relative;
        background-image: url('../assets/me-cute.jpg');
        background-size: cover;
        background-position: 100% 40%;
    }

    .emphasized {
        font-size: clamp(1.5em, 2.25cqi, 2.25cqi);
        color: var(--accentText);
        font-weight: 300;
    }

    .text {
        flex-grow: 1;
        padding: 1em;
        overflow: auto;
        container-type: inline-size;
    }

    p {
        margin: 0;
        line-height: 1.5em;
        letter-spacing: 0.5px;
        text-align: justify;
        vertical-align: middle;
        font-size: clamp(1em, 2.25cqi, 2.25cqi);
    }

    h2.emphasized {
        font-size: clamp(1.5em, 3.5cqi, 3.5cqi);
        text-align: center;
    }
</style>