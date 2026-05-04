// =======================
// CANVAS
// =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =======================
// LADDA PIL-BILD
// =======================
const arrowImg = new Image();
arrowImg.src = "pil.png";

// =======================
// PIL
// =======================
let arrow = {
x: 100,
y: 200,
speed: 5
};

// =======================
// HITBOX (anpassad till pilen)
// =======================
let hitbox = {
x: arrow.x + 200,
y: arrow.y + 450,
width: 600,
height: 150
};

// =======================
// INPUT
// =======================
let keys = {};

window.addEventListener("keydown", (e) => {
keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
keys[e.key] = false;
});

// =======================
// UPDATE
// =======================
function update() {
if (keys["ArrowRight"]) arrow.x += arrow.speed;
if (keys["ArrowLeft"]) arrow.x -= arrow.speed;
if (keys["ArrowUp"]) arrow.y -= arrow.speed;
if (keys["ArrowDown"]) arrow.y += arrow.speed;

// Uppdatera hitboxens position
hitbox.x = arrow.x + 200;
hitbox.y = arrow.y + 450;
}

// =======================
// DRAW
// =======================
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Rita pil (nedskalad från 1040x1040)
ctx.drawImage(arrowImg, arrow.x, arrow.y, 300, 300);

// Rita hitbox (debug)
ctx.strokeStyle = "red";
ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
}

// =======================
// GAME LOOP
// =======================
function gameLoop() {
update();
draw();
requestAnimationFrame(gameLoop);
}

// =======================
// START
// =======================
arrowImg.onload = () => {
gameLoop();
};
