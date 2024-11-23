// Menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const closeMenuToggle = document.getElementById('closeMenuToggle');
const offCanvasMenu = document.getElementById('offCanvasMenu');
const chessboardContainer = document.getElementById('chessboard-container');
const leftColumn = document.getElementById('leftColumn');
const reloadButton = document.getElementById('reloadButton');
const confirmDialog = document.getElementById('confirmDialog');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

menuToggle.addEventListener('click', function() {
    offCanvasMenu.classList.add('open');
    chessboardContainer.classList.add('open');
    leftColumn.style.display = 'none';
});

function closeMenu() {
    offCanvasMenu.classList.remove('open');
    chessboardContainer.classList.remove('open');
    leftColumn.style.display = 'flex';
    setTimeout(function() {
        adjustCanvasSize();
    }, 300);
}

closeMenuToggle.addEventListener('click', closeMenu);

// Close menu when ESC key is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMenu();
    }
});

// Close menu when chessboard is clicked
chessboardContainer.addEventListener('click', closeMenu);

// Variabler for skakbræt-tilstand
let isBlack = true;
let lastTimeSwitched = 0;
let interval = 500;
let isAnimationPaused = true; // Start med pauseret animation

// Variabler for skakbræt-udseende
let squareSize = 10;
let redSquares = { top: 0, right: 0, bottom: 0, left: 0 };
let redSquareOffset = 10;
let redSquareSizeMultiplier = 1;
let cornerSquareOffset = 10;

// Status for hjørnefirkanter
let topLeftCorner = false;
let topRightCorner = false;
let bottomLeftCorner = false;
let bottomRightCorner = false;

// Status for center firkant
let centerSquare = false;

// p5.js setup function - called once when the script starts
function setup() {
    let chessboardContainer = document.getElementById('chessboard-container');
    let canvas = createCanvas(chessboardContainer.offsetWidth, chessboardContainer.offsetHeight);
    canvas.parent('chessboard-container');
    noSmooth();
    frameRate(60);
    
    // Initialize settings
    updateSettingsFromURL();
    updateGUI();
}

// Nulstil bekræftelsesdialog
reloadButton.addEventListener('click', function(event) {
    event.preventDefault();
    confirmDialog.style.display = 'block';
});

confirmYes.addEventListener('click', function() {
    const urlWithoutParams = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.location.href = urlWithoutParams;
});

confirmNo.addEventListener('click', function() {
    confirmDialog.style.display = 'none';
});

// p5.js draw function - called continuously to render the chessboard
function draw() {
    background(255);

    if (!isAnimationPaused && millis() - lastTimeSwitched > interval) {
        isBlack = !isBlack;
        lastTimeSwitched = millis();
    }

    drawChessboard();
    drawRedPerimeter();
    drawCornerSquares();
    drawCenterSquare();
}

// Funktion til at tegne skakbrættet
function drawChessboard() {
    for (let y = 0; y < height; y += squareSize) {
        for (let x = 0; x < width; x += squareSize) {
            let color = (Math.floor(x / squareSize) % 2) == (Math.floor(y / squareSize) % 2) ? (isBlack ? 0 : 255) : (isBlack ? 255 : 0);
            fill(color);
            noStroke();
            rect(x, y, squareSize, squareSize);
        }
    }
}

// Funktion til at tegne det røde område omkring skakbrættet
function drawRedPerimeter() {
    fill(255, 0, 0);
    for (let side in redSquares) {
        drawRedSide(redSquares[side], side);
    }
}

// Funktion til at tegne de røde firkanter på en side
function drawRedSide(count, side) {
    let positions = calculateRedSquarePositions(count, side);
    for (let pos of positions) {
        rect(pos.x, pos.y, squareSize * redSquareSizeMultiplier, squareSize * redSquareSizeMultiplier);
    }
}

// Hjælpefunktion til at beregne positionerne for de røde firkanter
function calculateRedSquarePositions(count, side) {
    let positions = [];
    let x, y;

    for (let i = 0; i < count; i++) {
        switch (side) {
            case 'top':
                x = (width / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                y = 0 + redSquareOffset;
                break;
            case 'right':
                x = width - (squareSize * redSquareSizeMultiplier) - redSquareOffset;
                y = (height / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                break;
            case 'bottom':
                x = (width / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                y = height - (squareSize * redSquareSizeMultiplier) - redSquareOffset;
                break;
            case 'left':
                x = 0 + redSquareOffset;
                y = (height / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                break;
        }
        positions.push({ x, y });
    }
    return positions;
}

// Funktion til at tegne firkanter i hjørnerne
function drawCornerSquares() {
    if (topLeftCorner) {
        fill(255, 0, 0);
        rect(cornerSquareOffset, cornerSquareOffset, squareSize * redSquareSizeMultiplier, squareSize * redSquareSizeMultiplier);
    }
    if (topRightCorner) {
        fill(255, 0, 0);
        rect(width - squareSize * redSquareSizeMultiplier - cornerSquareOffset, cornerSquareOffset, squareSize * redSquareSizeMultiplier, squareSize * redSquareSizeMultiplier);
    }
    if (bottomLeftCorner) {
        fill(255, 0, 0);
        rect(cornerSquareOffset, height - squareSize * redSquareSizeMultiplier - cornerSquareOffset, squareSize * redSquareSizeMultiplier, squareSize * redSquareSizeMultiplier);
    }
    if (bottomRightCorner) {
        fill(255, 0, 0);
        rect(width - squareSize * redSquareSizeMultiplier - cornerSquareOffset, height - squareSize * redSquareSizeMultiplier - cornerSquareOffset, squareSize * redSquareSizeMultiplier, squareSize * redSquareSizeMultiplier);
    }
}

// Funktion til at tegne en firkant i centrum
function drawCenterSquare() {
    if (centerSquare) {
        fill(255, 0, 0);
        rect(width / 2 - (squareSize * redSquareSizeMultiplier) / 2, height / 2 - (squareSize * redSquareSizeMultiplier) / 2, squareSize * redSquareSizeMultiplier, squareSize * redSquareSizeMultiplier);
    }
}

// Funktion til at justere lærredets størrelse
function adjustCanvasSize() {
    let chessboardContainer = document.getElementById('chessboard-container');
    resizeCanvas(chessboardContainer.offsetWidth, chessboardContainer.offsetHeight);
}

// Funktion til at håndtere ændringer i vinduets størrelse
function windowResized() {
    adjustCanvasSize();
}

// Funktion til at opdatere indstillinger fra URL-parametre
function updateSettingsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    squareSize = parseInt(urlParams.get('squareSize')) || squareSize;
    interval = parseInt(urlParams.get('interval')) || interval;
    redSquares.top = parseInt(urlParams.get('topRed')) || redSquares.top;
    redSquares.right = parseInt(urlParams.get('rightRed')) || redSquares.right;
    redSquares.bottom = parseInt(urlParams.get('bottomRed')) || redSquares.bottom;
    redSquares.left = parseInt(urlParams.get('leftRed')) || redSquares.left;
    redSquareOffset = parseInt(urlParams.get('redSquareOffset')) || redSquareOffset;
    redSquareSizeMultiplier = parseInt(urlParams.get('redSquareSizeMultiplier')) || redSquareSizeMultiplier;
    cornerSquareOffset = parseInt(urlParams.get('cornerSquareOffset')) || cornerSquareOffset;
    topLeftCorner = urlParams.get('topLeftCorner') === 'true' || topLeftCorner;
    topRightCorner = urlParams.get('topRightCorner') === 'true' || topRightCorner;
    bottomLeftCorner = urlParams.get('bottomLeftCorner') === 'true' || bottomLeftCorner;
    bottomRightCorner = urlParams.get('bottomRightCorner') === 'true' || bottomRightCorner;
    centerSquare = urlParams.get('centerSquare') === 'true' || centerSquare;
}

// Funktion til at opdatere indstillingerne
function updateSettings() {
    const squareSizeInput = document.getElementById('squareSize');
    const intervalInput = document.getElementById('interval');
    const topRedInput = document.getElementById('topRed');
    const rightRedInput = document.getElementById('rightRed');
    const bottomRedInput = document.getElementById('bottomRed');
    const leftRedInput = document.getElementById('leftRed');
    const redSquareOffsetInput = document.getElementById('redSquareOffset');
    const redSquareSizeMultiplierInput = document.getElementById('redSquareSizeMultiplier');
    const cornerSquareOffsetInput = document.getElementById('cornerSquareOffset');
    const topLeftCornerInput = document.getElementById('topLeftCorner');
    const topRightCornerInput = document.getElementById('topRightCorner');
    const bottomLeftCornerInput = document.getElementById('bottomLeftCorner');
    const bottomRightCornerInput = document.getElementById('bottomRightCorner');
    const centerSquareInput = document.getElementById('centerSquare');

    if (squareSizeInput) squareSize = parseInt(squareSizeInput.value);
    if (intervalInput) interval = parseInt(intervalInput.value);
    if (topRedInput) redSquares.top = parseInt(topRedInput.value);
    if (rightRedInput) redSquares.right = parseInt(rightRedInput.value);
    if (bottomRedInput) redSquares.bottom = parseInt(bottomRedInput.value);
    if (leftRedInput) redSquares.left = parseInt(leftRedInput.value);
    if (redSquareOffsetInput) redSquareOffset = parseInt(redSquareOffsetInput.value);
    if (redSquareSizeMultiplierInput) redSquareSizeMultiplier = parseInt(redSquareSizeMultiplierInput.value);
    if (cornerSquareOffsetInput) cornerSquareOffset = parseInt(cornerSquareOffsetInput.value);
    if (topLeftCornerInput) topLeftCorner = topLeftCornerInput.checked;
    if (topRightCornerInput) topRightCorner = topRightCornerInput.checked;
    if (bottomLeftCornerInput) bottomLeftCorner = bottomLeftCornerInput.checked;
    if (bottomRightCornerInput) bottomRightCorner = bottomRightCornerInput.checked;
    if (centerSquareInput) centerSquare = centerSquareInput.checked;

    adjustCanvasSize();
    draw();
}

// Event Listener for submit-begivenhed på form
document.getElementById('controlForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateSettings();
    updateURL();
    closeMenu(); // Luk menuen efter opdatering
});

// Kopier link knap
document.getElementById('copyLinkButton').addEventListener('click', function() {
    copyCurrentLink();
});

// Funktion til at opdatere URL
function updateURL() {
    var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?';
    newUrl += 'squareSize=' + encodeURIComponent(squareSize) + '&';
    newUrl += 'interval=' + encodeURIComponent(interval) + '&';
    newUrl += 'redSquareSizeMultiplier=' + encodeURIComponent(redSquareSizeMultiplier) + '&';
    newUrl += 'topRed=' + encodeURIComponent(redSquares.top) + '&';
    newUrl += 'rightRed=' + encodeURIComponent(redSquares.right) + '&';
    newUrl += 'bottomRed=' + encodeURIComponent(redSquares.bottom) + '&';
    newUrl += 'leftRed=' + encodeURIComponent(redSquares.left) + '&';
    newUrl += 'redSquareOffset=' + encodeURIComponent(redSquareOffset) + '&';
    newUrl += 'topLeftCorner=' + topLeftCorner + '&';
    newUrl += 'topRightCorner=' + topRightCorner + '&';
    newUrl += 'bottomLeftCorner=' + bottomLeftCorner + '&';
    newUrl += 'bottomRightCorner=' + bottomRightCorner + '&';
    newUrl += 'centerSquare=' + centerSquare + '&';
    newUrl += 'cornerSquareOffset=' + encodeURIComponent(cornerSquareOffset);

    window.history.pushState({ path: newUrl }, '', newUrl);
}

// Funktion til at opdatere GUI
function updateGUI() {
    document.getElementById('squareSize').value = squareSize;
    document.getElementById('interval').value = interval;
    document.getElementById('topRed').value = redSquares.top;
    document.getElementById('rightRed').value = redSquares.right;
    document.getElementById('bottomRed').value = redSquares.bottom;
    document.getElementById('leftRed').value = redSquares.left;
    document.getElementById('redSquareOffset').value = redSquareOffset;
    document.getElementById('redSquareSizeMultiplier').value = redSquareSizeMultiplier;
    document.getElementById('cornerSquareOffset').value = cornerSquareOffset;
    document.getElementById('topLeftCorner').checked = topLeftCorner;
    document.getElementById('topRightCorner').checked = topRightCorner;
    document.getElementById('bottomLeftCorner').checked = bottomLeftCorner;
    document.getElementById('bottomRightCorner').checked = bottomRightCorner;
    document.getElementById('centerSquare').checked = centerSquare;
}

// Funktion til at kopiere det aktuelle link
function copyCurrentLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(function() {
        console.log('Linket er kopieret til udklipsholderen');
    }, function(err) {
        console.error('Kunne ikke kopiere linket: ', err);
    });
}

// Load help texts from JSON file
fetch('help-texts.json')
.then(response => response.json())
.then(helpTexts => {
    const helpIcons = document.querySelectorAll('.help-icon');
    helpIcons.forEach(icon => {
        const controlId = icon.dataset.help;
        const helpText = helpTexts[controlId];

        icon.addEventListener('click', () => {
            const helpTextElement = document.getElementById(`help-${controlId}`);
            helpTextElement.textContent = helpText;
            helpTextElement.classList.toggle('visible');
        });
    });
})
.catch(error => {
    console.error('Error loading help texts:', error);
});

// Update edge values and offset inputs
const edgeInputs = document.querySelectorAll('.edge-input select');
edgeInputs.forEach(input => {
    input.addEventListener('change', () => {
        updateSettings();
    });
});

// Tilføj event listener til redSquareOffset input
const redSquareOffsetInput = document.getElementById('redSquareOffset');
if (redSquareOffsetInput) {
    redSquareOffsetInput.addEventListener('input', () => {
        updateSettings();
    });
}

// Modal functionality
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        isAnimationPaused = false; // Start animationen når modal lukkes
    }
    if (event.target == confirmDialog) {
        confirmDialog.style.display = "none";
    }
}

span.onclick = function() {
    modal.style.display = "none";
    isAnimationPaused = false; // Start animationen når modal lukkes
}

window.onload = function() {
    modal.style.display = "block";
    // Animation er allerede pauseret fra start (isAnimationPaused = true)
}
