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
const golemSpeed = 2;
const golemScale = 3;
let golemState = 'walking';

const golemwalkFrameCount = 10;
const golemwalkFrameWidth = 90;
const golemwalkFrameHeight = 64;
let golemwalkFrameIndex = 0;
let golemwalkAnimationCounter = 0;
const golemwalkAnimationSpeed = 10;

const golemAttackFrameCount = 10;
let golemAttackFrameIndex = 0;
let golemAttackAnimationCounter = 0;
const golemAttackAnimationSpeed = 10;

function resetGolem() {
    golemAttackFrameIndex = 0;
    golemAttackAnimationCounter = 0;
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
    const y = (golemCanvas.height + 30 ) / 2;
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
            golemAttackFrameIndex = (golemAttackFrameIndex + 1) % golemAttackFrameCount;
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
