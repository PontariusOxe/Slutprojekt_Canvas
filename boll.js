
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
const bollSpeed = 10;

let projectiles = [];

function spawnProjectile(x, y, angle) {
    const rad = useInvertedSprites ? -angle * Math.PI / 180 : angle * Math.PI / 180;
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

function checkProjectileEnemyCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        
        for (const enemy of ActiveEnemies) {
            if (enemy.dead) continue;
            
            const enemyCoords = enemy.getCoords();
            
            if (
                p.x < enemyCoords.x + enemyCoords.width &&
                p.x + p.width > enemyCoords.x &&
                p.y < enemyCoords.y + enemyCoords.height &&
                p.y + p.height > enemyCoords.y
            ) {
                enemy.takeDamage(10);
                
                projectiles.splice(i, 1);
                break;
            }
        }
    }
}