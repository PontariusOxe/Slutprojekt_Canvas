
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bollImg = new Image();
bollImg.src = "boll/boll.png";

let bollFrameIndex = 0;
let bollAnimationCounter = 0;
const bollFrameCount = 1;
const bollAnimationSpeed = 10;
const bollFrameWidth = 16;
const bollFrameHeight = 16;
const bollScale = 1;
const bollSpeed = 5;

let projectiles = [];

function spawnProjectile(x, y, angle) {
    const rad = -angle * Math.PI / 180;
    const direction = useInvertedSprites ? -1 : 1;
    const vx = Math.cos(rad) * bollSpeed * direction;
    const vy = Math.sin(rad) * bollSpeed;
    projectiles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        width: bollFrameWidth * bollScale,
        height: bollFrameHeight * bollScale
    });
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        // Remove if off screen
        if (p.x < -p.width || p.x > canvas.width + p.width || p.y < -p.height || p.y > canvas.height + p.height) {
            projectiles.splice(i, 1);
        }
    }
}

function drawProjectiles() {
    for (const p of projectiles) {
        ctx.drawImage(bollImg, p.x, p.y, p.width, p.height);
    }
}