let currentRound = 0;
let enemiesToSpawn = 0;
let enemiesSpawned = 0;
let roundActive = false;

let showWaveWarning = false;
let waveWarningText = "";
let warningTimer = 0;

let spawnTimer = -1;
const SPAWN_INTERVAL = 80;
// Log initial state
console.log("Rounds.js loaded");
function startRound(round) {
    currentRound = round;

    enemiesToSpawn = Math.min(round + 5, 15);
    enemiesSpawned = 0;
    spawnTimer = 0;
    roundActive = false;
    showWaveWarning = false;

    document.getElementById("roundText").innerText = currentRound;

    showWarning(`ROUND ${currentRound} INCOMING`);
    console.log(`Starting Round ${currentRound}, spawning ${enemiesToSpawn} enemies`);
}

function showWarning(text) {
    showWaveWarning = true;
    waveWarningText = text;
    warningTimer = 100;
}

function spawnEnemyForRound() {
    if (!roundActive) return;
    if (enemiesSpawned >= enemiesToSpawn) return;

    spawnTimer++;

    if (spawnTimer >= SPAWN_INTERVAL) {
        spawnRandomEnemy();
        enemiesSpawned++;
        spawnTimer = 0;
        console.log(`Spawned enemy ${enemiesSpawned}/${enemiesToSpawn}`);
    }
}

function updateRounds() {

    if (showWaveWarning) {
        warningTimer--;

        if (warningTimer <= 0) {
            showWaveWarning = false;
            roundActive = true;
            spawnTimer = 0;
            console.log("Wave warning expired, starting spawns");
        }

        return;
    }

    spawnEnemyForRound();

    // Check if round should advance
    if (roundActive && enemiesSpawned >= enemiesToSpawn) {
        console.log(`Round ${currentRound}: spawned ${enemiesSpawned}/${enemiesToSpawn}, active enemies: ${ActiveEnemies.length}`);
        
        if (ActiveEnemies.length === 0) {
            roundActive = false;
            roundSwitchTimer = 0;
            console.log(`Round ${currentRound} complete!`);

            if (currentRound < 10) {
                console.log(`Starting next round in 1.5 seconds...`);
                roundSwitchTimer = 150; // ~1.5 seconds at 100fps
                setTimeout(() => {
                    console.log(`Switching to round ${currentRound + 1}`);
                    startRound(currentRound + 1);
                }, 1500);
            } else {
                console.log("All rounds completed! Going to win screen.");
                window.location.href = '../pages/WinScreen.html';
            }
        }
    }
}
