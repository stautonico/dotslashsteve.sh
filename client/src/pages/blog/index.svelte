<div>
    <h1>All blog posts go here:</h1>

    <button on:click={loadMore}>Load More</button>

    <ul>
        {#each posts as post}
            <li>
                {post.title}
            </li>
        {/each}
    </ul>

</div>

<script>
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