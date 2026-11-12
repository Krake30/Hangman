const MAX_GUESSES = 6;
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const hangmanImg = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const hintText = document.querySelector(".hint-text b");
const guessesText = document.querySelector(".guesses-text b");
const keyboard = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const gameModalImg = document.querySelector(".game-modal img");
const gameModalTitle = document.querySelector(".game-modal h4");
const gameModalWord = document.querySelector(".game-modal p b");
const playAgainBtn = document.querySelector(".play-again");

let selectedWord = "";
let guessedLetters = [];
let wrongLetters = [];
let isGameOver = false;

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}

function updateHangman() {
  hangmanImg.src = `images/hangman-${wrongLetters.length}.svg`;
  hangmanImg.alt = `Hangman stage ${wrongLetters.length}`;
}

function displayWord(showAll = false) {
  wordDisplay.innerHTML = "";

  selectedWord.split("").forEach((letter) => {
    const listItem = document.createElement("li");
    listItem.className = "letter";
    listItem.setAttribute("data-letter", letter);

    const shouldReveal = showAll || guessedLetters.includes(letter);
    listItem.textContent = shouldReveal ? letter : "";

    if (shouldReveal) {
      listItem.classList.add("guessed");
    }

    wordDisplay.appendChild(listItem);
  });
}

function createKeyboard() {
  keyboard.innerHTML = "";

  alphabet.forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = letter;
    button.disabled = guessedLetters.includes(letter) || isGameOver;

    button.addEventListener("click", () => handleGuess(letter, button));
    keyboard.appendChild(button);
  });
}

function finishGame(isWinner) {
  isGameOver = true;
  gameModal.classList.add("show");
  displayWord(true);
  createKeyboard();

  if (isWinner) {
    gameModalImg.src = "images/victory.gif";
    gameModalTitle.textContent = "You Won!";
    gameModalWord.textContent = selectedWord;
    return;
  }

  gameModalImg.src = "images/lost.gif";
  gameModalTitle.textContent = "Game Over!";
  gameModalWord.textContent = selectedWord;
}

function handleGuess(letter, button) {
  if (isGameOver || guessedLetters.includes(letter)) {
    return;
  }

  guessedLetters.push(letter);
  button.disabled = true;

  if (selectedWord.includes(letter)) {
    displayWord();

    const remainingLetters = [...new Set(selectedWord.split(""))].filter(
      (currentLetter) => !guessedLetters.includes(currentLetter)
    );

    if (remainingLetters.length === 0) {
      finishGame(true);
      return;
    }

    createKeyboard();
    return;
  }

  wrongLetters.push(letter);
  guessesText.textContent = wrongLetters.length;
  updateHangman();

  if (wrongLetters.length >= MAX_GUESSES) {
    finishGame(false);
    return;
  }

  createKeyboard();
}

function startNewGame() {
  const randomWord = getRandomWord();
  selectedWord = randomWord.word.toLowerCase();
  guessedLetters = [];
  wrongLetters = [];
  isGameOver = false;

  gameModal.classList.remove("show");
  hintText.textContent = randomWord.hint;
  guessesText.textContent = wrongLetters.length;
  updateHangman();
  displayWord();
  createKeyboard();
}

playAgainBtn.addEventListener("click", startNewGame);
startNewGame();
