// Initialisering af variabler
let isBlack = true;
let lastTimeSwitched = 0;
let interval = 500; // Farveskift interval i millisekunder
let squareSize = 10; // Størrelse af hvert skaktern
let redSquares = { top: 0, right: 0, bottom: 0, left: 0 };
let redSquareOffset = 0; // Offset mod centrum
let redSquareSizeMultiplier = 1; // Størrelsesmultiplikator
let cornerSquareOffset = 0; // Offset for hjørnefirkanter

// Status for hjørnefirkanter
let topLeftCorner = false;
let topRightCorner = false;
let bottomLeftCorner = false;
let bottomRightCorner = false;

// p5.js setup funktion - kaldes én gang, når scriptet startes
function setup() {
    let chessboardContainer = document.getElementById('chessboard-container');
    let canvas = createCanvas(chessboardContainer.offsetWidth, chessboardContainer.offsetHeight);
    canvas.parent('chessboard-container');
    noSmooth();
    frameRate(30); // Sæt en rimelig billedrate

    updateSettingsFromURL(); // Opdater indstillinger baseret på URL-parametre
    updateGUI(); // Opdater indstillinger i brugergrænsefladen
    updateSettings(); // Opdater indstillinger ved start
}

// p5.js draw funktion - kaldes kontinuerligt for at tegne skakbrættet
function draw() {
    if (millis() - lastTimeSwitched > interval) {
        isBlack = !isBlack;
        lastTimeSwitched = millis();
    }

    drawChessboard();
    drawRedPerimeter();
    drawCornerSquares();
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

// Funktion til at tegne firkanter i hjørnerne, hvis de er aktiverede
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

// Funktion til at justere lærredets størrelse
function adjustCanvasSize() {
    let chessboardContainer = document.getElementById('chessboard-container');
    resizeCanvas(chessboardContainer.offsetWidth, chessboardContainer.offsetHeight);
}

// Funktion til at opdatere indstillingerne baseret på brugerens input
function updateSettings() {
    // Opdater værdierne baseret på input-elementer
    squareSize = parseInt(document.getElementById('squareSize').value);
    interval = parseInt(document.getElementById('interval').value);
    redSquares.top = parseInt(document.getElementById('topRed').value);
    redSquares.right = parseInt(document.getElementById('rightRed').value);
    redSquares.bottom = parseInt(document.getElementById('bottomRed').value);
    redSquares.left = parseInt(document.getElementById('leftRed').value);
    redSquareOffset = parseInt(document.getElementById('redSquareOffset').value);
    redSquareSizeMultiplier = parseInt(document.getElementById('redSquareSizeMultiplier').value);
    cornerSquareOffset = parseInt(document.getElementById('cornerSquareOffset').value);
    topLeftCorner = document.getElementById('topLeftCorner').checked;
    topRightCorner = document.getElementById('topRightCorner').checked;
    bottomLeftCorner = document.getElementById('bottomLeftCorner').checked;
    bottomRightCorner = document.getElementById('bottomRightCorner').checked;

    adjustCanvasSize(); // Juster lærredets størrelse
    draw(); // Tegn skakbrættet igen for at vise ændringerne
}

// Funktion til at håndtere ændringer i vinduets størrelse
function windowResized() {
    adjustCanvasSize();
}

// Funktion til at opdatere indstillinger fra URL-parametre
function updateSettingsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Hent værdier fra URL-parametre, eller brug eksisterende værdier som fallback
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

    updateGUI(); // Opdater brugergrænsefladen med de nye indstillinger
}

// Funktion til at opdatere brugergrænsefladen med de nuværende indstillinger
function updateGUI() {
    document.getElementById('redSquareOffset').value = redSquareOffset;
    document.getElementById('redSquareSizeMultiplier').value = redSquareSizeMultiplier;
}