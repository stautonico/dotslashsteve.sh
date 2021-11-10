<nav>
    <a class="logo" href="{$url('/')}"><img
            src="/assets/img/logos/apple-touch-icon.png"
            alt="Logo"></a>
    <a on:click={toggleTheme} class="right"><i class="far {theme==='dark' ? 'fa-sun' : 'fa-moon'}"></i></a>
    <a class="right"href="{$url('/about')}">About</a>
    <a class="right active" href="{$url('/blog')}">Blog</a>
    <a href="{$url('/')}" class="right">Home</a>

</nav>

<script>
    import {goto, url} from '@roxi/routify'

    let theme = localStorage.getItem("theme") || "dark";

    // Initial theme setup
    if (theme === "dark") {
        dark();
    } else {
        light();
    }

    function toggleTheme() {
        if (theme === "dark") {
            theme = "light";
            light();
        } else {
            theme = "dark";
            dark();
        }
    }

    function light() {
        document.documentElement.style.setProperty('--background', getComputedStyle(document.documentElement).getPropertyValue('--background-light'));
        document.documentElement.style.setProperty('--foreground', getComputedStyle(document.documentElement).getPropertyValue('--foreground-light'));
        document.documentElement.style.setProperty('--link', getComputedStyle(document.documentElement).getPropertyValue('--link-light'));
        localStorage.setItem("theme", "light");
    }

    function dark() {
        document.documentElement.style.setProperty('--background', getComputedStyle(document.documentElement).getPropertyValue('--background-dark'));
        document.documentElement.style.setProperty('--foreground', getComputedStyle(document.documentElement).getPropertyValue('--foreground-dark'));
        document.documentElement.style.setProperty('--link', getComputedStyle(document.documentElement).getPropertyValue('--link-dark'));
        localStorage.setItem("theme", "dark");
    }
</script>

<style lang="scss">
  @import "src/styles/variables";

  nav {
    overflow: hidden;

    img {
      width: 2em;
      transition: transform 750ms ease-in-out;
    }

    img:hover {
      transform: rotate(360deg);
    }

    a {
      float: left;
      color: var(--foreground);
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 17px;
    }

    a:hover {
      cursor: pointer;
      color: lighten($selected-text, 5);
    }

    a.active {
      color: $selected-text;
    }
  }

  .right {
    float: right;
  }

</style>