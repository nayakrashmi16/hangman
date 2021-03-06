"use strict";

/*
    This is an array containing a list of countries for the hangman game
 */
let wordArray = ["India", "United States", "Ireland", "Antigua And Barbuda", "United Kingdom"];

/*
    This is used to store the index of the word randomly chosen for the
    current game
 */
let wordIndex;

/*
    This is used to store the word randomly chosen for the current game
 */
let word;

/*
    This is used to store the total number of wrong guesses a player is
    allowed before they lose
 */
let totalGuesses;

/*
    This is used to store the number of wrong guesses taken so far by
    the player
 */
let wrongGuesses;

/*
    This is used to store the number of characters that the player has
    guessed correctly so far
 */
let charactersGuessed;

/*
    This is a flag to store whether the player has won or lost
 */
let isPlayerWin;


/*
    Calling the startGame method to start the game
 */
startGame();


/*
    This method starts a new instance of the game by setting all the
    game variables and resetting the state of placeholders and buttons
    to initial state
 */
function startGame() {
    wordIndex = getRandomWordIndex(wordArray);
    word = getRandomWord(wordIndex, wordArray);

    totalGuesses = 8;
    wrongGuesses = 0;
    charactersGuessed = 0;

    let modalEle = document.getElementsByClassName("modal")[0];
    modalEle.classList.remove("visible");
    hideHangmanParts();
    clearPlaceholders();
    enableAllCharacterBtn();
    generatePlaceholders(wordArray[wordIndex]);
    setGuessesCount(totalGuesses);
}

/*
    This method is used to update the count of total wrong guesses
    remaining for the player
 */
function setGuessesCount(count) {
    let guessesCountEle = document.getElementsByClassName("guesses-left-count")[0];
    guessesCountEle.textContent = count;
}

/*
    This method is used to pick a random index from the word array for
    the current instance of the game
 */
function getRandomWordIndex(wordArray) {
    return Math.floor(Math.random() * wordArray.length);
}

/*
    This method is used to pick the word using the random index
    generated by the getRandomWordIndex method. We are also replacing
    any white spaces in the word as player need not guess the same
 */
function getRandomWord(wordIndex, wordArray) {
    return wordArray[wordIndex].replaceAll(/\s/g,"");
}

/*
    This method generates the placeholders for the current instance
    of the game depending on number of characters of the word chosen
 */
function generatePlaceholders(word) {
    for(let index = 0; index < word.length; index++) {
        let placeholderEle = document.createElement("div");

        if(word[index] === " ") {
            placeholderEle.classList.add("space");
        }
        else {
            placeholderEle.classList.add("character");
        }

        let placeholderContainer = document.getElementsByClassName("placeholder-container")[0];
        placeholderContainer.appendChild(placeholderEle);
    }
}

/*
    This method checks if the character clicked by the player is
    a correct guess or not and checks winning of game
 */
function checkIfGuessCorrect(characterBtn) {

    disableCharacterBtn(characterBtn);

    let guess = characterBtn.value;

    let indices = getIndicesOfGuessedCharacter(guess);

    if(indices.length === 0) {
        wrongGuesses++;
        setGuessesCount(totalGuesses-wrongGuesses);
        showHangmanPart();
    }

    else {
        fillPlaceholderWithCharacter(indices);
        charactersGuessed += indices.length;
    }

    if(wrongGuesses === totalGuesses) {
        isPlayerWin = false;
        endGame(isPlayerWin);
    }

    if(charactersGuessed === word.length) {
        isPlayerWin = true;
       endGame(isPlayerWin);
    }
}

/*
    This method is used to end the game by displaying the game
    ending modal with status of the player
 */
function endGame(isPlayerWin) {
    let message;

    if(!isPlayerWin) {
        showSkull();
        message = "You lost! The word was " +wordArray[wordIndex];
        showGameEndModal(message);
    }
    else {
        message = "You win!";
        showGameEndModal(message);
    }

}

/*
    This method is used to display the modal along with the appropriate
    message depending on whether the player has won or lost
 */
function showGameEndModal(message) {
    let modalEle = document.getElementsByClassName("modal")[0];
    modalEle.classList.add("visible");
    let messageEle = document.getElementsByClassName("modal-message")[0];
    messageEle.textContent = message;
}

/*
    This method is used to display the skull image when the player has
    lost the game
 */
function showSkull() {
    let faceImageEle = document.getElementsByClassName("face-img")[0];
    faceImageEle.setAttribute("src", "assets/skull.png");

    let illustrationMessageEle = document.getElementsByClassName("illustration-message")[0];
    illustrationMessageEle.classList.add("visible");
}

/*
    This method is used to hide the skull as the game is reset for the next
    instance
 */
function hideSkull() {
    let faceImageEle = document.getElementsByClassName("face-img")[0];
    faceImageEle.setAttribute("src", "assets/face.png");

    let illustrationMessageEle = document.getElementsByClassName("illustration-message")[0];
    illustrationMessageEle.classList.remove("visible");
}

/*
    This method is used to show a part of the hangman everytime the player
    enters a wrong guess
 */
function showHangmanPart() {
    let hangmanArray = Array.from(document.getElementsByClassName("hangman"));
    hangmanArray[wrongGuesses-1].classList.add("visible");
}

/*
    This method is used to hide all hangman parts as the game is reset for
    the next instance
 */
function hideHangmanParts() {
    let hangmanArray = Array.from(document.getElementsByClassName("hangman"));
    hangmanArray.forEach((hangman) => {
        hangman.classList.remove("visible");
    });
    hideSkull();
}

/*
    This method is used to disable the character button that the player
    just clicked. This is to ensure that the player does not click it again
    and to provide visual cues as to which characters have already by chosen
 */
function disableCharacterBtn(characterBtn) {
    characterBtn.disabled = true;
}

/*
    This method is used to enable all character buttons as the game is
    reset for the next instance
 */
function enableAllCharacterBtn() {
    let characterBtnArray = Array.from(document.getElementsByClassName("letter-input-btn"));
    characterBtnArray.forEach((characterBtn) => {
        characterBtn.disabled = false;
    })
}

/*
    This method is used to clear all placeholders as the game is reset
    for the next instance
 */
function clearPlaceholders() {
    let placeholderContainerEle = document.getElementsByClassName("placeholder-container")[0];
    let placeholderEleArray = Array.from(placeholderContainerEle.children);

    placeholderEleArray.forEach((placeholderEle) => {
        placeholderContainerEle.removeChild(placeholderEle);
    })
}

/*
    This method is used to get an array of the indices containing
    the index of the character guessed by the player
 */
function getIndicesOfGuessedCharacter(guess) {
    let indices = [];

    Array.from(word).forEach((letter, index) => {
        if(letter.toUpperCase() === guess.toUpperCase()){
            indices.push(index);
        }
    });

    return indices;
}

/*
    This method is used to fill the placeholder with the character
    guessed correctly by the player
 */
function fillPlaceholderWithCharacter(indices) {
    let placeHolderArray = document.getElementsByClassName("character");
    for(let index = 0; index < indices.length; index++) {
        placeHolderArray[indices[index]].textContent = word[indices[index]];
    }
}