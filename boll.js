
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
const bollScale = 3;
const bollSpeed = 5;


let hitbox = {
x: boll.x + 200,
y: boll.y + 450,
width: 600,
height: 150
};


let keys = {};

window.addEventListener("keydown", (spacebar) => {
keys[spacebar.key] = true;
});

window.addEventListener("keyup", (spacebar) => {
keys[spacebar.key] = false;
});


function update() {
if (keys["ArrowRight"]) boll.x += boll.speed;
if (keys["ArrowLeft"]) boll.x -= boll.speed;
if (keys["ArrowUp"]) boll.y -= boll.speed;
if (keys["ArrowDown"]) boll.y += boll.speed;


hitbox.x = boll.x + 200;
hitbox.y = boll.y + 450;
}


function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);


ctx.drawImage(bollImg, boll.x, boll.y, 300, 300);


ctx.strokeStyle = "red";
ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
}


function gameLoop() {
update();
draw();
requestAnimationFrame(gameLoop);
}


bollImg.onload = () => {
gameLoop();
};
