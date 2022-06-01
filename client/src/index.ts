const TERMINAL_IFRAME = document.getElementById('terminal');
const SITE_IFRAME = document.getElementById('site');

// Message handler from iframes
window.onmessage = (e) => {
    if (e.data === "terminal") {
        alert("Activating terminal...");
    }

    if (e.data === "site") {
        SITE_IFRAME!.classList.add('animate');
        // alert("Activating site...");
    }
}