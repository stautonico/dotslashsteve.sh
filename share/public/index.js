let droppedFiles = false;
let fileName = '';
let $dropzone = document.getElementsByClassName('dropzone')[0];
let $uploadElement = document.getElementsByClassName('upload')[0];
let $button = document.getElementsByClassName("upload-btn")[0];
let uploading = false;
let $syncing = document.getElementsByClassName("syncing")[0];
let $done = document.getElementsByClassName("done")[0];
let $bar = document.getElementsByClassName("bar")[0];
let $filenameElement = document.getElementsByClassName("filename")[0];
let timeOut;
let $inputField = document.getElementsByClassName("input")[0];
let doneUploading = false;

$dropzone.addEventListener("drag", dropzoneEvent);
$dropzone.addEventListener("dragstart", dropzoneEvent);
$dropzone.addEventListener("dragend", dropzoneEvent);
$dropzone.addEventListener("dragover", dropzoneEvent);
$dropzone.addEventListener("dragenter", dropzoneEvent);
$dropzone.addEventListener("dragleave", dropzoneEvent);
$dropzone.addEventListener("drop", dropzoneEvent);

function dropzoneEvent(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragover" || event.type === "dragenter") {
        $dropzone.classList.add("is-dragover")
    }

    if (event.type === "dragleave" || event.type === "dragend" || event.type === "drop") {
        $dropzone.classList.remove("is-dragover")
    }

    if (event.type === "drop") {
        droppedFiles = event.dataTransfer.files;
        fileName = droppedFiles[0].name;
        $filenameElement.innerHTML = fileName;
        $uploadElement.style.display = "none";
    }
}

$inputField.addEventListener("change", (e) => {
    fileName = e.target.files[0].name;
    $filenameElement.innerHTML = fileName;
    $uploadElement.style.display = "none";
});

$button.addEventListener("click", upload);


function upload() {
    if (!uploading && fileName !== "" && !doneUploading) {
        uploading = true;
        $button.innerHTML = "Uploading...";
        $syncing.classList.add("active");
        $dropzone.classList.add("fade-out");
        $done.classList.add("active");
        $bar.classList.add("active");
        // This is where you would upload the file to the server
        var formData = new FormData();

        formData.append("file", $inputField.files[0]);
        // fetch("/upload", {
        fetch("http://localhost:3000/upload/", {
            method: "POST",
            body: formData,
        }).then(function (response) {
                doneUploading = true;
                showDone();
                setTimeout(resetAfterUpload, 7500);
            }
        ).then(function (text) {
            console.log(text);
        })
            .catch((error) => {
                console.log(error);
            });
    } else {
        resetAfterUpload();
    }
}

function showDone() {
    $button.innerHTML = "Done";
    doneUploading = true;
}

function resetAfterUpload() {
    if (doneUploading) {
        doneUploading = false;
        // Reset the file field
        $uploadElement.value = "";
        fileName = "";
        droppedFiles = false;
        $button.innerHTML = "Upload";
        $syncing.classList.remove("active");
        $dropzone.classList.remove("fade-out");
        $done.classList.remove("active");
        $bar.classList.remove("active");
        $filenameElement.innerHTML = "";
        $uploadElement.style.display = "inline";
    }
}
