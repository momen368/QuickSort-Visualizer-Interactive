const arrayInput = document.querySelector("#array-input");
const inputError = document.querySelector("#input-error");
const sortForm = document.querySelector("#sort-form");
const algorithmSelect = document.querySelector("#algorithm-select");
const arraySizeRange = document.querySelector("#array-size-range");
const arraySizeValue = document.querySelector("#array-size-val");
const btnSort = document.querySelector("#btn-sort");
const btnClear = document.querySelector("#btn-clear");
const btnRandom = document.querySelector("#btn-random");
const btnPlay = document.querySelector("#btn-play");
const btnPause = document.querySelector("#btn-pause");
const btnBack = document.querySelector("#btn-back");
const btnNext = document.querySelector("#btn-next");
const btnReset = document.querySelector("#btn-reset");
const speedRange = document.querySelector("#speed-range");
const themeToggle = document.querySelector("#theme-toggle");
const codeLanguage = document.querySelector("#code-lang-select");
const copyCodeButton = document.querySelector("#btn-copy-code");
const originalDisplay = document.querySelector("#original-array-display");
const sortedDisplay = document.querySelector("#sorted-array-display");
const originalCount = document.querySelector("#original-count");
const sortedStatus = document.querySelector("#sorted-status-badge");
const dataStatus = document.querySelector("#data-status-badge");
const barsContainer = document.querySelector("#bars-container");
const placeholder = document.querySelector("#canvas-placeholder");
const stepCounter = document.querySelector("#step-counter");
const operationBox = document.querySelector("#current-operation-box");
const statusText = document.querySelector("#status-text");
const algorithmStatus = document.querySelector("#algorithm-status");
const codeContainer = document.querySelector("#code-container");

const algorithmNames = {
  quicksort: "QuickSort",
  mergesort: "MergeSort",
  heapsort: "HeapSort",
  builtin: "JavaScript built-in sort",
};

const sourceCode = {
  js: `function quickSort(arr, low, high) {\n  if (low < high) {\n    // Partition array and get pivot index\n    let pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n    quickSort(arr, pi + 1, high);\n  }\n}\n\nfunction partition(arr, low, high) {\n  let pivot = arr[high]; // Select pivot\n  let i = low - 1;\n  for (let j = low; j < high; j++) {\n    if (arr[j] <= pivot) {\n      i++;\n      swap(arr, i, j); // Swap elements\n    }\n  }\n  swap(arr, i + 1, high);\n  return i + 1;\n}`,
  python: `def quicksort(values, low=0, high=None):\n    if high is None:\n        high = len(values) - 1\n    if low < high:\n        pivot_index = partition(values, low, high)\n        quicksort(values, low, pivot_index - 1)\n        quicksort(values, pivot_index + 1, high)\n\ndef partition(values, low, high):\n    pivot = values[high]\n    smaller_index = low - 1\n    for current_index in range(low, high):\n        if values[current_index] <= pivot:\n            smaller_index += 1\n            values[smaller_index], values[current_index] = values[current_index], values[smaller_index]` ,
};

let originalArray = [];
let steps = [];
let currentStep = 0;
let timer = null;
let isRunning = false;

function parseInput(rawInput) {
  if (rawInput.trim() === "") throw new Error("Please enter at least one number.");
  const tokens = rawInput.split(",");
  const values = tokens.map((token) => {
    const trimmed = token.trim();
    if (trimmed === "") throw new Error("Every comma must be followed by a number.");
    const value = Number(trimmed);
    if (!Number.isFinite(value)) throw new Error(`“${trimmed}” is not a valid number.`);
    return value;
  });
  return values;
}

function partition(values, low, high, record = null) {
  const pivot = values[high];
  let smallerIndex = low - 1;
  record?.({ array: [...values], pivot: high, comparing: [], swapping: [], sorted: [], activeRange: [low, high], description: `Selected pivot = ${pivot} at index ${high}.`, line: 11 });
  for (let current = low; current < high; current += 1) {
    record?.({ array: [...values], pivot: high, comparing: [current, high], swapping: [], sorted: [], activeRange: [low, high], description: `Comparing ${values[current]} with pivot ${pivot}.`, line: 14 });
    if (values[current] <= pivot) {
      smallerIndex += 1;
      if (smallerIndex !== current) {
        record?.({ array: [...values], pivot: high, comparing: [], swapping: [smallerIndex, current], sorted: [], activeRange: [low, high], description: `Swapping indexes ${smallerIndex} and ${current}.`, line: 16 });
      }
      [values[smallerIndex], values[current]] = [values[current], values[smallerIndex]];
    }
  }
  const pivotIndex = smallerIndex + 1;
  [values[pivotIndex], values[high]] = [values[high], values[pivotIndex]];
  record?.({ array: [...values], pivot: pivotIndex, comparing: [], swapping: [pivotIndex, high], sorted: [], activeRange: [low, high], description: `Placed pivot ${pivot} at index ${pivotIndex}.`, line: 19 });
  return pivotIndex;
}

function generateQuickSteps(values) {
  const work = [...values];
  const trace = [];
  const record = (step) => trace.push(step);
  record({ array: [...work], pivot: -1, comparing: [], swapping: [], sorted: [], activeRange: [0, work.length - 1], description: `Initial array loaded with ${work.length} elements.`, line: 1 });
  const sorted = [];
  function sort(low, high) {
    if (low < high) {
      const pivotIndex = partition(work, low, high, record);
      sort(low, pivotIndex - 1);
      sort(pivotIndex + 1, high);
    } else if (low === high && low >= 0) {
      sorted.push(low);
      record({ array: [...work], pivot: -1, comparing: [], swapping: [], sorted: [...sorted], activeRange: [low, high], description: `Element ${work[low]} is trivially sorted.`, line: 7 });
    }
  }
  sort(0, work.length - 1);
  record({ array: [...work], pivot: -1, comparing: [], swapping: [], sorted: work.map((_, index) => index), activeRange: [], description: "QuickSort complete. Every element is sorted.", line: 20 });
  return trace;
}

function mergeSort(values) {
  if (values.length < 2) return values;
  const middle = Math.floor(values.length / 2);
  return merge(mergeSort(values.slice(0, middle)), mergeSort(values.slice(middle)));
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) result.push(left[leftIndex++]);
    else result.push(right[rightIndex++]);
  }
  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

function heapSort(values) {
  function siftDown(root, length) {
    let current = root;
    while (true) {
      const left = current * 2 + 1;
      const right = left + 1;
      let largest = current;
      if (left < length && values[left] > values[largest]) largest = left;
      if (right < length && values[right] > values[largest]) largest = right;
      if (largest === current) return;
      [values[current], values[largest]] = [values[largest], values[current]];
      current = largest;
    }
  }
  for (let root = Math.floor(values.length / 2) - 1; root >= 0; root -= 1) siftDown(root, values.length);
  for (let end = values.length - 1; end > 0; end -= 1) {
    [values[0], values[end]] = [values[end], values[0]];
    siftDown(0, end);
  }
  return values;
}

function createSteps(values, algorithm) {
  if (algorithm === "quicksort") return generateQuickSteps(values);
  const target = algorithm === "mergesort" ? mergeSort([...values]) : algorithm === "heapsort" ? heapSort([...values]) : [...values].sort((a, b) => a - b);
  return [
    { array: [...values], pivot: -1, comparing: [], swapping: [], sorted: [], activeRange: [0, values.length - 1], description: `${algorithmNames[algorithm]} is ready to run.`, line: 1 },
    { array: target, pivot: -1, comparing: [], swapping: [], sorted: target.map((_, index) => index), activeRange: [], description: `${algorithmNames[algorithm]} complete. Every element is sorted.`, line: 20 },
  ];
}

function renderTokens(container, values, emptyText = "") {
  container.innerHTML = "";
  if (!values.length) { container.textContent = emptyText; container.classList.add("empty-result"); return; }
  container.classList.remove("empty-result");
  values.forEach((value) => { const token = document.createElement("span"); token.className = "array-token"; token.textContent = value; container.appendChild(token); });
}

function renderBars(step) {
  barsContainer.innerHTML = "";
  if (!step.array.length) return;
  const min = Math.min(...step.array);
  const max = Math.max(...step.array);
  const spread = max - min || 1;
  step.array.forEach((value, index) => {
    const bar = document.createElement("div");
    const height = 25 + ((value - min) / spread) * 65;
    bar.className = "array-bar";
    if (step.sorted.includes(index)) bar.classList.add("sorted");
    else if (step.swapping.includes(index)) bar.classList.add("swapping");
    else if (step.comparing.includes(index)) bar.classList.add("comparing");
    else if (step.pivot === index) bar.classList.add("pivot");
    else if (step.activeRange.length === 2 && index >= step.activeRange[0] && index <= step.activeRange[1]) bar.classList.add("active");
    bar.style.height = `${height}%`;
    const label = document.createElement("span"); label.textContent = value; bar.appendChild(label); barsContainer.appendChild(bar);
  });
}

function renderStep() {
  const step = steps[currentStep];
  if (!step) return;
  renderBars(step);
  stepCounter.textContent = `Step ${currentStep} / ${Math.max(steps.length - 1, 0)}`;
  operationBox.textContent = step.description;
  statusText.textContent = currentStep >= steps.length - 1 ? "Complete" : isRunning ? "Running" : currentStep === 0 ? "Ready" : "Paused";
  placeholder.classList.toggle("hidden", currentStep > 0);
  btnNext.disabled = currentStep >= steps.length - 1;
  btnBack.disabled = currentStep <= 0;
  btnPause.disabled = !isRunning;
  btnPlay.disabled = isRunning || currentStep >= steps.length - 1;
  if (currentStep >= steps.length - 1) {
    const sorted = step.array;
    renderTokens(sortedDisplay, sorted);
    sortedStatus.textContent = "Sorted";
    sortedStatus.style.color = "var(--green)";
  }
  highlightCodeLine(step.line);
}

function prepareSimulation() {
  try {
    originalArray = parseInput(arrayInput.value);
    const algorithm = algorithmSelect.value;
    originalCount.textContent = `${originalArray.length} elements`;
    arraySizeRange.value = Math.min(Math.max(originalArray.length, 5), 20);
    arraySizeValue.textContent = originalArray.length;
    dataStatus.textContent = "Ready";
    dataStatus.className = "status-badge ready";
    inputError.textContent = "";
    renderTokens(originalDisplay, originalArray);
    renderTokens(sortedDisplay, [], "Your sorted numbers will appear here upon completion...");
    sortedStatus.textContent = "Not sorted yet";
    sortedStatus.style.color = "";
    algorithmStatus.textContent = algorithmNames[algorithm];
    steps = createSteps(originalArray, algorithm);
    currentStep = 0;
    stopSimulation();
    placeholder.classList.remove("hidden");
    renderStep();
    renderCode();
  } catch (error) {
    inputError.textContent = error.message;
    dataStatus.textContent = "Error";
    dataStatus.className = "status-badge error";
  }
}

function nextStep() {
  if (!steps.length) prepareSimulation();
  if (currentStep < steps.length - 1) { currentStep += 1; renderStep(); }
  if (currentStep >= steps.length - 1) stopSimulation();
}
function previousStep() {
  stopSimulation();
  if (currentStep > 0) { currentStep -= 1; renderStep(); }
}
function playSimulation() { if (!steps.length || currentStep >= steps.length - 1) prepareSimulation(); isRunning = true; renderStep(); timer = setInterval(nextStep, 1100 - Number(speedRange.value)); }
function stopSimulation() { clearInterval(timer); timer = null; isRunning = false; if (steps.length) renderStep(); }
function resetVisualization() { stopSimulation(); currentStep = 0; if (steps.length) renderStep(); }

function renderCode() {
  const lines = sourceCode[codeLanguage.value].split("\n");
  codeContainer.innerHTML = lines.map((line, index) => `<span class="code-line" data-line="${index + 1}"><span class="line-number">${index + 1}</span>${escapeHtml(line)}</span>`).join("");
}
function highlightCodeLine(lineNumber) {
  codeContainer.querySelectorAll(".code-line").forEach((line) => line.classList.toggle("active-line", Number(line.dataset.line) === lineNumber));
}
function escapeHtml(value) { return value.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]); }

sortForm.addEventListener("submit", (event) => { event.preventDefault(); prepareSimulation(); if (!inputError.textContent) playSimulation(); });
btnPlay.addEventListener("click", playSimulation);
btnPause.addEventListener("click", stopSimulation);
btnBack.addEventListener("click", previousStep);
btnNext.addEventListener("click", nextStep);
btnReset.addEventListener("click", resetVisualization);
algorithmSelect.addEventListener("change", prepareSimulation);
codeLanguage.addEventListener("change", renderCode);
copyCodeButton.addEventListener("click", async () => { await navigator.clipboard?.writeText(sourceCode[codeLanguage.value]); copyCodeButton.textContent = "✓"; setTimeout(() => { copyCodeButton.textContent = "▣"; }, 900); });
arraySizeRange.addEventListener("input", () => { arraySizeValue.value = arraySizeRange.value; });
btnRandom.addEventListener("click", () => { const size = Number(arraySizeRange.value); arrayInput.value = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5).join(", "); prepareSimulation(); });
btnClear.addEventListener("click", () => { arrayInput.value = ""; stopSimulation(); originalArray = []; steps = []; currentStep = 0; renderTokens(originalDisplay, [], "Nothing entered yet."); renderTokens(sortedDisplay, [], "Your sorted numbers will appear here upon completion..."); originalCount.textContent = "0 elements"; sortedStatus.textContent = "Not sorted yet"; dataStatus.textContent = "Ready"; inputError.textContent = ""; barsContainer.innerHTML = ""; placeholder.classList.remove("hidden"); stepCounter.textContent = "Step 0 / 0"; operationBox.textContent = "Ready to run QuickSort. Enter an array to begin."; statusText.textContent = "Ready"; });
themeToggle.addEventListener("click", () => { document.body.classList.toggle("dark"); themeToggle.textContent = document.body.classList.contains("dark") ? "☀" : "☾"; });

arrayInput.addEventListener("input", () => { try { const values = parseInput(arrayInput.value); arraySizeValue.textContent = values.length; originalCount.textContent = `${values.length} elements`; } catch (_) { /* Submit displays the accessible error. */ } });

renderTokens(originalDisplay, [8, 3, -2, 5, 5, 1, 9, 4]);
renderCode();
prepareSimulation();
