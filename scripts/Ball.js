
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bollImg = new Image();
const savedBoll = localStorage.getItem("selectedBoll");
bollImg.src = savedBoll || "../assets/sprites/balls/boll.png";

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


function getEnemyHitbox(enemy) {
    const enemyCoords = enemy.getCoords();
    const hitbox = enemy.hitbox;

    if (!hitbox) {
        return enemyCoords;
    }

    const x = enemyCoords.x + enemyCoords.width * hitbox.left;
    const width = enemyCoords.width * Math.max(0, 1 - hitbox.left - hitbox.right);
    const y = enemyCoords.y + enemyCoords.height * hitbox.top;
    const height = enemyCoords.height * hitbox.height;

    return {
        x,
        y,
        width,
        height
    };
}

function checkProjectileEnemyCollisions() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        
        for (const enemy of ActiveEnemies) {
            if (enemy.dead) continue;
            
            const enemyHitbox = getEnemyHitbox(enemy);
            
            if (
                p.x < enemyHitbox.x + enemyHitbox.width &&
                p.x + p.width > enemyHitbox.x &&
                p.y < enemyHitbox.y + enemyHitbox.height &&
                p.y + p.height > enemyHitbox.y
            ) {
                enemy.takeDamage(10);
                
                projectiles.splice(i, 1);
                break;
            }
        }
    }
}
