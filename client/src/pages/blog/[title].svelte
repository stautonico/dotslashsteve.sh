<script>

    export let title;
    let renderedMarkdown = "";

    fetch(`/api/blog/post/${title}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
    .catch(error => {
        console.log(error);
    })
    // fetch(`/api/${title}.md`)
    // .then(response => response.text())
    // .then(data => {
    //     console.log(data);
    //     data = data.replace(/(---\n.*\n---)/gims, "");
    //     renderedMarkdown = marked(data);
    // })


</script>

<div>
    {@html renderedMarkdown}
</div>