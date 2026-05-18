const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let animationStarted = false;

const underkroppImage = new Image();
underkroppImage.src = 'MonsterSprite/ArcherHero/Final/Underkropp_pilbage.png';
let underkroppLoaded = false;
underkroppImage.onload = () => underkroppLoaded = true;

const underkroppImageV = new Image();
underkroppImageV.src = 'MonsterSprite/ArcherHero/Final/underkroppV.png';
let underkroppVLoaded = false;
underkroppImageV.onload = () => underkroppVLoaded = true;

const överkroppImage = new Image();
överkroppImage.src = 'MonsterSprite/ArcherHero/Final/Idle.png';
let överkroppLoaded = false;
överkroppImage.onload = () => överkroppLoaded = true;

const överkroppImageV = new Image();
överkroppImageV.src = 'MonsterSprite/ArcherHero/Final/IdleV.png';
let överkroppVLoaded = false;
överkroppImageV.onload = () => överkroppVLoaded = true;

const överkroppAttackImage = new Image();
överkroppAttackImage.src = 'MonsterSprite/ArcherHero/Final/Attack.png';
let överkroppAttackLoaded = false;
överkroppAttackImage.onload = () => överkroppAttackLoaded = true;

const överkroppAttackImageV = new Image();
överkroppAttackImageV.src = 'MonsterSprite/ArcherHero/Final/AttackV.png';
let överkroppAttackVLoaded = false;
överkroppAttackImageV.onload = () => överkroppAttackVLoaded = true;


let överkroppFrameIndex = 0;
const överkroppFrameCount = 1;
const överkroppFrameWidth = 33;
const överkroppFrameHeight = 32;
let överkroppAnimationCounter = 0;
const överkroppAnimationSpeed = 10;

let överkroppAttackFrameIndex = 0;
const överkroppAttackFrameCount = 1;
const överkroppAttackFrameWidth = 32;
const överkroppAttackFrameHeight = 32;
let överkroppAttackAnimationCounter = 0;
const överkroppAttackAnimationSpeed = 10;

let rotationAngle = 0;
const rotationSpeed = 2;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let attackPressed = false;

let useInvertedSprites = false;
let useAttackSprites = false;

let överkroppPivotOffsetX = överkroppFrameWidth * 1.5;
let överkroppPivotOffsetY = överkroppFrameHeight * 3;

let överkroppVPivotOffsetX = överkroppFrameWidth * 1.5;
let överkroppVPivotOffsetY = överkroppFrameHeight * 3;

let överkroppAttackPivotOffsetX = överkroppAttackFrameWidth * 1.5;
let överkroppAttackPivotOffsetY = överkroppAttackFrameHeight * 3;


function getUnderkroppCoords() {
    const scale = 3;
    const width = underkroppImage.naturalWidth * scale;
    const height = underkroppImage.naturalHeight * scale;
    const x = canvas.width / 2;
    const y = (canvas.height + 260) / 2;
    return { x, y, width, height };
}

function getOverkroppCoords(underkropp) {
    const width = överkroppFrameWidth * 3;
    const height = överkroppFrameHeight * 3;
    const x = underkropp.x + 18;
    const y = underkropp.y - height + 40;
    return { x, y, width, height };
}


function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof HP !== 'undefined') {
        HP.draw(ctx);
    }

    // Update projectiles
    if (typeof updateProjectiles === 'function') {
        updateProjectiles();
    }

if (!animationStarted) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Press SPACE to start", canvas.width / 2 - 150, 100);

    requestAnimationFrame(draw);
    return;
}

const underkropp = getUnderkroppCoords();

const currentUnderkroppImage =
    useInvertedSprites && underkroppVLoaded
        ? underkroppImageV
        : underkroppImage;

const currentUnderkroppLoaded =
    useInvertedSprites && underkroppVLoaded
        ? underkroppVLoaded
        : underkroppLoaded;

if (currentUnderkroppLoaded) {
    ctx.drawImage(
        currentUnderkroppImage,
        underkropp.x,
        underkropp.y,
        underkropp.width,
        underkropp.height
    );
}

const överkropp = getOverkroppCoords(underkropp);

if (överkroppLoaded) {
    const currentOverkroppImage =
        useInvertedSprites && överkroppVLoaded
            ? överkroppImageV
            : överkroppImage;
    const currentOverkroppAttackImage =
        useAttackSprites
            ? (useInvertedSprites
                ? (överkroppAttackVLoaded ? överkroppAttackImageV : currentOverkroppImage)
                : (överkroppAttackLoaded ? överkroppAttackImage : currentOverkroppImage))
            : currentOverkroppImage;

    const currentOverkroppLoaded =
        useInvertedSprites && överkroppVLoaded
            ? överkroppVLoaded
            : överkroppLoaded;
    const currentOverkroppAttackLoaded =
        useAttackSprites
            ? (useInvertedSprites
                ? (överkroppAttackVLoaded || currentOverkroppLoaded)
                : (överkroppAttackLoaded || currentOverkroppLoaded))
            : currentOverkroppLoaded;

    if (rightPressed && rotationAngle <= 45) {
        rotationAngle += rotationSpeed;
    }
    if (leftPressed && rotationAngle >= -45) {
        rotationAngle -= rotationSpeed;
    }
    if (rotationAngle < -45 && leftPressed == true && upPressed == true ) {
        useInvertedSprites  = true;
        rotationAngle = 45;
    }
    if (rotationAngle > 45 && rightPressed == true && upPressed == true) {
        useInvertedSprites = false;
        rotationAngle = -45; 
    }
    if (rotationAngle > 0 && !rightPressed && !upPressed) {
        rotationAngle -= rotationSpeed - 1;
    }
    if (rotationAngle < 0 && !leftPressed && !upPressed) {
        rotationAngle += rotationSpeed - 1 ;
    }
    if (attackPressed) {
        useAttackSprites = true;
    } else {
        useAttackSprites = false;
    }


    ctx.save();

    const pivotX = överkropp.x + överkroppPivotOffsetX;
    const pivotY = överkropp.y + överkroppPivotOffsetY;

    ctx.translate(pivotX, pivotY);
    ctx.rotate(rotationAngle * Math.PI / 180);

    const sx = överkroppFrameIndex * överkroppFrameWidth;

    ctx.drawImage(
        currentOverkroppAttackImage,
        sx,
        0,
        överkroppFrameWidth,
        överkroppFrameHeight,
        -överkroppPivotOffsetX,
        -överkroppPivotOffsetY,
        överkropp.width,
        överkropp.height
    );

    ctx.restore();

    överkroppAnimationCounter++;
    if (överkroppAnimationCounter >= överkroppAnimationSpeed) {
        överkroppFrameIndex =
            (överkroppFrameIndex + 1) % överkroppFrameCount;
        överkroppAnimationCounter = 0;
        }
}

    // Draw projectiles
    if (typeof drawProjectiles === 'function') {
        drawProjectiles();
    }

    if (typeof drawGolem === 'function') {
        drawGolem(överkropp);
    }

    if (typeof drawNightborne === 'function') {
        drawNightborne(överkropp);
    }

    requestAnimationFrame(draw);
}

resizeCanvas();
draw();

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        animationStarted = true;
        attackPressed = true;
        // Spawn projectile
        const underkropp = getUnderkroppCoords();
        const överkropp = getOverkroppCoords(underkropp);

        const currentPivotOffsetX = useInvertedSprites
            ? överkroppVPivotOffsetX
            : överkroppPivotOffsetX;

        const currentPivotOffsetY = useInvertedSprites
            ? överkroppVPivotOffsetY
            : överkroppPivotOffsetY;

        const bowPivotX = överkropp.x + currentPivotOffsetX - 10;
        const bowPivotY = överkropp.y + currentPivotOffsetY - 50;

        const distance = 40;

        const rad = rotationAngle * Math.PI / 180;

        // Reverse direction when inverted
        const direction = useInvertedSprites ? -1 : 1;

        const spawnX = bowPivotX + Math.cos(rad) * distance * direction;
        const spawnY = bowPivotY + Math.sin(rad) * distance;

        if (typeof spawnProjectile === 'function') {
            spawnProjectile(spawnX, spawnY, rotationAngle);
        }
    }
    if (event.code === 'KeyD') rightPressed = true;
    if (event.code === 'KeyA') leftPressed = true;
    if (event.code === 'KeyW') upPressed = true;
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'KeyD') rightPressed = false;
    if (event.code === 'KeyA') leftPressed = false;
    if (event.code === 'KeyW') upPressed = false;
    if (event.code === 'Space') attackPressed = false;
});

