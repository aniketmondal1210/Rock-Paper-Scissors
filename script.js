const choices = ["rock", "paper", "scissors"]
const playerScore = document.getElementById("player-score")
const computerScore = document.getElementById("computer-score")
const result = document.getElementById("result")
const historyList = document.getElementById("history-list")
const choiceButtons = document.querySelectorAll(".choice")
const resetBtn = document.getElementById("reset-btn")
const modeSelect = document.getElementById("mode-select")
const timerElement = document.getElementById("timer")
const historySection = document.querySelector(".history")
const gameArea = document.querySelector(".game-area")

let playerPoints = 0
let computerPoints = 0
let gameMode = "classic"
let roundsPlayed = 0
let timeLeft = 30
let timerInterval
let isFirstGame = true

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => playRound(button.dataset.choice))
})

resetBtn.addEventListener("click", resetGame)
modeSelect.addEventListener("change", changeGameMode)

function playRound(playerChoice) {
  if (gameMode === "best-of-5" && roundsPlayed >= 5) return
  if (gameMode === "time-attack" && timeLeft <= 0) return

  const computerChoice = choices[Math.floor(Math.random() * choices.length)]
  const roundResult = getRoundResult(playerChoice, computerChoice)
  updateScore(roundResult)
  addToHistory(playerChoice, computerChoice, roundResult)

  if (gameMode !== "time-attack") {
    displayResult(playerChoice, computerChoice, roundResult)
  }

  if (isFirstGame) {
    isFirstGame = false
    historySection.style.display = "block"
  }

  if (gameMode === "best-of-5") {
    roundsPlayed++
    if (roundsPlayed === 5) {
      endBestOf5Game()
    }
  }

  animateChoice(playerChoice, "player")
  animateChoice(computerChoice, "computer")
}

function getRoundResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "tie"
  if (
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper")
  ) {
    return "win"
  }
  return "lose"
}

function updateScore(roundResult) {
  if (roundResult === "win") {
    playerPoints++
    playerScore.textContent = playerPoints
    playerScore.parentElement.classList.add("pulse")
  } else if (roundResult === "lose") {
    computerPoints++
    computerScore.textContent = computerPoints
    computerScore.parentElement.classList.add("pulse")
  }

  setTimeout(() => {
    playerScore.parentElement.classList.remove("pulse")
    computerScore.parentElement.classList.remove("pulse")
  }, 300)
}

function displayResult(playerChoice, computerChoice, roundResult) {
  const resultText = getResultText(playerChoice, computerChoice, roundResult)
  result.textContent = resultText
  result.className = "result " + roundResult
}

function getResultText(playerChoice, computerChoice, roundResult) {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
  const playerEmoji = getEmoji(playerChoice)
  const computerEmoji = getEmoji(computerChoice)

  if (roundResult === "tie") {
    return `It's a tie! ${playerEmoji} ${computerEmoji}`
  } else if (roundResult === "win") {
    return `You win! ${playerEmoji} beats ${computerEmoji}`
  } else {
    return `You lose! ${computerEmoji} beats ${playerEmoji}`
  }
}

function getEmoji(choice) {
  switch (choice) {
    case "rock":
      return "✊"
    case "paper":
      return "✋"
    case "scissors":
      return "✌️"
  }
}

function addToHistory(playerChoice, computerChoice, roundResult) {
  const historyItem = document.createElement("li")
  historyItem.textContent = `${getEmoji(playerChoice)} vs ${getEmoji(computerChoice)} - ${capitalize(roundResult)}`
  historyList.prepend(historyItem)

  if (historyList.children.length > 5) {
    historyList.removeChild(historyList.lastChild)
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function resetGame() {
  playerPoints = 0
  computerPoints = 0
  roundsPlayed = 0
  playerScore.textContent = "0"
  computerScore.textContent = "0"
  result.textContent = "Choose your weapon!"
  result.className = "result"
  historyList.innerHTML = ""
  clearInterval(timerInterval)
  document.querySelector(".container").classList.remove("time-attack")
  choiceButtons.forEach((button) => (button.disabled = false))
  isFirstGame = true
  historySection.style.display = "none"
  gameArea.style.display = "block"
}

function changeGameMode() {
  gameMode = modeSelect.value
  resetGame()

  document.querySelector(".container").classList.remove("time-attack")
  if (gameMode === "time-attack") {
    startTimeAttack()
    document.querySelector(".container").classList.add("time-attack")
  }
}

function startTimeAttack() {
  timeLeft = 30
  timerElement.textContent = timeLeft
  document.querySelector(".container").classList.add("time-attack")

  timerInterval = setInterval(() => {
    timeLeft--
    timerElement.textContent = timeLeft

    if (timeLeft <= 0) {
      clearInterval(timerInterval)
      endTimeAttackGame()
    }
  }, 1000)
}

function endTimeAttackGame() {
  choiceButtons.forEach((button) => (button.disabled = true))
  gameArea.style.display = "none"

  const finalResult =
    playerPoints > computerPoints ? "You win!" : playerPoints < computerPoints ? "You lose!" : "It's a tie!"

  result.textContent = `Time's up! ${finalResult} Final score: You ${playerPoints} - ${computerPoints} Computer`
  result.className =
    "result " + (playerPoints > computerPoints ? "win" : playerPoints < computerPoints ? "lose" : "tie")

  if (playerPoints > computerPoints) {
    showConfetti()
  }
}

function endBestOf5Game() {
  choiceButtons.forEach((button) => (button.disabled = true))
  const finalResult =
    playerPoints > computerPoints
      ? "You win the series!"
      : playerPoints < computerPoints
        ? "You lose the series!"
        : "The series is tied!"
  result.textContent = finalResult
  result.className =
    "result " + (playerPoints > computerPoints ? "win" : playerPoints < computerPoints ? "lose" : "tie")
  if (playerPoints > computerPoints) {
    showConfetti()
  }
}

function animateChoice(choice, player) {
  const button = document.querySelector(`.choice[data-choice="${choice}"]`)
  button.classList.add("pulse")
  setTimeout(() => {
    button.classList.remove("pulse")
  }, 300)
}

function showConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  })
}

