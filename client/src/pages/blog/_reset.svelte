<svelte:head>
    <style>
        body {
            background-color: var(--background);
            transition: color 1s, background-color 1s;
        }
    </style>
</svelte:head>

<style lang="scss">
  @import "src/styles/variables";

  // Blog specific color styles
  :root {
    --background-dark: #3B3342;
    --foreground-dark: #c9b9d5;
    --link-dark: red;

    --background-light: #d5d5d5;
    --foreground-light: #383838;
    --link-light: green;

    --background: var(--background-dark);
    --foreground: var(--foreground-dark);
    --link: var(--link-dark)
  }

  * {
    background-color: var(--background);
    color: var(--foreground);
    transition: color 1s, background-color 1s;
  }

  a {
    color: var(--link) !important;
    //transition: color 250ms;
  }

  a:hover {
    color: lighten($selected-text, 5);
    cursor: pointer;
  }

  main {
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    margin-right: auto;
    margin-left: auto;
  }

  ::-moz-selection { /* Code for Firefox */
    //color: red;
    background: $highlight-color;
  }

  ::selection {
    //color: red;
    background: $highlight-color;
  }

  @media (min-width: 576px) {
    main {
      max-width: 540px;
    }
  }

  @media (min-width: 768px) {
    main {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    main {
      max-width: 960px;
    }
  }

  @media (min-width: 1200px) {
    main {
      max-width: 1140px;
    }
  }

  @media (min-width: 1400px) {
    main {
      max-width: 1320px;
    }
  }

</style>

<!--<div class="container">-->
<main>
    <Navbar/>
    <slot/>
</main>
<!--</div>-->

<script>
    import Navbar from "../../components/Navbar.svelte";

    document.title = "./steve.sh | Blog";
</script>