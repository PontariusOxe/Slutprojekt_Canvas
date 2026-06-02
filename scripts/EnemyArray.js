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

        speed: 5,
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

            sprite: "../assets/sprites/NightBorne/NightBorneRun.png"
        },

        attack: {
            FrameCount: 12,
            FrameWidth: 80,
            FrameHeight: 47,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 6,

            damagePercent: 20,
            DamageFrame: 9,
            DamageDealt: false,

            sprite: "../assets/sprites/NightBorne/NightBorneA.png"
        },

        death: {
            FrameCount: 23,
            FrameWidth: 80,
            FrameHeight: 47,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 4,

            sprite: "../assets/sprites/NightBorne/NightBorneD.png"
        },

        offsets: {
            left: 80 / 1920,
            right: 90 / 1920
        },

        hitbox: {
            left: 500 / 1920,
            right: 500 / 1920,
            top: 0,
            height: 1
        },

        y: {
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

            else if (this.state === "stopped" && this.attackLoaded) {

                this.attack.AnimationCounter++;

                if (this.attack.AnimationCounter >= this.attack.AnimationSpeed) {

                    if (
                        this.attack.FrameIndex === this.attack.DamageFrame &&
                        !this.attack.DamageDealt
                    ) {

                        if (typeof HP !== "undefined") {
                            HP.takeDamagePercent(this.attack.damagePercent);
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

            const flipDir = (typeof this.renderDirection !== 'undefined') ? this.renderDirection : this.direction;
            if (flipDir < 0) {
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

        speed: 2.5,
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
            AnimationSpeed: 7,

            sprite: "../assets/sprites/Golems/Golem_1_walk.png"
        },

        attack: {
            FrameCount: 10,
            FrameWidth: 90,
            FrameHeight: 64,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 10,

            damagePercent: 10,
            DamageFrame: 6,
            DamageDealt: false,

            sprite: "../assets/sprites/Golems/Golem_1_attack.png"
        },

        death: {
            FrameCount: 12,
            FrameWidth: 90,
            FrameHeight: 64,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 6,

            sprite: "../assets/sprites/Golems/Golem_1_die.png"
        },

        offsets: {
            left: 95 / 1920,
            right: 125 / 1920
        },

        hitbox: {
            left: 600 / 1920,
            right: 600 / 1920,
            top: 0.4,
            height: 0.6
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

            else if (this.state === "stopped" && this.attackLoaded) {

                this.attack.AnimationCounter++;

                if (this.attack.AnimationCounter >= this.attack.AnimationSpeed) {

                    if (
                        this.attack.FrameIndex === this.attack.DamageFrame &&
                        !this.attack.DamageDealt
                    ) {

                        if (typeof HP !== "undefined") {
                            HP.takeDamagePercent(this.attack.damagePercent);
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

            const flipDir = (typeof this.renderDirection !== 'undefined') ? this.renderDirection : this.direction;
            if (flipDir < 0) {
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

    {
        Id: "bat",

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

        speed: 5,
        scale: 3,

        state: "walking",

        health: 30,
        maxHealth: 30,
        dead: false,

        walk: {
            FrameCount: 6,
            FrameWidth: 32,
            FrameHeight: 32,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 6,

            sprite: "../assets/sprites/BatSprites/BatMovement.png"
        },

        attack: {
            FrameCount: 7,
            FrameWidth: 32,
            FrameHeight: 32,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 8,

            damagePercent: 5,
            DamageFrame: 3,
            DamageDealt: false,

            sprite: "../assets/sprites/BatSprites/BatAttack.png"
        },

        death: {
            FrameCount: 7,
            FrameWidth: 32,
            FrameHeight: 32,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 8,

            sprite: "../assets/sprites/BatSprites/BatDeath.png"
        },

        offsets: {
            left: 60 / 1920,
            right: 120 / 1920
        },

        hitbox: {
            left: 120 / 1920,
            right: 120 / 1920,
            top: 0.08,
            height: 0.7
        },

        y: {
            walking: 25 / 1080,
            attack: 25 / 1080
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

            this.renderDirection = -this.direction;

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

            else if (this.state === "stopped" && this.attackLoaded) {

                this.attack.AnimationCounter++;

                if (this.attack.AnimationCounter >= this.attack.AnimationSpeed) {

                    if (
                        this.attack.FrameIndex === this.attack.DamageFrame &&
                        !this.attack.DamageDealt
                    ) {

                        if (typeof HP !== "undefined") {
                            HP.takeDamagePercent(this.attack.damagePercent);
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

            const flipDir = (typeof this.renderDirection !== 'undefined') ? this.renderDirection : this.direction;
            if (flipDir < 0) {
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

const ActiveEnemies = [];

function spawnRandomEnemy() {

    if (!Array.isArray(EnemyArray) || EnemyArray.length === 0) {
        console.error('spawnRandomEnemy: EnemyArray is empty or not defined');
        return;
    }

    const validEnemies = EnemyArray.filter(e => e && typeof e === 'object');
    console.log(`Available enemies: ${validEnemies.length} (${validEnemies.map(e => e.Id).join(', ')})`);

    if (validEnemies.length === 0) {
        console.error('spawnRandomEnemy: no valid enemy templates available', EnemyArray);
        return;
    }

    if (validEnemies.length !== EnemyArray.length) {
        console.warn('spawnRandomEnemy: EnemyArray contains empty slots or invalid entries', EnemyArray);
    }

    const randomIndex = Math.floor(Math.random() * validEnemies.length);
    const enemyTemplate = validEnemies[randomIndex];

    const enemy = Object.assign({}, enemyTemplate);

    enemy.walk = { ...enemyTemplate.walk };
    enemy.attack = { ...enemyTemplate.attack };
    enemy.death = { ...enemyTemplate.death };
    enemy.offsets = { ...enemyTemplate.offsets };
    enemy.y = { ...enemyTemplate.y };
    enemy.hitbox = enemyTemplate.hitbox
        ? { ...enemyTemplate.hitbox }
        : {
              left: (enemyTemplate.offsets && enemyTemplate.offsets.left) || 0,
              right: (enemyTemplate.offsets && enemyTemplate.offsets.right) || 0,
              top: 0.15,
              height: 0.7
          };

    enemy.canvas = document.getElementById('gameCanvas');
    enemy.ctx = enemy.canvas.getContext('2d');

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

    enemy.walkImage.onerror = () => {
        console.error("Failed to load walk image for", enemy.Id, "at", enemy.walk.sprite);
    };

    enemy.attackImage.onload = () => {

        enemy.attackLoaded = true;
    };

    enemy.attackImage.onerror = () => {
        console.error("Failed to load attack image for", enemy.Id, "at", enemy.attack.sprite);
    };

    enemy.deathImage.onload = () => {

        enemy.deathLoaded = true;
        console.log("Loaded death image for", enemy.Id);
    };

    enemy.deathImage.onerror = () => {
        console.error("Failed to load death image for", enemy.Id, "at", enemy.death.sprite);
    };

    ActiveEnemies.push(enemy);
    console.log("Spawned:", enemy.Id, "- Total active:", ActiveEnemies.length);
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
            console.log(`Removing dead ${enemy.Id} - ActiveEnemies will have ${ActiveEnemies.length - 1} left`);
            ActiveEnemies.splice(i, 1);
        }
    }
}
