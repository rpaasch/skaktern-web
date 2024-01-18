let isBlack = true;
let lastTimeSwitched = 0;
let interval = 500; // Color change interval in milliseconds
let squareSize = 10; // Size of each square
let redSquares = { top: 0, right: 0, bottom: 0, left: 0 };
let redSquareOffset = 0; // Offset towards the center
let redSquareSizeMultiplier = 1; // Size multiplier

function setup() {
    let chessboardContainer = document.getElementById('chessboard-container');
    let canvas = createCanvas(chessboardContainer.offsetWidth, chessboardContainer.offsetHeight);
    canvas.parent('chessboard-container');
    noSmooth();
    frameRate(30); // Set a reasonable frame rate
}

function draw() {
    if (millis() - lastTimeSwitched > interval) {
        isBlack = !isBlack;
        lastTimeSwitched = millis();
    }

    drawChessboard();
    drawRedPerimeter();
}

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

function drawRedPerimeter() {
    fill(255, 0, 0);
    drawRedSide(redSquares.top, 'top');
    drawRedSide(redSquares.right, 'right');
    drawRedSide(redSquares.bottom, 'bottom');
    drawRedSide(redSquares.left, 'left');
}

function drawRedSide(count, side) {
    let positions = calculateRedSquarePositions(count, side);
    for (let pos of positions) {
        rect(pos.x, pos.y, squareSize * redSquareSizeMultiplier, squareSize * redSquareSizeMultiplier);
    }
}

function calculateRedSquarePositions(count, side) {
    let positions = [];
    let x, y;
    let offsetAmount = redSquareOffset; // Fixed offset for all squares

    for (let i = 0; i < count; i++) {
        switch (side) {
            case 'top':
                x = (width / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                y = 0 + offsetAmount;
                break;
            case 'right':
                x = width - (squareSize * redSquareSizeMultiplier) - offsetAmount;
                y = (height / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                break;
            case 'bottom':
                x = (width / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                y = height - (squareSize * redSquareSizeMultiplier) - offsetAmount;
                break;
            case 'left':
                x = 0 + offsetAmount;
                y = (height / (count + 1)) * (i + 1) - (squareSize * redSquareSizeMultiplier) / 2;
                break;
        }
        positions.push({ x, y });
    }
    return positions;
}


function adjustCanvasSize() {
    let chessboardContainer = document.getElementById('chessboard-container');
    resizeCanvas(chessboardContainer.offsetWidth, chessboardContainer.offsetHeight);
}

function updateSettings() {
    squareSize = parseInt(document.getElementById('squareSize').value);
    interval = parseInt(document.getElementById('interval').value);
    redSquares.top = parseInt(document.getElementById('topRed').value);
    redSquares.right = parseInt(document.getElementById('rightRed').value);
    redSquares.bottom = parseInt(document.getElementById('bottomRed').value);
    redSquares.left = parseInt(document.getElementById('leftRed').value);
    redSquareOffset = parseInt(document.getElementById('redSquareOffset').value);
    redSquareSizeMultiplier = parseInt(document.getElementById('redSquareSizeMultiplier').value);

    adjustCanvasSize();
}

function windowResized() {
    adjustCanvasSize();
}
