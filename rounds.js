let currentRound = 0;
let enemiesToSpawn = 0;
let enemiesSpawned = 0;
let roundActive = false;

let showWaveWarning = false;
let waveWarningText = "";
let warningTimer = 0;

let spawnTimer = 0;
const SPAWN_INTERVAL = 140; // 2 seconds at 60fps

document.getElementById("roundText").innerText = currentRound;
currentRound++;
document.getElementById("roundText").innerText = currentRound;

function startRound(round) {
    currentRound = round;

    enemiesToSpawn = round + 5; // Runda 1 = 2 fiender, Runda 2 = 3, etc
    enemiesSpawned = 0;
    spawnTimer = 0;
    roundActive = false;

    // Update HUD
    document.getElementById("roundText").innerText = currentRound;

    // SHOW WARNING FIRST
    showWarning(`ROUND ${currentRound} INCOMING`);
}

function showWarning(text) {
    showWaveWarning = true;
    waveWarningText = text;
    warningTimer = 100; // ~3 seconds at 60fps
}

function spawnEnemyForRound() {
    if (!roundActive) return;
    if (enemiesSpawned >= enemiesToSpawn) return;

    spawnTimer++;

    if (spawnTimer >= SPAWN_INTERVAL) {
        spawnRandomEnemy();
        enemiesSpawned++;
        spawnTimer = 0;
    }
}

function updateRounds() {

    // WARNING SCREEN LOGIC
    if (showWaveWarning) {
        warningTimer--;

        if (warningTimer <= 0) {
            showWaveWarning = false;
            roundActive = true;
            spawnTimer = 0;
        }

        return; // freeze game during warning
    }

    // Spawn enemies each frame during active round
    spawnEnemyForRound();

    // ROUND COMPLETE CHECK
    if (
        roundActive &&
        enemiesSpawned >= enemiesToSpawn &&
        ActiveEnemies.length === 0
    ) {
        roundActive = false;

        //vilken runda spelet slutar skickar ut enemys.
        if (currentRound < 10) {
            setTimeout(() => {
                startRound(currentRound + 1);
            }, 1500);
        } else {
            window.location.href = 'WIn.html';
        }
    }
}

