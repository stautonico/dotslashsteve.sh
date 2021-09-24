<!--<script lang="ts">-->
<script>
    import {Router, Route, Link} from "svelte-routing";
    import Terminal from "./Terminal.svelte";
    import Blog from "./blog.svelte";

    export let url = "";


    const computers = ["skynet", "hp3000", "hal9000", "wopr", "GlaDOS", "joshua", "alpha60", "localhost"];

    let currentDir = "~"

    let intro = `<span id="username">steve@${computers[Math.floor(Math.random() * computers.length)]}</span>:<span class="directory">${currentDir}</span>$ `;
    let currentString = intro;
    let writing = false;
    let notificationMessage = "";
    let showNotification = false;

    let cursor = false;

    let blinkCounter = setInterval(() => {
        if (!writing) {
            cursor = !cursor;
        }
    }, 500)

    function isTouchDevice() {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);
    }

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }


    function getBrowser() {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

    // If its a laptop but with a touch screen
    if (isTouchDevice() && !isMobileDevice()) {
        notificationMessage = "Double tap or press enter/space to skip";
    } else if (isTouchDevice() && isMobileDevice()) {
        // Cellphones, tablets, etc
        notificationMessage = "Double tap to skip";
    } else {
        notificationMessage = "Press enter or space to skip";
    }

    setTimeout(() => {
        showNotification = true;
    }, 500);

    // $("#notification").delay(250).fadeIn(250).delay(3000).fadeOut(250);

</script>

<Router {url}>
    <div id="container">
        <Terminal />
<!--        <div id="terminal" class="noselect" class:cursor={cursor}>-->
<!--            {@html currentString}-->
<!--        </div>-->

<!--        <div id="site" class="scaleIn">-->
<!--            <p><code>TODO: Add the GUI for the site!</code></p>-->
<!--        </div>-->

<!--        <div id="notification" class="{showNotification ? 'visible' : 'hidden'}">-->
<!--            <span>{notificationMessage}</span>-->
<!--        </div>-->
    </div>
</Router>

<style lang="less">
    @import "../assets/styles/terminal";
    #terminal #username {
      color: red !important;
    }
</style>