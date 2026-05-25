let currentRound = 0;
let enemiesToSpawn = 0;
let enemiesSpawned = 0;
let roundActive = false;

let showWaveWarning = false;
let waveWarningText = "";
let warningTimer = 0;

document.getElementById("roundText").innerText = currentRound;
currentRound++;
document.getElementById("roundText").innerText = currentRound;

function startRound(round) {
    currentRound = round;

    enemiesToSpawn = 3 + round / 4; // scaling
    enemiesSpawned = 0;
    roundActive = false;

    // 🔥 SHOW WARNING FIRST
    showWarning(`ROUND ${currentRound} INCOMING`);
}

function showWarning(text) {
    showWaveWarning = true;
    waveWarningText = text;
    warningTimer = 180; // ~3 seconds at 60fps
}

function spawnEnemyForRound() {
    if (!roundActive) return;
    if (enemiesSpawned >= enemiesToSpawn) return;

    spawnRandomEnemy();
    enemiesSpawned++;

    setTimeout(spawnEnemyForRound, 700);
}

function updateRounds() {

    // remove dead enemies
    for (let i = ActiveEnemies.length - 1; i >= 0; i--) {
        if (ActiveEnemies[i].dead) {
            ActiveEnemies.splice(i, 1);
        }
    }

    // 🔥 WARNING SCREEN LOGIC
    if (showWaveWarning) {
        warningTimer--;

        if (warningTimer <= 0) {
            showWaveWarning = false;
            roundActive = true;

            spawnEnemyForRound();
        }

        return; // freeze game during warning
    }

    // ROUND COMPLETE CHECK
    if (
        roundActive &&
        enemiesSpawned >= enemiesToSpawn &&
        ActiveEnemies.length === 0
    ) {
        roundActive = false;

        if (currentRound < 20) {
            setTimeout(() => {
                startRound(currentRound + 1);
            }, 1500);
        } else {
            console.log("GAME COMPLETE");
        }
    }
}

// START GAME
startRound(1);

