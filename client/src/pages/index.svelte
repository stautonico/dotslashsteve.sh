<!--<script lang="ts">-->
<script>
    import Terminal from "../components/Terminal.svelte";
    import Site from "../components/Site.svelte";
    import {onMount} from "svelte";
    import {typeTitle} from "../helpers/title.svelte";

    export let url = "";

    let notificationContent = "";
    let showNotification = false;
    let showSite = false;
    let tapped = false;

    // Prevent mobile scrolling
    document.addEventListener("touchmove", (e) => {
        e.preventDefault();
    });

    function handleMessage(event) {
        if (event.detail.text === "showmainsite") {
            showSite = true;
        }
    }

    function isTouchDevice() {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);
    }

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // If its a laptop but with a touch screen
    if (isTouchDevice() && !isMobileDevice()) {
        notificationContent = "Double tap or press enter/space to skip";
    } else if (isTouchDevice() && isMobileDevice()) {
        // Cellphones, tablets, etc
        notificationContent = "Double tap to skip";
    } else {
        notificationContent = "Press enter or space to skip";
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    onMount(() => {
        sleep(250)
            .then(() => {
                showNotification = true;
                sleep(3000).then(() => {
                    showNotification = false;
                })
            })
    });

    document.body.addEventListener("keypress", (event) => {
        if (event.key === " " || event.key === "Enter") {
            showSite = true;
        }
    });

    document.body.addEventListener("touchstart", (event) => {
        if (!tapped) {
            tapped = setTimeout(function () {
                tapped = null
            }, 300);
        } else {
            clearTimeout(tapped);
            tapped = null
            showSite = true;
        }
        event.preventDefault()
    });

    function darkMode() {
        console.log("Dark mode!");
        document.body.style.background = "#494949";
        document.body.style.background_color = "#494949";
    }

    function lightMode() {
        console.log("Light mode!");
        document.body.style.background = "#c5c5c5";
        document.body.style.background_color = "#c5c5c5";
    }

    window.matchMedia("(prefers-color-scheme: dark)")
        .addListener(e => {
            if (e.matches) {
                darkMode();
            } else {
                lightMode();
            }
        });


    typeTitle("./steve.sh");

    // let title = "\u200E./steve.sh"
    // let currentIndex = 0;T
    // let sleepTimer = 0;
    // let forward = true;
    // document.title = "";

    // setInterval(() => {
    //     if (sleepTimer !== 0) {
    //         sleepTimer -= 1;
    //     } else {
    //         if (forward) {
    //             document.title += title.charAt(currentIndex);
    //             currentIndex += 1;
    //             if (currentIndex > title.length) {
    //                 currentIndex = 0;
    //                 sleepTimer = 50;
    //                 forward = false;
    //             }
    //         } else {
    //             document.title = document.title.substring(0, document.title.length-1);
    //             if (document.title.length === 1) {
    //                 sleepTimer = 5;
    //                 forward = true;
    //             }
    //         }
    //     }
    // }, 50)


</script>

<div>
    <div id="terminal">
        <Terminal on:message={handleMessage}/>
    </div>

    <div id="site" class="scaleIn" class:animate={showSite}>
        <Site/>
    </div>

    <div id="notification" class:fade-in={showNotification}>
        <span>{@html notificationContent}</span>
    </div>
</div>

<style lang="scss">

  * {
    font-weight: normal;
    font-style: normal;
    box-sizing: border-box;
  }

  #notification {
    font-family: "Source Code Pro", Sans-Serif, serif;
  }

  #terminal {
    z-index: 0;
  }

  #site {
    z-index: 1;
    background: white;
    height: 100%;
    width: 100%;
  }

  #notification {
    position: absolute;
    z-index: 101;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.25);
    text-align: center;
    line-height: 2.5;
    overflow: hidden;
    color: white;
    transition: opacity 1s linear;
    opacity: 0;
  }

  .fade-in {
    opacity: 1 !important;
  }

  .scaleIn {
    transform: scale(0);
    opacity: 0;
    transition: transform 400ms;
  }

  .scaleIn.animate {
    transform: scale(1);
    opacity: 1;
  }

</style>