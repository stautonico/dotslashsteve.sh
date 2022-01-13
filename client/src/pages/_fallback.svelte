<script>
    import {onMount} from "svelte";

    onMount(() => {
        let prev;
        if (history.state) {
            if ("path" in history.state) {
                prev = history.state.path;
            } else {
                prev = "";
            }
        } else {
            prev = "";
        }
        window.location.href = `/errors/404.html?path=${window.location.pathname}&prev=${prev}`;
    });
</script>
