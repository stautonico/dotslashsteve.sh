<script lang="ts" context="module">
    const TYPE_TAGS = {
        "bold": "b",
        "italic": "i",
        "h1": "h1",
        "h2": "h2",
        "h3": "h3",
        "h4": "h4",
        "h5": "h5",
        "h6": "h6",
        "blockquote": "blockquote",
        "divider": "hr",
        "linebreak": "br"
    }

    class RootNode {
        readonly type = "root";
        children: [Node];

        addChild(node: Node) {
            this.children.push(node);
        }
    }

    class Node {
        type: string;
        htmlTag: string;
        content: string;
        children: [Node];

        constructor(type: string) {
            this.type = type;
            this.htmlTag = TYPE_TAGS[type] || "p";
        }
    }

    const H1 = /^#\s?(.*$)/gim
    const H2 = /^##\s?(.*$)/gim
    const H3 = /^###\s?(.*$)/gim
    const H4 = /^####\s?(.*$)/gim
    const H5 = /^#####\s?(.*$)/gim
    const H6 = /^######\s?(.*$)/gim
    // Block quote
    const BQ = /^> (.*$)/gim
    const BOLD = /(\*\*)(.*?)\1/gims
    const ITALICS = /(\*)(.*?)\1/gims
    const ITALICS_ALT = /(_)(.*?)\1/gims
    const IMAGE = /!\[(.*?)]\((.*?)\)/gim
    const LINK = /\[(.*?)]\((.*?)\)/gim
    const LINEBREAK = /\n$/gim
    const CODE = /(`)(.*?)\1/gims
    const CODEMULTILINE = /(```)(.*?)\1/gims
    const HR = /^-{3,}$/gim
    const UNDERLINE = /(__)(.*?)\1/gims
    const STRIKETHROUGH = /(~~)(.*?)\1/gims
    const UNCHECKED_BOX = /^-\s?\[\s](.*)$/gim
    const CHECKED_BOX = /^-\s?\[x](.*)$/gim


    export function parseMarkdown(text) {
        let outputHTML = "";

        outputHTML += text
            .replace(H6, "<h6>$1</h6>")
            .replace(H5, "<h5>$1</h5>")
            .replace(H4, "<h4>$1</h4>")
            .replace(H3, "<h3>$1</h3>")
            .replace(H2, "<h2>$1</h2>")
            .replace(H1, "<h1>$1</h1>")
            .replace(BQ, "<blockquote>$1</blockquote>")
            .replace(IMAGE, "<img alt='$1' src='$2' />")
            .replace(LINK, "<a href='$2'>$1</a>")
            // Handle single line bold and italicizes
            .replace(BOLD, "<b>$2</b>")
            .replace(ITALICS, "<i>$1</i>")
            .replace(ITALICS_ALT, "<i>$1</i>")
            .replace(CODE, "<code>$2</code>")
            .replace(CODEMULTILINE, "<code>$2</code>")
            .replace(HR, "<hr />")
            .replace(LINEBREAK, "<br />")
            .replace(UNDERLINE, "<p style='text-decoration: underline'>$1</p>")
            .replace(STRIKETHROUGH, "<p style='text-decoration: line-through'>$1</p>")
            .replace(UNCHECKED_BOX, "<input type='checkbox'/>")
            .replace(CHECKED_BOX, "<input type='checkbox' checked/>")

        // for (let line of text.split("\n")) {
        //     // Test for single line
        //     // if ()
        //     console.log(line);
        // }

        return outputHTML.trim();
    }
</script>
