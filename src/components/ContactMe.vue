<template>
    <div class="contactPage">
        <div class="photo" :style="'background-image: url(/img/ShipsCrew.jpg)'">
            <div class="img-wrapper">
                <!-- <img src="/svg/stroke.svg"> -->
            </div>
        </div>
        <div class="form">
            <h2 class="sphereBaseHue">Let's talk.</h2>
            <div class="contactForm">
                <div>
                    <input
                        class="input"
                        required
                        v-model="formData.name"
                        title="Name"
                        id="name"
                        type="text"
                        name="name"
                        placeholder="name"
                    >
                    <label for="name">Name</label>
                </div>
                <div>
                    <input
                        class="input"
                        required
                        v-model="formData.email"
                        title="Email"
                        id="email"
                        type="text"
                        name="email"
                        placeholder="email"
                    >
                    <label for="email">Email</label>
                </div>
                <div>
                    <textarea
                        :class="['input', {hasInput: formData.message.length}]"
                        v-model="formData.message"
                        id="message"
                        rows="5"
                        placeholder="message"
                    >
                        {{formData.message}}
                    </textarea>
                    <label for="message">Message</label>
                </div>

                <div>
                    <select
                        class="input"
                        id="favorite"
                        v-model="formData.selectedFavorite"
                        placeholder="favorite"
                    >
                        <option selected></option>
                        <option v-for="option in favorites[randomFav].options">{{option}}</option>
                    </select>
                    <label for="favorite">Favorite {{favorites[randomFav].item}}</label>
                </div>
                <div class="button">
                    <button @click="send()">Fire away</button>
                </div>
                <div :class="['toast', {show: toastShown}]">{{ toastMessage }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue';

    const formData = ref({
        name: '',
        email: '',
        message: '',
        selectedFavorite: '',
    });
    const toastShown = ref(false);

    const favorites = ref([
        {item: 'Animal', options: ['Pangolin', 'Axolotl', 'Gharial', 'Pallas’s cat', 'Kakapo']},
        {item: 'All-American Food', options: ['Classic Hot Dog', 'Tator-Tot Casserole', 'Spray Cheese', 'Deep-Fried Oreos', 'Spam']},
        {item: 'Music Genre', options: ['Nintendocore', 'Pirate Metal', 'Psychedelic Synth Folk', 'Danger Music', 'Crunkcore']}
    ]);
    const randomFav = ref(Math.floor(Math.random() * (favorites.value.length - 1)));

    const status = ref('idle');
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const Status = {
        Idle: 'idle',
        Sending: 'sending',
        Success: 'success',
        Error: 'error',
    };

    const toastMessage = computed(() => {
        if (status.value === Status.Success) {
            return "Sweet, all sent! I'll get back to you as soon as I can!";
        } else if (status.value === Status.Error) {
            return "Hmm, something went wrong... Feel free to email me at lanecwheeler@gmail.com";
        }
    });

    const send = async () => {
        const { name, email, message } = formData.value
        if (!name || !email || !message) return

        status.value = 'sending'

        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData.value),
        })

        status.value = res.ok ? 'success' : 'error';
    }

    watch(status, async () => {
        if (status.value === Status.Success || status.value === Status.Error) {
            toastShown.value = true;
            await wait(3000);
            toastShown.value = false;
        }
    });
</script>

<style scoped lang="scss">
    @use "/src/assets/_mixins.scss" as *;

    .contactPage {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
    }

    .photo {
        background-size: cover;
        background-position: 30% 10%;
        min-height: 30vh;
    }

    .emphasized {
        font-size: 1.5em;
    }

    .form {
        padding: 1em;

        
        @include media() {
            padding: 2em;
        }
    }

    h2 {
        margin: 0;
    }

    p {
        line-height: 1.5em;
        letter-spacing: 0.5px;
        text-align: justify;
        vertical-align: middle;
    }

    .contactForm {
        display: flex;
        flex-direction: column;

        div {
            position: relative;

            .input {
                width: 100%;
                margin: 2em 0 0 0;
                padding: .5em 2px;
                background: none;
                border: none;
                border-bottom: 1px solid rgb(255 255 255 / .5);
                transition: all .3s ease;
                color: white;
                font-family: "Ubuntu Sans", sans-serif;
                font-size: 1em;

                &[required] + label::after { content: '*' }
                &::placeholder { opacity: 0 }
                &:not(:placeholder-shown) + label,
                &.hasInput + label {
                    bottom: 2.5em;
                    top: 1em;
                    font-size: .75em;
                }

                &:hover {
                    border-bottom: 1px solid white;
                    & + label { color: white }
                }

                &:focus {
                    outline: none;
                    border-bottom: 1px solid hsl(from var(--accentText) h s l / 1);

                    & + label {
                        bottom: 2.5em;
                        top: 1em;
                        color: hsl(from var(--accentText) h s l / 1);
                        font-size: .75em;
                    }
                }
            }

            textarea, select {
                & + label { top: 2.5em }
                &:focus + label{ top: 1em }

                option {
                    background: rgb(0 0 0 / .9);
                }
            }

            label {
                position: absolute;
                top: 2.5em;
                bottom: 8px;
                left: 0;
                font-family: "Ubuntu Sans", sans-serif;
                color: rgba(255,255,255,.5);
                transition: all .3s ease;
                font-weight: 500;
                pointer-events: none;
            }

        }

        .button {
            padding-top: 1em;
            text-align: center;

            button {
                padding: .5em;
                padding-left: 1em;
                background: none;
                border: 2px solid hsl(from var(--accentText) h calc(s * 1.5) calc(l * 2) / .75);
                box-shadow: 0 0 10px 0 hsl(from var(--accentText) h s calc(l) / .75) inset,
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

    .toast {
        position: absolute;
        bottom: 2em;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        color: contrast-color(var(--hslColor));
        font-weight: 500;
        background: var(--hslColor);
        border-radius: .25em;
        padding: .25em;
        font-size: 1em;
        opacity: 0;
        transition: var(--quickAnim);

        &.show {
            opacity: 1;
        }
    }
</style>