<script lang="ts">
    // @ts-ignore
    import marked from "marked";

    interface Post {
        category: string;
        content: string;
        date_published: Date;
        id: number;
        markdown_file: string;
        tags: string[];
        title: string;
    }

    export let title;
    let blogPost: Post;
    let renderedMarkdown = "";

    function toTitleCase(str) {
        return str.toLowerCase().split(' ').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }

    // START MAIN
    fetch(`/api/blog/post/${title}`)
        .then(response => response.json())
        .then(data => {
            if (data["message"] === "post not found") {

            } else {
                blogPost = data;
                blogPost.date_published = new Date(blogPost.date_published);
                renderedMarkdown = marked(data.content);
            }
        })
        .catch(error => {
            console.log(error);
        });

</script>

<div>
    {#if blogPost}
        <h1>{ toTitleCase(blogPost.title) }</h1>
        <p>Tags: {blogPost.tags.join(", ")}</p>
        <p>Category: {blogPost.category}</p>
        <p>Published: {blogPost.date_published.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            year: "numeric",
            day: "numeric"
        })}</p>
        {@html renderedMarkdown}
    {:else}
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45"/>
        </svg>
    {/if}
</div>

<style lang="scss">
  // SVG styles.
  svg {
    animation: 2s linear infinite svg-animation;
    max-width: 100px;
  }

  // SVG animation.
  @keyframes svg-animation {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg)
    }
  }

  // Circle styles.
  circle {
    animation: 1.4s ease-in-out infinite both circle-animation;
    display: block;
    fill: transparent;
    stroke: #2f3d4c;
    stroke-linecap: round;
    stroke-dasharray: 283;
    stroke-dashoffset: 280;
    stroke-width: 10px;
    transform-origin: 50% 50%;
  }

  // Circle animation.
  @keyframes circle-animation {
    0%,
    25% {
      stroke-dashoffset: 280;
      transform: rotate(0);
    }

    50%,
    75% {
      stroke-dashoffset: 75;
      transform: rotate(45deg);
    }

    100% {
      stroke-dashoffset: 280;
      transform: rotate(360deg);
    }
  }

  /*
  @media (prefers-color-scheme: dark) {
    div {
      background-color: #1f1f1f;
      color: white;
    }
  }

  @media (prefers-color-scheme: light) {
    body {
      background-color: #b0b0b0;
      color: black;
    }
  }
   */

</style>