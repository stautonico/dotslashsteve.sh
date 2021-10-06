<nav>
    <!--    <a on:click={() => {$goto('/')}}>./steve.sh</a>-->
    <a  class="logo" on:click={() => {$goto('/')}}><img src="https://dotslashsteve.sh/assets/img/logos/apple-touch-icon.png"
                                          alt="Logo"></a>
    <a class="right">About</a>
    <a class="right active">Blog</a>
    <a on:click={() => {$goto('/')}} class="right">Home</a>
</nav>

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
    }

    a.active {
      color: $selected-text;
    }
  }

  .right {
    float: right;
  }

</style>

<script>
    import {goto} from '@roxi/routify'
</script>