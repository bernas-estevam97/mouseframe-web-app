// Analysis page: paw-print marking on a canvas over the uploaded image, pixel-to-cm calibration,
// image resizing and the results table.
//
// The functions declared with `function name()` at the top level are called from the inline
// script in templates/index.html, so keep their names.
'use strict';

const $id = id => document.getElementById(id);

const canvas = $id('canvas');
const ctx = canvas.getContext('2d');

const activeFunctionInfo = $id('activeFunction');
const addMeasureInfo = $id('addMeasureInfo');
const measureToCm = $id('measureToCm');
const showSize = $id('dynamicSize');
const sizeInput = $id('sizeInput');
const selectPoint = $id('selectPoint');
const removePointButton = $id('removePoint');
const replacePointButton = $id('replacePoint');
const inputPixelsManually = $id('pixelsInCmMan');
const savedChoices = $id('savedChoices');
const imgContainer = $id('imgContainer');
const imgEdit = $id('imageEdit');
const buttons = document.querySelector('.buttons-plus-options');
const canvasUpload = $id('canvasUpload');
const tableTitle = $id('titleImage');
const manualID = $id('entryTableID');
const tableWarning = $id('imageResizeTableWarning');
const tableDynamicValuePx = $id('valuePx');
const tableDynamicValueCm = $id('valueCm');
const tbody = $id('tbody');
const footstepStart = $id('footstepStart');
const entryNumber = $id('entryNumber');
const removeMeasurement = $id('removeMeasurement');
const removeByEntriesOption = $id('removeByEntries');
const removeByMeasurementsOption = $id('removeByMeasurement');

function icon(className) {
  const i = document.createElement('i');
  i.className = className;
  return i;
}

function bold(...children) {
  const b = document.createElement('b');
  b.append(...children);
  return b;
}

const show = (el, visible) => { el.style.display = visible ? '' : 'none'; };


// ---------------------------------------------------------------- points state and drawing

const DEFAULT_POINT_SIZE = 4;
let pointSize = DEFAULT_POINT_SIZE; // radius in px of new points

// Each point is {x, y, r}: r is the radius it was drawn with, so changing the point size never
// breaks removing or replacing points that already exist.
const pointsRedLeft = [];
const pointsRedRight = [];
const pointsBlueLeft = [];
const pointsBlueRight = [];
const pointsMeasure = [];

const FRONT_COLOR = 'hsl(0, 100%, 30%)';
const HIND_COLOR = 'hsl(245, 89%, 42%)';
const MEASURE_COLOR = '#000000';

const GROUPS = {
  redLeft: { points: pointsRedLeft, color: FRONT_COLOR, css: 'var(--front-dark)', name: 'Red L', side: 'L',
             status: 'Red (front) Left circle active.', removed: 'All red left points removed!', button: 'redCircleLeft' },
  redRight: { points: pointsRedRight, color: FRONT_COLOR, css: 'var(--front-dark)', name: 'Red R', side: 'R',
              status: 'Red (front) Right circle active.', removed: 'All red right points removed!', button: 'redCircleRight' },
  blueLeft: { points: pointsBlueLeft, color: HIND_COLOR, css: 'var(--hind-dark)', name: 'Blue L', side: 'L',
              status: 'Blue (hind) Left circle active.', removed: 'All blue left points removed!', button: 'blueCircleLeft' },
  blueRight: { points: pointsBlueRight, color: HIND_COLOR, css: 'var(--hind-dark)', name: 'Blue R', side: 'R',
               status: 'Blue (hind) Right circle active.', removed: 'All blue right points removed!', button: 'blueCircleRight' },
};
const GROUP_LIST = Object.values(GROUPS);

function getPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top),
    r: pointSize,
  };
}

function drawPoint(point, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2, true);
  ctx.fill();
  if (label) {
    ctx.font = `${parseInt(point.r) + 8}px Arial`;
    ctx.fillText(label, point.x + point.r * 1.2, point.y + point.r * 1.2 + 10);
  }
}

// Clearing small rectangles around a removed point also erased parts of neighbouring points, so
// every removal redraws the whole canvas from the point arrays instead.
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pointsMeasure.forEach(p => drawPoint(p, MEASURE_COLOR));
  for (const group of GROUP_LIST) {
    group.points.forEach((p, i) => {
      if (!(replacing && replacing.group === group && replacing.index === i)) {
        drawPoint(p, group.color, group.side + (i + 1));
      }
    });
  }
}


// ---------------------------------------------------------------- tools (one active at a time)

// null, 'measure' or a GROUPS key. Replacing a point is tracked separately in `replacing`.
let mode = null;
let replacing = null; // {group, index} while waiting for the replacement point

const TOOL_BUTTONS = { measure: 'measureButton' };
for (const [key, group] of Object.entries(GROUPS)) TOOL_BUTTONS[key] = group.button;

function setMode(next) {
  mode = next;
  canvas.style.cursor = next ? 'crosshair' : 'auto';
  for (const [key, id] of Object.entries(TOOL_BUTTONS)) $id(id).classList.toggle('active', key === next);
  if (next !== 'measure') addMeasureInfo.textContent = '';
}

function showStatus(color, iconClass, text) {
  Object.assign(activeFunctionInfo.style, { color, fontWeight: 'bold', fontSize: '1.4em' });
  activeFunctionInfo.replaceChildren(icon(iconClass), ' ', text);
}

// Ends every tool, including a pending point replacement.
function stopTools() {
  cancelReplace();
  setMode(null);
  activeFunctionInfo.textContent = '';
}

canvas.addEventListener('click', event => {
  const point = getPosition(event);
  if (replacing) {
    finishReplace(point);
  } else if (mode === 'measure') {
    if (pointsMeasure.length < 2) {
      pointsMeasure.push(point);
      drawPoint(point, MEASURE_COLOR);
    }
  } else if (mode) {
    const group = GROUPS[mode];
    group.points.push(point);
    drawPoint(point, group.color, group.side + group.points.length);
    refreshRemoveList();
  }
});

function startMarking(key) {
  setMode(key);
  showStatus(GROUPS[key].css, 'fa-solid fa-play', GROUPS[key].status);
}

function drawRedCircleLeft() { startMarking('redLeft'); }
function drawRedCircleRight() { startMarking('redRight'); }
function drawBlueCircleLeft() { startMarking('blueLeft'); }
function drawBlueCircleRight() { startMarking('blueRight'); }

function removeGroup(key) {
  cancelReplace();
  if (mode !== 'measure') setMode(null);
  GROUPS[key].points.length = 0;
  redraw();
  refreshRemoveList();
  showStatus(GROUPS[key].css, 'fa-solid fa-xmark', GROUPS[key].removed);
}

function removeAllRedCircleLeft() { removeGroup('redLeft'); }
function removeAllRedCircleRight() { removeGroup('redRight'); }
function removeAllBlueCircleLeft() { removeGroup('blueLeft'); }
function removeAllBlueCircleRight() { removeGroup('blueRight'); }

function toggleInactive() {
  stopTools();
  document.activeElement.blur();
}

function resetCanvas() {
  stopTools();
  for (const group of GROUP_LIST) group.points.length = 0;
  pointsMeasure.length = 0;
  redraw();
  resetSizeValue();
  document.activeElement.blur();
  refreshRemoveList();
}


// ---------------------------------------------------------------- point size

sizeInput.addEventListener('keydown', e => {
  // Block the minus sign, the decimal point and the exponent
  if (['-', '.', 'e', 'E'].includes(e.key)) e.preventDefault();
});

sizeInput.addEventListener('input', () => {
  // Pasted values get past keydown
  if (sizeInput.value !== '' && sizeInput.value < 1) sizeInput.value = 1;
});

function showPointSize() {
  showSize.textContent = `Current point radius size is: ${pointSize}px`;
}

function changeSize() {
  pointSize = Number(sizeInput.value) || DEFAULT_POINT_SIZE;
  showPointSize();
}

// The size input keeps its text: only the size used for new points goes back to the default
function resetSizeValue() {
  pointSize = DEFAULT_POINT_SIZE;
  showPointSize();
}

function resetSize() {
  sizeInput.value = '';
  resetSizeValue();
}

showPointSize();


// ---------------------------------------------------------------- remove or replace one point

function refreshRemoveList() {
  const options = [new Option('Select Point')];
  for (const group of GROUP_LIST) {
    group.points.forEach((_, i) => options.push(new Option(group.name + (i + 1), group.name + (i + 1))));
  }
  selectPoint.replaceChildren(...options);
  updatePointButtons();
}

// The chosen option as {group, index}, or null when no existing point is selected
function selectedPoint() {
  const match = /^(Red|Blue) ([LR])(\d+)$/.exec(selectPoint.value);
  if (!match) return null;
  const group = GROUP_LIST.find(g => g.name === `${match[1]} ${match[2]}`);
  const index = Number(match[3]) - 1;
  return index < group.points.length ? { group, index } : null;
}

function updatePointButtons() {
  const visible = selectedPoint() !== null;
  show(removePointButton, visible);
  show(replacePointButton, visible);
}

selectPoint.addEventListener('change', updatePointButtons);

function removeChosenPoint() {
  const selected = selectedPoint();
  if (!selected) return;
  selected.group.points.splice(selected.index, 1);
  redraw();
  refreshRemoveList();
}

// Controls that would change the points while one is being replaced
const REPLACE_LOCKED = ['removePoint', 'replacePoint', 'selectPoint', 'removeImage',
  'redCircleLeft', 'redCircleRight', 'blueCircleLeft', 'blueCircleRight'];

function lockForReplace(locked) {
  REPLACE_LOCKED.forEach(id => { $id(id).disabled = locked; });
  document.querySelector('.upload-btn').disabled = locked;
}

function replaceChosenPoint() {
  const selected = selectedPoint();
  if (!selected) return;
  setMode(null);
  replacing = selected;
  lockForReplace(true);
  canvas.style.cursor = 'crosshair';
  const { group, index } = selected;
  const label = `${group.color === FRONT_COLOR ? 'Red (front)' : 'Blue (hind)'} ${group.side}${index + 1}`;
  showStatus(group.css, 'fa-solid fa-repeat', `Replacing ${label}`);
  redraw(); // hides the point being replaced
}

function finishReplace(point) {
  replacing.group.points[replacing.index] = point;
  cancelReplace();
}

function cancelReplace() {
  if (!replacing) return;
  replacing = null;
  lockForReplace(false);
  canvas.style.cursor = mode ? 'crosshair' : 'auto';
  activeFunctionInfo.textContent = '';
  redraw();
}

refreshRemoveList();


// ---------------------------------------------------------------- pixels per centimetre

let dist = 0; // pixels in 1 cm; 0 = not set

function drawMeasureCircle() {
  setMode('measure');
  activeFunctionInfo.textContent = '';
  addMeasureInfo.replaceChildren(
    bold(icon('fa-solid fa-play'), ' Add measure points active'),
    document.createElement('br'),
    '(*) You can stop this function by clicking the eraser button below or clicking the reset or pause buttons from the above section (shortcut keys work as well).'
  );
  alert('Measure 1cm function is active. Click on the canvas to add 2 points and measure the distance (shortcut key - M key) in pixels.');
}

// Removes the measurement points but keeps the measured value
function removeAllMeasurePointsOnly() {
  pointsMeasure.length = 0;
  if (mode === 'measure') setMode(null);
  redraw();
}

// Eraser (D): removes the measurement points and the conversion value, wherever it came from
function removeAllMeasurePoints() {
  pointsMeasure.length = 0;
  stopTools();
  redraw();
  resetInput();
}

function distanceMeasurePoint() {
  if (pointsMeasure.length < 2) {
    stopTools();
    alert('Add 2 points and measure or manually input known values under.');
    return;
  }
  const [a, b] = pointsMeasure;
  const measured = Math.hypot(b.x - a.x, b.y - a.y).toFixed(3);
  dist = Number(measured);
  measureToCm.value = dist;
  stopTools();
  alert(`Distance measured in pixels: ${measured}px. Removing points`);
  removeAllMeasurePointsOnly();
}

function manualInputMeasure() {
  const typed = inputPixelsManually.value;
  const saved = savedChoices.value;
  if ((typed === '') === (saved === 'None')) {
    alert('Type a value or pick a saved one (only one of the two), then click Use.');
    return;
  }
  const value = Number(typed !== '' ? typed : saved);
  if (!(value > 0)) {
    alert('The number of pixels in 1 cm must be greater than 0.');
    return;
  }
  dist = value;
  measureToCm.value = value;
}

function resetInput() {
  inputPixelsManually.value = '';
  savedChoices.value = 'None'; // set from code, so no "change" event: update the notice here
  dist = 0;
  measureToCm.value = '';
  updateSavedSizeNotice();
}


// ---------------------------------------------------------------- results table

// Row text below is copied into Excel exports, so keep it stable for users' spreadsheets.
const BREAK_TEXT = '------------------------------BREAK------------------------------';

const averageLabel = type => (type === 'Overlap Left' ? 'Overlap left' : type) + ' average in cm:';

const pxDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y).toFixed(3);

// Consecutive steps of one paw: 1 -> 2, 2 -> 3, ...
function strideRows(points, name) {
  const rows = [];
  for (let i = 0; i < points.length - 1; i++) {
    rows.push({ from: name + (i + 1), to: name + (i + 2), px: pxDistance(points[i], points[i + 1]) });
  }
  return rows;
}

// Same-numbered front and hind prints of one side
function overlapRows(front, hind, frontName, hindName) {
  const rows = [];
  for (let i = 0; i < Math.min(front.length, hind.length); i++) {
    rows.push({ from: frontName + (i + 1), to: hindName + (i + 1), px: pxDistance(front[i], hind[i]) });
  }
  return rows;
}

// Vertical distance between each print and the "imaginary" point halfway between the two
// surrounding prints of the other side (or that side's print itself when it is the last one).
// `start` is the side of the first set of footsteps and decides which prints pair up.
function strideWidthRows(left, right, color, kind, start) {
  const rows = [];
  const mid = (points, k) => (k < points.length - 1 ? (points[k].y + points[k + 1].y) / 2 : points[k].y);
  const add = (to, dy) => rows.push({ from: `Imaginary ${kind} ${rows.length + 1}`, to, px: Math.hypot(0, dy).toFixed(3) });
  for (let i = 0; i < left.length; i++) {
    if (start === 'Left') {
      if (i >= 1 && i - 1 < right.length) add(`${color} L${i + 1}`, left[i].y - mid(right, i - 1));
      if (i < right.length) add(`${color} R${i + 1}`, mid(left, i) - right[i].y);
    } else {
      if (i < right.length) add(`${color} L${i + 1}`, mid(right, i) - left[i].y);
      if (i + 1 < right.length) add(`${color} R${i + 2}`, mid(left, i) - right[i + 1].y);
    }
  }
  return rows;
}

// Every measurement type in table order, with its rows
function measurementSections() {
  const sections = [
    { type: 'Stride length left front', rows: strideRows(pointsRedLeft, 'Red L') },
    { type: 'Stride length right front', rows: strideRows(pointsRedRight, 'Red R') },
    { type: 'Stride length left hind', rows: strideRows(pointsBlueLeft, 'Blue L') },
    { type: 'Stride length right hind', rows: strideRows(pointsBlueRight, 'Blue R') },
    { type: 'Overlap Left', rows: overlapRows(pointsRedLeft, pointsBlueLeft, 'Red L', 'Blue L') },
    { type: 'Overlap Right', rows: overlapRows(pointsRedRight, pointsBlueRight, 'Red R', 'Blue R') },
  ];
  const start = footstepStart.value;
  if (start === 'Left' || start === 'Right') {
    const side = start[0];
    sections.push(
      { type: `Stride Width Front(${side})`, rows: strideWidthRows(pointsRedLeft, pointsRedRight, 'Red', 'Front', start) },
      { type: `Stride Width Hind(${side})`, rows: strideWidthRows(pointsBlueLeft, pointsBlueRight, 'Blue', 'Hind', start) },
    );
  }
  return sections;
}

function addEntryRow(row, type, cm) {
  const tr = tbody.insertRow(-1);
  // Entry numbers are the row position, so "Remove by entry number" can find them
  for (const text of [tr.rowIndex - 1, `${row.from} ` + ' → ' + row.to, type, row.px, cm]) {
    tr.insertCell().textContent = text;
  }
}

function addAverageRow(type, values) {
  const tr = tbody.insertRow(-1);
  const label = tr.insertCell();
  label.colSpan = 4;
  label.append(bold(averageLabel(type)));
  tr.insertCell().textContent = (values.reduce((a, b) => a + b) / values.length).toFixed(3);
}

function addBreakRow() {
  const cell = tbody.insertRow(-1).insertCell();
  cell.textContent = BREAK_TEXT;
  cell.colSpan = 5;
  cell.style.textAlign = 'center';
}

function updateRemoveOptions() {
  const hasRows = tbody.rows.length >= 1;
  show(removeByEntriesOption, hasRows);
  show(removeByMeasurementsOption, hasRows);
}

function addEntriesAll() {
  for (const { type, rows } of measurementSections()) {
    rows.forEach(row => addEntryRow(row, type, dist !== 0 ? (row.px / dist).toFixed(3) : 'Undefined'));
  }
  if (GROUP_LIST.some(g => g.points.length < 1)) alert('Points missing in some measurements.');
  addBreakRow();
  updateRemoveOptions();
}

function addEntriesAllAverage() {
  if (dist === 0) {
    alert('Measure how many pixels are in a cm before using these option!');
    return;
  }
  if (GROUP_LIST.some(g => g.points.length < 2)) {
    alert('Have enough points to perform at least one of each measurement.');
    return;
  }
  for (const { type, rows } of measurementSections()) {
    const values = rows.map(row => row.px / dist);
    rows.forEach((row, i) => addEntryRow(row, type, values[i].toFixed(3)));
    if (values.length) addAverageRow(type, values);
  }
  addBreakRow();
  updateRemoveOptions();
}

// Entry rows show their position; break rows and average rows ("...average in cm:") keep their text
function renumberRows() {
  [...tbody.rows].forEach((tr, i) => {
    const cell = tr.cells[0];
    if (cell.textContent !== BREAK_TEXT && !cell.textContent.includes(':')) cell.textContent = i + 1;
  });
}

function removeEntry() {
  const rows = tbody.rows;
  if (entryNumber.value.trim() !== '') {
    const number = String(Number(entryNumber.value));
    const row = [...rows].find(tr => tr.cells.length === 5 && tr.cells[0].textContent === number);
    if (!row) {
      alert(`There is no entry number ${entryNumber.value.trim()} in the table.`);
      return;
    }
    row.remove();
    renumberRows();
  } else if (rows.length === 1) {
    tbody.deleteRow(-1);
  } else if (rows.length > 1) {
    // Without a number, remove the last entry (the row above a trailing break)
    tbody.deleteRow(rows[rows.length - 1].cells[0].textContent === BREAK_TEXT ? rows.length - 2 : -1);
  }
  updateRemoveOptions();
}

function removeAllEntries() {
  tbody.replaceChildren();
  updateRemoveOptions();
}

// Options of the "Remove by measurement type" list that cover more than one type
const REMOVE_TYPES = {
  'Stride Width Front': ['Stride Width Front(L)', 'Stride Width Front(R)'],
  'Stride Width Hind': ['Stride Width Hind(L)', 'Stride Width Hind(R)'],
};

function removeByMeasurement() {
  const types = REMOVE_TYPES[removeMeasurement.value] || [removeMeasurement.value];
  const labels = types.map(averageLabel);
  for (const tr of [...tbody.rows]) {
    if (types.includes(tr.cells[2]?.textContent) || labels.includes(tr.cells[0].textContent)) tr.remove();
  }
  renumberRows();
  updateRemoveOptions();
}

function removeTableID() {
  tableTitle.replaceChildren(bold('Table ID: '));
  manualID.value = '';
}

updateRemoveOptions();


// ---------------------------------------------------------------- add entries options and help

const addButton = $id('addAll');
const addButtonAverage = $id('addAllAverage');
const openAeModal = $id('openAe');
const openAeaModal = $id('openAea');
const modalHelpAe = $id('modalHelpAddEntries');
const modalHelpAea = $id('modalHelpAddEntriesAverage');

// The add buttons need to know which side the footsteps start on
function updateAddButtons() {
  const chosen = footstepStart.value === 'Left' || footstepStart.value === 'Right';
  [addButton, addButtonAverage, openAeModal, openAeaModal].forEach(el => show(el, chosen));
}
footstepStart.addEventListener('change', updateAddButtons);
updateAddButtons();

modalHelpAe.classList.add('hidden');
modalHelpAea.classList.add('hidden');
openAeModal.addEventListener('click', () => modalHelpAe.classList.remove('hidden'));
openAeaModal.addEventListener('click', () => modalHelpAea.classList.remove('hidden'));
$id('closeModalHelpAddEntries').addEventListener('click', () => modalHelpAe.classList.add('hidden'));
$id('closeModalHelpAddEntriesAverage').addEventListener('click', () => modalHelpAea.classList.add('hidden'));


// ---------------------------------------------------------------- image upload and reset

const img = new Image();
let originalImageWidth = 0;
let originalImageHeight = 0;

const hasImage = () => img.src.startsWith('blob:');

function getShortenedFilename(filename, maxLength = 50) {
  if (filename.length <= maxLength) return filename;
  const extIndex = filename.lastIndexOf('.');
  const extension = extIndex !== -1 ? filename.slice(extIndex) : '';
  const nameOnly = extIndex !== -1 ? filename.slice(0, extIndex) : filename;
  const visibleChars = maxLength - extension.length - 3; // 3 for "..."
  return `${nameOnly.slice(0, Math.ceil(visibleChars / 2))}...${nameOnly.slice(-Math.floor(visibleChars / 2))}${extension}`;
}

function setWorkspaceVisible(visible) {
  show($id('savedDistance'), visible);
  show($id('showData'), visible);
  show(canvasUpload, visible);
  show(canvas, visible);
  buttons.style.display = visible ? 'block' : 'none';
  imgEdit.style.display = visible ? 'block' : 'none';
}

function loadFile(event) {
  const file = event.target.files[0];
  event.target.value = null; // lets the same file be selected again later
  if (!file) return;

  if (hasImage()) {
    if (!confirm('An image is already loaded. This will clear all current data and measurements. Are you sure you are done with the previous image?')) return;
    resetFile();
  }
  if (!file.type.startsWith('image/')) {
    alert('Please enter a valid image format!');
    return;
  }

  img.src = URL.createObjectURL(file);
  imgContainer.style.backgroundImage = `url(${img.src})`;
  $id('imageName').textContent = getShortenedFilename(file.name);
  setWorkspaceVisible(true);

  stopTools();
  for (const group of GROUP_LIST) group.points.length = 0;
  pointsMeasure.length = 0;
  removeAllEntries();
  removeTableID();
  refreshRemoveList();
}

img.addEventListener('load', () => {
  originalImageWidth = img.naturalWidth;
  originalImageHeight = img.naturalHeight;
  $id('imageUploadedWidth').textContent = originalImageWidth;
  $id('imageUploadedHeight').textContent = originalImageHeight;
  imgContainer.style.border = '2px solid var(--ink)';
  resizeImageToFitViewport();
  show($id('removeImage'), true);
  show($id('accordion'), true);
});

img.addEventListener('error', () => {
  if (!hasImage()) return;
  alert('This image could not be opened. Use a common format such as .png or .jpg (.tiff is not supported).');
  resetFile();
});

function resetFile() {
  if (hasImage()) URL.revokeObjectURL(img.src);
  img.removeAttribute('src');

  stopTools();
  for (const group of GROUP_LIST) group.points.length = 0;
  pointsMeasure.length = 0;
  refreshRemoveList();

  imgContainer.style.backgroundImage = '';
  imgContainer.style.width = '0';
  imgContainer.style.height = '0';
  imgContainer.style.border = 'none';
  canvas.width = 0;
  canvas.height = 0;
  setWorkspaceVisible(false);

  tableTitle.replaceChildren(bold('Table ID:'));
  measureToCm.value = '';
  dist = 0;

  show($id('removeImage'), false);
  show($id('accordion'), false);
}

window.addEventListener('beforeunload', event => {
  if (hasImage()) {
    event.preventDefault();
    event.returnValue = true; // Chrome and older browsers
  }
});

// Hidden until an image is uploaded
setWorkspaceVisible(false);
show($id('removeImage'), false);
show($id('accordion'), false);


// ---------------------------------------------------------------- image size toolbar

const zoomPercent = $id('zoomPercent');
const savedSizeNotice = $id('savedSizeNotice');
const ZOOM_STEP = 5;
let currentPercent = 100;

// Points are stored in canvas pixels of the current size, so resizing invalidates the points, the
// table values and the pixels-per-cm value. Ask before throwing work away.
function hasWork() {
  return pointsMeasure.length > 0 || GROUP_LIST.some(g => g.points.length > 0)
    || tbody.rows.length > 0 || dist !== 0;
}

const scaledSize = percent => [Math.round(originalImageWidth * percent / 100), Math.round(originalImageHeight * percent / 100)];

// Largest size up to 100% that fits 90% of the window
function fitPercent() {
  const scale = Math.min(window.innerWidth * 0.9 / originalImageWidth, window.innerHeight * 0.9 / originalImageHeight, 1);
  return Math.max(Math.round(scale * 100), 1);
}

// Every resize goes through here. Returns true when the image was resized.
function requestScale(percent) {
  zoomPercent.value = currentPercent; // updated by applyScale if the resize goes ahead
  if (!hasImage() || !Number.isFinite(percent)) return false;
  percent = Math.min(Math.max(Math.round(percent), 1), 100);
  if (percent === currentPercent) return false;
  if (hasWork() && !confirm('Resizing removes all points, the results table and the pixels-per-centimetre value. Resize anyway?')) return false;
  applyScale(percent);
  return true;
}

function applyScale(percent) {
  currentPercent = percent;
  zoomPercent.value = percent;
  resetCanvas();
  removeAllEntries();
  resetInput();

  const [width, height] = scaledSize(percent);
  imgContainer.style.backgroundSize = `${width}px ${height}px`;
  imgContainer.style.width = `${width}px`;
  imgContainer.style.height = `${height}px`;
  canvas.width = width;
  canvas.height = height;

  $id('currentImgSize').textContent = `${width} × ${height} px`;
  const warnIcon = document.createElement('span');
  warnIcon.style.color = 'red';
  warnIcon.append(bold('⚠'));
  tableWarning.replaceChildren(warnIcon, ` Image was redimensioned to ${percent}% of its original size!`);
  show(tableWarning, percent !== 100);
  tableDynamicValuePx.textContent = `Value(px) at ${percent}%`;
  tableDynamicValueCm.textContent = `Value(cm) at ${percent}%`;
  updateSavedSizeNotice();
}

// Large images start scaled down to fit the window (never scaled up)
function resizeImageToFitViewport() {
  applyScale(fitPercent());
}

// Next multiple of 5 in that direction: 87 -> 90 or 85
const stepPercent = direction => (direction > 0
  ? Math.floor(currentPercent / ZOOM_STEP) * ZOOM_STEP + ZOOM_STEP
  : Math.ceil(currentPercent / ZOOM_STEP) * ZOOM_STEP - ZOOM_STEP);

$id('zoomFit').addEventListener('click', () => requestScale(fitPercent()));
$id('zoomOut').addEventListener('click', () => requestScale(stepPercent(-1)));
$id('zoomIn').addEventListener('click', () => requestScale(stepPercent(1)));
$id('zoom100').addEventListener('click', () => requestScale(100));
// "change" fires on Enter or when the field loses focus, not on every typed digit
zoomPercent.addEventListener('change', () => requestScale(zoomPercent.valueAsNumber));

// A saved pixels-per-cm value only fits the image size it was measured on (stored as "WxH" at
// the end of the option text). Warn when it differs and offer to resize to that size.
function updateSavedSizeNotice() {
  savedSizeNotice.hidden = true;
  const match = /(\d+)\s*x\s*(\d+)\s*$/i.exec(savedChoices.selectedOptions[0]?.textContent || '');
  if (!match || !hasImage()) return;
  const [width, height] = [Number(match[1]), Number(match[2])];
  if (width === canvas.width && height === canvas.height) return;

  savedSizeNotice.replaceChildren(`This value was saved for a ${width} × ${height} image, but this image is shown at ${canvas.width} × ${canvas.height}.`);
  const percent = Math.round(width / originalImageWidth * 100);
  const [w, h] = scaledSize(percent);
  if (percent >= 1 && percent <= 100 && w === width && h === height) {
    const resize = Object.assign(document.createElement('button'), { type: 'button', className: 'btn-quiet', textContent: `Resize to ${width} × ${height}` });
    resize.addEventListener('click', () => {
      const chosen = savedChoices.selectedIndex;
      if (requestScale(percent)) {
        savedChoices.selectedIndex = chosen; // resizing clears the choice; keep it for "Use"
        updateSavedSizeNotice();
      }
    });
    savedSizeNotice.append(resize);
  } else {
    savedSizeNotice.append(' Measure the 1 cm line again on this image instead.');
  }
  savedSizeNotice.hidden = false;
}
savedChoices.addEventListener('change', updateSavedSizeNotice);


// ---------------------------------------------------------------- keyboard shortcuts

const SHORTCUTS = {
  q: 'redCircleLeft',
  w: 'redCircleRight',
  a: 'blueCircleLeft',
  s: 'blueCircleRight',
  m: 'measureDistance',
  d: 'resetMeasure',
};

document.addEventListener('keydown', event => {
  // Leave browser shortcuts (Ctrl+R, Ctrl+P...) and typing in form fields alone
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const active = document.activeElement;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName) || active.isContentEditable) return;
  if (!hasImage()) return;

  const key = event.key.toLowerCase();

  if (key === '+' || key === '=' || key === '-' || key === '0') {
    event.preventDefault();
    // Holding the key down repeats it: ask about losing work once, not on every repeat
    if (event.repeat && hasWork()) return;
    requestScale(key === '0' ? 100 : stepPercent(key === '-' ? -1 : 1));
  } else if (event.shiftKey && key === 'm') {
    $id('measureButton').click();
  } else if (key in SHORTCUTS) {
    $id(SHORTCUTS[key]).click();
  } else if (key === 'p') {
    alert('Stopped all marking/drawing functions.');
    $id('toggleInactive').click();
  } else if (key === 'r') {
    if (confirm('Are you sure you want to reset the canvas? This will delete all points and measurements.')) {
      $id('resetCanvas').click();
    }
  }
});


// ---------------------------------------------------------------- screen resolution

$id('userResolution').append(
  `${Math.round(window.screen.width * window.devicePixelRatio)}x${Math.round(window.screen.height * window.devicePixelRatio)}`
);
