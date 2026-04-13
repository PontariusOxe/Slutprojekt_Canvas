const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    const x = canvas.width * 0.5;
    const y = canvas.height * 0.5;
    ctx.fillRect(x, y, 100, 100);
}

draw();

setInterval(() => {
    draw();
}, 1000);  
