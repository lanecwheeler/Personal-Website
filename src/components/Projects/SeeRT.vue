<template>
    <p>
        It's a Saturday afternoon, and you have the hankering to play a classic game from your childhood -
        Super Mario 64! You boot up the game on your PC and notice the characters look a little too "angular"
        for your nostalgia causing the experience lack some of the character from days gone by.
        No problem, I'll just switch on some classic anime instead! Oh, well the colors aren't as vibrant and
        it's missing that "glow"...
        <br/><br/>
        Wouldn't it be nice to view retro media in the format it was designed to be played/viewed in? Wouldn't it be nice to make your very nice 4k monitor wildly antiquated? Wouldn't it be nice for you monitor to still have scanlines and static to further distort your view?
        <br/><br/>
        Well me too! Enter - SeeRT!
    </p>
    <img src="/src/assets/SeeRTExamples/SeeRTBeforeAfter.png" alt="I despise aliased edges"/>
    <table>
        <thead>
            <tr>
                <th align="center"><b>Before</b></th>
                <th align="center"><b>After</b></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><img src="/src/assets/SeeRTExamples/GameBefore.png" alt="Before"></td>
                <td><img src="/src/assets/SeeRTExamples/GameAfter.png" alt="After"></td>
            </tr>
            <tr>
                <td><img src="/src/assets/SeeRTExamples/PokemonBefore.png" alt="Before"></td>
                <td><img src="/src/assets/SeeRTExamples/PokemonAfter.png" alt="After"></td>
            </tr>
            <tr>
                <td><img src="/src/assets/SeeRTExamples/HunterXHunterBefore.png" alt="Before"></td>
                <td><img src="/src/assets/SeeRTExamples/HunterXHunterAfter.png" alt="After"></td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
    p {
        text-align: left;
        letter-spacing: .25em;
    }

    img {
        width: 100%;
    }

    table {
        margin: .5em 0;

        td {
            padding: 1em 0;
            position: relative;
            width: 50%;

            img {
                width: 100%;
            }

            &::after {
                content: '';
                height: 2px;
                width: 75%;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                background: var(--hslColor);
            }
        }
    }
</style>