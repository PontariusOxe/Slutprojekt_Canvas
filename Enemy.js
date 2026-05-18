const golemCanvas = document.getElementById('gameCanvas');
const golemCtx = golemCanvas.getContext('2d');

const golemwalkImage = new Image();
golemwalkImage.src = 'MonsterSprite/Golems_Free_Version/Golems_Free_Version/Golem_1/Blue/White_Swoosh_VFX/Golem_1_walk.png';

const golemAttackImage = new Image();
golemAttackImage.src = 'MonsterSprite/Golems_Free_Version/Golems_Free_Version/Golem_1/Blue/White_Swoosh_VFX/Golem_1_attack.png';
let golemAttackLoaded = false;
golemAttackImage.onload = () => golemAttackLoaded = true;
golemAttackImage.onerror = () => console.error('Failed to load golem attack image');

let golemLoaded = false;
let golemX = 0;
let golemDirection = 1;
const golemSpeed = 3;
const golemScale = 4;
let golemState = 'walking';

const golemwalkFrameCount = 10;
const golemwalkFrameWidth = 90;
const golemwalkFrameHeight = 64;
let golemwalkFrameIndex = 0;
let golemwalkAnimationCounter = 0;
const golemwalkAnimationSpeed = 5;

const golemAttackFrameCount = 10;
const golemAttackDamageFrame = 6;
let golemAttackFrameIndex = 0;
let golemAttackAnimationCounter = 0;
let golemAttackDamageDealt = false;
const golemAttackAnimationSpeed = 5;

function resetGolem() {
    golemAttackFrameIndex = 0;
    golemAttackAnimationCounter = 0;
    golemAttackDamageDealt = false;
    const width = golemwalkFrameWidth * golemScale;
    const fromLeft = Math.random() < 0.5;
    golemDirection = fromLeft ? 1 : -1;
    golemX = fromLeft ? -width : golemCanvas.width;
    golemState = 'walking';
    golemwalkFrameIndex = 0;
    golemwalkAnimationCounter = 0;
}

function getGolemCoords() {
    const width = golemwalkFrameWidth * golemScale;
    const height = golemwalkFrameHeight * golemScale;
    const y = (golemCanvas.height - 85) / 2;
    return { x: golemX, y, width, height };
}

function updateGolem(playerÖverkropp) {
    if (!golemLoaded || !playerÖverkropp) return;

    const golemCoords = getGolemCoords();
    const stopX = golemDirection === 1
        ? playerÖverkropp.x - golemCoords.width + 95
        : playerÖverkropp.x + playerÖverkropp.width - 125;

    const distance = stopX - golemX;
    if (golemState === 'walking') {
        if (Math.abs(distance) <= golemSpeed) {
            golemX = stopX;
            golemState = 'stopped';
        } else {
            golemX += golemDirection * golemSpeed;
        }

        golemwalkAnimationCounter++;
        if (golemwalkAnimationCounter >= golemwalkAnimationSpeed) {
            golemwalkFrameIndex = (golemwalkFrameIndex + 1) % golemwalkFrameCount;
            golemwalkAnimationCounter = 0;
        }
    } else if (golemState === 'stopped' && golemAttackLoaded) {
        golemAttackAnimationCounter++;
        if (golemAttackAnimationCounter >= golemAttackAnimationSpeed) {
            if (golemAttackFrameIndex === golemAttackDamageFrame && !golemAttackDamageDealt) {
                if (typeof HP !== 'undefined') {
                    HP.takeDamagePercent(HP.damagePercent);
                }
                golemAttackDamageDealt = true;
            }
            
            golemAttackFrameIndex = (golemAttackFrameIndex + 1) % golemAttackFrameCount;
            
            if (golemAttackFrameIndex === 0) {
                golemAttackDamageDealt = false;
            }
            
            golemAttackAnimationCounter = 0;
        }
    }
}

function drawGolem(playerÖverkropp) {
    if (!golemLoaded) return;
    updateGolem(playerÖverkropp);

    const golemCoords = getGolemCoords();
    const currentGolemImage = golemState === 'stopped' && golemAttackLoaded ? golemAttackImage : golemwalkImage;
    const frameX = golemState === 'walking'
        ? golemwalkFrameIndex * golemwalkFrameWidth
        : golemAttackFrameIndex * golemwalkFrameWidth;
    const frameY = 0;

    golemCtx.save();
    golemCtx.translate(golemCoords.x + golemCoords.width / 2, golemCoords.y + golemCoords.height / 2);
    if (golemDirection < 0) {
        golemCtx.scale(-1, 1);
    }

    golemCtx.drawImage(
        currentGolemImage,
        frameX,
        frameY,
        golemwalkFrameWidth,
        golemwalkFrameHeight,
        -golemCoords.width / 2,
        -golemCoords.height / 2,
        golemCoords.width,
        golemCoords.height
    );
    golemCtx.restore();
}

golemwalkImage.onload = () => {
    golemLoaded = true;
    resetGolem();
};

golemwalkImage.onerror = () => console.error('Failed to load golem walk image');











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
const nightborneSpeed = 10;
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
const nightborneAttackAnimationSpeed = 7;

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

