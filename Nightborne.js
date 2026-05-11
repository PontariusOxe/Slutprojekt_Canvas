const nightborneCanvas = document.getElementById('gameCanvas');
const nightborneCtx = nightborneCanvas.getContext('2d');

const nightborneWalkImage = new Image();
nightborneWalkImage.src = 'MonsterSprite/NightBorne/NightBorneRun.png';

const nightborneAttackImage = new Image();
nightborneAttackImage.src = 'MonsterSprite/NightBorne/NightBorneA.png';
let nightborneAttackLoaded = false;
nightborneAttackImage.onload = () => nightborneAttackLoaded = true;
nightborneAttackImage.onerror = () => console.error('Failed to load nightborne attack image');

let nightborneLoaded = false;
let nightborneX = 0;
let nightborneDirection = 1;
const nightborneSpeed = 3;
const nightborneScale = 3;
let nightborneState = 'walking';

const nightborneWalkFrameCount = 6;
const nightborneWalkFrameWidth = 79;
const nightborneWalkFrameHeight = 27;
let nightborneWalkFrameIndex = 0;
let nightborneWalkAnimationCounter = 0;
const nightborneWalkAnimationSpeed = 5;

const nightborneAttackFrameCount = 12;
const nightborneAttackFrameWidth =  80;
const nightborneAttackFrameHeight = 47;
const nightborneAttackDamageFrame = 9;
let nightborneAttackFrameIndex = 0;
let nightborneAttackAnimationCounter = 0;
let nightborneAttackDamageDealt = false;
const nightborneAttackAnimationSpeed = 10;

function resetNightborne() {
    nightborneAttackFrameIndex = 0;
    nightborneAttackAnimationCounter = 0;
    nightborneAttackDamageDealt = false;
    const width = nightborneWalkFrameWidth * nightborneScale;
    const fromLeft = Math.random() < 0.5;
    nightborneDirection = fromLeft ? 1 : -1;
    nightborneX = fromLeft ? -width : nightborneCanvas.width;
    nightborneState = 'walking';
    nightborneWalkFrameIndex = 0;
    nightborneWalkAnimationCounter = 0;
}

function getNightborneCoords() {
    const currentFrameWidth = nightborneState === 'walking' ? nightborneWalkFrameWidth : nightborneAttackFrameWidth;
    const currentFrameHeight = nightborneState === 'walking' ? nightborneWalkFrameHeight : nightborneAttackFrameHeight;
    const width = currentFrameWidth * nightborneScale;
    const height = currentFrameHeight * nightborneScale;
    const currenty = nightborneState === 'walking' ? (nightborneCanvas.height + 250 ) / 2 : (nightborneCanvas.height + 150 ) / 2;
    const y = currenty;
    return { x: nightborneX, y, width, height };
}

function updateNightborne(playerÖverkropp) {
    if (!nightborneLoaded || !playerÖverkropp) return;

    const nightborneCoords = getNightborneCoords();
    const stopX = nightborneDirection === 1
        ? playerÖverkropp.x - nightborneCoords.width + 80
        : playerÖverkropp.x + playerÖverkropp.width - 90;

    const distance = stopX - nightborneX;
    if (nightborneState === 'walking') {
        if (Math.abs(distance) <= nightborneSpeed) {
            nightborneX = stopX;
            nightborneState = 'stopped';
        } else {
            nightborneX += nightborneDirection * nightborneSpeed;
        }

        nightborneWalkAnimationCounter++;
        if (nightborneWalkAnimationCounter >= nightborneWalkAnimationSpeed) {
            nightborneWalkFrameIndex = (nightborneWalkFrameIndex + 1) % nightborneWalkFrameCount;
            nightborneWalkAnimationCounter = 0;
        }
    } else if (nightborneState === 'stopped' && nightborneAttackLoaded) {
        nightborneAttackAnimationCounter++;
        if (nightborneAttackAnimationCounter >= nightborneAttackAnimationSpeed) {
            // Trigger damage on specific frame
            if (nightborneAttackFrameIndex === nightborneAttackDamageFrame && !nightborneAttackDamageDealt) {
                if (typeof HP !== 'undefined') {
                    HP.takeDamagePercent(HP.damagePercent);
                }
                nightborneAttackDamageDealt = true;
            }
            
            nightborneAttackFrameIndex = (nightborneAttackFrameIndex + 1) % nightborneAttackFrameCount;
            
            if (nightborneAttackFrameIndex === 0) {
                nightborneAttackDamageDealt = false;
            }
            
            nightborneAttackAnimationCounter = 5;
        }
    }
}

function drawNightborne(playerÖverkropp) {
    if (!nightborneLoaded) return;
    updateNightborne(playerÖverkropp);

    const nightborneCoords = getNightborneCoords();
    const isWalking = nightborneState === 'walking';
    const currentNightborneImage = !isWalking && nightborneAttackLoaded ? nightborneAttackImage : nightborneWalkImage;
    const currentFrameIndex = isWalking ? nightborneWalkFrameIndex : nightborneAttackFrameIndex;
    const currentFrameWidth = isWalking ? nightborneWalkFrameWidth : nightborneAttackFrameWidth;
    const currentFrameHeight = isWalking ? nightborneWalkFrameHeight : nightborneAttackFrameHeight;
    const frameX = currentFrameIndex * currentFrameWidth;
    const frameY = 0;

    nightborneCtx.save();
    nightborneCtx.translate(nightborneCoords.x + nightborneCoords.width / 2, nightborneCoords.y + nightborneCoords.height / 2);
    if (nightborneDirection < 0) {
        nightborneCtx.scale(-1, 1);
    }

    nightborneCtx.drawImage(
        currentNightborneImage,
        frameX,
        frameY,
        currentFrameWidth,
        currentFrameHeight,
        -nightborneCoords.width / 2,
        -nightborneCoords.height / 2,
        nightborneCoords.width,
        nightborneCoords.height
    );
    nightborneCtx.restore();
}

nightborneWalkImage.onload = () => {
    nightborneLoaded = true;
    resetNightborne();
};

nightborneWalkImage.onerror = () => console.error('Failed to load nightborne walk image');
