const EnemyArray = [

    // NIGHTBORNE

    {
        Id: "NightBorne",

        canvas: document.getElementById('gameCanvas'),
        ctx: document.getElementById('gameCanvas').getContext('2d'),

        walkImage: new Image(),
        attackImage: new Image(),
        deathImage: new Image(),

        loaded: false,
        attackLoaded: false,
        deathLoaded: false,

        x: 0,
        direction: 1,

        speed: 4,
        scale: 3,

        state: "walking",

        health: 50,
        maxHealth: 50,
        dead: false,

        walk: {
            FrameCount: 6,
            FrameWidth: 79,
            FrameHeight: 27,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 5,

            sprite: "MonsterSprite/NightBorne/NightBorneRun.png"
        },

        attack: {
            FrameCount: 12,
            FrameWidth: 80,
            FrameHeight: 47,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 10,

            DamageFrame: 9,
            DamageDealt: false,

            sprite: "MonsterSprite/NightBorne/NightBorneA.png"
        },

        death: {
            FrameCount: 23,
            FrameWidth: 80,
            FrameHeight: 47,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 10,

            sprite: "MonsterSprite/NightBorne/NightBorneD.png"
        },

        // values stored as fractions of base resolution (1920x1080)
        offsets: {
            // horizontal percentages (relative to width)
            left: 80 / 1920,
            right: 90 / 1920
        },

        y: {
            // vertical percentages (relative to height)
            walking: 390 / 1080,
            attack: 220 / 1080
        },

        reset() {

            this.health = this.maxHealth;
            this.dead = false;

            this.attack.FrameIndex = 0;
            this.attack.AnimationCounter = 0;
            this.attack.DamageDealt = false;

            this.death.FrameIndex = 0;
            this.death.AnimationCounter = 0;

            const width = this.walk.FrameWidth * this.scale;

            const fromLeft = Math.random() < 0.5;

            this.direction = fromLeft ? 1 : -1;

            this.x = fromLeft
                ? -width
                : this.canvas.width;

            this.state = "walking";

            this.walk.FrameIndex = 0;
            this.walk.AnimationCounter = 0;
        },

        takeDamage(amount) {

            if (this.dead) return;

            this.health -= amount;

            if (this.health <= 0) {

                this.health = 0;

                this.state = "dead";

                this.dead = true;

                this.death.FrameIndex = 0;
                this.death.AnimationCounter = 0;
            }
        },

        getCoords() {

            const currentFrameWidth =
                this.state === "dead"
                    ? this.death.FrameWidth
                    : this.state === "walking"
                        ? this.walk.FrameWidth
                        : this.attack.FrameWidth;

            const currentFrameHeight =
                this.state === "dead"
                    ? this.death.FrameHeight
                    : this.state === "walking"
                        ? this.walk.FrameHeight
                        : this.attack.FrameHeight;

            const width = currentFrameWidth * this.scale;
            const height = currentFrameHeight * this.scale;

            const currentY =
                this.state === "walking"
                    ? (this.canvas.height + this.y.walking * this.canvas.height) / 2
                    : (this.canvas.height + this.y.attack * this.canvas.height) / 2;

            return {
                x: this.x,
                y: currentY,
                width,
                height
            };
        },

        update(playerÖverkropp) {

            if (!this.loaded || !playerÖverkropp) return;

            // DEATH
            if (this.state === "dead") {

                this.death.AnimationCounter++;

                if (this.death.AnimationCounter >= this.death.AnimationSpeed) {

                    if (this.death.FrameIndex < this.death.FrameCount - 1) {

                        this.death.FrameIndex++;
                    }

                    this.death.AnimationCounter = 0;
                }

                return;
            }

            const coords = this.getCoords();

            const stopX =
                this.direction === 1
                    ? playerÖverkropp.x - coords.width + this.offsets.left * this.canvas.width
                    : playerÖverkropp.x + playerÖverkropp.width - this.offsets.right * this.canvas.width;

            const distance = stopX - this.x;

            // WALK
            if (this.state === "walking") {

                if (Math.abs(distance) <= this.speed) {

                    this.x = stopX;
                    this.state = "stopped";

                } else {

                    this.x += this.direction * this.speed;
                }

                this.walk.AnimationCounter++;

                if (this.walk.AnimationCounter >= this.walk.AnimationSpeed) {

                    this.walk.FrameIndex =
                        (this.walk.FrameIndex + 1) % this.walk.FrameCount;

                    this.walk.AnimationCounter = 0;
                }
            }

            // ATTACK
            else if (this.state === "stopped" && this.attackLoaded) {

                this.attack.AnimationCounter++;

                if (this.attack.AnimationCounter >= this.attack.AnimationSpeed) {

                    if (
                        this.attack.FrameIndex === this.attack.DamageFrame &&
                        !this.attack.DamageDealt
                    ) {

                        if (typeof HP !== "undefined") {
                            HP.takeDamagePercent(HP.damagePercent);
                        }

                        this.attack.DamageDealt = true;
                    }

                    this.attack.FrameIndex =
                        (this.attack.FrameIndex + 1) % this.attack.FrameCount;

                    if (this.attack.FrameIndex === 0) {
                        this.attack.DamageDealt = false;
                    }

                    this.attack.AnimationCounter = 0;
                }
            }
        },

        draw(playerÖverkropp) {

            if (!this.loaded) return;

            this.update(playerÖverkropp);

            const coords = this.getCoords();

            const isWalking = this.state === "walking";
            const isDead = this.state === "dead";

            let currentImage;

            if (isDead && this.deathLoaded) {

                currentImage = this.deathImage;

            } else if (!isWalking && this.attackLoaded) {

                currentImage = this.attackImage;

            } else {

                currentImage = this.walkImage;
            }

            const currentFrameIndex =
                isDead
                    ? this.death.FrameIndex
                    : isWalking
                        ? this.walk.FrameIndex
                        : this.attack.FrameIndex;

            const currentFrameWidth =
                isDead
                    ? this.death.FrameWidth
                    : isWalking
                        ? this.walk.FrameWidth
                        : this.attack.FrameWidth;

            const currentFrameHeight =
                isDead
                    ? this.death.FrameHeight
                    : isWalking
                        ? this.walk.FrameHeight
                        : this.attack.FrameHeight;

            const frameX = currentFrameIndex * currentFrameWidth;

            this.ctx.save();

            this.ctx.translate(
                coords.x + coords.width / 2,
                coords.y + coords.height / 2
            );

            if (this.direction < 0) {
                this.ctx.scale(-1, 1);
            }

            this.ctx.drawImage(
                currentImage,
                frameX,
                0,
                currentFrameWidth,
                currentFrameHeight,
                -coords.width / 2,
                -coords.height / 2,
                coords.width,
                coords.height
            );

            this.ctx.restore();

            // HEALTH BAR (scaled from 1920x1080 baseline) - only show when alive
            if (!isDead) {
                const barWidth = Math.round(this.canvas.width * (80 / 1920));
                const barHeight = Math.round(this.canvas.height * (10 / 1080));
                const healthPercent = this.health / this.maxHealth;
                const barX = coords.x + (coords.width / 2) - (barWidth / 2);
                const barY = coords.y - Math.round(this.canvas.height * (20 / 1080));

                this.ctx.fillStyle = "red";
                this.ctx.fillRect(barX, barY, barWidth, barHeight);

                this.ctx.fillStyle = "lime";
                this.ctx.fillRect(barX, barY, Math.round(barWidth * healthPercent), barHeight);
            }
        }
    },






    // GOLEM

    {
        Id: "golem",

        canvas: document.getElementById('gameCanvas'),
        ctx: document.getElementById('gameCanvas').getContext('2d'),

        walkImage: new Image(),
        attackImage: new Image(),
        deathImage: new Image(),

        loaded: false,
        attackLoaded: false,
        deathLoaded: false,

        x: 0,
        direction: 1,

        speed: 2,
        scale: 3,

        state: "walking",

        health: 100,
        maxHealth: 100,
        dead: false,

        walk: {
            FrameCount: 10,
            FrameWidth: 90,
            FrameHeight: 64,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 10,

            sprite: "MonsterSprite/Golems_Free_Version/Golems_Free_Version/Golem_1/Blue/White_Swoosh_VFX/Golem_1_walk.png"
        },

        attack: {
            FrameCount: 10,
            FrameWidth: 90,
            FrameHeight: 64,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 10,

            DamageFrame: 6,
            DamageDealt: false,

            sprite: "MonsterSprite/Golems_Free_Version/Golems_Free_Version/Golem_1/Blue/White_Swoosh_VFX/Golem_1_attack.png"
        },

        death: {
            FrameCount: 12,
            FrameWidth: 90,
            FrameHeight: 64,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 14,

            sprite: "MonsterSprite/Golems_Free_Version/Golems_Free_Version/Golem_1/Blue/White_Swoosh_VFX/Golem_1_die.png"
        },

        offsets: {
            left: 95 / 1920,
            right: 125 / 1920
        },

        y: {
            walking: 30 / 1080,
            attack: 30 / 1080
        },

        reset() {

            this.health = this.maxHealth;
            this.dead = false;

            this.attack.FrameIndex = 0;
            this.attack.AnimationCounter = 0;
            this.attack.DamageDealt = false;

            this.death.FrameIndex = 0;
            this.death.AnimationCounter = 0;

            const width = this.walk.FrameWidth * this.scale;

            const fromLeft = Math.random() < 0.5;

            this.direction = fromLeft ? 1 : -1;

            this.x = fromLeft
                ? -width
                : this.canvas.width;

            this.state = "walking";

            this.walk.FrameIndex = 0;
            this.walk.AnimationCounter = 0;
        },

        takeDamage(amount) {

            if (this.dead) return;

            this.health -= amount;

            if (this.health <= 0) {

                this.health = 0;

                this.state = "dead";

                this.dead = true;

                this.death.FrameIndex = 0;
                this.death.AnimationCounter = 0;
            }
        },

        getCoords() {

            const currentFrameWidth =
                this.state === "dead"
                    ? this.death.FrameWidth
                    : this.state === "walking"
                        ? this.walk.FrameWidth
                        : this.attack.FrameWidth;

            const currentFrameHeight =
                this.state === "dead"
                    ? this.death.FrameHeight
                    : this.state === "walking"
                        ? this.walk.FrameHeight
                        : this.attack.FrameHeight;

            const width = currentFrameWidth * this.scale;
            const height = currentFrameHeight * this.scale;

            const currentY =
                (this.canvas.height + this.y.walking * this.canvas.height) / 2;

            return {
                x: this.x,
                y: currentY,
                width,
                height
            };
        },

        update(playerÖverkropp) {

            if (!this.loaded || !playerÖverkropp) return;

            // DEATH
            if (this.state === "dead") {

                this.death.AnimationCounter++;

                if (this.death.AnimationCounter >= this.death.AnimationSpeed) {

                    if (this.death.FrameIndex < this.death.FrameCount - 1) {

                        this.death.FrameIndex++;
                    }

                    this.death.AnimationCounter = 0;
                }

                return;
            }

            const coords = this.getCoords();

            const stopX =
                this.direction === 1
                    ? playerÖverkropp.x - coords.width + this.offsets.left * this.canvas.width
                    : playerÖverkropp.x + playerÖverkropp.width - this.offsets.right * this.canvas.width;

            const distance = stopX - this.x;

            // WALK
            if (this.state === "walking") {

                if (Math.abs(distance) <= this.speed) {

                    this.x = stopX;
                    this.state = "stopped";

                } else {

                    this.x += this.direction * this.speed;
                }

                this.walk.AnimationCounter++;

                if (this.walk.AnimationCounter >= this.walk.AnimationSpeed) {

                    this.walk.FrameIndex =
                        (this.walk.FrameIndex + 1) % this.walk.FrameCount;

                    this.walk.AnimationCounter = 0;
                }
            }

            // ATTACK
            else if (this.state === "stopped" && this.attackLoaded) {

                this.attack.AnimationCounter++;

                if (this.attack.AnimationCounter >= this.attack.AnimationSpeed) {

                    if (
                        this.attack.FrameIndex === this.attack.DamageFrame &&
                        !this.attack.DamageDealt
                    ) {

                        if (typeof HP !== "undefined") {
                            HP.takeDamagePercent(HP.damagePercent);
                        }

                        this.attack.DamageDealt = true;
                    }

                    this.attack.FrameIndex =
                        (this.attack.FrameIndex + 1) % this.attack.FrameCount;

                    if (this.attack.FrameIndex === 0) {
                        this.attack.DamageDealt = false;
                    }

                    this.attack.AnimationCounter = 0;
                }
            }
        },

        draw(playerÖverkropp) {

            if (!this.loaded) return;

            this.update(playerÖverkropp);

            const coords = this.getCoords();

            const isWalking = this.state === "walking";
            const isDead = this.state === "dead";

            let currentImage;

            if (isDead && this.deathLoaded) {

                currentImage = this.deathImage;

            } else if (!isWalking && this.attackLoaded) {

                currentImage = this.attackImage;

            } else {

                currentImage = this.walkImage;
            }

            const currentFrameIndex =
                isDead
                    ? this.death.FrameIndex
                    : isWalking
                        ? this.walk.FrameIndex
                        : this.attack.FrameIndex;

            const currentFrameWidth =
                isDead
                    ? this.death.FrameWidth
                    : isWalking
                        ? this.walk.FrameWidth
                        : this.attack.FrameWidth;

            const currentFrameHeight =
                isDead
                    ? this.death.FrameHeight
                    : isWalking
                        ? this.walk.FrameHeight
                        : this.attack.FrameHeight;

            const frameX = currentFrameIndex * currentFrameWidth;

            this.ctx.save();

            this.ctx.translate(
                coords.x + coords.width / 2,
                coords.y + coords.height / 2
            );

            if (this.direction < 0) {
                this.ctx.scale(-1, 1);
            }

            this.ctx.drawImage(
                currentImage,
                frameX,
                0,
                currentFrameWidth,
                currentFrameHeight,
                -coords.width / 2,
                -coords.height / 2,
                coords.width,
                coords.height
            );

            this.ctx.restore();

            // HEALTH BAR (scaled from 1920x1080 baseline) - only show when alive
            if (!isDead) {
                const barWidth = Math.round(this.canvas.width * (80 / 1920));
                const barHeight = Math.round(this.canvas.height * (10 / 1080));
                const healthPercent = this.health / this.maxHealth;
                const barX = coords.x + (coords.width / 2) - (barWidth / 2);
                const barY = coords.y - Math.round(this.canvas.height * (20 / 1080));

                this.ctx.fillStyle = "red";
                this.ctx.fillRect(barX, barY, barWidth, barHeight);

                this.ctx.fillStyle = "lime";
                this.ctx.fillRect(barX, barY, Math.round(barWidth * healthPercent), barHeight);
            }
        }
    }
];




// ACTIVE ENEMIES

const ActiveEnemies = [];




// SPAWN RANDOM ENEMY

function spawnRandomEnemy() {

    const enemyTemplate =
        EnemyArray[Math.floor(Math.random() * EnemyArray.length)];

    const enemy = Object.assign({}, enemyTemplate);

    enemy.walk = { ...enemyTemplate.walk };
    enemy.attack = { ...enemyTemplate.attack };
    enemy.death = { ...enemyTemplate.death };
    enemy.offsets = { ...enemyTemplate.offsets };
    enemy.y = { ...enemyTemplate.y };

    // CANVAS
    enemy.canvas = document.getElementById('gameCanvas');
    enemy.ctx = enemy.canvas.getContext('2d');

    // IMAGES
    enemy.walkImage = new Image();
    enemy.attackImage = new Image();
    enemy.deathImage = new Image();

    enemy.loaded = false;
    enemy.attackLoaded = false;
    enemy.deathLoaded = false;

    enemy.walkImage.src = enemy.walk.sprite;
    enemy.attackImage.src = enemy.attack.sprite;
    enemy.deathImage.src = enemy.death.sprite;

    enemy.walkImage.onload = () => {

        enemy.loaded = true;
        enemy.reset();
    };

    enemy.attackImage.onload = () => {

        enemy.attackLoaded = true;
    };

    enemy.deathImage.onload = () => {

        enemy.deathLoaded = true;
        console.log("Loaded death image for", enemy.Id);
    };

    enemy.deathImage.onerror = () => {
        console.error("Failed to load death image for", enemy.Id, "at", enemy.death.sprite);
    };

    ActiveEnemies.push(enemy);
    console.log("Spawned:", enemy.Id);
}



function drawActiveEnemies(playerÖverkropp) {
    if (!ActiveEnemies.length) return;
    ActiveEnemies.forEach((enemy) => enemy.draw(playerÖverkropp));
}

function cleanupActiveEnemies() {
    for (let i = ActiveEnemies.length - 1; i >= 0; i--) {
        const enemy = ActiveEnemies[i];
        if (
            enemy.state === 'dead' &&
            enemy.death.FrameIndex === enemy.death.FrameCount - 1 &&
            enemy.death.AnimationCounter === 0
        ) {
            ActiveEnemies.splice(i, 1);
        }
    }
}