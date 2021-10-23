<style lang="scss">
  @import "src/styles/variables.scss";

  ::-moz-selection { /* Code for Firefox */
    //color: red;
    background: $highlight-color;
  }

  ::selection {
    //color: red;
    background: $highlight-color;
  }

</style>

<div>
    <slot/>
</div>

<script>
</script>