<script>

    import marked from "marked";

    export let title;
    let renderedMarkdown = "";

    fetch(`/api/${title}.md`)
    .then(response => response.text())
    .then(data => {
        console.log(data);
        data = data.replace(/(---\n.*\n---)/gims, "");
        renderedMarkdown = marked(data);
    })


</script>

<div>
    {@html renderedMarkdown}
</div>