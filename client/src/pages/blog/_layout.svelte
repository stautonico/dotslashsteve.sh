<style lang="scss" global>
  @import "src/styles/variables";

    * {
        background-color: var(--background);
        color: var(--foreground);
    }

    a {
      //transition: color 250ms;
    }

    a:hover {
        color: lighten($selected-text, 5);
        cursor: pointer;
    }

    // Container styles

    .container {
        width: 100%;
        padding-right: 1.5rem;
        padding-left: 1.5rem;
        margin-right: auto;
        margin-left: auto;
    }

    @media (min-width: 576px) {
        .container {
            max-width: 540px;
        }
    }

    @media (min-width: 768px) {
        .container {
            max-width: 720px;
        }
    }

    @media (min-width: 992px) {
        .container {
            max-width: 960px;
        }
    }

    @media (min-width: 1200px) {
        .container {
            max-width: 1140px;
        }
    }

    @media (min-width: 1400px) {
        .container {
            max-width: 1320px;
        }
    }

</style>

<div class="container">
    <Navbar/>
    <slot/>
</div>

<script>
    import Navbar from "../../components/Navbar.svelte";

    document.title = "./steve.sh | Blog";
</script>