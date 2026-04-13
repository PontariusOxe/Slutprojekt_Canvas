const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Example: Draw a red rectangle
    ctx.fillStyle = 'blu';
    ctx.fillRect(625, 464, 100, 100);
}
// Call the draw function to render the initial state
draw();

// Example: Update the canvas every second
setInterval(() => {
    draw();
}, 1000);  
