<style>
    code {
        background-color: #eee;
        border: 1px solid #999;
        display: block;
        padding: 20px;
    }
</style>

<script lang="ts">
    // import {Link} from 'svelte-routing';
    import {parseMarkdown} from "../helper/markdown.svelte";
    export let title;
    let documentContent;

    fetch(`http://localhost:8000/${title}.md`)
        .then(response => response.text())
        .then(text => {
            documentContent = parseMarkdown(text);
            let contentDiv = document.getElementById("content");
            contentDiv.innerHTML = documentContent;
        })
        .catch(error => console.error(error));


</script>

<div>
    <div class="container">
        <h3>This is Blog Page - {title}</h3>
<!--        <Link to="/">Home</Link>-->
    </div>

    <div id="content"></div>

    <!--{#if documentContent}-->
    <!--    {#each documentContent as line}-->
    <!--        {#if line.startsWith("######")}-->
    <!--            <h6>{line.replace("######", "")}</h6><br/>-->
    <!--        {:else if line.startsWith("#####")}-->
    <!--            <h5>{line.replace("#####", "")}</h5><br/>-->
    <!--        {:else if line.startsWith("####")}-->
    <!--            <h4>{line.replace("####", "")}</h4><br/>-->
    <!--        {:else if line.startsWith("###")}-->
    <!--            <h3>{line.replace("###", "")}</h3><br/>-->
    <!--        {:else if line.startsWith("##")}-->
    <!--            <h2>{line.replace("##", "")}</h2><br/>-->
    <!--        {:else if line.startsWith("#")}-->
    <!--            <h1>{line.replace("#", "")}</h1><br/>-->
    <!--        {:else if line.startsWith("-")}-->
    <!--            <ul>-->
    <!--                <li>{line.replace("-", "")}</li>-->
    <!--            </ul>-->
    <!--        {:else}-->
    <!--            {line}<br/>-->
    <!--        {/if}-->
    <!--    {/each}-->
    <!--{/if}-->

</div>