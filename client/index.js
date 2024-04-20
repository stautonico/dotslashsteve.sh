const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const font = '16px monospace';
const lineHeight = 20;
const charWidth = 9;

let cursorX = 0;
let cursorY = lineHeight;
let textLines = [''];

const NON_PRINTABLES = ["Control", "Shift", "Alt", "Super", "OS", "Meta", "Escape", "Delete",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
    "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24",
    "PrintScreen", "PageUp", "PageDown", "Insert", "Home", "End", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "CapsLock", "NumLock", "ScrollLock", "Pause", "ContextMenu", "AudioVolumeMute", "AudioVolumeDown", "AudioVolumeUp",
    "MediaTrackNext", "MediaTrackPrevious", "MediaPlay", "MediaStop", "MediaPlayPause", "LaunchMail", "SelectTask",
    "LaunchApp1", "LaunchApp2", "BrowserSearch", "BrowserHome", "BrowserBack", "BrowserForward", "BrowserStop", "BrowserRefresh"];

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    textLines.forEach((line, index) => {
        ctx.fillText(line, 0, lineHeight + index * lineHeight);
    });
    ctx.fillRect(cursorX * charWidth, cursorY - 15, 2, 16); // Draw cursor as pipe
}

function updateCursorX() {
    let line = textLines[textLines.length - 1];
    cursorX = ctx.measureText(line).width / charWidth;
}

function handleKeyPress(event) {
    event.preventDefault();
    const key = event.key;


    if (key === 'Enter') {
        cursorX = 0;
        cursorY += lineHeight;
        textLines.push('');
    } else if (key === 'Backspace') {
        if (textLines[textLines.length - 1].length > 0) {
            textLines[textLines.length - 1] = textLines[textLines.length - 1].slice(0, -1);
            cursorX -= 1;
        }
    } else if (key === "ArrowUp") {
        console.log('up');
        if (cursorY > 0) {
            cursorY -= lineHeight;
        }
    } else if (NON_PRINTABLES.includes(key)) {
        return;
    } else {
        textLines[textLines.length - 1] += key;
        updateCursorX();
    }
    draw();
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('keydown', handleKeyPress);
    draw();
}

window.onload = init;
