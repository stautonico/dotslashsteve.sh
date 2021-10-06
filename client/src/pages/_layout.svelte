<style lang="scss">
    @import "src/styles/variables.scss";

    :global(:root) {
        --background-dark: #3B3342;
        --foreground-dark: #c9b9d5;

        --background-light: #d5d5d5;
        --foreground-light: #383838;

        --background: var(--background-dark);
        --foreground: var(--foreground-dark);
    }

    :global(*) {
      transition: color 1s, background-color 1s;
    }

    :global(::-moz-selection) { /* Code for Firefox */
        //color: red;
        background: $highlight-color;
    }

    :global(::selection) {
        //color: red;
        background: $highlight-color;
    }

</style>

<div>
    <slot/>
    <button on:click={light}>Light</button>
    <button on:click={dark}>Dark</button>
</div>

<script>
    function light() {
        document.documentElement.style.setProperty('--background', getComputedStyle(document.documentElement).getPropertyValue('--background-light'));
        document.documentElement.style.setProperty('--foreground', getComputedStyle(document.documentElement).getPropertyValue('--foreground-light'));
        localStorage.setItem("theme", "light");
    }

    function dark() {
        document.documentElement.style.setProperty('--background', getComputedStyle(document.documentElement).getPropertyValue('--background-dark'));
        document.documentElement.style.setProperty('--foreground', getComputedStyle(document.documentElement).getPropertyValue('--foreground-dark'));
        localStorage.setItem("theme", "dark");
    }

    let currentTheme = localStorage.getItem("theme") || "dark";

    if (currentTheme === "dark") {
        dark();
    } else {
        light();
    }


</script>