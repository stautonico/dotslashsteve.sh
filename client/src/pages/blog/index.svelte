<div>
    <h1>All blog posts go here:</h1>

    <button on:click={loadMore}>Load More</button>

<!--    <BlogCard/>-->

    <ul>
        {#each posts as post}
            <li>
<!--                <a style="color: deepskyblue;" href={$url("/blog/" + post.title.replace(" ", "_").toLowerCase())}>{post.title}</a>-->
                <a style="color: deepskyblue;" href={$url("/blog/id_" + post.id)}>{post.title}</a>
            </li>
        {/each}
    </ul>

</div>

<script>
    import BlogCard from "src/components/BlogCard.svelte";
    import {url} from "@roxi/routify";

    let page = 1;

    let posts = [];

    fetch(`/api/blog/list/3/${page}`)
        .then(response => response.json())
        .then(data => {
            for (let post of data["posts"]) {
                posts.push(post);
            }
            posts = posts;
        })
        .catch(error => {
            console.log(error);
        });

    function loadMore() {
        page++;
        fetch(`/api/blog/list/3/${page}`)
            .then(response => response.json())
            .then(data => {
                // It's fine to check the posts title because they're unique anyway
                // For whatever reason, when I compare the objects themselves, its always false
                if (data["posts"][data["posts"].length - 1].title !== posts[posts.length - 1].title) {
                    for (let post of data["posts"]) {
                        posts.push(post);
                    }
                    posts = posts;
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

</script>