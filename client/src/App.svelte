<!--<script lang="ts">-->
<!--    // Configure sentry logging-->
<!--    // Sentry.init({-->
<!--    //     dsn: "https://1e26e2343d8840ceac577e0e4aba0401@o214576.ingest.sentry.io/5948402",-->
<!--    //     integrations: [new Integrations.BrowserTracing()],-->
<!--    //     environment: "dev",-->
<!--    //     attachStacktrace: true,-->
<!--    //     tracesSampleRate: 1.0,-->
<!--    //     autoSessionTracking: false-->
<!--    // });-->
<!--    let counter: number = 0;-->

<!--    function increment() {-->
<!--        counter += 1;-->
<!--    }-->

<!--    var link = document.querySelector("link[rel~='icon']");-->
<!--    if (!link) {-->
<!--        link = document.createElement('link');-->
<!--        link.rel = 'icon';-->
<!--        document.getElementsByTagName('head')[0].appendChild(link);-->
<!--    }-->

<!--    let icon = true;-->

<!--    setInterval(() => {-->
<!--        if (icon === true) {-->
<!--            link.href = 'https://stackoverflow.com/favicon.ico';-->
<!--            icon = false;-->
<!--        } else {-->
<!--            link.href = 'assets/img/logos/favicon-32x32.png';-->
<!--            icon = true;-->
<!--        }-->
<!--    }, 1000);-->

<!--</script>-->

<!--<body class="container">-->
<!--<span data-testid="counter">{counter}</span>-->


<!--<button class="button is-primary" on:click={increment}>-->
<!--    Increment-->
<!--</button>-->

<!--<h2>Title 2</h2>-->
<!--<h3>Title 3</h3>-->

<!--</body>-->











<!--<style lang="less">-->
<!--  @import "assets/styles/test.less";-->

<!--  @primarycolor: #FF7F50;-->
<!--  @color: #800080;-->
<!--  h2 {-->
<!--    color: @primarycolor;-->
<!--  }-->

<!--  h3 {-->
<!--    color: @color;-->
<!--  }-->
<!--</style>-->

<!--<script>-->
<!--    var effectButton;-->
<!--    var paintButton;-->
<!--    var canvas;-->
<!--    var context;-->
<!--    let color;-->

<!--    function init() {-->
<!--        effectButton = document.getElementById('EffectButton');-->
<!--        paintButton = document.getElementById('PaintButton');-->
<!--        canvas = document.getElementById('Canvas');-->
<!--        context = canvas.getContext('2d');-->
<!--        var image = document.getElementById('SourceImage');-->

<!--        // Set the canvas the same width and height of the image-->
<!--        // canvas.width = image.width;-->
<!--        // canvas.height = image.height;-->

<!--        canvas.width = 512;-->
<!--        canvas.height = 512;-->

<!--        console.log(canvas.width);-->
<!--        console.log(canvas.height);-->

<!--        // paintButton.addEventListener('click', function () {-->
<!--        //     drawImage(image);-->
<!--        //     // Or-->
<!--        //     // var image = new Image();-->
<!--        //     // image.onload = function () {-->
<!--        //     //    drawImage(image);-->
<!--        //     // }-->
<!--        //     // image.src = 'image.jpg';-->
<!--        // });-->

<!--        paintButton.addEventListener('click', () => {-->
<!--            drawImage(image);-->
<!--        });-->

<!--        effectButton.addEventListener('click', () => {-->
<!--            onClick();-->
<!--        });-->
<!--    }-->

<!--    function drawImage(image) {-->
<!--        context.drawImage(image, 0, 0);-->
<!--    }-->

<!--    function onClick() {-->
<!--        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);-->
<!--        invertColors(imageData.data);-->
<!--        context.putImageData(imageData, 0, 0);-->
<!--        console.log(hexToRgb(color));-->
<!--    }-->

<!--    function hexToRgb(hex) {-->
<!--        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")-->
<!--        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;-->
<!--        hex = hex.replace(shorthandRegex, function(m, r, g, b) {-->
<!--            return r + r + g + g + b + b;-->
<!--        });-->

<!--        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);-->
<!--        return result ? {-->
<!--            r: parseInt(result[1], 16),-->
<!--            g: parseInt(result[2], 16),-->
<!--            b: parseInt(result[3], 16)-->
<!--        } : null;-->
<!--    }-->

<!--    function between(value, first, last) {-->

<!--        let lower = Math.min(first, last), upper = Math.max(first, last);-->
<!--        return value >= lower && value <= upper;-->

<!--    }-->

<!--    function invertColors(data) {-->
<!--        console.log("Inverting colors...");-->
<!--        for (var i = 0; i < data.length; i += 4) {-->

<!--            if (between(data[i], 0, 50) && between(data[i + 1], 0, 50) && between(data[i + 2], 0, 50)) {-->
<!--                let convertColors = hexToRgb(color);-->
<!--                data[i] = convertColors.r;-->
<!--                data[i + 1] = convertColors.g;-->
<!--                data[i + 2] = convertColors.b;-->
<!--            }-->

<!--            // data[i] = data[i] ^ 255;-->
<!--            // data[i+1] = data[i+1] ^ 255;-->
<!--            // data[i+2] = data[i+2] ^ 255;-->
<!--        }-->

<!--        canvas = document.querySelector("#Canvas");-->
<!--        var imageURL = canvas.toDataURL();-->
<!--        var link = document.querySelector("link[rel~='icon']");-->
<!--        if (!link) {-->
<!--            link = document.createElement('link');-->
<!--            link.rel = 'icon';-->
<!--            document.getElementsByTagName('head')[0].appendChild(link);-->
<!--            link.href = imageURL;-->
<!--        } else {-->
<!--            link.href = imageURL-->
<!--        }-->

<!--    }-->
<!--    window.addEventListener('load', init);-->
<!--</script>-->

<!--<style lang="less">-->
<!--  .container {-->
<!--    display: flex;-->
<!--    width: 400px;-->

<!--    .column {-->
<!--      max-width: 100%;-->
<!--      flex: 0 0 400px;-->
<!--    }-->

<!--    img, canvas {-->
<!--      max-width: 100%;-->
<!--    }-->

<!--    canvas {-->
<!--      border: 1px solid #ccc;-->
<!--    }-->
<!--  }-->

<!--  .video-container {-->
<!--    width: 512px;-->
<!--  }-->
<!--</style>-->

<!--<div class="container">-->
<!--    <h1>Pick a color and press the button to change the favicon</h1>-->
<!--    <input type="color" id="favcolor" bind:value={color}>-->
<!--    <button id="EffectButton">Update</button>-->
<!--    <button id="PaintButton">Paint</button>-->
<!--    <img src="assets/img/logos/android-chrome-512x512.png" id="SourceImage">-->
<!--    <canvas id="Canvas"></canvas>-->

<!--<button id="PaintButton">Paint</button>-->
<!--<button id="EffectButton">Invert Colors</button>-->
<!--</div>-->









<script>
    import Router from './routes/index.svelte';
</script>

<main>
    <Router />
</main>
