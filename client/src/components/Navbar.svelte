<nav>
    <a class="logo" on:click={() => {$goto('/')}}><img
            src="https://dotslashsteve.sh/assets/img/logos/apple-touch-icon.png"
            alt="Logo"></a>
    <a on:click={toggleTheme} class="right"><i class="far {theme==='dark' ? 'fa-sun' : 'fa-sun'}"></i>
    </a>
    <a class="right">About</a>
    <a class="right active">Blog</a>
    <a on:click={() => {$goto('/')}} class="right">Home</a>

</nav>

<script>
    import {goto} from '@roxi/routify'

    let theme = localStorage.getItem("theme") || "dark";

    if (theme === "dark") {
        dark();
    } else {
        light();
    }

    function toggleTheme() {
        // A 1 millisecond delay is theoretically long enough for the icon to change but to be safe, I'll use
        // a delay of 10 milliseconds is better for slower browsers (haha ie), but it shouldn't be noticeable
        // Without this delay, the background of the icon changes instantly
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
        localStorage.setItem("theme", "light");
    }

    function dark() {
        document.documentElement.style.setProperty('--background', getComputedStyle(document.documentElement).getPropertyValue('--background-dark'));
        document.documentElement.style.setProperty('--foreground', getComputedStyle(document.documentElement).getPropertyValue('--foreground-dark'));
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