const EnemyArray = [

    // =========================
    // NIGHTBORNE
    // =========================

    {
        Id: "NightBorne",

        canvas: document.getElementById('gameCanvas'),
        ctx: document.getElementById('gameCanvas').getContext('2d'),

        walkImage: new Image(),
        attackImage: new Image(),

        loaded: false,
        attackLoaded: false,

        x: 0,
        direction: 1,

        speed: 3,
        scale: 3,

        state: "walking",

        health: 100,
        maxHealth: 100,

        deathImage: new Image(),
        deathLoaded: false,
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
            FrameHeight: 67,

            FrameIndex: 0,
            AnimationCounter: 0,
            AnimationSpeed: 10,

            sprite: "MonsterSprite/NightBorne/NightBorneD.png"
        },

        offsets: {
            left: 80,
            right: 90
        },

        y: {
            walking: 250,
            attack: 150
        },

        reset() {

            this.attack.FrameIndex = 0;
            this.attack.AnimationCounter = 0;
            this.attack.DamageDealt = false;

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
                this.state === "walking"
                    ? this.walk.FrameWidth
                    : this.attack.FrameWidth;

            const currentFrameHeight =
                this.state === "walking"
                    ? this.walk.FrameHeight
                    : this.attack.FrameHeight;

            const width = currentFrameWidth * this.scale;
            const height = currentFrameHeight * this.scale;

            const currentY =
                this.state === "walking"
                    ? (this.canvas.height + this.y.walking) / 2
                    : (this.canvas.height + this.y.attack) / 2;

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
                    ? playerÖverkropp.x - coords.width + this.offsets.left
                    : playerÖverkropp.x + playerÖverkropp.width - this.offsets.right;

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

            } else if (this.state === "stopped" && this.attackLoaded) {

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

            const currentImage =
                !isWalking && this.attackLoaded
                    ? this.attackImage
                    : this.walkImage;

            const currentFrameIndex =
                isWalking
                    ? this.walk.FrameIndex
                    : this.attack.FrameIndex;

            const currentFrameWidth =
                isWalking
                    ? this.walk.FrameWidth
                    : this.attack.FrameWidth;

            const currentFrameHeight =
                isWalking
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
        }
    },




    // GOLEM


    {
        Id: "golem",

        canvas: document.getElementById('gameCanvas'),
        ctx: document.getElementById('gameCanvas').getContext('2d'),

        walkImage: new Image(),
        attackImage: new Image(),

        loaded: false,
        attackLoaded: false,

        x: 0,
        direction: 1,

        speed: 1.5,
        scale: 3,

        state: "walking",
         
        health: 100,
        maxHealth: 100,

        deathImage: new Image(),
        deathLoaded: false,
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
            AnimationSpeed: 10,

            sprite: "MonsterSprite/Golems_Free_Version/Golems_Free_Version/Golem_1/Blue/White_Swoosh_VFX/Golem_1_die.png"
        },

        offsets: {
            left: 95,
            right: 125
        },

        y: {
            walking: 30,
            attack: 30
        },

        reset() {

            this.health = this.maxHealth;
            this.dead = false;
            this.health = this.maxHealth;
            this.dead = false;
            this.attack.FrameIndex = 0;
            this.attack.AnimationCounter = 0;
            this.attack.DamageDealt = false;

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
                this.state === "walking"
                    ? this.walk.FrameWidth
                    : this.attack.FrameWidth;

            const currentFrameHeight =
                this.state === "walking"
                    ? this.walk.FrameHeight
                    : this.attack.FrameHeight;

            const width = currentFrameWidth * this.scale;
            const height = currentFrameHeight * this.scale;

            const currentY =
                (this.canvas.height + this.y.walking) / 2;

            return {
                x: this.x,
                y: currentY,
                width,
                height
            };
        },

        update(playerÖverkropp) {

            if (!this.loaded || !playerÖverkropp) return;

            const coords = this.getCoords();

            const stopX =
                this.direction === 1
                    ? playerÖverkropp.x - coords.width + this.offsets.left
                    : playerÖverkropp.x + playerÖverkropp.width - this.offsets.right;

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

            } else if (this.state === "stopped" && this.attackLoaded) {

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

            const currentImage =
                !isWalking && this.attackLoaded
                    ? this.attackImage
                    : this.walkImage;

            const currentFrameIndex =
                isWalking
                    ? this.walk.FrameIndex
                    : this.attack.FrameIndex;

            const currentFrameWidth =
                isWalking
                    ? this.walk.FrameWidth
                    : this.attack.FrameWidth;

            const currentFrameHeight =
                isWalking
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
        }
    }
];




// LOAD ENEMIES


EnemyArray.forEach(enemy => {

    enemy.walkImage.src = enemy.walk.sprite;
    enemy.attackImage.src = enemy.attack.sprite;
    enemy.deathImage.src = enemy.death.sprite;

    enemy.walkImage.onload = () => {

        enemy.loaded = true;
        enemy.reset();
    };

    enemy.deathImage.onload = () => {

    enemy.deathLoaded = true;
    };

    enemy.attackImage.onload = () => {

        enemy.attackLoaded = true;
    };

    enemy.walkImage.onerror = () => {
        console.error(`${enemy.Id} walk image failed to load`);
    };

    enemy.attackImage.onerror = () => {
        console.error(`${enemy.Id} attack image failed to load`);
    };
});