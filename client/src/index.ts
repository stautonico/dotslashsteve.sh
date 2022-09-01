const TERMINAL_IFRAME = document.getElementById("terminal");
const SITE_IFRAME = document.getElementById("site");

// Message handler from iframes
window.onmessage = (e) => {
    if (e.data === "terminal") {
        alert("Activating terminal...");
    }

    if (e.data === "site" || e.data === "exit") {
        SITE_IFRAME!.classList.add("animate");
        // alert("Activating site...");
    }
};

// var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
// @ts-ignore
// win.document.write("<iframe src='terminal.html' width='780' height='200' frameborder='0'></iframe>");

// We need to pass focus to the terminal iframe because otherwise the user will
// have to click on the terminal to activate it
// and start typing.
TERMINAL_IFRAME.focus();