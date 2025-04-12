function createMenu(options) {
  // Create the main structure
  const mainBox = document.createElement("div");
  mainBox.classList.add("box");

  // Secondary box
  const secondaryBox = document.createElement("div");
  secondaryBox.classList.add("box");
  mainBox.appendChild(secondaryBox);

  // Content div
  const content = document.createElement("div");
  content.classList.add("content");
  secondaryBox.appendChild(content);

  const title = document.createElement("span");
  title.classList.add("title");
  title.innerText = options.title;

  const subtitle = document.createElement("p");
  subtitle.innerText = "Please choose an option:";
  content.appendChild(subtitle);

  const mainUl = document.createElement('ul');
  mainUl.classList.add('menu');

  for (const option of options.options) {
    const newOption = document.createElement('li');
    newOption.classList.add('selectable');


    const link = document.createElement('a');
    link.innerHTML = option.text;

    link.id = "id" + Math.random().toString(16).slice(2);

    if (option.hasOwnProperty("action")) {
      link.onclick = (e) => {
        e.preventDefault();
        option.action();
      }
      console.log(link);
      link.href = "#";
    } else if (option.hasOwnProperty("link")) {
      link.href = option.link;
    }

    newOption.appendChild(link);
    mainUl.appendChild(newOption);
  }

  content.appendChild(mainUl);

  // Create our buttons
  const buttons = `
  <div class="buttons">
          <a id="ok" href="#" class="btn selectable">OK</a>
          <a id="cancel" href="#" class="btn selectable">Cancel</a>
  </div>
  `;
  content.innerHTML += buttons;

  options.target.appendChild(mainBox);

  // Now create the controller for this menu
  // Grab all of our valid options
  const selectableInputs = [].slice.call(document.getElementsByClassName('selectable'));

  // Save our cursor index
  let cursor = 0;

  function moveCursor(direction) {
    selectableInputs[cursor].classList.remove('active');
    if (direction !== null) {
      if (direction === 'down') {
        cursor += 1;
      } else if (direction === 'up') {
        cursor -= 1;
      } else if (direction === 'left' && cursor === 4) {
        cursor -= 1;
      } else if (direction === 'right' && cursor === 3) {
        cursor += 1;
      }

      if (cursor < 0) {
        cursor = 0;
      } else if (cursor > selectableInputs.length - 1) {
        cursor = selectableInputs.length - 1;
      }
    }
    selectableInputs[cursor].classList.add('active');
  }

  function updateCursor(idx) {
    selectableInputs[cursor].classList.remove('active');
    cursor = idx;

    if (cursor < 0) {
      cursor = 0;
    } else if (cursor > options.options.length - 1) {
      cursor = options.options.length - 1;
    }

    selectableInputs[cursor].classList.add('active');
  }

  function handleEnter() {

    if (options.options.length -1 >= cursor) {
      if (options.options[cursor]["action"] !== undefined)
        options.options[cursor].action();
    }
  }

  document.body.addEventListener("keydown", (e) => {
    // e.preventDefault();
    if (e.code === "ArrowDown") {
      moveCursor("down");
    } else if (e.code === "ArrowUp") {
      moveCursor("up");
    } else if (e.code === "ArrowLeft") {
      moveCursor("left");
    } else if (e.code === "ArrowRight") {
      moveCursor("right");
    } else if (e.code === "Enter") {
      handleEnter();
    }
  });

  for (let element of selectableInputs) {
    element.addEventListener("mouseenter", (e) => {
        let target = null;
        // Find our hovered element in our selectables array
        if (e.target.id === "" && e.target.tagName.toLowerCase() === "li") {
          target = e.target.getElementsByTagName("a")[0];
        } else {
          target = e.target;
        }

        // Now that we know what we're hovering over, find its index in the array

        for (let index = 0; index < selectableInputs.length; index++) {
          let compareAgainst = selectableInputs[index];
          if (selectableInputs[index].id === "") {
            compareAgainst = selectableInputs[index].getElementsByTagName("a")[0];
          }

          if (compareAgainst.id === target.id) {
            // We have our index
            updateCursor(index);
          }
        }
      }
    )
  }

  moveCursor(null);
}
