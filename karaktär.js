const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let animationStarted = false;

// =======================
// UNDERKROPP
// =======================
const underkroppImage = new Image();
underkroppImage.src = 'MonsterSprite/ArcherHero/Final/Underkropp_pilbage.png';
let underkroppLoaded = false;
underkroppImage.onload = () => underkroppLoaded = true;

const underkroppImageV = new Image();
underkroppImageV.src = 'MonsterSprite/ArcherHero/Final/underkroppV.png';
let underkroppVLoaded = false;
underkroppImageV.onload = () => underkroppVLoaded = true;

// =======================
// ÖVERKROPP
// =======================
const överkroppImage = new Image();
överkroppImage.src = 'MonsterSprite/ArcherHero/Final/Idle.png';
let överkroppLoaded = false;
överkroppImage.onload = () => överkroppLoaded = true;

const överkroppImageV = new Image();
överkroppImageV.src = 'MonsterSprite/ArcherHero/Final/IdleV.png';
let överkroppVLoaded = false;
överkroppImageV.onload = () => överkroppVLoaded = true;

// =======================
// ANIMATION (Överkropp)
// =======================
let överkroppFrameIndex = 0;
const överkroppFrameCount = 1;
const överkroppFrameWidth = 32;
const överkroppFrameHeight = 32;
let överkroppAnimationCounter = 0;
const överkroppAnimationSpeed = 10;

// =======================
// ROTATION / INPUT
// =======================
let rotationAngle = 0;
const rotationSpeed = 2;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;

let useInvertedSprites = false;

// =======================
// PIVOT
// =======================
let överkroppPivotOffsetX = överkroppFrameWidth * 1.5;
let överkroppPivotOffsetY = överkroppFrameHeight * 3;

let överkroppVPivotOffsetX = överkroppFrameWidth * 2;
let överkroppVPivotOffsetY = överkroppFrameHeight * 3;


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


// =======================
// RESIZE
// =======================
function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

// =======================
// DRAW LOOP
// =======================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const underkropp = getUnderkroppCoords();

    // =======================
    // UNDERKROPP (ALLTID)
    // =======================
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

// =======================
// STOPPA TILLS START
// =======================
if (!animationStarted) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Press SPACE to start", canvas.width / 2 - 150, 100);

    requestAnimationFrame(draw);
    return;
}

// =======================
// ÖVERKROPP
// =======================
const överkropp = getOverkroppCoords(underkropp);

if (överkroppLoaded) {
     const currentOverkroppImage =
    useInvertedSprites && överkroppVLoaded
        ? överkroppImageV
        : överkroppImage;

const currentOverkroppLoaded =
    useInvertedSprites && överkroppVLoaded
        ? överkroppVLoaded
        : överkroppLoaded;

    // rotation
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
    ctx.save();

    const pivotX = överkropp.x + överkroppPivotOffsetX;
    const pivotY = överkropp.y + överkroppPivotOffsetY;

    ctx.translate(pivotX, pivotY);
    ctx.rotate(rotationAngle * Math.PI / 180);

    const sx = överkroppFrameIndex * överkroppFrameWidth;

    ctx.drawImage(
        currentOverkroppImage,
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

    // animation
    överkroppAnimationCounter++;
    if (överkroppAnimationCounter >= överkroppAnimationSpeed) {
        överkroppFrameIndex =
            (överkroppFrameIndex + 1) % överkroppFrameCount;
        överkroppAnimationCounter = 0;
    }
}

    if (typeof drawGolem === 'function') {
        drawGolem(överkropp);
    }

    requestAnimationFrame(draw);
}

resizeCanvas();
draw();

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        animationStarted = true;
    }
    if (event.code === 'ArrowRight') rightPressed = true;
    if (event.code === 'ArrowLeft') leftPressed = true;
    if (event.code === 'ArrowUp') upPressed = true;
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowRight') rightPressed = false;
    if (event.code === 'ArrowLeft') leftPressed = false;
    if (event.code === 'ArrowUp') upPressed = false;
});

