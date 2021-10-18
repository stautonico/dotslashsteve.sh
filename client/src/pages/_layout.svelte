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
</div>

<script>
</script>