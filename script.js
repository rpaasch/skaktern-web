// Konstanter
const DEFAULT_SQUARE_SIZE = 10;
const DEFAULT_INTERVAL = 500;
const DEFAULT_OFFSET = 60;
const DEFAULT_MULTIPLIER = 1;
const MENU_ANIMATION_DURATION = 300;

// DOM elementer
const menuToggle = document.getElementById('menuToggle');
const closeMenuToggle = document.getElementById('closeMenuToggle');
const offCanvasMenu = document.getElementById('offCanvasMenu');
const chessboardContainer = document.getElementById('chessboard-container');
const leftColumn = document.getElementById('leftColumn');
const reloadButton = document.getElementById('reloadButton');
const confirmDialog = document.getElementById('confirmDialog');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');

// Applikations-state
const state = {
    // Animations-tilstand
    isBlack: true,
    lastTimeSwitched: 0,
    interval: DEFAULT_INTERVAL,
    isAnimationPaused: true,

    // Skakbræt-udseende
    squareSize: DEFAULT_SQUARE_SIZE,
    redSquareSizeMultiplier: DEFAULT_MULTIPLIER,

    // Kant-indstillinger
    redSquares: { top: 0, right: 0, bottom: 0, left: 0 },
    redSquareOffset: DEFAULT_OFFSET,

    // Hjørne-indstillinger
    corners: {
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false
    },
    center: false,
    cornerSquareOffset: DEFAULT_OFFSET
};

// Hjælpefunktion til at toggle menu accessibility
function setMenuAccessibility(isOpen) {
    // Find alle interaktive elementer i menuen
    const formElements = offCanvasMenu.querySelectorAll('input, select, textarea');
    const buttons = offCanvasMenu.querySelectorAll('button:not(#closeMenuToggle)');
    const links = offCanvasMenu.querySelectorAll('a');

    const allElements = [...formElements, ...buttons, ...links];

    if (isOpen) {
        offCanvasMenu.setAttribute('aria-hidden', 'false');
        offCanvasMenu.style.pointerEvents = 'auto';

        allElements.forEach(el => {
            el.removeAttribute('tabindex');
        });
    } else {
        offCanvasMenu.setAttribute('aria-hidden', 'true');
        offCanvasMenu.style.pointerEvents = 'none';

        allElements.forEach(el => {
            el.setAttribute('tabindex', '-1');
        });
    }
}

menuToggle.addEventListener('click', function() {
    offCanvasMenu.classList.add('open');
    chessboardContainer.classList.add('open');
    leftColumn.style.display = 'none';
    menuToggle.setAttribute('aria-expanded', 'true');
    setMenuAccessibility(true);
    // Fokuser på close button når menuen åbnes
    setTimeout(() => closeMenuToggle.focus(), 100);
});

function closeMenu() {
    offCanvasMenu.classList.remove('open');
    chessboardContainer.classList.remove('open');
    leftColumn.style.display = 'flex';
    menuToggle.setAttribute('aria-expanded', 'false');
    setMenuAccessibility(false);
    setTimeout(function() {
        adjustCanvasSize();
    }, MENU_ANIMATION_DURATION);
}

closeMenuToggle.addEventListener('click', function() {
    closeMenu();
    // Returner fokus til menu toggle når den lukkes
    setTimeout(() => menuToggle.focus(), MENU_ANIMATION_DURATION);
});

// Luk menu når ESC tastes trykkes
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Luk confirm dialog hvis den er åben
        if (confirmDialog.style.display === 'block') {
            confirmDialog.style.display = 'none';
            reloadButton.focus();
        }
        // Ellers luk menu hvis den er åben
        else if (offCanvasMenu.classList.contains('open')) {
            closeMenu();
            menuToggle.focus();
        }
    }
});

// Luk menu når der klikkes på skakbrættet
chessboardContainer.addEventListener('click', closeMenu);

// p5.js setup funktion - kaldes én gang når scriptet starter
function setup() {
    let chessboardContainer = document.getElementById('chessboard-container');
    let canvas = createCanvas(chessboardContainer.offsetWidth, chessboardContainer.offsetHeight);
    canvas.parent('chessboard-container');
    noSmooth();
    frameRate(60);

    // Indlæs indstillinger fra URL og opdater GUI
    updateSettingsFromURL();
    updateGUI();
    setupEventListeners();
}

// Nulstil bekræftelsesdialog
reloadButton.addEventListener('click', function(event) {
    event.preventDefault();
    confirmDialog.style.display = 'block';
    // Fokuser på "Annuller" knappen for sikkerhed
    setTimeout(() => confirmNo.focus(), 100);
});

confirmYes.addEventListener('click', function() {
    const urlWithoutParams = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.location.href = urlWithoutParams;
});

confirmNo.addEventListener('click', function() {
    confirmDialog.style.display = 'none';
    // Returner fokus til reload knappen
    reloadButton.focus();
});

// p5.js draw funktion - kaldes kontinuerligt for at tegne skakbrættet
function draw() {
    background(255);

    if (!state.isAnimationPaused && millis() - state.lastTimeSwitched > state.interval) {
        state.isBlack = !state.isBlack;
        state.lastTimeSwitched = millis();
    }

    drawChessboard();
    drawRedPerimeter();
    drawCornerSquares();
    drawCenterSquare();
}

// Funktion til at tegne skakbrættet
function drawChessboard() {
    for (let y = 0; y < height; y += state.squareSize) {
        for (let x = 0; x < width; x += state.squareSize) {
            let color = (Math.floor(x / state.squareSize) % 2) == (Math.floor(y / state.squareSize) % 2)
                ? (state.isBlack ? 0 : 255)
                : (state.isBlack ? 255 : 0);
            fill(color);
            noStroke();
            rect(x, y, state.squareSize, state.squareSize);
        }
    }
}

// Funktion til at tegne det røde område omkring skakbrættet
function drawRedPerimeter() {
    fill(255, 0, 0);
    for (let side in state.redSquares) {
        drawRedSide(state.redSquares[side], side);
    }
}

// Funktion til at tegne de røde firkanter på en side
function drawRedSide(count, side) {
    let positions = calculateRedSquarePositions(count, side);
    for (let pos of positions) {
        rect(pos.x, pos.y, state.squareSize * state.redSquareSizeMultiplier, state.squareSize * state.redSquareSizeMultiplier);
    }
}

// Hjælpefunktion til at beregne positionerne for de røde firkanter
function calculateRedSquarePositions(count, side) {
    let positions = [];
    let x, y;
    const redSize = state.squareSize * state.redSquareSizeMultiplier;

    for (let i = 0; i < count; i++) {
        switch (side) {
            case 'top':
                x = (width / (count + 1)) * (i + 1) - redSize / 2;
                y = 0 + state.redSquareOffset;
                break;
            case 'right':
                x = width - redSize - state.redSquareOffset;
                y = (height / (count + 1)) * (i + 1) - redSize / 2;
                break;
            case 'bottom':
                x = (width / (count + 1)) * (i + 1) - redSize / 2;
                y = height - redSize - state.redSquareOffset;
                break;
            case 'left':
                x = 0 + state.redSquareOffset;
                y = (height / (count + 1)) * (i + 1) - redSize / 2;
                break;
        }
        positions.push({ x, y });
    }
    return positions;
}

// Funktion til at tegne firkanter i hjørnerne
function drawCornerSquares() {
    const redSize = state.squareSize * state.redSquareSizeMultiplier;
    fill(255, 0, 0);

    if (state.corners.topLeft) {
        rect(state.cornerSquareOffset, state.cornerSquareOffset, redSize, redSize);
    }
    if (state.corners.topRight) {
        rect(width - redSize - state.cornerSquareOffset, state.cornerSquareOffset, redSize, redSize);
    }
    if (state.corners.bottomLeft) {
        rect(state.cornerSquareOffset, height - redSize - state.cornerSquareOffset, redSize, redSize);
    }
    if (state.corners.bottomRight) {
        rect(width - redSize - state.cornerSquareOffset, height - redSize - state.cornerSquareOffset, redSize, redSize);
    }
}

// Funktion til at tegne en firkant i centrum
function drawCenterSquare() {
    if (state.center) {
        const redSize = state.squareSize * state.redSquareSizeMultiplier;
        fill(255, 0, 0);
        rect(width / 2 - redSize / 2, height / 2 - redSize / 2, redSize, redSize);
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

    state.squareSize = parseInt(urlParams.get('squareSize')) || state.squareSize;
    state.interval = parseInt(urlParams.get('interval')) || state.interval;
    state.redSquares.top = parseInt(urlParams.get('topRed')) || state.redSquares.top;
    state.redSquares.right = parseInt(urlParams.get('rightRed')) || state.redSquares.right;
    state.redSquares.bottom = parseInt(urlParams.get('bottomRed')) || state.redSquares.bottom;
    state.redSquares.left = parseInt(urlParams.get('leftRed')) || state.redSquares.left;
    state.redSquareOffset = parseInt(urlParams.get('redSquareOffset')) || state.redSquareOffset;
    state.redSquareSizeMultiplier = parseInt(urlParams.get('redSquareSizeMultiplier')) || state.redSquareSizeMultiplier;
    state.cornerSquareOffset = parseInt(urlParams.get('cornerSquareOffset')) || state.cornerSquareOffset;
    state.corners.topLeft = urlParams.get('topLeftCorner') === 'true';
    state.corners.topRight = urlParams.get('topRightCorner') === 'true';
    state.corners.bottomLeft = urlParams.get('bottomLeftCorner') === 'true';
    state.corners.bottomRight = urlParams.get('bottomRightCorner') === 'true';
    state.center = urlParams.get('centerSquare') === 'true';
}

// Funktion til at opdatere indstillingerne
function updateSettings() {
    // Simpel input mapping til state
    const numberInputs = {
        'squareSize': 'squareSize',
        'interval': 'interval',
        'redSquareOffset': 'redSquareOffset',
        'redSquareSizeMultiplier': 'redSquareSizeMultiplier',
        'cornerSquareOffset': 'cornerSquareOffset'
    };

    const edgeInputs = {
        'topRed': 'top',
        'rightRed': 'right',
        'bottomRed': 'bottom',
        'leftRed': 'left'
    };

    const cornerInputs = {
        'topLeftCorner': 'topLeft',
        'topRightCorner': 'topRight',
        'bottomLeftCorner': 'bottomLeft',
        'bottomRightCorner': 'bottomRight'
    };

    // Opdater simple number inputs
    for (const [inputId, stateKey] of Object.entries(numberInputs)) {
        const input = document.getElementById(inputId);
        if (input) state[stateKey] = parseInt(input.value);
    }

    // Opdater kant-inputs
    for (const [inputId, stateKey] of Object.entries(edgeInputs)) {
        const input = document.getElementById(inputId);
        if (input) state.redSquares[stateKey] = parseInt(input.value);
    }

    // Opdater hjørne-inputs
    for (const [inputId, stateKey] of Object.entries(cornerInputs)) {
        const input = document.getElementById(inputId);
        if (input) state.corners[stateKey] = input.checked;
    }

    // Opdater center checkbox
    const centerInput = document.getElementById('centerSquare');
    if (centerInput) state.center = centerInput.checked;

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
    const params = new URLSearchParams();

    // Tilføj alle state-værdier til URL
    params.set('squareSize', state.squareSize);
    params.set('interval', state.interval);
    params.set('redSquareSizeMultiplier', state.redSquareSizeMultiplier);
    params.set('topRed', state.redSquares.top);
    params.set('rightRed', state.redSquares.right);
    params.set('bottomRed', state.redSquares.bottom);
    params.set('leftRed', state.redSquares.left);
    params.set('redSquareOffset', state.redSquareOffset);
    params.set('topLeftCorner', state.corners.topLeft);
    params.set('topRightCorner', state.corners.topRight);
    params.set('bottomLeftCorner', state.corners.bottomLeft);
    params.set('bottomRightCorner', state.corners.bottomRight);
    params.set('centerSquare', state.center);
    params.set('cornerSquareOffset', state.cornerSquareOffset);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

// Funktion til at opdatere GUI
function updateGUI() {
    document.getElementById('squareSize').value = state.squareSize;
    document.getElementById('interval').value = state.interval;
    document.getElementById('topRed').value = state.redSquares.top;
    document.getElementById('rightRed').value = state.redSquares.right;
    document.getElementById('bottomRed').value = state.redSquares.bottom;
    document.getElementById('leftRed').value = state.redSquares.left;
    document.getElementById('redSquareOffset').value = state.redSquareOffset;
    document.getElementById('redSquareSizeMultiplier').value = state.redSquareSizeMultiplier;
    document.getElementById('cornerSquareOffset').value = state.cornerSquareOffset;
    document.getElementById('topLeftCorner').checked = state.corners.topLeft;
    document.getElementById('topRightCorner').checked = state.corners.topRight;
    document.getElementById('bottomLeftCorner').checked = state.corners.bottomLeft;
    document.getElementById('bottomRightCorner').checked = state.corners.bottomRight;
    document.getElementById('centerSquare').checked = state.center;
}

// Funktion til at annoncere beskeder til skærmlæsere
function announceToScreenReader(message) {
    const ariaLiveRegion = document.getElementById('ariaLiveRegion');
    if (ariaLiveRegion) {
        ariaLiveRegion.textContent = message;
        // Ryd beskeden efter 3 sekunder
        setTimeout(() => {
            ariaLiveRegion.textContent = '';
        }, 3000);
    }
}

// Funktion til at kopiere det aktuelle link
function copyCurrentLink() {
    const url = window.location.href;
    const button = document.getElementById('copyLinkButton');
    const originalText = button.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function() {
            button.textContent = 'Kopieret!';
            button.setAttribute('aria-label', 'Link kopieret til udklipsholder');
            announceToScreenReader('Link er kopieret til udklipsholderen');

            setTimeout(() => {
                button.textContent = originalText;
                button.setAttribute('aria-label', 'Kopier link til udklipsholder');
            }, 2000);
        }, function(err) {
            button.textContent = 'Fejl ved kopiering';
            announceToScreenReader('Fejl ved kopiering af link');

            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    } else {
        // Fallback for ældre browsere
        button.textContent = 'Ikke understøttet';
        announceToScreenReader('Kopiering af link er ikke understøttet i denne browser');

        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
}

// Funktion til at opsætte alle event listeners
function setupEventListeners() {
    // Event listeners for inputs der skal opdatere ved ændring
    const updateOnChangeInputs = [
        'redSquareOffset',
        'cornerSquareOffset',
        'redSquareSizeMultiplier'
    ];

    updateOnChangeInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => {
                updateSettings();
            });
        }
    });

    // Event listeners for checkboxes
    const checkboxIds = [
        'topLeftCorner',
        'topRightCorner',
        'bottomLeftCorner',
        'bottomRightCorner',
        'centerSquare'
    ];

    checkboxIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => {
                updateSettings();
            });
        }
    });

    // Event listeners for kant-inputs
    const edgeInputs = document.querySelectorAll('.edge-input select');
    edgeInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateSettings();
        });
    });

    // Tilføj scroll-into-view på alle interaktive elementer i menuen
    const menuInteractiveElements = offCanvasMenu.querySelectorAll('input, select, button, a, textarea');
    menuInteractiveElements.forEach(element => {
        element.addEventListener('focus', () => {
            // Kun scroll hvis menuen er åben
            if (offCanvasMenu.classList.contains('open')) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        });
    });

    // Setup hjælpetekster
    setupHelpTexts();
}

// Hjælpetekster embedded
const helpTexts = {
    "generelleIndstillinger": "Her kan du justere de grundlæggende indstillinger for skakbrættet:\n- Ternstørrelse: Bestemmer størrelsen af hvert enkelt felt i pixels\n- Tidsinterval: Hvor hurtigt mønstret skifter i millisekunder\n- Røde tern - forstørrelsesfaktor: Hvor meget større de røde tern skal være i forhold til de normale tern",
    "kanter": "Her kan du tilføje røde tern langs skakbrættets kanter:\n- Vælg antal tern for hver kant (0-3)\n- Juster afstanden fra kanten med 'Afstand fra kanter'",
    "hjorner": "Her kan du tilføje røde tern i hjørnerne og centrum af skakbrættet:\n- Marker de hjørner hvor du ønsker røde tern\n- Tilføj en rød tern i centrum ved at markere 'Center'\n- Juster afstanden fra hjørnerne med 'Afstand fra hjørner'"
};

// Funktion til at opsætte hjælpetekster
function setupHelpTexts() {
    const helpIcons = document.querySelectorAll('.help-icon');
    helpIcons.forEach(icon => {
        const controlId = icon.dataset.help;
        const helpText = helpTexts[controlId];
        const helpTextElement = document.getElementById(`help-${controlId}`);

        if (helpTextElement && helpText) {
            // Tilføj aria-label til hjælpe-ikon
            icon.setAttribute('aria-label', 'Hjælp');
            icon.setAttribute('role', 'button');

            icon.addEventListener('click', () => {
                const isVisible = helpTextElement.classList.contains('visible');
                helpTextElement.textContent = helpText;
                helpTextElement.classList.toggle('visible');

                // Annoncér til skærmlæsere når hjælp vises
                if (!isVisible) {
                    announceToScreenReader(helpText);
                }
            });
        }
    });
}

// Luk confirm dialog ved klik udenfor
window.addEventListener('click', function(event) {
    if (event.target === confirmDialog) {
        confirmDialog.style.display = "none";
        reloadButton.focus();
    }
});

// Initialiser app ved page load
window.addEventListener('load', function() {
    // Start animation automatisk
    state.isAnimationPaused = false;

    // Initialiser menu som utilgængelig via keyboard
    setMenuAccessibility(false);
});
