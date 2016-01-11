const { isCodeCellSelected, } = require("./code-cell");

module.exports = {
  addPlusButton,
  hidePlusButton,

  highlightLine,
  addLineHighlight,
  getLinePosition,
  removeLineHighlight,
  removeAllLineHighlights,
  isCurrentHighlightedLine,
  getCurrentLineElement,
  getCurrentHighlightedLine,
};

function getLinePosition(editor) {
  let line = getCurrentLineElement(editor);
  let { top } = line.getBoundingClientRect();
  let { left, right } = editor.getFocusedElement().getBoundingClientRect();
  return { top, right, left }; 
}

// *** Line Highlighting *** ///
function highlightLine(editor) {
  const line = getCurrentLineElement(editor);
  if (isCurrentHighlightedLine(line)) return;
  removeAllLineHighlights();
  addLineHighlight(line);
  movePlusButton({ editor, line});
}

function addLineHighlight(line) {
  line.style.background = "aliceblue";
  line.classList.add("selected-line");  
}

function removeLineHighlight(line) {
  line.style.background = "";
  line.classList.remove("selected-line");
}

function removeAllLineHighlights() {
  let lines = [].slice.call(document.querySelectorAll(".selected-line"));
  lines.forEach(removeLineHighlight);
}

function getCurrentHighlightedLine() {
  return document.querySelector(".selected-line");
}

function getCurrentLineElement(editor) {
  let line = editor.getSelectedParentElement();
  return line;
}

function isCurrentHighlightedLine(line) {
  return line === getCurrentHighlightedLine();
}

// todo - organize

// *** Click-to-add-code-cell Button *** ///
function addPlusButton({ editor, clickHandler }) {
   const button = document.createElement("div");
   const modClickHandler = (event) => {
     const line = getLastHighlightedLineFromButton(button);
     clickHandler(event, { line });
   }
   button.addEventListener("click", modClickHandler);
   initializePlusButton(button);
}

function setLastHighlightedLineOnButton(button, line) {
  button.__LAST_LINE = line;
}

function getLastHighlightedLineFromButton(button) {
  return button.__LAST_LINE;
}

function initializePlusButton(button) {
  button.classList.add("livebook-add-code-button");
  button.dataset.livebookAddCodeButton = "";
  button.innerHTML = "<img src='/plus.svg' height=32 width=32 />";
  button.style.position = "fixed";
  hidePlusButton(button);
  document.body.appendChild(button);
}

function removePlusButton() {
  getPlusButton().remove();
}

function getPlusButton() {
  return document.querySelector("[data-livebook-add-code-button]");
}

function showPlusButton(button) {
  button = button || getPlusButton();
  button.style.visibility = ""; 
}

function hidePlusButton(button) {
  button = button || getPlusButton();
  button.style.visibility = "hidden";
}

function movePlusButton({ editor, line }) {
  const button = getPlusButton();
  const lineContents = line.textContent;
  const lineHasContent = !!lineContents.trim();

  if (lineHasContent || isCodeCellSelected()) { // instead of isCodeCellSelected, could opt to look at inner html
    hidePlusButton(button);
    setLastHighlightedLineOnButton(button, null);
    return;
  }
  positionPlusButtonByLine({ editor, button, line });
  setLastHighlightedLineOnButton(button, line);
  showPlusButton(button);
}

function positionPlusButtonByLine({ editor, button, line }) {
  const { top, height } = getLineRect(line);
  const { left } = editor.getFocusedElement().getBoundingClientRect();

  const buttWidth = button.getBoundingClientRect().width;
  const buttMarginRight = 6;
  const buttMarginTop = -6;

  button.style.top = (top + buttMarginTop) + "px";
  button.style.left = (left - buttWidth - buttMarginRight) + "px";
  button.style.height = (height) + "px";
}

function getLineRect(line) {
  return line.getBoundingClientRect();
}