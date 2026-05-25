const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const underkroppImage = new Image();
underkroppImage.src = 'MonsterSprite/ArcherHero/Final/Underkropp_pilbage.png';
let underkroppLoaded = false;
underkroppImage.onload = () => underkroppLoaded = true;
underkroppImage.onerror = () => console.error('Failed to load underkropp image');

const överkroppImage = new Image();
överkroppImage.src = 'MonsterSprite/ArcherHero/Final/Standby_bilbage-32x32_med_4a_bildrutor.png';
let överkroppLoaded = false;
överkroppImage.onload = () => överkroppLoaded = true;
överkroppImage.onerror = () => console.error('Failed to load överkropp image');

const överkroppImageV = new Image();
överkroppImageV.src = 'MonsterSprite/ArcherHero/Final/överkroppV.png';
let överkroppVLoaded = false;
överkroppImageV.onload = () => överkroppVLoaded = true;
överkroppImageV.onerror = () => console.error('Failed to load överkropp inverted image');

const underkroppImageV = new Image();
underkroppImageV.src = 'MonsterSprite/ArcherHero/Final/underkroppV.png';
let underkroppVLoaded = false;
underkroppImageV.onload = () => underkroppVLoaded = true;
underkroppImageV.onerror = () => console.error('Failed to load underkropp inverted image');


let överkroppFrameIndex = 0;
const överkroppFrameCount = 4;
const överkroppFrameWidth = 32;
const överkroppFrameHeight = 32;
let överkroppAnimationCounter = 0;
const överkroppAnimationSpeed = 10;

let underkroppFrameIndex = 0;
const underkroppFrameCount = 1;
const underkroppFrameWidth = 32;
const underkroppFrameHeight = 32;
let underkroppAnimationCounter = 0;
const underkroppAnimationSpeed = 0;


let rotationAngle = 0;
const rotationSpeed = 2;
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let useInvertedSprites = false;


let överkroppPivotOffsetX = överkroppFrameWidth * 1;
let överkroppPivotOffsetY = överkroppFrameHeight * 3;

let överkroppVPivotOffsetX = överkroppFrameWidth * 2;
let överkroppVPivotOffsetY = överkroppFrameHeight * 3;

function setOverkroppRotationPivot(offsetX, offsetY) {
    överkroppPivotOffsetX = offsetX; 
    överkroppPivotOffsetY = offsetY;
}

function getUnderkroppCoords() {
    const scale = 3;
    const width = underkroppImage.naturalWidth * scale;
    const height = underkroppImage.naturalHeight * scale;
    const x = canvas.width / 2;
    // 260px at 1080px height -> fraction of baseline height
    const underkroppYOffsetPct = 260 / 1080;
    const y = (canvas.height + underkroppYOffsetPct * canvas.height) / 2;
    return { x, y, width, height };
}

function getOverkroppCoords(underkropp) {
    const width = överkroppFrameWidth * 3;
    const height = överkroppFrameHeight * 3;
    const overkroppOffsetXPct = 38 / 1920; // 38px baseline
    const overkroppOffsetYPct = 48 / 1080; // 48px baseline
    const x = underkropp.x + overkroppOffsetXPct * canvas.width;
    const y = underkropp.y - height + overkroppOffsetYPct * canvas.height;
    return { x, y, width, height };
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const underkropp = getUnderkroppCoords();

    const currentUnderkroppImage = useInvertedSprites && underkroppVLoaded ? underkroppImageV : underkroppImage;
    const currentUnderkroppLoaded = useInvertedSprites && underkroppVLoaded ? underkroppVLoaded : underkroppLoaded;
    
    if (currentUnderkroppLoaded && underkropp.width > 0 && underkropp.height > 0) {
        ctx.drawImage(currentUnderkroppImage, underkropp.x, underkropp.y, underkropp.width, underkropp.height);
    }

    if (överkroppLoaded) {
        const baseÖverkropp = getOverkroppCoords(underkropp);
        // Apply offset for inverted sprites
        const invertedOffsetXPct = 24 / 1920;
        const överkropp = useInvertedSprites ? 
            { ...baseÖverkropp, x: baseÖverkropp.x - invertedOffsetXPct * canvas.width } : 
            baseÖverkropp;
        
        // Determine which sprite set to use
        const currentÖverkroppImage = useInvertedSprites && överkroppVLoaded ? överkroppImageV : överkroppImage;
        const currentÖverkroppLoaded = useInvertedSprites && överkroppVLoaded ? överkroppVLoaded : överkroppLoaded;
        
        // Update rotation
        if (rightPressed && rotationAngle <= 45) {
            rotationAngle += rotationSpeed;
        }
        if (leftPressed && rotationAngle >= -45) {
            rotationAngle -= rotationSpeed;
        }
        if (rotationAngle < -45 && leftPressed == true && upPressed == true ) {
            useInvertedSprites = true;
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
        const currentPivotOffsetX = useInvertedSprites ? överkroppVPivotOffsetX : överkroppPivotOffsetX;
        const currentPivotOffsetY = useInvertedSprites ? överkroppVPivotOffsetY : överkroppPivotOffsetY;
        const pivotX = överkropp.x + currentPivotOffsetX;
        const pivotY = överkropp.y + currentPivotOffsetY;
        ctx.translate(pivotX, pivotY);
        ctx.rotate(rotationAngle * Math.PI / 180);
        
        let flip = false;
        if (Math.abs(rotationAngle) > 90) {
            flip = true;
            ctx.scale(-1, 1);
        }
        
        const sx = överkroppFrameIndex * överkroppFrameWidth;
        const sy = 0;
        const dx = -currentPivotOffsetX;
        const dy = -currentPivotOffsetY;
        ctx.drawImage(currentÖverkroppImage, sx, sy, överkroppFrameWidth, överkroppFrameHeight, dx, dy, överkropp.width, överkropp.height);
        
        ctx.restore();
        
        // Update animation
        överkroppAnimationCounter++;
        if (överkroppAnimationCounter >= överkroppAnimationSpeed) {
            överkroppFrameIndex = (överkroppFrameIndex + 1) % överkroppFrameCount;
            överkroppAnimationCounter = 0;
        }
    }
    
    // Request next frame
    requestAnimationFrame(draw);
}

// Initial setup
resizeCanvas();

// Setup pivot controls if present
const pivotXRange = document.getElementById('pivotXRange');
const pivotYRange = document.getElementById('pivotYRange');
const pivotXValue = document.getElementById('pivotXValue');
const pivotYValue = document.getElementById('pivotYValue');

if (pivotXRange && pivotYRange && pivotXValue && pivotYValue) {
    pivotXRange.addEventListener('input', (event) => {
        överkroppPivotOffsetX = Number(event.target.value);
        överkroppVPivotOffsetX = Number(event.target.value);
        pivotXValue.textContent = överkroppPivotOffsetX;
    });
    pivotYRange.addEventListener('input', (event) => {
        överkroppPivotOffsetY = Number(event.target.value);
        överkroppVPivotOffsetY = Number(event.target.value);
        pivotYValue.textContent = överkroppPivotOffsetY;
    });

    pivotXValue.textContent = överkroppPivotOffsetX;
    pivotYValue.textContent = överkroppPivotOffsetY;
}

// Handle window resize
window.addEventListener('resize', resizeCanvas);

window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowRight') {
        rightPressed = true;
    } else if (event.code === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.code === 'ArrowUp') {
        upPressed = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowRight') {
        rightPressed = false;
    } else if (event.code === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.code === 'ArrowUp') {
        upPressed = false;
    }
});