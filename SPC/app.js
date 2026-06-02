// 1. UI Elementen selecteren
const humanHand = document.getElementById("human-hand");
const computerHand = document.getElementById("computer-hand");
const countdownText = document.getElementById("countdown-text");
const resultOutput = document.getElementById("result");
const currentStreakElement = document.getElementById("current-streak");
const playerNameDisplay = document.getElementById("player-name-display");
const leaderboardList = document.getElementById("leaderboard-list");
const changePlayerBtn = document.getElementById("change-player-btn");
const btns = document.querySelectorAll('.choice-btn');

const emojiMap = { 'steen': '👊', 'papier': '✋', 'schaar': '✌️' };

// 2. Game variabelen
let playerName = "";
let currentStreak = 0;

// 3. Start de game: Vraag om de naam van de speler
function askPlayerName() {
    let name = prompt("Voer je naam in voor de nieuwe game:");
    if (!name || name.trim() === "") {
        name = "Onbekende Speler";
    }
    playerName = name.trim();
    playerNameDisplay.innerHTML = playerName;
    currentStreak = 0;
    currentStreakElement.innerHTML = currentStreak;
}

// 4. Leaderboard functies (Halen, Sorteren, Opslaan, Tonen)
function updateLeaderboard(name, score) {
    if (score === 0) return; // Geen noodzaak om 0-scores op te slaan

    // Haal huidige lijst op, of maak een lege array als er nog niks staat
    let leaderboard = JSON.parse(localStorage.getItem("rps_leaderboard")) || [];

    // Kijk of deze speler al in de lijst staat
    const existingPlayerIndex = leaderboard.findIndex(player => player.name.toLowerCase() === name.toLowerCase());

    if (existingPlayerIndex !== -1) {
        // Alleen updaten als de nieuwe score hoger is dan de oude highscore
        if (score > leaderboard[existingPlayerIndex].score) {
            leaderboard[existingPlayerIndex].score = score;
        }
    } else {
        // Nieuwe speler toevoegen
        leaderboard.push({ name: name, score: score });
    }

    // Sorteer van hoog naar laag
    leaderboard.sort((a, b) => b.score - a.score);

    // Beperk tot top 5
    leaderboard = leaderboard.slice(0, 5);

    // Sla op in localStorage als string
    localStorage.setItem("rps_leaderboard", JSON.stringify(leaderboard));

    // Teken de lijst opnieuw op het scherm
    renderLeaderboard();
}

function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("rps_leaderboard")) || [];
    leaderboardList.innerHTML = ""; // Maak lijst leeg

    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = "<li>Nog geen scores</li>";
        return;
    }

    leaderboard.forEach(player => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${player.name}</span> <strong>${player.score}</strong>`;
        leaderboardList.appendChild(li);
    });
}

// 5. Computer Keuze
function getComputerChoice() {
    const choices = ['steen', 'papier', 'schaar'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// 6. Resultaat verwerken
function processResult(human, computer) {
    if (human === computer) {
        resultOutput.innerHTML = "Gelijkspel! 🤝";
        return;
    }

    let isWin = false;
    switch (human) {
        case 'steen': isWin = (computer === 'schaar'); break;
        case 'papier': isWin = (computer === 'steen'); break;
        case 'schaar': isWin = (computer === 'papier'); break;
    }

    if (isWin) {
        resultOutput.innerHTML = "Je hebt gewonnen! 🎉";
        currentStreak++;
        currentStreakElement.innerHTML = currentStreak;
        
        // Update direct het leaderboard bij een nieuwe highscore tijdens de streak
        updateLeaderboard(playerName, currentStreak);
    } else {
        resultOutput.innerHTML = "De computer wint! 🤖";
        // Sla de definitieve score op in het leaderboard bij verlies
        updateLeaderboard(playerName, currentStreak);
        currentStreak = 0; // Reset streak na het opslaan
        currentStreakElement.innerHTML = currentStreak;
    }
}

// 7. Ronde afspelen met countdown
function playRound(humanChoice) {
    btns.forEach(btn => btn.disabled = true);
    humanHand.innerHTML = "👊";
    computerHand.innerHTML = "👊";
    humanHand.classList.add("shake");
    computerHand.classList.add("shake");

    let count = 3;
    countdownText.innerHTML = count;

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownText.innerHTML = count;
        } else {
            clearInterval(timer);
            countdownText.innerHTML = "GO!";
            
            humanHand.classList.remove("shake");
            computerHand.classList.remove("shake");

            const computerChoice = getComputerChoice();
            humanHand.innerHTML = emojiMap[humanChoice];
            computerHand.innerHTML = emojiMap[computerChoice];

            processResult(humanChoice, computerChoice);
            btns.forEach(btn => btn.disabled = false);
        }
    }, 400);
}

// 8. Event Listeners
btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const choice = e.target.closest('.choice-btn').id;
        playRound(choice);
    });
});

changePlayerBtn.addEventListener('click', askPlayerName);

// Initialisatie bij laden van de pagina
askPlayerName();
renderLeaderboard();