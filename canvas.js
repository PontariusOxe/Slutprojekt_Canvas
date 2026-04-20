const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the underkropp image
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

// Animation variables for överkropp
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

// Rotation variables
let rotationAngle = 0;
const rotationSpeed = 2; // degrees per frame
let rightPressed = false;
let leftPressed = false;
let useInvertedSprites = false; // Track if we're using inverted sprites

// Pivot point for överkropp rotation (pixels from överkropp top-left)
let överkroppPivotOffsetX = överkroppFrameWidth * 1; // center horizontally
let överkroppPivotOffsetY = överkroppFrameHeight * 3; // bottom of the sprite

function setOverkroppRotationPivot(offsetX, offsetY) {
    överkroppPivotOffsetX = offsetX; 
    överkroppPivotOffsetY = offsetY;
}

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
    const x = underkropp.x + 38;
    const y = underkropp.y - height + 48;
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

    // Determine which sprite set to use
    const currentUnderkroppImage = useInvertedSprites && underkroppVLoaded ? underkroppImageV : underkroppImage;
    const currentUnderkroppLoaded = useInvertedSprites && underkroppVLoaded ? underkroppVLoaded : underkroppLoaded;
    
    // Draw the underkropp image
    if (currentUnderkroppLoaded && underkropp.width > 0 && underkropp.height > 0) {
        ctx.drawImage(currentUnderkroppImage, underkropp.x, underkropp.y, underkropp.width, underkropp.height);
    }

    // Draw the överkropp image with animation
    if (överkroppLoaded) {
        const överkropp = getOverkroppCoords(underkropp);
        
        // Determine which sprite set to use
        const currentÖverkroppImage = useInvertedSprites && överkroppVLoaded ? överkroppImageV : överkroppImage;
        const currentÖverkroppLoaded = useInvertedSprites && överkroppVLoaded ? överkroppVLoaded : överkroppLoaded;
        
        // Update rotation
        if (rightPressed && rotationAngle < 90) {
            rotationAngle += rotationSpeed;
            // Switch back to normal sprites when rotating right past 45 degrees
            if (rotationAngle > 45) {
                useInvertedSprites = false;
            }
        }
        if (leftPressed && rotationAngle > -90) {
            rotationAngle -= rotationSpeed;
            // Switch to inverted sprites when rotating left past 45 degrees
            if (rotationAngle < -45) {
                useInvertedSprites = true;
            }
        }
        
        ctx.save();
        const pivotX = överkropp.x + överkroppPivotOffsetX;
        const pivotY = överkropp.y + överkroppPivotOffsetY;
        ctx.translate(pivotX, pivotY);
        ctx.rotate(rotationAngle * Math.PI / 180);
        
        let flip = false;
        if (Math.abs(rotationAngle) > 90) {
            flip = true;
            ctx.scale(-1, 1);
        }
        
        const sx = överkroppFrameIndex * överkroppFrameWidth;
        const sy = 0;
        const dx = -överkroppPivotOffsetX;
        const dy = -överkroppPivotOffsetY;
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
        pivotXValue.textContent = överkroppPivotOffsetX;
    });
    pivotYRange.addEventListener('input', (event) => {
        överkroppPivotOffsetY = Number(event.target.value);
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
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowRight') {
        rightPressed = false;
    } else if (event.code === 'ArrowLeft') {
        leftPressed = false;
    }
});