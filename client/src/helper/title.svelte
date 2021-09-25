<script lang="ts" context="module">
    export function typeTitle(message, append = false) {
        if (!append) {
            // Unicode chracter for a blank character is required becuase if no title is set, the website url is used instead
            // Without this, the website url flashes temporarily before typing begins
            document.title = "\u200E";
        }
        let index = 0;
        let titleInterval = setInterval(() => {
            document.title += message.charAt(index);
            index += 1;
            if (index > message.length) {
                clearInterval(titleInterval);
            }
        }, 50)
    }

    export function eraseTitle() {
        let eraseInterval = setInterval(() => {
            if (document.title.length !== 1) {
                document.title = document.title.substring(0, document.title.length - 1);
            } else {
                document.title = "\u200E";
                clearInterval(eraseInterval);
            }
        }, 50);
    }
</script>